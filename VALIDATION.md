# GLANHEIM release validation

Validated on 28 October 2026 in the cloud instance against a local production build.

Passed:

- Production build, TypeScript check, ESLint and content validation.
- All 18 category images exist and are individually mapped to their material applications.
- Eight enquiry-service/content tests: validation, consent, rate limits, idempotent receipt, missing credentials, provider failure, changed payload rejection, signed receipt integrity and publication guards.
- 34 desktop/mobile Playwright checks, covering every public route, metadata, responsive overflow, navigation, catalogue filtering, image mapping, package-builder carry-through, company copy, process disclosures, slideshow controls, unconfigured enquiry fallback, simulated responses and signed receipt templates.
- Automated axe WCAG A/AA checks on the principal marketing and enquiry pages. This is not a claim of complete manual accessibility conformance.
- Taste source lint: zero failures or warnings. Taste browser inspection: zero failures on Home, About Us and Materials at 1440/768/390 pixels. Defended warnings and visual critique are in `DESIGN-NOTES.md`.
- Visual review of every final inspector fold and full-page sheet for those three pages.
- Internal-link crawl: 50 pages, 97 unique internal destinations, zero broken links.
- No private reviewer/evidence field names found in public JavaScript bundles; no credential-pattern findings in new files.

External release steps still apply:

- Actual Netlify deployment and domain/HTTPS configuration must be confirmed in the connected Netlify account.
- Automated enquiry receipt needs genuine Resend sender settings and Netlify private storage; local tests do not establish live email delivery.
- Dropbox upload buttons use the email fallback until a genuine owner-managed File Request URL is configured.
- Business disclosures, legal drafts, retention practices and product-specific technical information need the owner’s appropriate review.

The public company page has no named founder or Caribbean reference. Category images are generated application concepts with provenance in the content records; no visible photo labels or captions are rendered.
