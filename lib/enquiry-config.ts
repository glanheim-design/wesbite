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
