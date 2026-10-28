import type { Metadata, Viewport } from "next";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/header";
import { siteUrl } from "@/lib/site";
import "./globals.css";
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "GLANHEIM | Architectural materials & project procurement",
    template: "%s | GLANHEIM",
  },
  description:
    "Project-specific architectural materials sourcing and supply for Australian builders, developers and commercial construction teams.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_AU",
    siteName: "GLANHEIM",
    images: ["/opengraph-image"],
  },
  twitter: { card: "summary_large_image" },
  icons: { icon: "/icon.png" },
};
export const viewport: Viewport = { themeColor: "#183D32" };
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-AU">
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <Header />
        <main id="main">{children}</main>
        <footer className="site-footer">
          <div className="container">
            <div className="footer-top">
              <Link href="/" aria-label="GLANHEIM home">
                <Image
                  src="/brand/logo-green.svg"
                  alt="GLANHEIM — Curators of Distinction"
                  width={360}
                  height={75}
                />
              </Link>
              <p>
                Architectural materials.
                <br />
                Considered procurement.
                <br />
                Australian projects.
              </p>
              <a className="footer-email" href="mailto:info@glanheim.com">
                info@glanheim.com ↗
              </a>
            </div>
            <div className="footer-links">
              <span>© {new Date().getFullYear()} GLANHEIM</span>
              <Link href="/privacy">Privacy policy</Link>
              <Link href="/terms">Website terms</Link>
              <Link href="/enquiry-terms">Enquiry terms</Link>
              <span>Supply only · Australia</span>
            </div>
          </div>
        </footer>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "GLANHEIM",
              url: siteUrl,
              email: "info@glanheim.com",
              logo: siteUrl + "/brand/logo-ivory.svg",
              areaServed: "AU",
              description:
                "Architectural materials sourcing and supply for Australian construction projects.",
            }),
          }}
        />
      </body>
    </html>
  );
}
