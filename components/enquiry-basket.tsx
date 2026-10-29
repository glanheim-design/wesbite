"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import {
  catalogueProducts,
  productCollections,
  productHref,
} from "@/lib/products";
import { useProductSelection } from "./product-selection";

export default function EnquiryBasket() {
  const selection = useProductSelection();
  const heading = useRef<HTMLHeadingElement>(null);

  function remove(id: string) {
    selection.remove(id);
    requestAnimationFrame(() => heading.current?.focus());
  }
  function clear() {
    selection.clear();
    requestAnimationFrame(() => heading.current?.focus());
  }

  if (!selection.ready)
    return (
      <div className="eb-loading" role="status">
        Restoring your enquiry selections…
      </div>
    );

  if (!selection.items.length)
    return (
      <section className="eb-empty" aria-labelledby="enquiry-basket-heading">
        <span className="eb-eyebrow">A considered starting point</span>
        <h2 id="enquiry-basket-heading" ref={heading} tabIndex={-1}>
          Your enquiry is ready to take shape.
        </h2>
        <p>
          Explore the collection and add the products that belong in your
          project. You can record quantities, measurements and notes here before
          sending your brief.
        </p>
        <div className="eb-empty-actions">
          <Link className="eb-primary" href="/collections">
            Explore the collection <span aria-hidden="true">↗</span>
          </Link>
          <Link className="eb-link" href="/request-pricing">
            Enquire about a custom package <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </section>
    );

  return (
    <section className="eb-basket" aria-labelledby="enquiry-basket-heading">
      <div className="eb-heading">
        <div>
          <span className="eb-eyebrow">Your material package</span>
          <h2 id="enquiry-basket-heading" ref={heading} tabIndex={-1}>
            Your selected products
          </h2>
          <p role="status">
            {selection.items.length}{" "}
            {selection.items.length === 1 ? "selection" : "selections"} in your
            enquiry
          </p>
        </div>
        <button type="button" className="eb-clear" onClick={clear}>
          Clear all selections
        </button>
      </div>
      <p className="eb-intro">
        Add the detail you know. Quantities can be provisional, and measurements
        should include their units. All dimensions and notes below are supplied
        by you and will be reviewed with your project brief.
      </p>
      <div className="eb-items">
        {selection.items.map((item, index) => {
          const product = catalogueProducts.find(
            (candidate) => candidate.id === item.id,
          );
          if (!product) return null;
          const collection = productCollections.find(
            (candidate) => candidate.id === product.collection,
          );
          const codes = [
            product.code,
            ...(product.alternativeCodes || []),
          ].filter(Boolean);
          const name = `${product.name}${product.code ? ` ${product.code}` : ""}`;
          const fieldPrefix = `enquiry-item-${product.id}`;
          return (
            <article
              className="eb-item"
              key={item.id}
              aria-labelledby={`${fieldPrefix}-title`}
            >
              <div className="eb-product">
                <Link
                  className="eb-image"
                  href={productHref(product)}
                  aria-label={`View ${name}`}
                >
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="(max-width:600px) 40vw, 200px"
                  />
                </Link>
                <div className="eb-product-copy">
                  <span className="eb-item-number">
                    {String(index + 1).padStart(2, "0")} / {collection?.name}
                  </span>
                  <h3 id={`${fieldPrefix}-title`}>
                    <Link href={productHref(product)}>{product.name}</Link>
                  </h3>
                  <p className="eb-category">{product.category}</p>
                  <p className="eb-code">
                    {codes.length
                      ? codes.join(" / ")
                      : "Project-specific selection"}
                    {product.variant ? ` · ${product.variant}` : ""}
                  </p>
                  <button
                    type="button"
                    className="eb-remove"
                    onClick={() => remove(item.id)}
                    aria-label={`Remove ${name} from enquiry`}
                  >
                    Remove selection <span aria-hidden="true">×</span>
                  </button>
                </div>
              </div>
              <fieldset className="eb-fields">
                <legend>Project details for {name}</legend>
                <label
                  className="eb-quantity"
                  htmlFor={`${fieldPrefix}-quantity`}
                >
                  <span>Quantity</span>
                  <input
                    id={`${fieldPrefix}-quantity`}
                    type="text"
                    value={item.quantity}
                    maxLength={60}
                    placeholder="e.g. 8 units, 42 m², or from drawings"
                    onChange={(event) =>
                      selection.updateItem(item.id, {
                        quantity: event.target.value,
                      })
                    }
                  />
                </label>
                <label
                  className="eb-measurements"
                  htmlFor={`${fieldPrefix}-measurements`}
                >
                  <span>
                    Measurements <small>Customer supplied</small>
                  </span>
                  <textarea
                    id={`${fieldPrefix}-measurements`}
                    rows={3}
                    value={item.measurements}
                    maxLength={1200}
                    placeholder="e.g. W 2400 × H 2100 mm. Include units and identify each opening or location."
                    onChange={(event) =>
                      selection.updateItem(item.id, {
                        measurements: event.target.value,
                      })
                    }
                  />
                </label>
                <label className="eb-notes" htmlFor={`${fieldPrefix}-notes`}>
                  <span>Selection notes</span>
                  <textarea
                    id={`${fieldPrefix}-notes`}
                    rows={3}
                    value={item.notes}
                    maxLength={1200}
                    placeholder="Finishes, room references, hardware preferences or details to confirm…"
                    onChange={(event) =>
                      selection.updateItem(item.id, {
                        notes: event.target.value,
                      })
                    }
                  />
                </label>
              </fieldset>
            </article>
          );
        })}
      </div>
      <div className="eb-next">
        <div>
          <h3>Bring your selections into one brief.</h3>
          <p>
            Continue to add your project and contact details, drawings or
            document links, and delivery requirements. Your saved quantities and
            notes will carry into the enquiry.
          </p>
          <span className="eb-draft-note">
            This browser saves your product selections and line-item notes. Add
            contact details and document links in the enquiry form.
          </span>
        </div>
        <div className="eb-next-actions">
          <Link className="eb-primary" href={selection.enquiryHref}>
            Continue enquiry <span aria-hidden="true">↗</span>
          </Link>
          <Link className="eb-link" href="/products">
            Explore more products <span aria-hidden="true">+</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
