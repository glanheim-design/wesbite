import { getStore } from "@netlify/blobs";
import type { StoredEnquiry } from "../../lib/enquiry-service";
export default async function retention() {
  const now = Date.now();
  let enquiriesDeleted = 0,
    limitsDeleted = 0;
  const enquiries = getStore({
    name: "glanheim-enquiries",
    consistency: "strong",
  });
  for await (const page of enquiries.list({
    prefix: "enquiries/",
    paginate: true,
  })) {
    for (const { key } of page.blobs) {
      const record = (await enquiries.get(key, { type: "json" })) as
        (StoredEnquiry & { retentionHold?: boolean }) | null;
      if (
        record &&
        !record.retentionHold &&
        Date.parse(record.receivedAt) < now - 90 * 86400000
      ) {
        await enquiries.delete(key);
        enquiriesDeleted++;
      }
    }
  }
  const limits = getStore({
    name: "glanheim-rate-limits",
    consistency: "strong",
  });
  for await (const page of limits.list({ paginate: true })) {
    for (const { key } of page.blobs) {
      const window = Number(key.split("/")[0]);
      if (Number.isFinite(window) && window * 900000 < now - 86400000) {
        await limits.delete(key);
        limitsDeleted++;
      }
    }
  }
  // Counts only; never log enquiry content, links, emails, identifiers or credentials.
  console.info("Retention completed", { enquiriesDeleted, limitsDeleted });
}
export const config = { schedule: "@daily" };
