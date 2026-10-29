import { catalogueProducts, productCollections } from "./products";
import { labels, type Enquiry } from "./enquiry-schema";
export type EnquiryItem = {
  id: string;
  quantity: string;
  measurements: string;
  notes: string;
};
export function itemSummary(items: EnquiryItem[]) {
  return items
    .map((item, i) => {
      const p = catalogueProducts.find((product) => product.id === item.id);
      if (!p) return "";
      return [
        `${i + 1}. ${p.name}`,
        `Collection: ${productCollections.find((c) => c.id === p.collection)?.name || p.collection}`,
        `Reference: ${[p.code, ...(p.alternativeCodes || [])].filter(Boolean).join(" / ") || "Design reference"}${p.variant ? ` · ${p.variant}` : ""}`,
        `Product ID: ${p.id}`,
        `Quantity: ${item.quantity || "Confirm from drawings"}`,
        `Measurements (customer supplied): ${item.measurements || "Confirm from drawings / project brief"}`,
        ...(item.notes ? [`Item notes: ${item.notes}`] : []),
      ].join("\n");
    })
    .filter(Boolean)
    .join("\n\n");
}
export function enquiryBrief(data: Enquiry) {
  const excluded = new Set(["submissionId", "startedAt", "website", "items"]);
  return [
    "GLANHEIM PROJECT ENQUIRY",
    `Enquiry ID: ${data.submissionId}`,
    ...Object.entries(data)
      .filter(([k]) => !excluded.has(k))
      .map(
        ([k, v]) =>
          `${labels[k] || k}: ${Array.isArray(v) ? v.join(", ") : typeof v === "boolean" ? (v ? "Confirmed" : "Not confirmed") : v || "Not provided"}`,
      ),
    ...(data.items.length
      ? ["PRODUCT SCHEDULE\n\n" + itemSummary(data.items)]
      : []),
    "Measurements are supplied by the enquirer or requested for review against the linked drawings. Final dimensions and quantities require project confirmation.",
  ].join("\n\n");
}
export function briefEmail(data: Enquiry) {
  const text = enquiryBrief(data);
  const long = text.length > 1600;
  const body = long
    ? `Hello GLANHEIM,\n\nPlease review the attached project enquiry brief.\nProject: ${data.projectName || "To be discussed"}\nName: ${data.fullName}\nCompany: ${data.company}\nContact: ${data.email}\nEnquiry ID: ${data.submissionId}\n\nI will attach the downloaded enquiry brief and any authorised drawings before sending.`
    : text;
  return {
    text,
    needsAttachment: long,
    href: `mailto:info@glanheim.com?subject=${encodeURIComponent(`Project enquiry${data.projectName ? ` — ${data.projectName}` : ""}`)}&body=${encodeURIComponent(body)}`,
  };
}
