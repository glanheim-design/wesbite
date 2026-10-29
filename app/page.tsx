import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";
import { catalogueProducts } from "@/lib/products";
import ProductCatalogue from "@/components/product-catalogue";
import { CollectionRail, ConstructionStages, ProductApproach, ProductClosing } from "@/components/product-editorial";
export default function Home() {
  const featured = [["kitchens", "AN-01"], ["kitchens", "AN-15"], ["entrance-interior-doors", "AN-P001"], ["vanities", "AN-01"], ["vanities", "AN-06"], ["wardrobes", "AN-01"]].map(([collection, code]) => catalogueProducts.find((p) => p.collection === collection && p.code === code)).filter((p) => !!p);
  const edit = featured;
  return <div className="collection-site">
    <div className="pl-subnav"><div className="pl-wrap"><strong>The GLANHEIM collection</strong><span>Considered materials. Coordinated supply.</span></div></div>
    <section className="pl-hero pl-wrap"><span className="pl-eyebrow">Architectural materials · Australian projects</span><h1>Materials without<br />compromise.</h1><p className="pl-intro">Every opening. Every finish. Every detail.<br />Explore materials that work beautifully together,<br className="pl-desktop-break" /> from the building envelope to the final fit-out.</p><div className="pl-hero-actions"><Link className="pl-button" href="/products">Explore the collection <span aria-hidden="true">↓</span></Link><Link className="pl-text-link" href="#construction-stages">Plan your package <span aria-hidden="true">↗</span></Link></div><div className="pl-hero-image"><Image src="/images/products/kitchens/p02-21.webp" alt="Architectural kitchen with a long island, integrated shelving and full-height glazing" fill priority sizes="100vw" /></div><div className="pl-image-foot"><span>Kitchen collection · Considered from every angle.</span><Link href="/products/kitchens">Discover joinery <span aria-hidden="true">↗</span></Link></div><CollectionRail /></section>
    <ConstructionStages />
    <section className="pl-section pl-product-edit" id="product-edit"><div className="pl-wrap"><div className="pl-section-top"><div><span className="pl-eyebrow">The product edit</span><h2>Find your next detail.</h2></div><p>A considered introduction to the collection. Explore a product, keep its reference, and add it to your project enquiry.</p></div><Suspense fallback={<p>Preparing the collection…</p>}><ProductCatalogue products={edit} /></Suspense><div className="pl-centred-link"><Link className="pl-button" href="/products">Explore all products <span aria-hidden="true">↗</span></Link></div></div></section>
    <ProductApproach /><ProductClosing />
  </div>;
}
