"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
const links = [
  ["Collections", "/products"],
  ["Project packages", "/project-packages"],
  ["Procurement", "/procurement"],
  ["About us", "/about"],
  ["Contact", "/contact"],
];
export default function Header() {
  const [open, setOpen] = useState(false);
  const path = usePathname();
  const toggle = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    function close(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        toggle.current?.focus();
      }
    }
    document.addEventListener("keydown", close);
    return () => document.removeEventListener("keydown", close);
  }, [open]);
  return (
    <header className="site-header">
      <Link
        href="/"
        aria-label="GLANHEIM home"
        onClick={() => setOpen(false)}
        className="brand"
      >
        <Image
          src="/brand/logo-primary.svg"
          width={280}
          height={57}
          alt="GLANHEIM"
          priority
        />
      </Link>
      <button
        className="menu-toggle"
        ref={toggle}
        aria-expanded={open}
        aria-controls="primary-nav"
        onClick={() => setOpen(!open)}
      >
        {open ? "Close −" : "Menu +"}
      </button>
      <nav
        id="primary-nav"
        className={open ? "primary-nav is-open" : "primary-nav"}
        aria-label="Primary"
      >
        {links.map(([name, href]) => (
          <Link
            key={href}
            href={href}
            aria-current={
              path === href || path.startsWith(href + "/") ? "page" : undefined
            }
            onClick={() => setOpen(false)}
          >
            {name}
          </Link>
        ))}
        <Link
          href="/request-pricing"
          className="header-cta"
          onClick={() => setOpen(false)}
        >
          Request pricing <span aria-hidden="true">↗</span>
        </Link>
      </nav>
    </header>
  );
}
