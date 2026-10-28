import { test } from "node:test";
import assert from "node:assert/strict";
import {
  processEnquiry,
  EnquiryError,
  signReceipt,
  verifyReceipt,
  type EnquiryDependencies,
  type StoredEnquiry,
} from "../lib/enquiry-service";
import { enquirySchema } from "../lib/enquiry-schema";
import { catalogueSchema } from "../lib/content";
import raw from "../content/catalogue.json";
const valid = () => ({
  submissionId: crypto.randomUUID(),
  startedAt: Date.now() - 4000,
  website: "",
  fullName: "Alex Builder",
  company: "Example Construction",
  position: "Estimator",
  email: "alex@example.com",
  phone: "",
  companyWebsite: "",
  projectName: "Commercial fit-out",
  projectLocation: "Brisbane",
  projectType: "Commercial",
  projectStage: "Tender",
  tenderDate: "",
  deliveryDate: "",
  packages: ["Joinery"],
  selectedProduct: "",
  selectedCategory: "",
  pricingPurpose: "Tender pricing",
  scope: "Joinery material supply for a commercial reception and office.",
  quantity: "50",
  unit: "Units",
  packageValue: "",
  targetRate: "",
  supplierQuote: "",
  alternatives: "Discuss",
  deliveryRequirements: "",
  documentLink: "https://www.dropbox.com/scl/fo/example",
  drawingRevision: "A",
  documentDescription: "Tender drawings",
  authority: true,
  privacy: true,
});
function fixture() {
  const stored = new Map<string, StoredEnquiry>();
  let sent = 0;
  const deps: EnquiryDependencies = {
    enabled: true,
    salt: "unit-test-only-salt",
    sender: "GLANHEIM <team@example.com>",
    recipient: "info@glanheim.com",
    apiKey: "test",
    takeRateSlot: async () => true,
    read: async (id) => stored.get(id) || null,
    create: async (id, v) => {
      if (stored.has(id)) return false;
      stored.set(id, v);
      return true;
    },
    markNotified: async (id, v) => {
      stored.set(id, v);
    },
    send: async () => {
      sent++;
    },
  };
  return { deps, stored, sent: () => sent };
}
test("accepts a complete enquiry, stores metadata and notifies once across retries", async () => {
  const f = fixture(),
    data = valid();
  const a = await processEnquiry(data, "test-ip", f.deps);
  const b = await processEnquiry(data, "test-ip", f.deps);
  assert.equal(a.reference, b.reference);
  assert.equal(f.sent(), 1);
  assert.equal(f.stored.get(data.submissionId)?.status, "notified");
});
test("missing credentials fail closed without storing or notifying", async () => {
  const f = fixture();
  f.deps.apiKey = "";
  await assert.rejects(
    () => processEnquiry(valid(), "ip", f.deps),
    (e: unknown) => e instanceof EnquiryError && e.status === 503,
  );
  assert.equal(f.stored.size, 0);
  assert.equal(f.sent(), 0);
});
test("provider failure does not produce a successful receipt and preserves retry identity", async () => {
  const f = fixture(),
    data = valid();
  f.deps.send = async () => {
    throw new Error("provider failure");
  };
  await assert.rejects(
    () => processEnquiry(data, "ip", f.deps),
    (e: unknown) => e instanceof EnquiryError && e.status === 502,
  );
  assert.equal(f.stored.get(data.submissionId)?.status, "received");
  f.deps.send = async () => {};
  const receipt = await processEnquiry(data, "ip", f.deps);
  assert.equal(receipt.reference, f.stored.get(data.submissionId)?.reference);
});
test("rate limit blocks storage and mail", async () => {
  const f = fixture();
  f.deps.takeRateSlot = async () => false;
  await assert.rejects(
    () => processEnquiry(valid(), "ip", f.deps),
    (e: unknown) => e instanceof EnquiryError && e.status === 429,
  );
  assert.equal(f.stored.size, 0);
});
test("invalid consent, sharing links, quantity, dates and honeypot are rejected", () => {
  for (const patch of [
    { privacy: false },
    { authority: false },
    { documentLink: "javascript:alert(1)" },
    { documentLink: "http://example.com/files" },
    { documentLink: "https://user:password@example.com/" },
    { quantity: "-1" },
    { tenderDate: "2026-02-30" },
    { website: "spam" },
  ])
    assert.equal(
      enquirySchema.safeParse({ ...valid(), ...patch }).success,
      false,
    );
});
test("same id cannot change content after receipt", async () => {
  const f = fixture(),
    data = valid();
  await processEnquiry(data, "ip", f.deps);
  await assert.rejects(
    () =>
      processEnquiry(
        { ...data, scope: "A different project scope after first receipt." },
        "ip",
        f.deps,
      ),
    (e: unknown) => e instanceof EnquiryError && e.status === 409,
  );
  assert.equal(f.sent(), 1);
});
test("confirmation receipts reject forged or wrong-key tokens", () => {
  const token = signReceipt("GL-2026-ABCDEF12", "test-key");
  assert.equal(verifyReceipt(token, "test-key"), "GL-2026-ABCDEF12");
  assert.equal(verifyReceipt(token, "other-key"), null);
  assert.equal(verifyReceipt(token + "a", "test-key"), null);
  assert.equal(verifyReceipt(undefined, "test-key"), null);
});
test("prohibited products and unreviewed compliance claims cannot publish", () => {
  for (const patch of [
    { eligibility: "prohibited" },
    { complianceStatus: "DO NOT OFFER" },
    { publicationStatus: "published" },
    { approvedPublicStatement: "NCC certified" },
  ])
    assert.equal(
      catalogueSchema.safeParse({
        ...raw,
        products: [{ ...raw.products[0], ...patch }],
      }).success,
      false,
    );
});
