import Image from "next/image";
import Link from "next/link";
import { projectCollections } from "@/lib/project-collections";
export default function ProjectCollectionPreview() {
  const cards = [
    ...projectCollections.map((c) => ({ ...c, href: `/collections/${c.id}` })),
    {
      id: "packages",
      name: "Project packages",
      intro:
        "Bring the relevant selections together. Coordinate openings, interiors and finishes in one clear project brief.",
      image: "/images/workshop.webp",
      href: "/project-packages",
    },
  ];
  return (
    <section
      className="pl-section pl-wrap cx-preview"
      aria-labelledby="collection-context-heading"
    >
      <div className="pl-section-top">
        <div>
          <span className="pl-eyebrow">Collections around your project</span>
          <h2 id="collection-context-heading">
            The right materials.
            <br />
            In the right context.
          </h2>
        </div>
        <p>
          Start with the spaces you are creating. Each collection brings
          relevant products and supply packages together.
        </p>
      </div>
      <div className="cx-grid">
        {cards.map((c, i) => (
          <Link className="cx-card" key={c.id} href={c.href}>
            <div className="cx-image">
              <Image
                src={c.image}
                alt={`${c.name} material application study`}
                fill
                sizes="(max-width:700px) 100vw, 33vw"
              />
            </div>
            <span className="pl-eyebrow">0{i + 1} / Explore</span>
            <h3>
              {c.name}
              <span aria-hidden="true">↗</span>
            </h3>
            <p>{c.intro}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
