import { createEnquirySession } from "@/lib/enquiry-service";
import { Suspense } from "react";
import EnquiryForm from "@/components/enquiry-form";
import { PageIntro } from "@/components/ui";
import { pageMeta, uploadLink } from "@/lib/site";
export const metadata = pageMeta(
  "Request project pricing",
  "Submit your project scope, material schedules and secure drawing links for GLANHEIM procurement review.",
  "/request-pricing",
);
export const dynamic = "force-dynamic";
export default function Pricing() {
  return (
    <>
      <PageIntro
        eyebrow="PROJECT-SPECIFIC SUPPLY ENQUIRIES"
        title="Every project starts with a conversation."
      >
        <p>
          Send us your drawings. Tell us what you need. We’ll review the
          material package and discuss the possibilities.
        </p>
      </PageIntro>
      <Suspense
        fallback={<p className="container">Preparing your enquiry form…</p>}
      >
        <EnquiryForm
          {...createEnquirySession()}
          uploadUrl={uploadLink()}
          enabled={
            process.env.ENQUIRIES_ENABLED === "true" &&
            !!process.env.RESEND_API_KEY &&
            !!process.env.ENQUIRY_FROM_EMAIL &&
            !!process.env.RATE_LIMIT_SALT &&
            process.env.NETLIFY === "true"
          }
        />
      </Suspense>
    </>
  );
}
