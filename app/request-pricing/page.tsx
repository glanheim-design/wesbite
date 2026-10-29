import { enquiryTransport } from "@/lib/enquiry-config";
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
      <PageIntro title="Request project pricing">
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
          enabled={enquiryTransport(process.env) !== "email"}
          transport={enquiryTransport(process.env)}
        />
      </Suspense>
    </>
  );
}
