import { enquiryBrief } from "./enquiry-brief";
import {
  createHash,
  createHmac,
  randomUUID,
  timingSafeEqual,
} from "node:crypto";
import { enquirySchema, type Enquiry } from "./enquiry-schema";
export type StoredEnquiry = {
  reference: string;
  receivedAt: string;
  payloadHash: string;
  status: "received" | "notified";
  data: Enquiry;
};
export type EnquiryDependencies = {
  enabled: boolean;
  salt: string;
  sender: string;
  recipient: string;
  apiKey: string;
  takeRateSlot: (identity: string) => Promise<boolean>;
  read: (id: string) => Promise<StoredEnquiry | null>;
  create: (id: string, value: StoredEnquiry) => Promise<boolean>;
  markNotified: (id: string, value: StoredEnquiry) => Promise<void>;
  send: (e: StoredEnquiry) => Promise<void>;
};
export class EnquiryError extends Error {
  constructor(
    public status: number,
    message: string,
    public fields?: Record<string, string>,
  ) {
    super(message);
  }
}
export async function processEnquiry(
  input: unknown,
  identity: string,
  deps: EnquiryDependencies,
) {
  const parsed = enquirySchema.safeParse(input);
  if (!parsed.success)
    throw new EnquiryError(
      400,
      "Please check the highlighted fields.",
      Object.fromEntries(
        parsed.error.issues.map((i) => [i.path.join("."), i.message]),
      ),
    );
  const data = parsed.data;
  const age = Date.now() - data.startedAt;
  if (age < 2000 || age > 86400000)
    throw new EnquiryError(400, "Please reload the form and try again.");
  if (!deps.enabled || !deps.salt || !deps.sender || !deps.apiKey || !identity)
    throw new EnquiryError(
      503,
      "Online submissions are not available yet. Please email info@glanheim.com.",
    );
  if (
    !(await deps.takeRateSlot(
      createHmac("sha256", deps.salt).update(identity).digest("hex"),
    ))
  )
    throw new EnquiryError(
      429,
      "Too many attempts. Please wait 15 minutes or email info@glanheim.com.",
    );
  const hash = createHash("sha256").update(JSON.stringify(data)).digest("hex");
  let existing = await deps.read(data.submissionId);
  if (!existing) {
    const value: StoredEnquiry = {
      reference: `GL-${new Date().getUTCFullYear()}-${randomUUID().slice(0, 8).toUpperCase()}`,
      receivedAt: new Date().toISOString(),
      payloadHash: hash,
      status: "received",
      data,
    };
    if (await deps.create(data.submissionId, value)) existing = value;
    else existing = await deps.read(data.submissionId);
  }
  if (!existing)
    throw new EnquiryError(
      503,
      "Receipt could not be confirmed. Please try again or email our team.",
    );
  if (existing.payloadHash !== hash)
    throw new EnquiryError(
      409,
      "This submission has changed. Reload the page before sending a revised enquiry.",
    );
  if (existing.status !== "notified") {
    try {
      await deps.send(existing);
    } catch {
      throw new EnquiryError(
        502,
        "Your enquiry was saved, but notification could not be confirmed. Retry without changing the form, or email info@glanheim.com.",
      );
    }
    // The provider has accepted notification. A bookkeeping failure must not turn successful receipt into a false failure.
    try {
      await deps.markNotified(data.submissionId, {
        ...existing,
        status: "notified",
      });
    } catch {
      /* Provider idempotency protects retries. */
    }
  }
  return { reference: existing.reference, receivedAt: existing.receivedAt };
}
export function notificationText(e: StoredEnquiry) {
  return [
    `GLANHEIM PROJECT ENQUIRY`,
    `Reference: ${e.reference}`,
    `Received: ${e.receivedAt}`,
    enquiryBrief(e.data),
    "Document links are confidential. Do not fetch or forward without project authority.",
  ].join("\n\n");
}
export function signReceipt(reference: string, salt: string) {
  const payload = Buffer.from(
    JSON.stringify({ reference, expires: Date.now() + 3600000 }),
  ).toString("base64url");
  return `${payload}.${createHmac("sha256", salt).update(payload).digest("base64url")}`;
}
export function verifyReceipt(token: string | undefined, salt: string) {
  try {
    if (!token || !salt) return null;
    const [p, s] = token.split(".");
    const expected = createHmac("sha256", salt).update(p).digest();
    const actual = Buffer.from(s, "base64url");
    if (actual.length !== expected.length || !timingSafeEqual(actual, expected))
      return null;
    const data = JSON.parse(Buffer.from(p, "base64url").toString());
    return typeof data.reference === "string" &&
      /^GL-\d{4}-[A-F0-9]{8}$/.test(data.reference) &&
      data.expires > Date.now()
      ? data.reference
      : null;
  } catch {
    return null;
  }
}

export function createEnquirySession() {
  return { submissionId: randomUUID(), startedAt: Date.now() };
}
