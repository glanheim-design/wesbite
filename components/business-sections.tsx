import { supplyCommitment } from "@/lib/supply";
import Link from "next/link";
import { Architecture, Button, ClosingCTA } from "./ui";
import { AudienceSelector } from "./project-tools";
import { processSteps } from "@/lib/content";
export const commonQuestions = [
  ["Australian installation", supplyCommitment],
  [
    "Can I submit a complete package?",
    "Yes. Send drawings, specifications, BOQs and finish schedules for an individual material or a mixed supply package. We assess whether the scope is suitable for a quotation.",
  ],
  [
    "Do you provide installation?",
    "All products supplied will be certified for Australian installation and meet the Australian construction standards applicable to their intended use. Our service is material supply; installation and project engineering are undertaken by the project’s appointed specialists.",
  ],
  [
    "Can you consider alternatives?",
    "Where your specification and project team allow it, indicate that alternatives may be considered. Any proposed option still needs to be reviewed against the intended application and agreed project requirements.",
  ],
  [
    "How do I share drawings?",
    "Paste a secure project-document link into the pricing form or request a secure upload link by email. Only share information you are authorised to disclose.",
  ],
  [
    "When will I receive pricing?",
    "We review scope, quantities, documentation, suitability and programme first. We may request clarifications and cannot guarantee that every package can be quoted. Timing is discussed after review.",
  ],
];
export function Questions({
  title = "Project questions",
  questions = commonQuestions,
}: {
  title?: string;
  questions?: string[][];
}) {
  return (
    <section className="questions-section container">
      <h2>{title}</h2>
      <div className="questions-layout">
        <Architecture
          src="/images/workshop.webp"
          alt="Conceptual material review workbench with timber samples, stone and drawings"
        />
        <div>
          {questions.map(([q, a]) => (
            <details className="question" key={q}>
              <summary>{q}</summary>
              <p>{a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
export function SupplyProcess() {
  return (
    <section className="container supply-process">
      <div className="section-top">
        <h2>How supply works</h2>
        <p>
          Your drawings establish the scope. Each following stage is coordinated
          around the agreed materials, responsibilities and programme.
        </p>
      </div>
      <div className="process-disclosures">
        {processSteps.map(([title, description], i) => (
          <details key={title} open={i === 0}>
            <summary>{title}</summary>
            <p>{description}</p>
            <p>
              {
                [
                  "Please include drawings, BOQ, quantities, finish schedules, deadlines and the project delivery location. We identify missing information before discussing a potential quotation.",
                  "The proposed material, finish, manufacturer information and commercial requirements are considered against the project brief. Availability is established for the selected option.",
                  "Technical information is checked for the intended application. Matters requiring specialist input are identified before commitments are made.",
                  "Samples and manufacturer shop drawings are coordinated only where included in the agreed scope. The project team retains its design and approval responsibilities.",
                  "Manufacturing scope, dimensions, finishes and agreed quality checks are established before production proceeds. Changes must be reviewed and recorded.",
                  "Delivery requirements, site access, unloading responsibilities and programme milestones are agreed in the supply contract. Dates are confirmed for the selected package.",
                ][i]
              }
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}
export function AboutBusiness() {
  return (
    <>
      <section className="container about-overview">
        <Architecture
          src="/images/interior.webp"
          alt="Architectural concept showing coordinated stone surfaces and timber joinery"
          priority
        />
        <div>
          <h2>Materials for your project</h2>
          <p>
            GLANHEIM is an Australian architectural materials sourcing and
            supply business. We help construction and design teams bring
            individual material requirements or coordinated interior and
            exterior packages into a clearly defined supply scope.
          </p>
          <p>
            Our work starts with your project documentation. We review the
            intended application, quantities, finishes, budget context and
            programme, then assess potential sourcing options and identify the
            information needed to prepare a quotation.
          </p>
          <p>
            {supplyCommitment} We coordinate material supply, with installation
            undertaken by the project’s appointed team.
          </p>
          <Button href="/request-pricing">Discuss your project</Button>
        </div>
      </section>
      <section className="container founding-section">
        <div>
          <h2>What shaped GLANHEIM</h2>
          <p>
            The experience behind GLANHEIM has been shaped by construction and
            project environments in Australia, New Zealand and the UK. That
            perspective brings an understanding of different project cultures,
            procurement pressures and the importance of clear communication.
          </p>
          <p>
            It informed the founding of a business focused on understanding the
            client’s requirements before proposing a supply solution. Drawings,
            material selections, quantities and programme should guide the
            conversation, with responsibilities and expectations made clear from
            the outset.
          </p>
          <p>
            GLANHEIM intends to carry that experience into a practical,
            client-focused way of working: careful scope review, transparent
            discussions about suitability and availability, coordinated
            technical information, and delivery arrangements agreed around the
            project.
          </p>
          <p>
            The aim is a dependable material supply relationship, with
            considered service and clearly defined commitments at each stage.
          </p>
        </div>
        <Architecture
          src="/images/workshop.webp"
          alt="Conceptual material review showing drawings, timber and stone samples"
        />
      </section>
      <AudienceSelector />
      <SupplyProcess />
      <section className="container about-supply">
        <div>
          <h2>What we supply</h2>
          <p>
            Material enquiries can range from a single architectural finish to a
            coordinated package. Every supply package follows our commitment to
            certified products for Australian installation and applicable
            Australian construction standards.
          </p>
          <ul className="supply-links">
            <li>
              <Link href="/materials/exterior">Exterior materials</Link>
              <p>
                Façade cladding, brick and masonry finishes, stone, porcelain,
                screens and architectural metalwork.
              </p>
            </li>
            <li>
              <Link href="/materials/interior">Interior packages</Link>
              <p>
                Joinery, wall and ceiling finishes, flooring, tiling, bathroom
                materials, doors, hardware and partitions.
              </p>
            </li>
            <li>
              <Link href="/materials/structural">Structural enquiries</Link>
              <p>
                Selected component enquiries supported by the project’s
                engineering documentation and requirements.
              </p>
            </li>
            <li>
              <Link href="/materials/bespoke">Bespoke components</Link>
              <p>
                Custom profiles, trims, decorative components and coordinated
                finishes developed around your brief.
              </p>
            </li>
          </ul>
        </div>
        <Architecture
          src="/images/facade.webp"
          alt="Architectural concept of stone, brick and aluminium façade detailing"
        />
      </section>
      <section className="container responsibilities">
        <h2>A clearly agreed scope</h2>
        <div className="two-col">
          <div>
            <h3>What we coordinate</h3>
            <p>
              Project scope review, potential supply options, manufacturer
              information, agreed samples and shop drawings, manufacturing
              checks and delivery requirements.
            </p>
            <p>
              A quotation, where available, sets out the selected materials,
              quantities, inclusions, exclusions and commercial terms. A website
              enquiry is not an accepted order.
            </p>
          </div>
          <div>
            <h3>What remains project-led</h3>
            <p>
              GLANHEIM supplies certified products for Australian installation.
              Design decisions, project engineering, installation and site
              responsibilities remain with the relevant project parties. Product
              documentation is coordinated for the agreed application.
            </p>
            <p>
              Quantities, finishes, pricing and delivery dates are set out in
              the project quotation and supply agreement.
            </p>
          </div>
        </div>
      </section>
      <Questions />
      <ClosingCTA />
    </>
  );
}
