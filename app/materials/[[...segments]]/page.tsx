import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import Catalogue from "@/components/catalogue";
import {
  Architecture,
  Breadcrumbs,
  Button,
  ClosingCTA,
  PageIntro,
} from "@/components/ui";
import {
  categories,
  products,
  groups,
  groupInfo,
  categoryHref,
  productHref,
  type Group,
} from "@/lib/content";
import { pageMeta } from "@/lib/site";
type Props = { params: Promise<{ segments?: string[] }> };
export const dynamicParams = false;
export function generateStaticParams() {
  return [
    { segments: [] },
    ...groups.map((g) => ({ segments: [g] })),
    ...categories.map((c) => ({ segments: [c.group, c.slug] })),
    ...products.map((p) => ({ segments: [p.group, p.category, p.slug] })),
  ];
}
function resolve(s: string[]) {
  const group = groups.includes(s[0] as Group) ? (s[0] as Group) : undefined;
  const cat = categories.find((c) => c.group === group && c.slug === s[1]);
  const product = products.find(
    (p) => p.group === group && p.category === cat?.slug && p.slug === s[2],
  );
  if (
    s.length > 3 ||
    (s.length && !group) ||
    (s.length > 1 && !cat) ||
    (s.length > 2 && !product)
  )
    return null;
  return { group, cat, product };
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const s = (await params).segments || [];
  const r = resolve(s);
  if (!r) return {};
  const title =
    r.product?.name ||
    r.cat?.name ||
    (r.group ? groupInfo[r.group].title : "The material palette");
  return pageMeta(
    title,
    r.product?.description ||
      r.cat?.description ||
      "Explore project-specific architectural materials sourcing categories for Australian commercial construction.",
    `/materials${s.length ? "/" + s.join("/") : ""}`,
  );
}
export default async function Materials({ params }: Props) {
  const s = (await params).segments || [];
  const r = resolve(s);
  if (!r) notFound();
  const { group, cat, product } = r;
  if (product)
    return (
      <>
        <div className="container">
          <Breadcrumbs
            items={[
              { name: "Materials", href: "/materials" },
              { name: groupInfo[group!].title, href: `/materials/${group}` },
              { name: cat!.name, href: categoryHref(cat!) },
              { name: "Sourcing profile" },
            ]}
          />
        </div>
        <PageIntro
          eyebrow="PROJECT-SPECIFIC SOURCING PROFILE"
          title={product.name}
        >
          <p>{product.description}</p>
        </PageIntro>
        <section className="container detail-grid">
          {product.image ? (
            <div className="architecture">
              <Image
                src={product.image.src}
                alt={product.image.alt}
                fill
                sizes="(max-width:700px) 100vw, 50vw"
              />
            </div>
          ) : (
            <div className="material-profile-art">
              <span>{cat!.materialType}</span>
              <span className="large-serif">{cat!.name}</span>
              <small>
                Illustrative material study · not a verified product photograph
              </small>
            </div>
          )}
          <div>
            <p className="status-tag">
              Sourcing enquiry · availability to be established
            </p>
            <h2>
              Your specification.
              <br />
              <em>A considered response.</em>
            </h2>
            <p>
              Send your intended application, quantities, finish schedule and
              project requirements for scope review.
            </p>
            <Button
              href={`/request-pricing?product=${encodeURIComponent(product.name)}`}
            >
              Request project pricing
            </Button>
            <dl className="spec-list">
              {[
                ["Applications", product.applications.join(", ")],
                ["Manufacturer", product.manufacturer],
                ["Composition", product.composition],
                ["Dimensions", product.dimensions],
                ["Available finishes", product.finishes.join(", ")],
                ["Lead time", product.leadTime],
                ["Minimum order", product.minimumOrderQuantity],
                ["Installation system", product.installationSystem],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt>{k}</dt>
                  <dd>{v || "To be confirmed for the selected product"}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
        <section className="container prose-section">
          <h2>Technical information</h2>
          <p>
            {product.approvedPublicStatement ||
              "Product specifications and technical documentation are confirmed for the selected material and intended application during project review."}
          </p>
          {product.technicalDataSheet &&
            product.documentAccess === "approved-public" && (
              <a
                href={product.technicalDataSheet}
                rel="noopener noreferrer"
                target="_blank"
              >
                Technical data sheet ↗
              </a>
            )}
          {product.testReports
            .filter(
              (t) =>
                t.publicPermission &&
                product.documentAccess === "approved-public",
            )
            .map((t) => (
              <p key={t.url}>
                <a href={t.url} target="_blank" rel="noopener noreferrer">
                  Authorised test report ↗
                </a>
              </p>
            ))}
          <ul>
            {product.limitations.map((l) => (
              <li key={l}>{l}</li>
            ))}
          </ul>
          <Link href="/procurement" className="text-link">
            Our procurement approach ↗
          </Link>
        </section>
        <ClosingCTA />
      </>
    );
  if (cat)
    return (
      <>
        <div className="container">
          <Breadcrumbs
            items={[
              { name: "Materials", href: "/materials" },
              { name: groupInfo[group!].title, href: `/materials/${group}` },
              { name: cat.name },
            ]}
          />
        </div>
        <PageIntro eyebrow={`${group} / MATERIAL CATEGORY`} title={cat.name}>
          <p>{cat.description}</p>
        </PageIntro>
        <section className="container detail-grid">
          <Architecture />
          <div>
            <h2>
              A package shaped
              <br />
              <em>around your project.</em>
            </h2>
            <p>
              Potential sourcing categories for discussion, subject to
              availability, product suitability and evidence review. These are
              material supply enquiries, not installation services.
            </p>
            <ul className="ruled-list">
              {cat.items.map((i) => (
                <li key={i}>{i}</li>
              ))}
            </ul>
            <Button
              href={`/request-pricing?package=${encodeURIComponent(cat.name)}`}
            >
              Request category pricing
            </Button>
          </div>
        </section>
        <section className="container prose-section">
          <p className="eyebrow">EXPLORE THE REQUIREMENTS</p>
          <h2>Start with a sourcing profile.</h2>
          <p>
            Manufacturer, dimensions, finishes, technical documentation and
            availability are confirmed for the selected product and project.
          </p>
          {products
            .filter((p) => p.category === cat.slug && p.group === cat.group)
            .map((p) => (
              <Link key={p.slug} href={productHref(p)} className="profile-link">
                {p.name} <span aria-hidden="true">↗</span>
              </Link>
            ))}
        </section>
        <ClosingCTA />
      </>
    );
  return (
    <>
      <PageIntro
        eyebrow={
          group
            ? `${groupInfo[group].number} / THE MATERIAL PALETTE`
            : "ARCHITECTURAL MATERIALS / AUSTRALIA"
        }
        title={group ? groupInfo[group].title : "A material difference."}
      >
        <p>
          {group
            ? groupInfo[group].intro
            : "From the building envelope to the final interior detail. Explore a considered range of project-specific sourcing categories."}
        </p>
      </PageIntro>
      <section className="container catalogue-section">
        <nav className="collection-tabs" aria-label="Material collections">
          <Link href="/materials" aria-current={!group ? "page" : undefined}>
            All materials
          </Link>
          {groups.map((g) => (
            <Link
              key={g}
              href={`/materials/${g}`}
              aria-current={group === g ? "page" : undefined}
            >
              {groupInfo[g].title}
            </Link>
          ))}
        </nav>
        <p className="catalogue-notice">
          A sourcing catalogue, subject to project review. Listings do not
          confirm stock availability or product approval.
        </p>
        <Catalogue group={group} categories={categories} />
      </section>
      <ClosingCTA />
    </>
  );
}
