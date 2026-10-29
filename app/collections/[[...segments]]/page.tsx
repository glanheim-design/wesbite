import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import ProductCatalogue from "@/components/product-catalogue";
import { productCollections } from "@/lib/products";
import {
  projectCollections,
  productsForContext,
} from "@/lib/project-collections";
import { pageMeta } from "@/lib/site";

type Props = { params: Promise<{ segments?: string[] }> };
export const dynamicParams = false;
export function generateStaticParams() {
  return [
    { segments: [] },
    ...projectCollections.map((collection) => ({ segments: [collection.id] })),
  ];
}
function contextFor(segments: string[]) {
  if (segments.length !== 1) return undefined;
  return projectCollections.find((collection) => collection.id === segments[0]);
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const segments = (await params).segments || [];
  if (!segments.length)
    return pageMeta(
      "Collections for your project",
      "Explore commercial, residential, fit-out, exterior and interior material collections, with coordinated project packages for your brief.",
      "/collections",
    );
  const context = contextFor(segments);
  return context
    ? pageMeta(
        `${context.name} collections & packages`,
        context.intro,
        `/collections/${context.id}`,
      )
    : {};
}
const navigation = [
  ...projectCollections.map((collection) => ({
    name: collection.name,
    href: `/collections/${collection.id}`,
  })),
  { name: "Project packages", href: "/project-packages" },
];

export default async function ProjectCollectionsPage({ params }: Props) {
  const segments = (await params).segments || [];
  const context = contextFor(segments);
  if (segments.length && !context) notFound();

  if (!context)
    return (
      <div className="collection-site cx-site">
        <nav className="pl-breadcrumbs pl-wrap" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">Project collections</span>
        </nav>
        <section className="pl-collection-intro pl-wrap cx-intro">
          <span className="pl-eyebrow">The GLANHEIM collections</span>
          <h1>
            A material story.
            <br />
            Shaped around your project.
          </h1>
          <p>
            Start with the way the space will be built and used. Explore
            connected product selections and supply packages for commercial
            projects, homes, fit-outs and the spaces inside and out.
          </p>
        </section>
        <section
          className="pl-wrap cx-context-grid"
          aria-label="Explore project collections"
        >
          {projectCollections.map((collection, index) => (
            <Link
              className="cx-context-card"
              key={collection.id}
              href={`/collections/${collection.id}`}
            >
              <div className="cx-card-photo">
                <Image
                  src={collection.image}
                  alt={`${collection.name} architectural application imagery`}
                  fill
                  sizes="(max-width:700px) 100vw, 50vw"
                  priority={index < 2}
                />
              </div>
              <div className="cx-card-copy">
                <span className="pl-eyebrow">
                  0{index + 1} / {collection.name}
                </span>
                <h2>
                  {collection.name}
                  <span aria-hidden="true">↗</span>
                </h2>
                <p>{collection.intro}</p>
              </div>
            </Link>
          ))}
          <Link className="cx-context-card" href="/project-packages">
            <div className="cx-card-photo">
              <Image
                src="/images/workshop.webp"
                alt="Architectural concept of a material selection bench with drawings and finishes"
                fill
                sizes="(max-width:700px) 100vw, 50vw"
              />
            </div>
            <div className="cx-card-copy">
              <span className="pl-eyebrow">06 / Coordinated supply</span>
              <h2>
                Project packages<span aria-hidden="true">↗</span>
              </h2>
              <p>
                From one material to a coordinated supply brief. Bring together
                selected products, scope boundaries, quantities, drawings and
                programme requirements in one enquiry.
              </p>
            </div>
          </Link>
        </section>
        <section className="pl-section pl-wrap cx-index-close">
          <span className="pl-eyebrow">Choose your starting point</span>
          <h2>
            A whole package.
            <br />
            Or a single detail.
          </h2>
          <p>
            Explore by project context, browse individual product families, or
            bring us a scope that needs a more tailored review.
          </p>
          <div className="cx-actions">
            <Link className="pl-button" href="/products">
              Browse all products <span aria-hidden="true">↗</span>
            </Link>
            <Link className="pl-text-link" href="/request-pricing">
              Discuss your scope <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </section>
      </div>
    );

  const products = productsForContext(context.id);
  const enquiry = (name: string, materials: string[]) => {
    const query = new URLSearchParams({ package: `${context.name} · ${name}` });
    materials.forEach((material) => query.append("material", material));
    return `/request-pricing?${query.toString()}`;
  };
  const imageNote =
    context.id === "commercial" || context.id === "fit-out"
      ? "Architectural application concept. Shown to illustrate the collection context."
      : "Catalogue application imagery. Final selections and inclusions are confirmed with your project brief.";

  return (
    <div className="collection-site cx-site">
      <nav className="pl-breadcrumbs pl-wrap" aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <span aria-hidden="true">/</span>
        <Link href="/collections">Project collections</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">{context.name}</span>
      </nav>
      <nav className="cx-context-nav pl-wrap" aria-label="Project collections">
        {navigation.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            aria-current={
              item.href === `/collections/${context.id}` ? "page" : undefined
            }
          >
            {item.name}
          </Link>
        ))}
      </nav>
      <section className="pl-wrap cx-hero">
        <div className="cx-hero-copy">
          <span className="pl-eyebrow">
            {context.name} / The GLANHEIM collection
          </span>
          <h1>
            {context.headline.split("\n").map((line, index) => (
              <span key={line}>
                {index > 0 && <br />}
                {line}
              </span>
            ))}
          </h1>
          <p>{context.intro}</p>
          <div className="cx-actions">
            <a className="pl-button" href="#context-packages">
              Explore the packages <span aria-hidden="true">↓</span>
            </a>
            <a className="pl-text-link" href="#context-products">
              Browse product references <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
        <div className="cx-hero-photo">
          <Image
            src={context.image}
            alt={`${context.name} architectural material application`}
            fill
            priority
            sizes="(max-width:900px) 100vw, 55vw"
          />
        </div>
        <p className="cx-image-note pl-note">{imageNote}</p>
      </section>
      <section
        className="pl-section pl-wrap cx-packages"
        id="context-packages"
        aria-labelledby="context-packages-heading"
      >
        <div className="pl-section-top">
          <div>
            <span className="pl-eyebrow">Connected by the scope</span>
            <h2 id="context-packages-heading">Considered together.</h2>
          </div>
          <p>
            Use a package as the starting point for your brief. Select
            individual references below, then coordinate the materials,
            dimensions and technical requirements for the intended application.
          </p>
        </div>
        <div className="cx-package-grid">
          {context.packages.map((item, index) => (
            <article className="cx-package-card" key={item.name}>
              <span className="pl-eyebrow">
                0{index + 1} / {context.name}
              </span>
              <h3>{item.name}</h3>
              <p>{item.description}</p>
              <ul
                className="cx-package-links"
                aria-label={`Product families in ${item.name}`}
              >
                {item.collections.map((id) => {
                  const family = productCollections.find(
                    (collection) => collection.id === id,
                  );
                  if (
                    !family ||
                    !products.some((product) => product.collection === id)
                  )
                    return null;
                  return (
                    <li key={id}>
                      <Link
                        href={`/collections/${context.id}?collection=${id}#context-products`}
                      >
                        {family.name}
                        <span aria-hidden="true">↗</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
              {(/ceiling/i.test(item.name) ||
                /ceiling/i.test(item.description)) && (
                <Link
                  className="cx-scope-link"
                  href="/materials/interior/wall-ceiling"
                >
                  Wall & ceiling scope review <span aria-hidden="true">↗</span>
                </Link>
              )}
              {/curtain.wall/i.test(item.description) && (
                <Link
                  className="cx-scope-link"
                  href="/materials/exterior/facade-systems"
                >
                  Façade & curtain-wall scope review{" "}
                  <span aria-hidden="true">↗</span>
                </Link>
              )}
              <Link
                className="pl-text-link cx-package-enquire"
                href={enquiry(item.name, item.materials)}
              >
                Enquire about this package <span aria-hidden="true">↗</span>
              </Link>
            </article>
          ))}
        </div>
        <p className="pl-note cx-suitability-note">
          These collections organise design references for a project enquiry.
          They do not establish suitability, certification or performance for a
          particular use. Product construction, technical evidence, installation
          requirements and supply scope are confirmed through project review.
        </p>
      </section>
      <section
        className="pl-section pl-product-edit"
        id="context-products"
        aria-labelledby="context-products-heading"
      >
        <div className="pl-wrap">
          <div className="pl-section-top">
            <div>
              <span className="pl-eyebrow">
                {context.name} / Product references
              </span>
              <h2 id="context-products-heading">
                Find the details
                <br />
                for your brief.
              </h2>
            </div>
            <p>
              Explore relevant product families, search an original reference
              and keep your selections together in one project enquiry.
            </p>
          </div>
          <Suspense fallback={<p>Preparing product references…</p>}>
            <ProductCatalogue products={products} />
          </Suspense>
        </div>
      </section>
      <section className="pl-package cx-closing">
        <div className="pl-wrap">
          <div>
            <span className="pl-eyebrow">
              {context.name} / A coordinated supply brief
            </span>
            <h2>
              One clear scope.
              <br />A connected package.
            </h2>
            <p>
              Bring your drawings, quantities, selected references and required
              dates. We’ll review the material package with the intended
              application and project requirements.
            </p>
          </div>
          <div className="pl-package-actions">
            <Link
              className="pl-button pl-button-light"
              href={enquiry("Project material package", [
                ...new Set(context.packages.flatMap((item) => item.materials)),
              ])}
            >
              Discuss your {context.name.toLowerCase()} project{" "}
              <span aria-hidden="true">↗</span>
            </Link>
            <Link className="pl-text-link" href="/enquiry">
              Review your selections <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
