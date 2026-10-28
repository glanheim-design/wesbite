# Implementation validation

Validated on 28 October 2026 in the prepared cloud instance, against a local production Next.js server.

## Passed

- Production build, including TypeScript checking and 55 generated pages/assets.
- ESLint with no warnings or errors; Prettier format check.
- Structured content validation: 18 material categories and 18 enquiry-only sourcing profiles.
- Eight service/content tests: successful receipt with test doubles, idempotent retry, missing configuration, notification failure, rate limiting, unsafe/invalid inputs, changed submission IDs, forged receipt rejection and publication eligibility guards.
- 22 Playwright checks across desktop Chromium and mobile-emulated Chromium: all public routes, canonical metadata, horizontal overflow, catalogue search/filter/reset, product selection, six-step form validation, the unconfigured submission failure, email fallback, simulated accepted response, signed receipt template with an isolated local test key, navigation, API rejection paths and Australian business positioning.
- Axe automated WCAG A/AA checks on the homepage, catalogue, packages, contact and pricing pages at both tested viewports. This does not establish full manual accessibility conformance.
- Actual internal-link crawl: 50 pages, 96 unique internal destinations, zero broken links.
- Logo sizing and horizontal overflow checked at 320, 375, 390, 768, 1024 and 1440 pixels.
- Manual visual inspection of final desktop/mobile homepage and footer screenshots, including supplied logo and arrow rendering.
- Social sharing image, logo, favicon, symbol font, sitemap and robots responses returned HTTP 200.
- No internal product reviewer/evidence fields found in generated public JavaScript bundles.
- Production dependency audit: zero reported vulnerabilities.

## Requires external setup or approval

- No real email was sent. Resend delivery and customer acknowledgement require verified sender credentials, real Netlify private storage and a staging end-to-end test.
- No real Dropbox File Request was configured or uploaded to. Upload buttons currently use the secure-link email fallback.
- Netlify scheduled retention and runtime-only integrations have not been exercised on a deployed site. Follow the staging checklist before activation.
- No GitHub commit/push, Netlify deployment, DNS change or domain publication was performed.
- Founder copy, branding rights, actual product details, business disclosures and legal drafts require owner review; technical eligibility/evidence checks remain internal.
- The cloud configuration draft has reusable installation and startup instructions saved, but is not published. Review and save in environment settings, then publish the environment.

The public site has no NCC/compliance navigation or page, and does not describe GLANHEIM as an import business. No unverified Australian-made product claim is introduced.
