import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import path from "node:path";
export const alt =
  "GLANHEIM. Architectural materials and project-specific procurement.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default async function OG() {
  const svg = await readFile(
    path.join(process.cwd(), "public/brand/logo-primary.svg"),
    "utf8",
  );
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "#FFFFFF",
        color: "#183D32",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 65,
      }}
    >
      <img
        alt="GLANHEIM"
        src={`data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`}
        width={520}
        height={108}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          fontFamily: "serif",
          fontSize: 83,
          letterSpacing: -3,
          lineHeight: 1.05,
        }}
      >
        Materials without
        <br />
        compromise.
      </div>
      <div style={{ fontSize: 18, letterSpacing: 3 }}>
        ARCHITECTURAL MATERIALS · AUSTRALIAN PROJECTS
      </div>
    </div>,
    size,
  );
}
