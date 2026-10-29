import { NextRequest, NextResponse } from "next/server";
import {
  EnquiryError,
  processEnquiry,
  signReceipt,
} from "@/lib/enquiry-service";
import { runtimeDependencies } from "@/lib/enquiry-runtime";
export const runtime = "nodejs";
export async function POST(req: NextRequest) {
  try {
    let origin: URL | null = null;
    try {
      origin = new URL(req.headers.get("origin") || "");
    } catch {
      /* Rejected below. */
    }
    // Match the public Host, not Next's internal listening address behind a proxy.
    if (
      !origin ||
      !["http:", "https:"].includes(origin.protocol) ||
      origin.host !== req.headers.get("host")
    )
      throw new EnquiryError(403, "Please submit from this website.");
    if (!req.headers.get("content-type")?.startsWith("application/json"))
      throw new EnquiryError(415, "JSON submission required.");
    if (Number(req.headers.get("content-length") || 0) > 131072)
      throw new EnquiryError(
        413,
        "Enquiry is too long. Please use a document-sharing link.",
      );
    const reader = req.body?.getReader();
    if (!reader) throw new EnquiryError(400, "Missing enquiry.");
    const chunks: Uint8Array[] = [];
    let size = 0;
    while (true) {
      const r = await reader.read();
      if (r.done) break;
      size += r.value.byteLength;
      if (size > 131072) {
        await reader.cancel();
        throw new EnquiryError(413, "Enquiry is too long.");
      }
      chunks.push(r.value);
    }
    let data: unknown;
    try {
      data = JSON.parse(Buffer.concat(chunks).toString("utf8"));
    } catch {
      throw new EnquiryError(400, "Invalid enquiry format.");
    }
    const deps = runtimeDependencies();
    const identity =
      process.env.NETLIFY === "true"
        ? req.headers.get("x-nf-client-connection-ip") || ""
        : "";
    const result = await processEnquiry(data, identity, deps);
    const response = NextResponse.json(result, {
      headers: { "Cache-Control": "no-store" },
    });
    response.cookies.set(
      "glanheim-receipt",
      signReceipt(result.reference, deps.salt),
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/enquiry-confirmation",
        maxAge: 3600,
      },
    );
    return response;
  } catch (e) {
    if (e instanceof EnquiryError)
      return NextResponse.json(
        { error: e.message, fields: e.fields },
        {
          status: e.status,
          headers: {
            "Cache-Control": "no-store",
            ...(e.status === 429 ? { "Retry-After": "900" } : {}),
          },
        },
      );
    return NextResponse.json(
      {
        error:
          "Receipt could not be confirmed. Please try again or email info@glanheim.com.",
      },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
