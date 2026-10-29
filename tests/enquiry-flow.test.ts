import { test } from "node:test";
import assert from "node:assert/strict";
import { enquiryTransport } from "../lib/enquiry-config";
import { enquiryBrief, itemSummary, briefEmail } from "../lib/enquiry-brief";
import { catalogueProducts } from "../lib/products";
import { enquirySchema } from "../lib/enquiry-schema";
const p = catalogueProducts.find((p) => !!p.code)!;
test("Netlify capture works without a separately configured mail provider", () => {
  assert.equal(enquiryTransport({ NETLIFY: "true" }), "netlify");
  assert.equal(
    enquiryTransport({ NETLIFY: "true", NETLIFY_FORMS_ENABLED: "false" }),
    "email",
  );
  assert.equal(enquiryTransport({}), "email");
  assert.equal(
    enquiryTransport({
      NETLIFY: "true",
      ENQUIRIES_ENABLED: "true",
      RESEND_API_KEY: "test-key",
      ENQUIRY_FROM_EMAIL: "test@example.com",
      RATE_LIMIT_SALT: "test-only",
    }),
    "api",
  );
});
test("per-item quantities, dimensions and drawing references survive brief preparation", () => {
  const line = {
    id: p.id,
    quantity: "12 units",
    measurements: "W 1200 × H 2400 mm — A201 Rev C",
    notes: "Confirm handle finish",
  };
  const summary = itemSummary([line]);
  assert.ok(summary.includes(p.code!));
  assert.ok(summary.includes("12 units"));
  assert.ok(summary.includes("A201 Rev C"));
  assert.ok(summary.includes("Confirm handle finish"));
  const input = {
    submissionId: crypto.randomUUID(),
    startedAt: Date.now(),
    website: "",
    fullName: "Project User",
    company: "Commercial Builder",
    position: "",
    email: "test@example.com",
    phone: "",
    companyWebsite: "",
    projectName: "Office fit-out",
    projectLocation: "Brisbane",
    projectType: "Office",
    projectStage: "Tender",
    tenderDate: "",
    deliveryDate: "",
    packages: ["Joinery"],
    selectedProduct: p.name,
    selectedCategory: p.category,
    pricingPurpose: "Tender pricing",
    scope: "Coordinate a commercial fit-out material package.",
    quantity: "",
    unit: "",
    packageValue: "",
    targetRate: "",
    supplierQuote: "",
    alternatives: "Discuss",
    deliveryRequirements: "",
    documentLink: "https://example.com/authorised-drawings",
    drawingRevision: "C",
    documentDescription: "A201 opening schedule",
    authority: true,
    privacy: true,
    items: [line],
    measurementMethod: "Both",
    measurements: "Check dimensions against drawing A201.",
  };
  const data = enquirySchema.parse(input);
  const brief = enquiryBrief(data);
  assert.ok(brief.includes("PRODUCT SCHEDULE"));
  assert.ok(brief.includes("12 units"));
  assert.ok(brief.includes(input.documentLink));
  assert.ok(brief.includes("Check dimensions"));
  const draft = briefEmail({ ...data, scope: "A".repeat(6000) });
  assert.equal(draft.needsAttachment, true);
  assert.ok(draft.href.length < 2000);
  assert.ok(draft.text.includes("12 units"));
  assert.ok(!draft.href.includes("A".repeat(1000)));
});
