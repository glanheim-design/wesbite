"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import {
  productCollections,
  productHref,
  type CatalogueProduct,
} from "@/lib/products";
import { ProductSelectButton } from "./product-selection";

const phaseLabels = {
  enclose: "Building envelope",
  "fit-out": "Joinery & fit-out",
  finish: "Surfaces & finishes",
} as const;

export default function ProductCatalogue({
  products,
  collection,
}: {
  products: CatalogueProduct[];
  collection?: string;
}) {
  const params = useSearchParams();
  const [visible, setVisible] = useState(24);
  const query = params.get("q") || "";
  const chosenCollection = collection || params.get("collection") || "";
  const category = params.get("category") || "";
  const phase = params.get("phase") || "";
  const filtered = useMemo(() => {
    const search = query
      .trim()
      .toLocaleLowerCase()
      .replace(/[‐‑–−]/g, "-");
    return products.filter((product) => {
      const searchable =
        `${product.name} ${product.code || ""} ${product.category} ${product.description} ${product.variant || ""} ${(product.alternativeCodes || []).join(" ")}`
          .toLocaleLowerCase()
          .replace(/[‐‑–−]/g, "-");
      return (
        (!chosenCollection || product.collection === chosenCollection) &&
        (!category || product.category === category) &&
        (!phase || product.phase === phase) &&
        (!search || searchable.includes(search))
      );
    });
  }, [products, chosenCollection, category, phase, query]);
  const source = products.filter(
    (product) => !chosenCollection || product.collection === chosenCollection,
  );
  const categories = [
    ...new Set(source.map((product) => product.category)),
  ].sort((a, b) => a.localeCompare(b));
  const phases = [...new Set(source.map((product) => product.phase))];
  const collections = productCollections.filter((item) =>
    products.some((product) => product.collection === item.id),
  );

  function change(key: string, value: string, replace = false) {
    const search = new URLSearchParams(window.location.search);
    if (value) search.set(key, value);
    else search.delete(key);
    if (key === "collection") {
      search.delete("category");
      search.delete("phase");
    }
    const url = `${window.location.pathname}${search.size ? `?${search.toString()}` : ""}${window.location.hash}`;
    if (replace) window.history.replaceState(null, "", url);
    else window.history.pushState(null, "", url);
    setVisible(24);
  }
  function reset() {
    const search = new URLSearchParams(window.location.search);
    for (const key of ["q", "collection", "category", "phase"])
      search.delete(key);
    window.history.pushState(
      null,
      "",
      `${window.location.pathname}${search.size ? `?${search.toString()}` : ""}${window.location.hash}`,
    );
    setVisible(24);
  }
  const shown = filtered.slice(0, visible);

  return (
    <div className="pc-catalogue">
      <div className="pc-toolbar">
        <label className="pc-search">
          <span>Find your product</span>
          <input
            type="search"
            value={query}
            placeholder="Search a product, style or reference…"
            onChange={(event) => change("q", event.target.value, true)}
            autoComplete="off"
          />
        </label>
        {!collection && (
          <label className="pc-filter">
            <span>Collection</span>
            <select
              value={chosenCollection}
              onChange={(event) => change("collection", event.target.value)}
            >
              <option value="">All collections</option>
              {collections.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>
        )}
        <label className="pc-filter">
          <span>Product category</span>
          <select
            value={category}
            onChange={(event) => change("category", event.target.value)}
          >
            <option value="">All categories</option>
            {categories.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </label>
        <label className="pc-filter">
          <span>Construction stage</span>
          <select
            value={phase}
            onChange={(event) => change("phase", event.target.value)}
          >
            <option value="">Every stage</option>
            {phases.map((value) => (
              <option key={value} value={value}>
                {phaseLabels[value]}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="pc-results">
        <p role="status" aria-live="polite">
          {filtered.length} {filtered.length === 1 ? "product" : "products"}
          {filtered.length > shown.length ? ` · showing ${shown.length}` : ""}
        </p>
        {(query || (chosenCollection && !collection) || category || phase) && (
          <button type="button" onClick={reset}>
            Reset filters <span aria-hidden="true">↺</span>
          </button>
        )}
      </div>
      <div className="pc-grid">
        {shown.map((product) => (
          <article className="pc-card" key={product.id}>
            <Link
              className="pc-image"
              href={productHref(product)}
              aria-label={`Explore ${product.name}${product.code ? ` ${product.code}` : ""}`}
            >
              <Image
                src={product.image}
                alt={`${product.name}${product.code ? `, catalogue reference ${product.code}` : ""}`}
                fill
                sizes="(max-width:600px) 100vw, (max-width:1000px) 50vw, 33vw"
              />
            </Link>
            <div className="pc-card-copy">
              <div className="pc-meta">
                <span>{product.category}</span>
                <span>Enquiry only</span>
              </div>
              <h3>
                <Link href={productHref(product)}>{product.name}</Link>
              </h3>
              <p>{product.description}</p>
              <div className="pc-reference">
                <span>{product.code || "Project-specific selection"}</span>
                {product.alternativeCodes?.length ? <span>Also {product.alternativeCodes.join(" / ")}</span> : product.variant ? <span>{product.variant}</span> : null}
              </div>
              <div className="pc-card-actions">
                <Link href={productHref(product)}>
                  Explore product <span aria-hidden="true">↗</span>
                </Link>
                <ProductSelectButton
                  productId={product.id}
                  className="pc-select"
                />
              </div>
            </div>
          </article>
        ))}
      </div>
      {!filtered.length && (
        <div className="pc-empty">
          <h3>No matching products.</h3>
          <p>
            Try a different reference or fewer filters. We can also review a
            material requirement that is outside the collection.
          </p>
          <button type="button" className="pc-reset" onClick={reset}>
            Clear filters
          </button>
          <Link href="/request-pricing">
            Discuss your project <span aria-hidden="true">↗</span>
          </Link>
        </div>
      )}
      {shown.length < filtered.length && (
        <div className="pc-more">
          <button
            type="button"
            onClick={() => setVisible((count) => count + 24)}
          >
            Explore more products <span aria-hidden="true">+</span>
          </button>
          <p>
            {shown.length} of {filtered.length} products
          </p>
        </div>
      )}
    </div>
  );
}
