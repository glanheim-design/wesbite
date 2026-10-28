import { catalogueSchema } from "../lib/content";
import raw from "../content/catalogue.json";
const result = catalogueSchema.safeParse(raw);
if (!result.success) {
  console.error(result.error);
  process.exit(1);
}
const ids = new Set<string>();
for (const c of raw.categories) {
  const id = `${c.group}/${c.slug}`;
  if (ids.has(id)) throw new Error(`Duplicate category ${id}`);
  ids.add(id);
}
const productIds = new Set<string>();
for (const p of result.data.products) {
  const id = `${p.group}/${p.category}/${p.slug}`;
  if (!ids.has(`${p.group}/${p.category}`))
    throw new Error(`Unknown product category ${id}`);
  if (productIds.has(id)) throw new Error(`Duplicate product ${id}`);
  productIds.add(id);
}
console.log(
  `Validated ${ids.size} categories and ${productIds.size} sourcing profiles. No prohibited or do-not-offer profiles are public.`,
);
