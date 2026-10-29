import { getStore } from "@netlify/blobs";
export default async function retention() {
  const now = Date.now();
  let limitsDeleted = 0;
  // Enquiries are retained regardless of inactivity at the business owner’s request.
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
  console.info("Retention completed", { limitsDeleted });
}
export const config = { schedule: "@daily" };
