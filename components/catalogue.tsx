"use client";
import Link from "next/link";
import Image from "next/image";
import { getCategoryArtwork } from "@/lib/artwork";
import { useMemo, useState } from "react";
import type { Group } from "@/lib/content";
type Category = (typeof import("@/lib/content").categories)[number];
const categoryHref = (c: Category) => `/materials/${c.group}/${c.slug}`;
import { Arrow } from "./ui-client";
export default function Catalogue({
  group,
  categories,
}: {
  group?: Group;
  categories: Category[];
}) {
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<Record<string, string>>({});
  const source = group
    ? categories.filter((c) => c.group === group)
    : categories;
  const fields = [
    ["group", "Collection"],
    ["materialType", "Material"],
    ["finish", "Finish"],
    ["application", "Application"],
    ["technical", "Technical review"],
  ] as const;
  const filtered = useMemo(
    () =>
      source.filter(
        (c) =>
          (!query ||
            `${c.name} ${c.items.join(" ")}`
              .toLowerCase()
              .includes(query.toLowerCase())) &&
          Object.entries(filters).every(
            ([k, v]) => !v || c[k as keyof typeof c] === v,
          ),
      ),
    [source, query, filters],
  );
  return (
    <div className="catalogue">
      <div className="catalogue-toolbar">
        <label className="search-field">
          <span>Find a material or package</span>
          <input
            type="search"
            placeholder="Search stone, joinery, façade…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
        {fields
          .filter(([k]) => !group || k !== "group")
          .map(([key, label]) => (
            <label key={key} htmlFor={`filter-${key}`}>
              <span id={`filter-label-${key}`}>{label}</span>
              <select
                id={`filter-${key}`}
                aria-labelledby={`filter-label-${key}`}
                value={filters[key] || ""}
                onChange={(e) =>
                  setFilters({ ...filters, [key]: e.target.value })
                }
              >
                <option value="">All {label.toLowerCase()}</option>
                {[...new Set(source.map((c) => c[key]))].map((v) => (
                  <option value={v} key={v}>
                    {v}
                  </option>
                ))}
              </select>
            </label>
          ))}
      </div>
      <div className="results-line">
        <p role="status">
          {filtered.length} sourcing{" "}
          {filtered.length === 1 ? "category" : "categories"}
        </p>
        <button
          type="button"
          className="reset"
          onClick={() => {
            setQuery("");
            setFilters({});
          }}
        >
          Reset filters ↺
        </button>
      </div>
      <div className="catalogue-grid">
        {filtered.map((c) => (
          <Link
            className="catalogue-card"
            key={c.group + c.slug}
            href={categoryHref(c)}
          >
            <div className="catalogue-surface">
              <Image
                src={getCategoryArtwork(c).src}
                alt={getCategoryArtwork(c).alt}
                fill
                sizes="(max-width:700px) 100vw, 40vw"
              />
            </div>
            <h2>
              {c.name}
              <Arrow />
            </h2>
            <p>{c.description}</p>
          </Link>
        ))}
      </div>
      {!filtered.length && (
        <div className="empty-state">
          <h2>No matching categories.</h2>
          <p>Try fewer filters, or send us your scope for review.</p>
          <Link className="text-link" href="/request-pricing">
            Discuss a material package ↗
          </Link>
        </div>
      )}
    </div>
  );
}
