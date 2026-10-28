import type { Metadata } from "next";
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://glanheim.com";
export const email = "info@glanheim.com";
export function pageMeta(
  title: string,
  description: string,
  path: string,
): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: `${title} | GLANHEIM`,
      description,
      url: path,
      images: ["/opengraph-image"],
    },
  };
}
export function uploadLink() {
  const v = process.env.DROPBOX_FILE_REQUEST_URL;
  try {
    if (v) {
      const u = new URL(v);
      if (
        u.protocol === "https:" &&
        ["www.dropbox.com", "dropbox.com"].includes(u.hostname) &&
        /^\/request\/[a-zA-Z0-9]+\/?$/.test(u.pathname) &&
        !u.username &&
        !u.password
      )
        return u.href;
    }
  } catch {}
  return null;
}
