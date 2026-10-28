import Link from "next/link";
import {
  Architecture,
  Arrow,
  Button,
  ClosingCTA,
  UploadButton,
} from "@/components/ui";
import { processSteps } from "@/lib/content";
export default function Home() {
  return (
    <>
      <section className="home-hero">
        <div className="hero-copy">
          <div className="hero-kicker">
            <span className="tiny-line" /> AUSTRALIAN BUSINESS. CONSIDERED
            MATERIALS.
          </div>
          <h1>
            Materials
            <br />
            without
            <br />
            <em>compromise.</em>
          </h1>
          <p>
            Architectural materials, interior packages and project-specific
            procurement for the Australian construction industry.
          </p>
          <Button href="/request-pricing">Submit a project for pricing</Button>
          <Link className="text-link" href="/materials">
            Explore materials <Arrow />
          </Link>
          <div className="hero-bottom">
            <span>CURATORS OF DISTINCTION.</span>
            <span>SCROLL TO EXPLORE ↓</span>
          </div>
        </div>
        <div className="hero-visual">
          <Architecture priority />
          <div className="image-note">
            <span>MATERIAL. DETAIL. POSSIBILITY.</span>
            <span>01 / 04</span>
          </div>
          <span className="visual-caption">
            ARCHITECTURAL CONCEPT · FOR INSPIRATION
          </span>
        </div>
      </section>
      <div className="statement-bar">
        <span>CONSTRUCTION-LED.</span>
        <span>PROJECT-SPECIFIC.</span>
        <span>SUPPLY ONLY.</span>
        <span>CONSIDERED AT EVERY STAGE.</span>
      </div>
      <section className="intro-section container">
        <p className="eyebrow">01 / A CONSIDERED APPROACH</p>
        <div className="intro-grid">
          <h2>
            A better approach
            <br />
            to material
            <br />
            <em>procurement.</em>
          </h2>
          <div>
            <p className="lead">
              Exceptional spaces begin with the right materials. And the right
              conversations.
            </p>
            <p>
              GLANHEIM provides project-specific material sourcing and supply
              solutions for Australian builders, developers and contractors.
              From reviewing drawings and specifications to coordinating
              manufacturing, quality verification and delivery, our approach is
              built around the requirements of commercial construction.
            </p>
            <Link className="text-link" href="/about">
              Discover GLANHEIM <Arrow />
            </Link>
          </div>
        </div>
      </section>
      <section className="materials-section container">
        <div className="section-top">
          <div>
            <p className="eyebrow">02 / THE MATERIAL PALETTE</p>
            <h2>
              Considered materials.
              <br />
              <em>Complete possibilities.</em>
            </h2>
          </div>
          <Link className="text-link" href="/materials">
            View all materials <Arrow />
          </Link>
        </div>
        <div className="material-editorial">
          <Link href="/materials/exterior" className="editorial-card exterior">
            <Architecture />
            <div className="editorial-caption">
              <span>01 / THE BUILDING ENVELOPE</span>
              <h3>
                Exterior systems <Arrow />
              </h3>
              <p>Façades, stone & architectural metalwork</p>
            </div>
          </Link>
          <Link href="/materials/interior" className="editorial-card interior">
            <div className="material-still">
              <span className="swatch stone" />
              <span className="swatch timber" />
              <span className="swatch ceramic" />
            </div>
            <div className="editorial-caption">
              <span>02 / FROM THE INSIDE OUT</span>
              <h3>
                Interior packages <Arrow />
              </h3>
              <p>Joinery, surfaces & complete finish packages</p>
            </div>
          </Link>
        </div>
        <div className="material-small">
          <Link href="/materials/structural">
            <span>03 / ENGINEERED INTENT</span>
            <h3>Structural materials</h3>
            <Arrow />
          </Link>
          <Link href="/materials/bespoke">
            <span>04 / BEYOND THE STANDARD</span>
            <h3>Bespoke materials</h3>
            <Arrow />
          </Link>
        </div>
      </section>
      <section className="package-feature">
        <div className="container package-grid">
          <div>
            <p className="eyebrow">03 / PROJECT PACKAGE PROCUREMENT</p>
            <h2>
              Send us the drawings.
              <br />
              <em>
                We’ll review
                <br />
                the package.
              </em>
            </h2>
          </div>
          <div>
            <p className="lead">
              One finish. One floor.
              <br />
              Or an entire project package.
            </p>
            <p>
              Bring your drawings, BOQ and material schedules together. We’ll
              review the scope and assess suitable sourcing options for a
              project-specific supply quotation.
            </p>
            <p className="small-copy">
              For quantity surveyors, estimators, commercial teams and head
              contractors. Quotation availability is subject to scope and
              suitability review.
            </p>
            <Button light href="/project-packages">
              Explore project packages
            </Button>
            <UploadButton light />
          </div>
        </div>
      </section>
      <section className="process-section container">
        <div className="section-top">
          <div>
            <p className="eyebrow">04 / FROM DRAWINGS TO DELIVERY</p>
            <h2>
              Clarity at
              <br />
              <em>every stage.</em>
            </h2>
          </div>
          <p className="section-aside">
            A coordinated approach to sourcing, technical review, manufacturing
            and delivery.
          </p>
        </div>
        <div className="process-list">
          {processSteps.map(([title, description], i) => (
            <div key={title}>
              <span className="process-number">0{i + 1}</span>
              <h3>{title}</h3>
              <p>{description}</p>
            </div>
          ))}
        </div>
        <Link className="text-link" href="/procurement">
          Our procurement approach <Arrow />
        </Link>
      </section>
      <section className="quality-strip container">
        <span className="quality-mark" aria-hidden="true">
          G<span>+</span>
        </span>
        <div>
          <p className="eyebrow">CONSIDERED DOWN TO THE DETAIL</p>
          <h2>
            Design intent.
            <br />
            <em>Every detail considered.</em>
          </h2>
          <p>
            From the finish schedule to the final delivery, we coordinate the
            details around your project specifications, material requirements
            and programme.
          </p>
          <Link className="text-link" href="/procurement">
            Our approach to quality <Arrow />
          </Link>
        </div>
      </section>
      <section className="qs-section container">
        <p className="eyebrow">FOR QUANTITY SURVEYORS & ESTIMATORS</p>
        <div className="intro-grid">
          <h2>
            Pricing
            <br />
            <em>a project?</em>
          </h2>
          <div>
            <p className="lead">
              Let’s put your material package into perspective.
            </p>
            <p>
              Send GLANHEIM your drawings, BOQ, material schedules and scope of
              works. Include your quantities, delivery location, tender deadline
              and pricing intent to help us understand the brief.
            </p>
            <Button href="/request-pricing">Send a drawing package</Button>
            <a className="text-link" href="mailto:info@glanheim.com">
              info@glanheim.com <Arrow />
            </a>
          </div>
        </div>
      </section>
      <ClosingCTA />
    </>
  );
}
