import { catalogueProducts, productCollections, productHref as catalogueProductHref } from "@/lib/products";
import type { MetadataRoute } from "next";
import {
  categories,
  products,
  groups,
  categoryHref,
  productHref,
} from "@/lib/content";
import { siteUrl } from "@/lib/site";
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    "",
    "/products",
    ...productCollections.filter((c) => catalogueProducts.some((p) => p.collection === c.id)).map((c) => "/products/" + c.id),
    ...catalogueProducts.map(catalogueProductHref),
    "/materials",
    ...groups.map((g) => "/materials/" + g),
    ...categories.map(categoryHref),
    ...products.map(productHref),
    "/project-packages",
    "/procurement",
    "/about",
    "/contact",
    "/request-pricing",
    "/privacy",
    "/terms",
    "/enquiry-terms",
  ].map((path) => ({
    url: siteUrl + path,
    changeFrequency: "monthly",
    priority: path === "" ? 1 : path === "/request-pricing" ? 0.9 : 0.7,
  }));
}
