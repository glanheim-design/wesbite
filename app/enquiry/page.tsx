import EnquiryBasket from "@/components/enquiry-basket";
import { pageMeta } from "@/lib/site";
export const metadata = {
  ...pageMeta(
    "Your enquiry",
    "Review selected products, add quantities and measurements, and prepare one coordinated project enquiry.",
    "/enquiry",
  ),
  robots: { index: false, follow: true },
};
export default function EnquiryPage() {
  return (
    <div className="collection-site">
      <section className="pl-collection-intro pl-wrap">
        <span className="pl-eyebrow">Your project. Your selections.</span>
        <h1>
          A considered package.
          <br />
          All in one place.
        </h1>
        <p>
          Keep the details together. Review your products, add quantities and
          dimensions, or ask us to review your drawings.
        </p>
      </section>
      <div className="pl-wrap eb-page">
        <EnquiryBasket />
      </div>
    </div>
  );
}
