"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
export default function PageExperience() {
  const path = usePathname();
  const [items, setItems] = useState<{ id: string; text: string }[]>([]);
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const headings = [...document.querySelectorAll<HTMLElement>("main h2")];
      setItems(
        headings.map((h, i) => {
          if (!h.id)
            h.id = `section-${i}-${(h.textContent || "")
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, "-")
              .slice(0, 50)}`;
          return { id: h.id, text: h.textContent || "" };
        }),
      );
    });
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const observed = [
      ...document.querySelectorAll<HTMLElement>(
        "main h1,main h2,main h3,main section p,main .architecture,main .editorial-card,main details",
      ),
    ];
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            if (!reduce)
              el.classList.add(
                el.classList.contains("architecture")
                  ? "picture-arrival"
                  : "text-arrival",
              );
            observer.unobserve(el);
          }
        }
      },
      { threshold: 0.12 },
    );
    observed.forEach((el) => observer.observe(el));
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [path]);
  return items.length > 1 ? (
    <div className="page-tools container">
      <details>
        <summary>On this page</summary>
        <nav aria-label="Page contents">
          {items.map((i) => (
            <a key={i.id} href={"#" + i.id}>
              {i.text}
            </a>
          ))}
        </nav>
      </details>
    </div>
  ) : null;
}
