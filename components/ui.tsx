import Link from "next/link";
import Image from "next/image";
import { uploadLink } from "@/lib/site";
export function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return <span aria-hidden="true">{diagonal ? "↗" : "↗"}</span>;
}
export function Button({
  href,
  children,
  light = false,
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  light?: boolean;
  className?: string;
}) {
  return (
    <Link
      className={`button ${light ? "button-light" : ""} ${className}`}
      href={href}
    >
      {children}
      <Arrow />
    </Link>
  );
}
export function Architecture({
  className = "",
  priority = false,
  alt = "Illustrative architectural concept: limestone courtyard, timber screening and an olive tree",
}: {
  className?: string;
  priority?: boolean;
  alt?: string;
}) {
  return (
    <div className={`architecture ${className}`}>
      <Image
        src="/images/architecture.webp"
        alt={alt}
        fill
        priority={priority}
        sizes="(max-width: 760px) 100vw, 75vw"
      />
    </div>
  );
}
export function UploadButton({ light = false }: { light?: boolean }) {
  const href = uploadLink();
  return (
    <a
      className={`button ${light ? "button-light" : ""}`}
      href={
        href ||
        "mailto:info@glanheim.com?subject=Request%20a%20secure%20upload%20link"
      }
      {...(href ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {href ? "Upload drawings securely" : "Request a secure upload link"}
      <Arrow />
    </a>
  );
}
export function PageIntro({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="page-intro container">
      <p className="eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      {children && <div className="intro-copy">{children}</div>}
    </section>
  );
}
export function ClosingCTA() {
  return (
    <section className="closing container">
      <p className="eyebrow">THE NEXT STEP</p>
      <div className="closing-grid">
        <h2>
          Your project.
          <br />
          <em>Our next conversation.</em>
        </h2>
        <div>
          <p>Send us your drawings. Let’s discuss your material package.</p>
          <Button href="/request-pricing">Request project pricing</Button>
        </div>
      </div>
    </section>
  );
}
export function Breadcrumbs({
  items,
}: {
  items: { name: string; href?: string }[];
}) {
  return (
    <nav aria-label="Breadcrumb" className="breadcrumbs">
      <Link href="/">Home</Link>
      {items.map((i, n) => (
        <span key={n}>
          <span aria-hidden="true"> / </span>
          {i.href ? (
            <Link href={i.href}>{i.name}</Link>
          ) : (
            <span aria-current="page">{i.name}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
