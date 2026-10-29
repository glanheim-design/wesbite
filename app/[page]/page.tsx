import ProjectCollectionPreview from "@/components/project-collection-preview";
import { ConstructionStages } from "@/components/product-editorial";
import { supplyCommitment } from "@/lib/supply";
import {
  AboutBusiness,
  Questions,
  SupplyProcess,
} from "@/components/business-sections";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  Architecture,
  Button,
  ClosingCTA,
  PageIntro,
  UploadButton,
} from "@/components/ui";
import { pageMeta } from "@/lib/site";
const pages: Record<string, { title: string; description: string }> = {
  "project-packages": {
    title: "Project packages",
    description:
      "From individual architectural finishes to complete interior and exterior material packages, GLANHEIM welcomes project-specific enquiries supported by drawings, specifications and material schedules.",
  },
  procurement: {
    title: "From drawings to delivery",
    description:
      "A construction-led approach to project-specific material sourcing, technical coordination, manufacturing and logistics.",
  },
  about: {
    title: "About GLANHEIM",
    description:
      "An Australian architectural materials business, coordinating project-specific sourcing and supply from your first drawing to agreed delivery.",
  },
  contact: {
    title: "Contact GLANHEIM",
    description:
      "A conversation is the beginning of a considered material package.",
  },
  privacy: {
    title: "Privacy policy.",
    description:
      "How GLANHEIM collects, uses, stores and handles personal information and project enquiries.",
  },
  terms: {
    title: "Website terms.",
    description:
      "Terms for using GLANHEIM’s website, material information and external links.",
  },
  "enquiry-terms": {
    title: "Enquiry terms.",
    description:
      "Terms for submitting project scopes, pricing requests and confidential documents to GLANHEIM.",
  },
};
export const dynamicParams = false;
export function generateStaticParams() {
  return Object.keys(pages).map((page) => ({ page }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ page: string }>;
}) {
  const { page } = await params;
  const p = pages[page];
  return p ? pageMeta(p.title, p.description, "/" + page) : {};
}
const packages = [
  "Façade material",
  "Aluminium",
  "Brick slip cladding",
  "Stone and tiling",
  "Joinery",
  "Interior finishes",
  "Bathroom finishes",
  "Wall and ceiling finishes",
  "Architectural metalwork",
  "Mixed architectural materials",
];
export default async function InfoPage({
  params,
}: {
  params: Promise<{ page: string }>;
}) {
  const { page } = await params;
  const p = pages[page];
  if (!p) notFound();
  return (
    <>
      <PageIntro title={p.title}>
        <p>{p.description}</p>
      </PageIntro>
      {page === "project-packages" && (
        <>
          <div className="collection-site">
            <ProjectCollectionPreview />
            <ConstructionStages />
          </div>
          <section className="container detail-grid">
            <Architecture />
            <div>
              <h2>
                Many materials.
                <br />
                <em>One considered brief.</em>
              </h2>
              <p>
                GLANHEIM can assess your submitted scope and determine whether a
                suitable supply quotation can be prepared. Individual orders and
                substantial construction supply packages are welcome for review.
              </p>
              <p>{supplyCommitment}</p>
              <Button href="/request-pricing">Submit drawings</Button>
              <UploadButton />
              <a
                className="text-link"
                href="mailto:info@glanheim.com?subject=Project%20package%20enquiry"
              >
                Email our procurement team ↗
              </a>
            </div>
          </section>
          <section className="container prose-section">
            <div className="package-options">
              {packages.map((x) => (
                <Link
                  key={x}
                  href={`/request-pricing?package=${encodeURIComponent(x + " package")}`}
                >
                  <h3>{x} package</h3>
                  <span aria-hidden="true">↗</span>
                </Link>
              ))}
            </div>
          </section>
          <section className="container qs-detail">
            <h2>Pricing a project?</h2>
            <p className="lead">
              A clear brief helps us understand the opportunity.
            </p>
            <div className="three-col">
              <div>
                <h3>What to send</h3>
                <ul>
                  {[
                    "Architectural and IFC drawings",
                    "Specifications and scope of works",
                    "BOQ, material and finish schedules",
                    "Required quantities",
                    "Project programme",
                    "Delivery location and tender closing date",
                    "Target pricing or budget, if available",
                  ].map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3>What we need to know</h3>
                <ul>
                  {[
                    "Project name, company and contact details",
                    "Material package and approximate quantities",
                    "Delivery date and tender deadline",
                    "Budget, tender or procurement pricing intent",
                    "Australian benchmark or target rate, if available",
                    "Whether alternatives may be considered",
                  ].map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3>What happens next</h3>
                <ol>
                  {[
                    "Enquiry received",
                    "Scope reviewed",
                    "Clarifications requested if needed",
                    "Suitable sourcing options assessed",
                    "A quotation may be issued following suitability and commercial review",
                  ].map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ol>
              </div>
            </div>
            <p>
              Some packages may not be suitable for pricing. Turnaround times
              are agreed only after scope review.
            </p>
            <Button href="/request-pricing">Request package pricing</Button>
          </section>
        </>
      )}
      {page === "project-packages" && (
        <section className="container package-study">
          <h2>Materials in context</h2>
          <div>
            <Link href="/materials/interior">
              <Architecture
                src="/images/interior.webp"
                alt="Reception joinery and stone surfaces"
              />
            </Link>
            <Link href="/materials/exterior">
              <Architecture
                src="/images/facade.webp"
                alt="Stone, brick and aluminium exterior finishes"
              />
            </Link>
          </div>
        </section>
      )}
      {page === "procurement" && (
        <>
          <div className="container">
            <Architecture
              className="wide-image"
              src="/images/facade.webp"
              alt="Conceptual stone and metal facade detailing"
            />
          </div>
          <SupplyProcess />
          <section className="container detail-grid">
            <div>
              <h2>An agreed supply scope</h2>
              <p>
                GLANHEIM coordinates material supply in accordance with the
                agreed contract. Samples, manufacturer shop drawings,
                inspections and delivery requirements are included only where
                expressly agreed.
              </p>
              <p>
                {supplyCommitment} Our service is material supply. Installation
                and project engineering are undertaken by the project’s
                appointed specialists.
              </p>
              <Button href="/request-pricing">Request pricing</Button>
            </div>
            <Architecture
              src="/images/interior.webp"
              alt="Conceptual interior with coordinated timber and stone finishes"
            />
          </section>
        </>
      )}
      {page === "about" && <AboutBusiness />}
      {page === "contact" && (
        <section className="container contact-section">
          <a className="contact-email" href="mailto:info@glanheim.com">
            info@glanheim.com ↗
          </a>
          <div className="three-col contact-paths">
            <article>
              <Architecture
                src="/images/interior.webp"
                alt="Reception joinery and coordinated interior materials"
              />
              <div>
                <h2>
                  Bring us
                  <br />
                  your brief.
                </h2>
                <p>
                  For contractors, estimators and quantity surveyors with a
                  material package to price.
                </p>
                <Button href="/request-pricing">Request pricing</Button>
              </div>
            </article>
            <article>
              <Architecture
                src="/images/facade.webp"
                alt="Stone, brick and aluminium exterior material finishes"
              />
              <div>
                <h2>
                  Start a<br />
                  conversation.
                </h2>
                <p>
                  For business enquiries and questions about our material
                  sourcing approach.
                </p>
                <a
                  className="text-link"
                  href="mailto:info@glanheim.com?subject=General%20enquiry"
                >
                  Email our team ↗
                </a>
              </div>
            </article>
            <article>
              <Architecture
                src="/images/workshop.webp"
                alt="Timber and stone samples with a material review brief"
              />
              <div>
                <h2>
                  A shared
                  <br />
                  standard.
                </h2>
                <p>
                  For prospective manufacturing partners. Introduce your
                  capabilities and technical documentation.
                </p>
                <a
                  className="text-link"
                  href="mailto:info@glanheim.com?subject=Manufacturer%20enquiry"
                >
                  Introduce your business ↗
                </a>
              </div>
            </article>
          </div>
        </section>
      )}
      {["privacy", "terms", "enquiry-terms"].includes(page) && (
        <section className="container legal prose-section">
          <p className="status-tag">
            Effective 29 October 2026 · GLANHEIM · Queensland, Australia
          </p>
          {page === "privacy" ? (
            <>
              <h2>Who we are</h2>
              <p>
                This policy applies to the GLANHEIM website and project
                enquiries. GLANHEIM operates in Queensland, Australia. Contact
                info@glanheim.com about this policy or your information.
              </p>
              <h2>Information we collect</h2>
              <p>
                Project enquiries may include your name, company, contact
                details, project information, scope, quantities, deadlines and
                document-sharing links. Do not include sensitive personal
                information or documents you are not authorised to share.
              </p>
              <h2>Use and disclosure</h2>
              <p>
                Information is used to assess your enquiry, communicate with you
                and prepare potential supply options. We seek your authority
                before sharing confidential project documents with manufacturers
                or other project participants. We may also disclose information
                where required by law. We do not sell personal information or
                use enquiry details for unsolicited marketing.
              </p>
              <h2>Service providers and storage</h2>
              <p>
                The website uses Netlify for hosting and private enquiry capture
                and storage, with optional Resend transactional email where
                configured. Netlify form email notifications are configured
                separately. Dropbox uploads, if configured, are handled
                separately by Dropbox. These providers may process information
                outside Australia, including in the United States. Information
                is handled under their service arrangements and privacy
                policies. Only share personal information needed for your
                enquiry.
              </p>
              <h2>Document handling</h2>
              <p>
                The website does not fetch your document links or make customer
                files public. A secure upload request sends files to GLANHEIM’s
                designated Dropbox destination. Access is restricted to
                authorised personnel. No online service can guarantee absolute
                security.
              </p>
              <h2>Retention, access and deletion</h2>
              <p>
                We retain project enquiries, including inactive enquiries, for
                future project discussions, business records and the
                establishment or protection of legal rights. Inactivity does not
                trigger automatic deletion and there is no fixed automatic
                expiry. This also applies to enquiry emails and separately
                supplied project documents. You may request access, correction
                or deletion by contacting us. We assess requests against our
                business needs and legal obligations and explain any reason we
                cannot fulfil a request. Temporary security rate-limit records
                are cleared separately; this does not delete your enquiry.
              </p>
              <p>
                For access, corrections, deletion requests or privacy concerns,
                email{" "}
                <a href="mailto:info@glanheim.com?subject=Privacy%20enquiry">
                  info@glanheim.com
                </a>
                . We will assess and respond to your request, subject to
                applicable obligations. If you raise a privacy complaint,
                include enough detail for us to investigate. We acknowledge your
                complaint and aim to respond within 30 days. If more time is
                needed, we explain why. If you are dissatisfied, you may contact
                the Office of the Australian Information Commissioner at
                oaic.gov.au where applicable.
              </p>
              <h2>Cookies and analytics</h2>
              <p>
                The website uses a temporary cookie to show your enquiry
                confirmation for one hour after successful submission. We do not
                use advertising cookies or analytics. Your product selections,
                quantities and item notes are saved in this browser until you
                clear them. Contact details and unfinished form fields are kept
                in this tab for enquiry preparation and removed after confirmed
                online submission. You can clear browser storage to remove local
                drafts. Temporary security records use hashed network
                identifiers rather than storing raw IP addresses.
              </p>
            </>
          ) : page === "terms" ? (
            <>
              <h2>About these terms</h2>
              <p>
                These terms apply to glanheim.com, operated as GLANHEIM in
                Queensland, Australia. By using the website, you agree to these
                terms. For enquiries, contact info@glanheim.com. The website
                accepts project enquiries only; it does not take orders or
                payments.
              </p>
              <h2>Website information</h2>
              <p>
                Content provides general information about potential materials
                sourcing and procurement. It is not engineering, legal,
                installation or certification advice. Product categories are
                subject to availability and project-specific review.
              </p>
              <h2>Intellectual property</h2>
              <p>
                You may browse, print and share links to website content for
                genuine project assessment. GLANHEIM and its licensors retain
                their intellectual property rights. Do not reproduce content
                commercially, misrepresent ownership, interfere with the website
                or use it unlawfully. Architectural imagery is illustrative
                concept imagery and does not represent completed GLANHEIM
                projects.
              </p>
              <h2>No automatic offer</h2>
              <p>
                Browsing a category or submitting an enquiry does not form a
                supply contract. Product eligibility, specifications, evidence,
                price and terms must be agreed separately in writing.
              </p>
              <h2>Links and responsibility</h2>
              <p>
                External services have their own terms and privacy practices.
                Nothing on this website excludes rights or guarantees that
                cannot lawfully be excluded under Australian law.
              </p>
              <h2>Availability and liability</h2>
              <p>
                We take reasonable care with website information but do not
                guarantee uninterrupted access or that every description is
                current or suitable for a particular project. Confirm
                specifications, availability and suitability with us and your
                appointed specialists before relying on them. To the extent
                permitted by law, we are not liable for loss caused by reliance
                on general website information, service interruptions or
                third-party services. This does not exclude or restrict any
                right, remedy or guarantee that cannot lawfully be excluded,
                including under the Australian Consumer Law.
              </p>
              <h2>Governing terms</h2>
              <p>
                These terms are governed by the laws of Queensland, Australia.
                The parties submit to the non-exclusive jurisdiction of its
                courts. Any mandatory consumer protections continue to apply. We
                may update these terms by publishing a revised version with its
                effective date; changes apply to future use and do not
                retrospectively change an agreed supply contract.
              </p>
            </>
          ) : (
            <>
              <h2>Submitting an enquiry</h2>
              <p>
                These terms apply to project enquiries submitted to GLANHEIM in
                Queensland, Australia. Read them with our website terms and
                privacy policy. No purchase, payment or sales contract is made
                through this website.
              </p>
              <h2>Scope review</h2>
              <p>
                A submitted enquiry is a request for scope assessment. It is not
                an accepted order, an offer to supply, a guaranteed quotation or
                a commitment to a turnaround time.
              </p>
              <h2>Authority and confidentiality</h2>
              <p>
                You must have authority to share documents and project
                information. Set appropriate access permissions and notify
                GLANHEIM of confidentiality or tender restrictions. Do not
                provide passwords through public form fields. You retain
                ownership of your documents and authorise us to access and use
                them to assess and respond to your enquiry. We seek your
                authority before sharing confidential project documents with
                prospective manufacturers or other project participants.
                Submission does not transfer intellectual property rights or
                create a separate non-disclosure agreement. If a separate
                agreement is required, arrange it before sharing restricted
                material.
              </p>
              <h2>Supply only</h2>
              <p>
                {supplyCommitment} Installation, construction contracting and
                project engineering are undertaken by the project’s appointed
                specialists and are not included in a material supply quotation
                unless expressly agreed in writing.
              </p>
              <h2>Pricing and documents</h2>
              <p>
                Any quotation is subject to its written scope, exclusions,
                currency, validity, quantities, evidence requirements, logistics
                arrangements and payment terms. Drawing revisions and
                alternatives must be clearly identified.
              </p>
              <h2>Accuracy and changes</h2>
              <p>
                Provide accurate contact details and identify the latest drawing
                revisions, tender restrictions and deadlines. Tell us promptly
                about changes by emailing info@glanheim.com with your enquiry
                reference. A requested deadline is not accepted until we confirm
                it in writing. We may decline enquiries or request further
                information.
              </p>
              <h2>Receipt and follow-up</h2>
              <p>
                A confirmation reference acknowledges receipt through the
                website service only. If submission fails, contact{" "}
                <a href="mailto:info@glanheim.com">info@glanheim.com</a>. Do not
                assume a failed submission has reached the team.
              </p>
            </>
          )}
        </section>
      )}
      {["project-packages", "procurement", "contact"].includes(page) && (
        <Questions />
      )}
      {!["privacy", "terms", "enquiry-terms", "contact", "about"].includes(
        page,
      ) && <ClosingCTA />}
    </>
  );
}
