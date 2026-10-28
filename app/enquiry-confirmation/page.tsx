import { cookies } from "next/headers";
import { verifyReceipt } from "@/lib/enquiry-service";
import { Button } from "@/components/ui";
export const metadata = {
  title: "Enquiry receipt",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";
export default async function Confirmation() {
  const reference = verifyReceipt(
    (await cookies()).get("glanheim-receipt")?.value,
    process.env.RATE_LIMIT_SALT || "",
  );
  return (
    <section className="container confirmation">
      <h1>{reference ? "Enquiry received" : "Check your enquiry"}</h1>
      {reference ? (
        <>
          <p>
            Your project enquiry has been received and the notification service
            has accepted our team’s notification.
          </p>
          <span className="reference">{reference}</span>
          <p>
            Keep this reference for your records. We’ll review the scope and may
            request further information. Receipt does not guarantee a quotation
            or a turnaround time.
          </p>
        </>
      ) : (
        <p>
          No verified enquiry receipt is available in this browser. Please
          submit your project or contact{" "}
          <a href="mailto:info@glanheim.com">info@glanheim.com</a> if you need
          help checking a previous submission.
        </p>
      )}
      <Button href={reference ? "/materials" : "/request-pricing"}>
        {reference ? "Explore materials" : "Request project pricing"}
      </Button>
    </section>
  );
}
