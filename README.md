# GLANHEIM

An original, responsive architectural materials procurement website. Next.js App Router, TypeScript, Tailwind CSS, validated Git-based content, a six-step enquiry pathway, and a server-only Resend / private Netlify Blobs integration.

## Current business positioning

GLANHEIM is presented as an Australian architectural materials sourcing and supply business. At the owner’s request, there is no public NCC/compliance marketing page or import-led positioning. Public copy focuses on project specifications, quality and delivery. Product eligibility, evidence review and lawful supply checks remain internal. No Australian-made claim is made about unverified products.

## What is implemented

- All main navigation pages, website and enquiry terms, privacy policy, custom 404 and signed enquiry receipt page.
- Four material collections, 18 category pages and 18 **enquiry-only sourcing profiles** with searchable, combinable catalogue filters. These are not invented verified stock products.
- Primary green-background logo derived from the supplied PDF. The wordmark, intertwined monogram and frame are preserved; the slogan is removed from the logo. The original assets remain available for reverting the trial.
- Business-led About Us page describes how experience in Australia, New Zealand and the UK shaped the company’s founding and intended approach to clients. No founder name, military biography or Caribbean references appear in the public page.
- Static marketing/category/profile generation; dynamic enquiry page and API. Unique metadata, canonical URLs, sitemap, robots, social sharing image, Organization schema, semantic structure and mobile navigation.
- Server validation, payload limits, origin checks, honeypot and timing checks, distributed atomic rate limiting, private metadata persistence, idempotent notifications, visible error fallback and cryptographically signed receipt cookies.

## 1. Local installation

Use Node.js 24 and npm 11. Existing cloud tasks are already isolated; use the checkout at `/workspace/wesbite`. Do not create a worktree unless explicitly requested.

```sh
cd /workspace/wesbite
npm ci
cp .env.example .env.local
npm run dev
```

The default configuration has no credentials and fails closed for online submission. No Dropbox upload button is shown unless a real File Request URL is configured. General email and secure-upload-request mail links work without credentials. Development does not need a database or Docker.

Keep TLS and package integrity verification enabled. Never commit `.env.local`, API keys, customer documents or live enquiry records.

## 2. Development and production validation

```sh
npm run content:check
npm run typecheck
npm run lint
npm test
npm run build
npm start
```

`npm start` runs the production server on port 3000. Verify the homepage, a sourcing profile and the pricing workflow by making actual requests. Processes do not survive a cloud snapshot; restart the server in each new task.

For browser checks against a running production server:

```sh
npx playwright install chromium
npm run test:e2e
```

The browser suite covers every public route at desktop and mobile widths, filtering, preselected products, validation, navigation, the unconfigured API failure state, secure-upload email fallback, and unverified confirmation. The simulated response test is explicitly **not** evidence of live email delivery. Service tests use in-memory test doubles to exercise persistence, rate limits, notification failures, retries, consent and forged receipts.

## 3. GitHub setup

The selected checkout is `glanheim-design/wesbite`; it originally had no commits or `main` branch. Files are prepared here, with no commit, push or repository rename performed. Inspect `git status`, review the implementation, create your desired initial branch/commit and push using your normal GitHub access. The business brief suggested the repository label `glanheim-website`; use the actual connected repository or rename it deliberately in GitHub and update deployment settings.

## 4. Netlify deployment

Connect the reviewed GitHub repository to a new Netlify site. `netlify.toml` sets build command `npm run content:check && npm run build`, publish directory `.next` and Node 24. Netlify's current Next.js adapter supplies runtime routes and image handling automatically. Do not deploy as a static `out` export: the enquiry API requires a server runtime.

Create a Deploy Preview first. Leave `ENQUIRIES_ENABLED=false` until the legal, privacy, storage and email checks below pass. Keep preview environments disabled for enquiries unless you intentionally configure a separate staging workflow. Review the dependency audit and Netlify build logs before production launch.

## 5. Domain and HTTPS

Add `glanheim.com` as the primary custom domain in Netlify and add `www.glanheim.com` as an alias redirect. Use the exact DNS records displayed for your site rather than guessing an IP. Wait for DNS verification and Netlify's HTTPS certificate, then enforce HTTPS. Set `NEXT_PUBLIC_SITE_URL=https://glanheim.com` before the production build and redeploy. Verify one canonical hostname, HTTP-to-HTTPS redirects and the generated canonical URLs.

No domain, DNS or hosting account has been changed by this build task.

## 6. Email integration

Create a Resend account and verify a sending domain controlled by GLANHEIM. Add SPF and DKIM records **exactly as Resend provides**. Have the domain administrator configure DMARC with an appropriate reporting mailbox and gradually enforced policy after alignment is verified. Do not guess or overwrite existing SPF records: there must be one valid SPF policy per hostname.

In Netlify server/runtime environment settings, configure:

- `RESEND_API_KEY`: production transactional email credential, never public.
- `ENQUIRY_FROM_EMAIL`: a verified sender, e.g. `GLANHEIM <enquiries@your-verified-domain>` using your real verified domain.
- `BUSINESS_NOTIFICATION_EMAIL=info@glanheim.com`.
- `RATE_LIMIT_SALT`: a strong private random value, e.g. generate with `openssl rand -hex 32` and enter securely in settings.
- `ENQUIRIES_ENABLED=true` **only after** the launch checklist is completed.
- `SEND_CUSTOMER_ACKNOWLEDGEMENT=true` optionally, after the owner approves acknowledgement mail.

Netlify injects Blobs credentials. Never expose a Blobs token in frontend code. The submission endpoint requires Netlify's trusted `x-nf-client-connection-ip` client identity for rate limiting; arbitrary forwarded headers are not accepted as trusted identities. Native `next dev` / `next start` outside Netlify deliberately cannot accept live enquiries. Use a Netlify staging deployment to test the real integration.

A confirmation is returned only after metadata has been saved and Resend has accepted the team notification. Provider acceptance is not inbox delivery: verify the message arrives at `info@glanheim.com` and inspect provider delivery events. If notification fails, the metadata remains private and the user sees an error. Retry without modifying the form; the same submission ID and Resend idempotency key are reused. Customer acknowledgement failure does not invalidate an already accepted business enquiry.

Required egress for live processing: `api.resend.com`. The current cloud development environment does not require Resend access while credentials are absent. Netlify production networking is configured separately from Codex environment settings.

## 7. Dropbox File Request

In the business-owned Dropbox account, create a File Request to a private, access-controlled folder. Configure a real URL in server environment variable `DROPBOX_FILE_REQUEST_URL`, in the form `https://www.dropbox.com/request/<request-id>`. The site accepts only Dropbox's HTTPS File Request path, never arbitrary destinations. Test it from a signed-out browser: upload a harmless labelled sample, verify receipt in the intended folder, and verify uploaders cannot browse other files. Delete the sample afterward.

Without this variable, every upload action becomes a pre-addressed email requesting a secure upload link. No Dropbox token is needed. A customer may instead paste their own Dropbox, SharePoint, OneDrive or other HTTPS document link. Links are stored as sensitive enquiry metadata and included in the team's email as text; the server never fetches or exposes them publicly.

A separate Dropbox upload does not submit the pricing form. Customers are told to identify their project and complete the enquiry. Limit Dropbox folder membership, set retention rules and periodically revoke obsolete requests.

## 8. Secure enquiry handling and retention

`glanheim-enquiries` and `glanheim-rate-limits` are private Netlify Blobs stores, not public asset buckets. No API route lists or reads customer records. Notifications go only to the configured business recipient, with the customer's email as reply-to. No drawings are emailed as attachments. Submitted fields are plain text rather than HTML templates. No private submission payload is logged.

The API accepts JSON from the same site only, caps streamed payloads at 24 KB, validates all fields, rejects credential-bearing/non-HTTPS document links, and uses five atomic rate slots per salted client hash per 15-minute window. The salt is private and raw network identifiers are not retained. Rate limiting and honeypot/timing checks reduce spam; monitor real traffic and add platform protection if abuse occurs.

A scheduled daily Netlify function deletes only expired security rate-limit records. Enquiries, including inactive enquiries, are retained without automatic expiry at the owner’s instruction. Enquiry emails and separate project documents are also retained. Handle access, correction and deletion requests through info@glanheim.com, assess legal obligations and business needs, and restrict access to authorised staff. No customer records should be added to Git.

Public policies describe GLANHEIM in Queensland, Australia, with info@glanheim.com as the enquiry and privacy contact. Website and enquiry terms do not constitute sales terms; any supply contract requires a separate written agreement. No ABN, registered company status or privacy certification is claimed.

## 9. Product and content management

Edit `content/catalogue.json` through a private GitHub branch and PR. This is the initial Git-based CMS. No public administration panel is deployed. Nontechnical editors can use GitHub's file editor, but a maintainer must review changes and the validation result before merging.

- Categories define collection, name, potential material scope and filter attributes.
- Profiles include manufacturer/country, composition, dimensions, finishes, technical characteristics, applications, lead time, minimum order, installation system, limitations, technical sheet, reports, standards and evidence-review fields.
- Unknown values remain `null` or empty: the public template displays “to be confirmed”, not fabricated specifications.
- `draft` stays private. `enquiry-only` is clearly a sourcing discussion. `published` requires `eligibility: eligible` after actual eligibility review.
- `prohibited` or `DO NOT OFFER` must never be public; validation rejects them. Do not add prohibited engineered stone products.
- The internal review states are `NOT YET ASSESSED`, `DOCUMENTATION REQUESTED`, `UNDER TECHNICAL REVIEW`, `EVIDENCE REVIEWED FOR SPECIFIED APPLICATION`, `FURTHER VERIFICATION REQUIRED`, `DO NOT OFFER`.
- Public evidence statements require a documented reviewer date, issuer and application-specific review status. A reviewer must still verify the substance: schema validation cannot determine legal or technical compliance.
- Technical download links render only with `documentAccess: approved-public`; individual test reports also require `publicPermission: true`. Never commit confidential reports even on a draft profile.
- Add approved product imagery under `public/images` and set the profile’s optional `image: {src, alt, licence}` object; record the licence and descriptive alternative text. Each category has its own unlabelled application image. These generated application studies are not evidence of completed GLANHEIM projects or verified product performance.
- Edit homepage content in `app/page.tsx`, company operations and the generic founding story in `components/business-sections.tsx`, and supporting pages in `app/[page]/page.tsx`. Category/profile templates are under `app/materials/[[...segments]]`. Future verified case studies and articles should use new validated collections and routes; none are invented here.

Run `npm run content:check` and the full validation commands after edits. Netlify rebuilds public pages after an approved merge.

## 10. SEO and Search Console

After the real domain and HTTPS are active, verify ownership in Google Search Console using its supplied DNS TXT record. Submit `https://glanheim.com/sitemap.xml`. Check canonical tags, crawl results and mobile rendering. Organisation schema has no invented address, reviews or certifications. Keep Deploy Previews out of indexing using Netlify access controls and its preview headers; do not point production DNS at a preview.

## 11. Asset provenance

- Logos, monogram and favicon: extracted from the user's supplied `Black+and+White+Oval+Vintage+Apparel+Logo.pdf` (Canva-authored source). Confirm ownership and trademark use with the owner.
- Hero / architectural image: generated specifically for this implementation, labelled as illustrative architectural concept imagery. It is not a photograph of a completed GLANHEIM project.
- Material palette graphics: original CSS/SVG studies, not a supplier's product images.
- Typography: system Arial and Georgia stacks, plus an openly licensed DejaVu arrow/checkmark subset (`public/fonts/LICENSE.txt`); no external font requests.
- No reference website images, code or exact layouts were copied.

## 12. Maintenance

Keep Node on a supported release and review dependency/security updates monthly. Commit the lockfile, use `npm ci`, run checks and deploy to preview before production. Test enquiry receipt, provider delivery, Dropbox permissions and retention after configuration changes. Review product eligibility and technical evidence when products, systems, standards or intended applications change. Review legal text when actual business practices change.

## 13. Launch status

See `LAUNCH-CHECKLIST.md`. An implemented integration and passing tests with test doubles do not establish live Resend delivery, a real Dropbox upload, business approval, technical certification or legal readiness.

## Taste design trial

Installed via the requested `npx skills add Leonxlnx/taste-skill` command (noninteractive Codex project installation). The skill lives at `.agents/skills/design-taste-frontend/SKILL.md` and its version is recorded in `skills-lock.json`. Vendored skill scripts are excluded from application ESLint; they are development tooling, not website runtime code.

The direction is “Photographs at uneven sizes”, seed 2075853245, keeping the green brand and type. White is the page ground; the primary logo uses the supplied green-background variant. No external photograph or video licence is asserted: new material and architectural images are generated concept illustrations and are recorded as concept assets in this README and the content records. They are not completed projects or verified supplier photographs. No unrelated footage was added.

Interactive features include a package builder that carries selected categories into the real enquiry, service-role selection on Home and About Us, expandable supply stages and questions, catalogue search/filters, and page contents links. Existing enquiry validation and fail-closed integration behaviour are retained. Main navigation and collection controls use larger readable labels and touch targets, with a mobile menu on smaller screens.

Run `node .agents/skills/design-taste-frontend/scripts/lint.mjs app components lib` for the source design check. The full inspector requires an installed Chromium that can launch in the environment. Local inspection outputs belong in ignored `.taste-skill/`.

The material palette now maps a distinct image to each of its 18 categories. Examples include an office suspended ceiling grid, a reception desk, glass partitions, tile flooring, bathroom finishes, standing-seam roofing and exposed steel. No image captions or project labels are rendered, as requested by the owner. Their provenance remains in the image fields of `content/catalogue.json`. No third-party designer’s images were copied. The skill’s open-collection searches could not connect, including a retry through the configured proxy; tailored generated assets were used instead.

## Australian product supply commitment

At the owner’s instruction, public copy states: “All products supplied by GLANHEIM will be certified for Australian installation and meet the Australian construction standards applicable to their intended use.” The commitment is shared through `lib/supply.ts` and used across the home, company, procurement, package and material pages.

This is the business’s forward-looking supply commitment. Internal product records and evidence controls continue to hold the actual certificate, issuer, scope and application information. No certificate identifiers or specialist approvals have been invented or marked as reviewed without documentation. Product certification is distinguished from the separate service of undertaking project engineering or installation.

## Submission launch verification

For a mailbox-only setup, follow [EMAIL-LAUNCH-SETUP.md](EMAIL-LAUNCH-SETUP.md) to connect Resend, configure the production runtime and verify inbox delivery.

A configured email inbox is separate from the Resend sending integration. Add the server-only Resend credential, verified sender and strong rate-limit secret securely in Netlify’s production environment settings, then enable enquiries and redeploy. Never paste secrets into chat or commit them. The form and endpoint share the same readiness check and remain unavailable until all prerequisites are present.

After deployment, open the public pricing page in a signed-out browser. Complete all six steps with a genuine monitored email address, a clearly identified launch-test brief, one material package and both consent confirmations. Submit once. Confirm the signed receipt and reference, the private stored record, the delivered notification at info@glanheim.com and the matching Resend delivery event. A successful API response proves provider acceptance, not final inbox delivery. Verify Reply-To reaches the submitter. If the public page returns 401, resolve the site access restriction before testing.

If delivery fails after storage, keep the form unchanged and retry. The same submission identifier is reused. When the service is unconfigured the final submit action is disabled and the email fallback remains available. A stalled request times out with a retry message; it never reports false success.


## Product catalogue expansion

The approved GLANHEIM catalogue experience is documented in [CATALOGUE-NOTES.md](CATALOGUE-NOTES.md). The site now includes 1,045 enquiry-only product/design references across nine collections and 82 categories, individual product pages, original code search and a persistent product shortlist that prefills the enquiry form. Original supplier advertising is not rendered. The oversized railing/staircase attachment remains pending a compressed or split copy. Production builds use Next.js’s supported webpack pipeline because Turbopack’s CSS worker cannot bind its local socket in this cloud runtime.

## Netlify Forms and project collections

The current site adds the railing/staircase range, bringing the enquiry-only catalogue to **1,197 entries across ten product families**. Explore it through Commercial, Residential, Fit-out, Exterior, Interior and Project packages. The editable `/enquiry` basket retains quantities, measurement notes and product references before the project form.

Netlify Forms provides native intake when Resend is not connected. In Netlify, enable form detection if it is off, deploy the updated site, and open **Forms → glanheim-project-enquiry → notification settings** to add **info@glanheim.com**. The native notification is separate from the optional `BUSINESS_NOTIFICATION_EMAIL` variable. Confirm a real form record and email arrival before declaring live notifications operational. A Netlify deploy-credit pause must be resolved before the new site can publish.
