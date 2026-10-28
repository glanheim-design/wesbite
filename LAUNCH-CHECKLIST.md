# GLANHEIM launch checklist

## Code and local verification

- [ ] Review logo crops, founder copy, editorial design and sourcing categories with the owner.
- [x] Run content validation, type checking, lint, service tests, production build and desktop/mobile browser tests.
- [x] Audit production dependencies: zero reported vulnerabilities.
- [ ] Review actual image rendering, keyboard focus, reduced motion, contrast and screen-reader labels.
- [x] Inspect final internal links, metadata, sitemap, 404 and image responses.

## External configuration — no live integration claimed

- [ ] Push the reviewed initial project to the chosen GitHub branch.
- [ ] Connect Netlify and verify the Next.js adapter and private Blobs stores.
- [ ] Configure the real domain, www redirect and HTTPS; verify canonical URLs.
- [ ] Verify Resend sender domain, SPF, DKIM and DMARC. Enter server-only credentials securely.
- [ ] Confirm the notification recipient is info@glanheim.com.
- [ ] Generate RATE_LIMIT_SALT; enable enquiries only after business/legal approval.
- [ ] Complete a real staging enquiry. Check private stored metadata, delivered team email, reference and confirmation cookie; then delete test data.
- [ ] Test a real provider rejection, retry/idempotency behaviour and rate limit on staging.
- [ ] Optionally enable and test customer acknowledgement delivery.
- [ ] Create an owner-managed Dropbox File Request, configure URL and test signed-out upload/permissions; delete test file.
- [ ] Verify email fallback remains available when upload or enquiry services are unavailable.
- [ ] Test scheduled retention in staging and separately implement email/Dropbox retention.
- [ ] Verify Search Console ownership and submit the production sitemap.

## Business owner approval

- [ ] Confirm legal entity and applicable business disclosures.
- [ ] Approve the generic company founding story, the trial slogan-free logo and the use of supplied brand artwork.
- [ ] Approve supply-only scope, actual sourcing capability and current category coverage.
- [ ] Confirm no 24/7, stock, delivery time, supplier agreement or completed-project claims are implied.
- [ ] Approve enquiry handling staff, private-store access, overseas providers and notification recipients.
- [ ] Approve retention period, legal-hold handling and privacy contact procedures.

## Legal and technical review

- [ ] Australian legal adviser approves Privacy Policy, Website Terms and Enquiry Terms based on actual operations.
- [ ] Competent specialist verifies the currently adopted NCC, Queensland requirements and relevant standard editions for intended public claims.
- [ ] Verify Queensland non-conforming building products obligations across the actual supply chain.
- [ ] Complete eligibility checks before publishing actual products; exclude prohibited engineered stone.
- [ ] Validate each evidence statement for its exact product, system and application; obtain document publication permissions.
- [ ] Confirm technical advice, engineering, certification and installation are not implied as GLANHEIM services.

Do not treat completed code or simulated tests as a live launch sign-off.
