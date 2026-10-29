import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import ProductCatalogue from "@/components/product-catalogue";
import { ProductSelectButton } from "@/components/product-selection";
import { ProductClosing } from "@/components/product-editorial";
import { catalogueProducts, productCollections, productHref, phaseInfo } from "@/lib/products";
import { pageMeta } from "@/lib/site";
import { siteUrl } from "@/lib/site";
type Props = { params: Promise<{ segments?: string[] }> };
export const dynamicParams = false;
export function generateStaticParams() {
  return [{ segments: [] }, ...productCollections.filter((c) => catalogueProducts.some((p) => p.collection === c.id)).map((c) => ({ segments: [c.id] })), ...catalogueProducts.map((p) => ({ segments: [p.collection, p.slug] }))];
}
function resolve(segments: string[]) {
  if (!segments.length) return {};
  const collection = productCollections.find((c) => c.id === segments[0]);
  if (!collection || segments.length > 2) return null;
  const product = segments[1] ? catalogueProducts.find((p) => p.collection === collection.id && p.slug === segments[1]) : undefined;
  if (segments[1] && !product) return null;
  return { collection, product };
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const segments = (await params).segments || [], r = resolve(segments);
  if (!r) return {};
  return pageMeta(r.product ? `${r.product.name}${r.product.code ? ` · ${r.product.code}` : ""}` : r.collection?.name || "The product collection", r.product?.description || r.collection?.intro || "Explore architectural windows, doors, kitchens, vanities, wardrobes, wall panels, tiles and timber flooring. Select products for one project enquiry.", `/products${segments.length ? "/" + segments.join("/") : ""}`);
}
export default async function ProductsPage({ params }: Props) {
  const segments = (await params).segments || [], r = resolve(segments);
  if (!r) notFound();
  const { collection, product } = r;
  if (product && collection) {
    const phase = phaseInfo[product.phase];
    const related = catalogueProducts.filter((p) => p.collection === product.collection && p.category === product.category && p.id !== product.id).slice(0, 3);
    return <div className="collection-site">
      <nav className="pl-breadcrumbs pl-wrap" aria-label="Breadcrumb"><Link href="/products">Collections</Link><span aria-hidden="true">/</span><Link href={`/products/${collection.id}`}>{collection.name}</Link><span aria-hidden="true">/</span><span aria-current="page">{product.code || product.name}</span></nav>
      <section className="pl-product-detail pl-wrap"><div className="pl-detail-photo"><Image src={product.image} alt={product.name + (product.code ? ` — ${product.code}` : "")} fill priority sizes="(max-width:700px) 100vw, 55vw" /></div><div className="pl-detail-copy"><Link className="pl-eyebrow" href={`/products/${collection.id}?category=${encodeURIComponent(product.category)}`}>{product.category}</Link><h1>{product.name}</h1><p className="pl-detail-description">{product.description}</p><dl className="pl-specs"><div><dt>Catalogue reference</dt><dd>{product.code || "Refer to this design in your enquiry"}</dd></div>{!!product.alternativeCodes?.length && <div><dt>Additional source references</dt><dd>{product.alternativeCodes.join(" / ")}</dd></div>}{product.variant && <div><dt>Design variant</dt><dd>{product.variant}</dd></div>}<div><dt>Collection</dt><dd>{collection.name}</dd></div><div><dt>Project stage</dt><dd>{phase.number} · {phase.name}</dd></div><div><dt>Dimensions & finishes</dt><dd>Confirmed with your project scope</dd></div><div><dt>Supply</dt><dd>By project enquiry</dd></div></dl><div className="pl-detail-actions"><ProductSelectButton productId={product.id} className="pl-button" /><Link className="pl-text-link" href={`/request-pricing?selection=${product.id}`}>Enquire about this product <span aria-hidden="true">↗</span></Link></div><p className="pl-note">Catalogue imagery shows design options. Materials, dimensions, hardware, inclusions, availability and suitability are confirmed for the selected product and intended application.</p><span className="pl-wordmark">GLANHEIM</span></div></section>
      {product.gallery.length > 0 && <section className="pl-gallery pl-wrap" aria-label={product.galleryContext ? "Collection application imagery" : "More product views"}>{product.galleryContext && <p className="pl-note" style={{ gridColumn: "1 / -1" }}>{product.galleryContext}</p>}{product.gallery.map((src, i) => <div key={src}><Image src={src} alt={product.galleryContext ? `${collection.name}, collection application ${i + 1}` : `${product.name}, detail ${i + 1}`} fill sizes="(max-width:700px) 100vw, 50vw" /></div>)}</section>}
      <section className="pl-section pl-wrap"><div className="pl-section-top"><div><span className="pl-eyebrow">Coordinate the package</span><h2>Make it work<br />for your project.</h2></div><p>{phase.intro}</p></div><div className="pl-process pl-process-three"><article><span className="pl-number">01 / DOCUMENT</span><h3>Define the selection.</h3><p>Include this reference, the intended application, quantities and your drawing or schedule revision.</p></article><article><span className="pl-number">02 / RESOLVE</span><h3>Check the interfaces.</h3><p>Coordinate adjoining materials, finished dimensions and installation requirements with your project team.</p></article><article><span className="pl-number">03 / PROGRAMME</span><h3>Plan the supply.</h3><p>Share required dates, delivery location and access constraints so the supply scope can be reviewed.</p></article></div></section>
      {related.length > 0 && <section className="pl-section pl-product-edit"><div className="pl-wrap"><div className="pl-section-top"><div><span className="pl-eyebrow">Continue the material story</span><h2>Considered together.</h2></div><Link className="pl-text-link" href={`/products/${collection.id}`}>View the collection ↗</Link></div><Suspense fallback={<p>Preparing related products…</p>}><ProductCatalogue products={related} collection={collection.id} /></Suspense></div></section>}
      <ProductClosing /><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "Product", name: product.name, description: product.description, image: siteUrl + product.image, ...(product.code ? {mpn: product.code} : {}), url: siteUrl + productHref(product) }).replace(/</g, "\\u003c") }} />
    </div>;
  }
  const rows = collection ? catalogueProducts.filter((p) => p.collection === collection.id) : catalogueProducts;
  return <div className="collection-site"><nav className="pl-breadcrumbs pl-wrap" aria-label="Breadcrumb"><Link href="/">Home</Link><span aria-hidden="true">/</span>{collection ? <><Link href="/products">Collections</Link><span aria-hidden="true">/</span><span aria-current="page">{collection.name}</span></> : <span aria-current="page">Collections</span>}</nav>
    <section className="pl-collection-intro pl-wrap"><span className="pl-eyebrow">The GLANHEIM collection</span><h1>{collection?.name || <>A material story.<br />Made for your project.</>}</h1><p>{collection?.intro || "From the building envelope to the final interior detail. Explore a connected collection of architectural products, organised around the way you build."}</p>{collection && <Link className="pl-text-link" href={`/request-pricing?package=${encodeURIComponent(collection.name)}&material=${encodeURIComponent(collection.materialPackage)}`}>Discuss this package <span aria-hidden="true">↗</span></Link>}</section>
    {!collection && <nav className="pl-collection-grid pl-wrap" aria-label="Choose a collection">{productCollections.filter((c) => catalogueProducts.some((p) => p.collection === c.id)).map((c) => <Link href={`/products/${c.id}`} key={c.id}><div><Image src={c.image} alt={c.name} fill sizes="(max-width:700px) 45vw, 25vw" /></div><span>{c.name} <span aria-hidden="true">↗</span></span></Link>)}</nav>}
    <section className="pl-section pl-product-edit"><div className="pl-wrap"><div className="pl-section-top"><div><span className="pl-eyebrow">Browse by reference, category or construction stage</span><h2>{collection ? "Explore the collection." : "Find your next detail."}</h2></div><p>Keep the original product reference with your selection. Add individual products to one enquiry, with no online checkout.</p></div><Suspense fallback={<p>Preparing products…</p>}><ProductCatalogue products={rows} collection={collection?.id} /></Suspense></div></section><ProductClosing /></div>;
}
