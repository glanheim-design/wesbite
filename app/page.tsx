import { supplyCommitment } from "@/lib/supply";
import Link from "next/link";
import { Architecture, Button, ClosingCTA } from "@/components/ui";
import {
  PackageBuilder,
  AudienceSelector,
  HeroStudy,
} from "@/components/project-tools";
import { Questions, SupplyProcess } from "@/components/business-sections";
export default function Home() {
  return (
    <>
      <section className="home-hero container">
        <div className="hero-heading">
          <h1>Materials without compromise.</h1>
          <div>
            <p>
              Architectural materials and project-specific supply packages for
              Australian builders, designers and commercial construction teams.
            </p>
            <Button href="/request-pricing">Request pricing</Button>
          </div>
        </div>
        <div className="hero-gallery">
          <p>
            From an individual finish to a coordinated package, bring us the
            drawings that define your project.
          </p>
          <HeroStudy />
          <Link className="text-link" href="/about">
            About GLANHEIM
          </Link>
        </div>
      </section>
      <section className="materials-section container">
        <div className="section-top">
          <h2>Material collections</h2>
          <Link className="text-link" href="/materials">
            Explore materials
          </Link>
        </div>
        <div className="material-editorial">
          <Link className="editorial-card exterior" href="/materials/exterior">
            <Architecture
              src="/images/facade.webp"
              alt="Architectural concept with limestone, brick and aluminium façade finishes"
            />
            <div className="editorial-caption">
              <h3>Exterior materials</h3>
              <p>Façades, stone, screens and architectural metalwork.</p>
            </div>
          </Link>
          <Link className="editorial-card interior" href="/materials/interior">
            <Architecture
              src="/images/interior.webp"
              alt="Architectural concept with coordinated joinery and stone interior finishes"
            />
            <div className="editorial-caption">
              <h3>Interior packages</h3>
              <p>Joinery, surfaces and complete finish packages.</p>
            </div>
          </Link>
        </div>
        <div className="material-small">
          <Link href="/materials/structural">
            <h3>Structural enquiries</h3>
            <p>Selected components to your engineering brief.</p>
          </Link>
          <Link href="/materials/bespoke">
            <h3>Bespoke materials</h3>
            <p>Custom profiles, components and project finishes.</p>
          </Link>
        </div>
      </section>
      <PackageBuilder />
      <section className="container intro-section">
        <div className="intro-grid">
          <Architecture
            src="/images/workshop.webp"
            alt="Conceptual material review bench with drawings, timber and natural stone"
          />
          <div>
            <h2>Your scope comes first</h2>
            <p>
              GLANHEIM coordinates material sourcing and supply around the needs
              of your project. We start with drawings, schedules, quantities and
              programme to understand what is required before assessing
              potential supply options.
            </p>
            <p>
              Clear documentation helps establish the selected materials,
              technical information, manufacturing scope and delivery
              requirements. Our current offering is supply only.
            </p>
            <p>{supplyCommitment}</p>
            <Link className="text-link" href="/project-packages">
              Explore project packages
            </Link>
          </div>
        </div>
      </section>
      <SupplyProcess />
      <AudienceSelector />
      <Questions />
      <ClosingCTA />
    </>
  );
}
