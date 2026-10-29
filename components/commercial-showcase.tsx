import Image from "next/image";
import Link from "next/link";
export default function CommercialShowcase({
  full = false,
}: {
  full?: boolean;
}) {
  return (
    <section
      className="pl-section pl-commercial"
      aria-labelledby="commercial-heading"
    >
      <div className="pl-wrap">
        <div className="pl-section-top">
          <div>
            <span className="pl-eyebrow">
              Commercial scale. Considered detail.
            </span>
            <h2 id="commercial-heading">
              From the street.
              <br />
              To the working day.
            </h2>
          </div>
          <p>
            Office fit-outs, architectural glazing and connected interior
            packages. Bring the envelope, shared spaces and everyday details
            into one coordinated supply brief.
          </p>
        </div>
        <div className="commercial-grid">
          <article className="commercial-card commercial-wide">
            <div className="commercial-photo">
              <Image
                src="/images/materials/commercial-fitout.webp"
                alt="Commercial interior application concept with reception joinery, glass meeting rooms and coordinated ceilings"
                fill
                sizes="(max-width:700px) 100vw, 65vw"
              />
            </div>
            <div className="commercial-copy">
              <span className="pl-eyebrow">01 / Office fit-outs</span>
              <h3>Make space for better work.</h3>
              <p>
                Reception counters, meeting rooms, workspaces and breakout
                areas. Coordinate joinery, glazing, doors, wall finishes,
                flooring and ceiling interfaces around your fit-out drawings.
              </p>
              <Link
                className="pl-text-link"
                href="/request-pricing?package=Office%20fit-out&material=Joinery&material=Glazing%20and%20partitions&material=Wall%20and%20ceiling%20finishes&material=Flooring%20and%20tiling"
              >
                Discuss an office package <span aria-hidden="true">↗</span>
              </Link>
            </div>
          </article>
          <article className="commercial-card">
            <div className="commercial-photo">
              <Image
                src="/images/commercial-curtain-wall.png"
                alt="Commercial facade application concept showing a curtain-wall grid and architectural glazing"
                fill
                sizes="(max-width:700px) 100vw, 40vw"
              />
            </div>
            <div className="commercial-copy">
              <span className="pl-eyebrow">02 / Glazing & the envelope</span>
              <h3>A clear architectural line.</h3>
              <p>
                Discuss curtain-wall and commercial glazing requirements against
                your elevations, engineering brief and performance schedule.
                Frame, glass, fixing and weatherproofing interfaces are resolved
                for the specific project.
              </p>
              <Link
                className="pl-text-link"
                href="/request-pricing?package=Curtain%20wall%20and%20commercial%20glazing&material=Architectural%20aluminium&material=Glazing%20and%20partitions"
              >
                Discuss commercial glazing <span aria-hidden="true">↗</span>
              </Link>
            </div>
          </article>
          <article className="commercial-card">
            <div className="commercial-photo">
              <Image
                src="/images/products/railings-staircases/overview-p03-01.jpeg"
                alt="Supplier catalogue application image with a glass mezzanine balustrade and shared commercial seating area"
                fill
                sizes="(max-width:700px) 100vw, 40vw"
              />
            </div>
            <div className="commercial-copy">
              <span className="pl-eyebrow">03 / Stairs & shared spaces</span>
              <h3>Connect every level.</h3>
              <p>
                Staircase and balustrade designs for circulation and shared
                spaces. Confirm geometry, clearances, loads, handrails, finishes
                and adjoining construction with the project team.
              </p>
              <Link
                className="pl-text-link"
                href="/products/railings-staircases"
              >
                Explore stairs & balustrades <span aria-hidden="true">↗</span>
              </Link>
            </div>
          </article>
          {full && (
            <article className="commercial-card">
              <div className="commercial-photo">
                <Image
                  src="/images/materials/glazing-partitions.webp"
                  alt="Meeting-room application concept with full-height glass partitions and coordinated timber wall finishes"
                  fill
                  sizes="(max-width:700px) 100vw, 40vw"
                />
              </div>
              <div className="commercial-copy">
                <span className="pl-eyebrow">04 / Interior glazing</span>
                <h3>Room to collaborate.</h3>
                <p>
                  Glazed meeting rooms and interior partitions coordinated with
                  door hardware, ceiling junctions, floor transitions and the
                  acoustic requirements in your specification.
                </p>
                <Link
                  className="pl-text-link"
                  href="/request-pricing?package=Commercial%20interior%20glazing&material=Glazing%20and%20partitions&material=Doors%20and%20hardware"
                >
                  Discuss partition requirements{" "}
                  <span aria-hidden="true">↗</span>
                </Link>
              </div>
            </article>
          )}
        </div>
        <p className="commercial-image-note">
          Application imagery illustrates design possibilities. It does not
          represent completed GLANHEIM projects or verified product performance.
        </p>
        {!full && (
          <div className="pl-centred-link">
            <Link className="pl-text-link" href="/commercial">
              Explore commercial packages <span aria-hidden="true">↗</span>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
