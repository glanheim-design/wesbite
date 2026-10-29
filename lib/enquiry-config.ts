/** Shared by the rendered form and server so their availability cannot drift. */
export function enquiriesConfigured(env: Record<string, string | undefined>) {
  return (
    env.ENQUIRIES_ENABLED === "true" &&
    env.NETLIFY === "true" &&
    !!env.RESEND_API_KEY?.trim() &&
    !!env.ENQUIRY_FROM_EMAIL?.trim() &&
    !!env.RATE_LIMIT_SALT?.trim()
  );
}

export type EnquiryTransport = "api" | "netlify" | "email";
export function enquiryTransport(
  env: Record<string, string | undefined>,
): EnquiryTransport {
  if (enquiriesConfigured(env)) return "api";
  if (env.NETLIFY === "true" && env.NETLIFY_FORMS_ENABLED !== "false")
    return "netlify";
  return "email";
}
