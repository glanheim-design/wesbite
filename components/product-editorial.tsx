"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { phaseInfo, productCollections, type ProductPhase } from "@/lib/products";
const phaseMedia = { enclose: "/images/products/windows-doors/bifold-window.jpeg", "fit-out": "/images/products/kitchens/p07-102.webp", finish: "/images/products/wall-panels/wall-panel-interior.png" };
const headlines = { enclose: <>Open up<br />the possibilities.</>, "fit-out": <>Everything in<br />its right place.</>, finish: <>Finish with<br />a considered touch.</> };
export function ConstructionStages() {
  const [phase, setPhase] = useState<ProductPhase>("enclose");
  const keys = Object.keys(phaseInfo) as ProductPhase[];
  const active = phaseInfo[phase];
  return <section className="pl-section pl-wrap" id="construction-stages" aria-labelledby="stage-heading">
    <div className="pl-section-top"><div><span className="pl-eyebrow">One project. A connected material palette.</span><h2 id="stage-heading">Built around<br />the way you build.</h2></div><p>Make selections in the right sequence. We coordinate materials with your drawings, trade interfaces and delivery programme.</p></div>
    <div className="pl-stage-tabs" role="tablist" aria-label="Construction stages">{keys.map((key, i) => <button type="button" role="tab" id={`stage-tab-${key}`} aria-controls="construction-panel" aria-selected={phase === key} tabIndex={phase === key ? 0 : -1} key={key} onClick={() => setPhase(key)} onKeyDown={(e) => { if (["ArrowLeft", "ArrowRight", "Home", "End"].includes(e.key)) { e.preventDefault(); const next = e.key === "Home" ? 0 : e.key === "End" ? 2 : (i + (e.key === "ArrowRight" ? 1 : 2)) % 3; setPhase(keys[next]); document.getElementById(`stage-tab-${keys[next]}`)?.focus(); } }}><small>{phaseInfo[key].number} · {phaseInfo[key].short}</small><strong>{phaseInfo[key].name}</strong></button>)}</div>
    <div className="pl-stage-panel" id="construction-panel" role="tabpanel" aria-labelledby={`stage-tab-${phase}`}>
      <div className="pl-stage-photo"><Image src={phaseMedia[phase]} alt={phase === "enclose" ? "Folding window above a kitchen bench" : phase === "fit-out" ? "Contemporary kitchen with an island bench" : "Fluted wall panelling in a living space"} fill sizes="(max-width:700px) 100vw, 60vw" /></div>
      <div className="pl-stage-copy"><span className="pl-eyebrow">{active.number} / {active.name}</span><h3>{headlines[phase]}</h3><p>{active.intro}</p><ul>{active.items.map((x) => <li key={x}>{x}</li>)}</ul><Link className="pl-text-link" href={`/products?phase=${phase}`}>Explore this stage <span aria-hidden="true">↗</span></Link><span className="pl-wordmark">GLANHEIM</span></div>
    </div>
  </section>;
}
export function CollectionRail() {
  return <nav className="pl-range-nav" aria-label="Product collections">{productCollections.map((c, i) => <Link key={c.id} href={`/products/${c.id}`}><svg className="pl-range-icon" viewBox="0 0 42 38" aria-hidden="true"><rect x="5" y="3" width="32" height="31" /><path d={i % 3 === 0 ? "M21 3v31M5 19h32" : i % 3 === 1 ? "M17 3v31M25 16v6M12 16v6" : "M5 14h32M5 23h32M18 14v20"} /></svg><span>{c.name}</span></Link>)}</nav>;
}
export function ProductApproach() {
  const steps = [["Define", "Start with the scope.", "Share drawings, product references, quantities and required dates. Identify the boundaries of each supply package."], ["Coordinate", "Resolve the interfaces.", "Review openings, service positions, finished levels and adjoining materials before finalising selections."], ["Confirm", "Make it specific.", "Agree samples, finishes, technical information and shop drawings where required for your package."], ["Programme", "Plan for installation.", "Coordinate production and supply milestones with the project programme, access and storage requirements."]];
  return <section className="pl-section pl-wrap" aria-labelledby="approach-heading"><div className="pl-section-top"><div><span className="pl-eyebrow">From selection to site</span><h2 id="approach-heading">The details matter.<br />So does the sequence.</h2></div><p>Beautiful materials need a clear brief. Coordinate selections early, resolve the interfaces, and plan delivery around the work on site.</p></div><div className="pl-process">{steps.map(([label, title, text], i) => <article key={label}><span className="pl-number">0{i + 1} / {label}</span><h3>{title}</h3><p>{text}</p></article>)}</div></section>;
}
export function ProductClosing() {
  return <section className="pl-package"><div className="pl-wrap"><div><span className="pl-eyebrow">Your selections. One conversation.</span><h2>A single detail.<br />Or the whole package.</h2><p>Select the products that belong in your project. Send your shortlist with your scope and drawings, and we’ll take it from there.</p></div><div className="pl-package-actions"><Link className="pl-button pl-button-light" href="/request-pricing">Discuss your project <span aria-hidden="true">↗</span></Link><Link className="pl-text-link" href="/products">Keep exploring <span aria-hidden="true">↗</span></Link></div></div></section>;
}
