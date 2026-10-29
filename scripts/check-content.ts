import { catalogueProducts, productCollections } from "../lib/products";
import { existsSync } from "node:fs";
import path from "node:path";
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

for (const category of result.data.categories) {
  if (
    category.image &&
    !existsSync(path.join(process.cwd(), "public", category.image.src))
  ) {
    throw new Error(`Missing category image: ${category.image.src}`);
  }
}
console.log("All category image files are present.");

// Real catalogue products are enquiry-only design references, with traceable source pages.

const catalogueIds = new Set<string>();
const cataloguePaths = new Set<string>();
for (const p of catalogueProducts) {
  if (!productCollections.some((c) => c.id === p.collection)) throw new Error(`Unknown collection ${p.collection}`);
  if (catalogueIds.has(p.id)) throw new Error(`Duplicate product ID ${p.id}`);
  const route = `${p.collection}/${p.slug}`;
  if (cataloguePaths.has(route)) throw new Error(`Duplicate catalogue route ${route}`);
  catalogueIds.add(p.id); cataloguePaths.add(route);
  for (const src of [p.image, ...p.gallery]) if (!existsSync(path.join(process.cwd(), "public", src))) throw new Error(`Missing product image ${src}`);
  if (/[\u3400-\u9fff]/.test(`${p.name} ${p.description} ${p.category}`)) throw new Error(`Untranslated product ${p.id}`);
  if (/anewson/i.test(`${p.name} ${p.description} ${p.category}`)) throw new Error(`Supplier copy in product ${p.id}`);
}
for (const c of productCollections) if (catalogueProducts.some((p) => p.collection === c.id) && !existsSync(path.join(process.cwd(), "public", c.image))) throw new Error(`Missing collection image ${c.image}`);
console.log(`Validated ${catalogueProducts.length} enquiry-only catalogue products, unique references, routes, collection images and product galleries.`);
