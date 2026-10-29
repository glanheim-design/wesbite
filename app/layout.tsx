import type { Metadata, Viewport } from "next";
import Link from "next/link";
import Image from "next/image";
import { ProductSelectionProvider } from "@/components/product-selection";
import Header from "@/components/header";
import PageExperience from "@/components/page-experience";
import { Architecture } from "@/components/ui";
import { siteUrl } from "@/lib/site";
import "./globals.css";
import "./products.css";
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
        <ProductSelectionProvider>
          <Header />
          <main id="main">{children}</main>
          <PageExperience />
          <footer className="site-footer">
            <div className="footer-photo">
              <Architecture
                src="/images/architecture.webp"
                alt="Architectural concept of a limestone courtyard and timber screening"
              />
            </div>
            <div className="container footer-content">
              <div className="footer-top">
                <Link href="/" aria-label="GLANHEIM home">
                  <Image
                    src="/brand/logo-primary.svg"
                    alt="GLANHEIM"
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
              <nav className="footer-menu" aria-label="Footer">
                <Link href="/products">Product collections</Link>
                <Link href="/commercial">Commercial packages</Link>
                <Link href="/enquiry">Your enquiry</Link>
                <Link href="/materials">Material sourcing</Link>
                <Link href="/project-packages">Project packages</Link>
                <Link href="/procurement">Procurement</Link>
                <Link href="/about">About us</Link>
                <Link href="/contact">Contact</Link>
              </nav>
              <div className="footer-links">
                <span>© {new Date().getFullYear()} GLANHEIM</span>
                <Link href="/privacy">Privacy policy</Link>
                <Link href="/terms">Website terms</Link>
                <Link href="/enquiry-terms">Enquiry terms</Link>
                <span>Supply only · Australia</span>
              </div>
            </div>
          </footer>
        </ProductSelectionProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "GLANHEIM",
              url: siteUrl,
              email: "info@glanheim.com",
              logo: siteUrl + "/brand/logo-primary.svg",
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
