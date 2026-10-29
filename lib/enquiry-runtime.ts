import { enquiriesConfigured } from "./enquiry-config";
import { getStore } from "@netlify/blobs";
import {
  EnquiryError,
  notificationText,
  type EnquiryDependencies,
  type StoredEnquiry,
} from "./enquiry-service";
export function runtimeDependencies(): EnquiryDependencies {
  const env = process.env;
  // Blobs credentials are injected by Netlify; the stores are private, never exposed via public routes.
  const enquiries = () =>
    getStore({ name: "glanheim-enquiries", consistency: "strong" });
  const limits = () =>
    getStore({ name: "glanheim-rate-limits", consistency: "strong" });
  return {
    enabled: enquiriesConfigured(env),
    salt: env.RATE_LIMIT_SALT || "",
    sender: env.ENQUIRY_FROM_EMAIL || "",
    recipient: env.BUSINESS_NOTIFICATION_EMAIL || "info@glanheim.com",
    apiKey: env.RESEND_API_KEY || "",
    async takeRateSlot(identity) {
      const store = limits();
      const window = Math.floor(Date.now() / 900000);
      for (let slot = 0; slot < 5; slot++) {
        const r = await store.setJSON(
          `${window}/${identity}/${slot}`,
          { expiresAt: Date.now() + 1800000 },
          { onlyIfNew: true },
        );
        if (r.modified) return true;
      }
      return false;
    },
    async read(id) {
      return (await enquiries().get(`enquiries/${id}`, {
        type: "json",
      })) as StoredEnquiry | null;
    },
    async create(id, value) {
      return (
        await enquiries().setJSON(`enquiries/${id}`, value, { onlyIfNew: true })
      ).modified;
    },
    async markNotified(id, value) {
      await enquiries().setJSON(`enquiries/${id}`, value);
    },
    async send(e) {
      const to = env.BUSINESS_NOTIFICATION_EMAIL || "info@glanheim.com";
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
          "Idempotency-Key": `project-${e.data.submissionId}`,
        },
        body: JSON.stringify({
          from: env.ENQUIRY_FROM_EMAIL,
          to: [to],
          reply_to: e.data.email,
          subject: `GLANHEIM enquiry ${e.reference}`,
          text: notificationText(e),
        }),
        signal: AbortSignal.timeout(12000),
      });
      if (!response.ok)
        throw new EnquiryError(
          502,
          "Notification provider did not accept the message",
        );
      const result = await response.json();
      if (typeof result.id !== "string")
        throw new EnquiryError(502, "Notification receipt unavailable");
      if (env.SEND_CUSTOMER_ACKNOWLEDGEMENT === "true") {
        // Optional acknowledgement has no private links or scope in its body.
        try {
          await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${env.RESEND_API_KEY}`,
              "Content-Type": "application/json",
              "Idempotency-Key": `ack-${e.data.submissionId}`,
            },
            body: JSON.stringify({
              from: env.ENQUIRY_FROM_EMAIL,
              to: [e.data.email],
              subject: `Your GLANHEIM enquiry ${e.reference}`,
              text: `Thank you for contacting GLANHEIM. Your project enquiry has been received. Reference: ${e.reference}.\n\nWe will review the scope. Receipt does not guarantee a quotation or a response time.\n\ninfo@glanheim.com`,
            }),
            signal: AbortSignal.timeout(12000),
          });
        } catch {
          /* Optional acknowledgement does not change accepted business notification. */
        }
      }
    },
  };
}
