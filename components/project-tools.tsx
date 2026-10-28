"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";
const scopeOptions = [
  ["Façade systems", "Exterior façade"],
  ["Joinery & cabinetry", "Joinery"],
  ["Stone & porcelain", "Stone / porcelain"],
  ["Wall & ceiling finishes", "Wall and ceiling finishes"],
  ["Flooring & tiling", "Flooring and tiling"],
  ["Metalwork", "Architectural metalwork"],
] as const;
export function PackageBuilder() {
  const [selected, setSelected] = useState<string[]>([]);
  const params = new URLSearchParams();
  if (selected.length) params.set("package", selected.join(", "));
  selected.forEach((s) => {
    const match = scopeOptions.find(([name]) => name === s);
    if (match) params.append("material", match[1]);
  });
  return (
    <section
      className="scope-builder container"
      aria-labelledby="scope-heading"
    >
      <div>
        <h2 id="scope-heading">Build your package</h2>
        <p>
          Bring the materials you need into one project enquiry. Choose the
          categories that belong in your scope.
        </p>
        <Link href="/materials" className="text-link">
          Explore the complete catalogue
        </Link>
      </div>
      <div>
        <fieldset>
          <legend>Select material categories</legend>
          <div className="scope-choices">
            {scopeOptions.map(([name]) => (
              <label
                key={name}
                className={
                  selected.includes(name)
                    ? "scope-choice selected"
                    : "scope-choice"
                }
              >
                <input
                  type="checkbox"
                  checked={selected.includes(name)}
                  onChange={(e) =>
                    setSelected(
                      e.target.checked
                        ? [...selected, name]
                        : selected.filter((s) => s !== name),
                    )
                  }
                />
                <span>{name}</span>
              </label>
            ))}
          </div>
        </fieldset>
        <p className="scope-summary" role="status">
          {selected.length
            ? `${selected.length} ${selected.length === 1 ? "category" : "categories"} in your package`
            : "Individual materials or a complete package."}
        </p>
        <Link
          href={`/request-pricing${params.size ? "?" + params.toString() : ""}`}
          className="button"
        >
          Request pricing <span aria-hidden="true">↗</span>
        </Link>
        <noscript>
          <p>Select your categories in the pricing enquiry form.</p>
        </noscript>
      </div>
    </section>
  );
}
const audiences = [
  {
    name: "Builders & contractors",
    text: "Review a defined supply package against the drawings, programme and delivery requirements of your construction project.",
    send: "Drawings, scope boundaries, quantities, delivery location and required dates.",
    action: "Discuss a supply package",
  },
  {
    name: "QS & estimators",
    text: "Explore material supply options for a budget, tender or procurement comparison, with alternatives considered where the specification allows.",
    send: "BOQ, finish schedules, tender deadline, pricing purpose and any target rates.",
    action: "Send a pricing scope",
  },
  {
    name: "Architects & designers",
    text: "Discuss material selections, finishes and the technical information needed to assess options against the design intent.",
    send: "Material palette, specifications, intended applications and sample requirements.",
    action: "Discuss material selections",
  },
  {
    name: "Developers & teams",
    text: "Coordinate material requirements across interior, exterior and repeated project packages, with supply scope and programme milestones clearly agreed.",
    send: "Project brief, package schedule, quantities, procurement stage and delivery programme.",
    action: "Discuss your project",
  },
  {
    name: "Fit-out & specialist trades",
    text: "Source an individual material or a coordinated finish package for office, retail, hospitality and residential interiors.",
    send: "Trade scope, dimensions, finish schedule, quantities and delivery requirements.",
    action: "Discuss a finish package",
  },
];
export function AudienceSelector() {
  const [active, setActive] = useState(0);
  return (
    <section
      className="audience-section container"
      aria-labelledby="audience-heading"
    >
      <h2 id="audience-heading">Who we service</h2>
      <div className="audience-layout">
        <div
          className="audience-options"
          aria-label="Explore services for your role"
        >
          {audiences.map((a, i) => (
            <button
              key={a.name}
              type="button"
              aria-pressed={active === i}
              onClick={() => setActive(i)}
            >
              {a.name}
              <span aria-hidden="true">{active === i ? "−" : "+"}</span>
            </button>
          ))}
        </div>
        <div className="audience-answer" aria-live="polite">
          <h3>{audiences[active].name}</h3>
          <p>{audiences[active].text}</p>
          <h4>What to send us</h4>
          <p>{audiences[active].send}</p>
          <Link
            className="button"
            href={`/request-pricing?role=${encodeURIComponent(audiences[active].name)}`}
          >
            {audiences[active].action}
          </Link>
        </div>
      </div>
      <noscript>
        <p>
          We work with builders, contractors, quantity surveyors, estimators,
          architects, designers, developers, project teams and specialist
          trades. Send your drawings, quantities and programme for review.
        </p>
      </noscript>
    </section>
  );
}

const studies = [
  {
    name: "Architecture",
    src: "/images/architecture.webp",
    alt: "Conceptual limestone courtyard and timber screening",
  },
  {
    name: "Interiors",
    src: "/images/interior.webp",
    alt: "Conceptual reception with coordinated timber and stone finishes",
  },
  {
    name: "Façades",
    src: "/images/facade.webp",
    alt: "Conceptual façade with stone, brick and architectural aluminium",
  },
];
export function HeroStudy() {
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(true);
  useEffect(() => {
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!playing || reduce) return;
    const timer = setInterval(() => {
      if (!document.hidden) setActive((i) => (i + 1) % studies.length);
    }, 6500);
    return () => clearInterval(timer);
  }, [playing]);
  return (
    <div className="hero-study">
      <div className="study-images">
        {studies.map((s, i) => (
          <Image
            key={s.name}
            src={s.src}
            alt={i === active ? s.alt : ""}
            aria-hidden={i !== active}
            fill
            priority={i === 0}
            sizes="(max-width:700px) 100vw, 66vw"
            className={i === active ? "active" : ""}
          />
        ))}
      </div>
      <div className="study-controls" aria-label="Architectural concept images">
        {studies.map((s, i) => (
          <button
            key={s.name}
            type="button"
            aria-pressed={active === i}
            onClick={() => {
              setActive(i);
              setPlaying(false);
            }}
          >
            {s.name}
          </button>
        ))}
        <button
          type="button"
          onClick={() => setPlaying(!playing)}
          aria-label={
            playing ? "Pause image slideshow" : "Play image slideshow"
          }
        >
          {playing ? "Pause" : "Play"}
        </button>
      </div>
    </div>
  );
}
