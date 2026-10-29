import CommercialShowcase from "@/components/commercial-showcase";
import {
  ProductClosing,
  ProductApproach,
} from "@/components/product-editorial";
import { pageMeta } from "@/lib/site";
export const metadata = pageMeta(
  "Commercial materials & fit-out packages",
  "Project-specific office fit-out, curtain-wall glazing, interior partitions, staircases and coordinated commercial material supply packages.",
  "/commercial",
);
export default function CommercialPage() {
  return (
    <div className="collection-site">
      <section className="pl-collection-intro pl-wrap">
        <span className="pl-eyebrow">GLANHEIM / Commercial</span>
        <h1>
          One material language.
          <br />
          Across the whole project.
        </h1>
        <p>
          From the building envelope to the reception desk. Commercial material
          packages shaped around your drawings, specifications, trade interfaces
          and construction programme.
        </p>
      </section>
      <CommercialShowcase full />
      <ProductApproach />
      <ProductClosing />
    </div>
  );
}
