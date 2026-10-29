"use client";
import { useRouter } from "next/navigation";
import { useProductSelection } from "./product-selection";
export default function ProductEnquireLink({
  productId,
}: {
  productId: string;
}) {
  const basket = useProductSelection();
  const router = useRouter();
  return (
    <button
      className="pl-text-link pl-text-button"
      type="button"
      onClick={() => {
        if (!basket.has(productId)) basket.toggle(productId);
        router.push("/enquiry");
      }}
    >
      Enquire about this product <span aria-hidden="true">↗</span>
    </button>
  );
}
