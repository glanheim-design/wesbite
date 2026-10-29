# GLANHEIM release validation

Checked on 29 October 2026 against the local development server. No production build was run; deployment validation handles the build.

Content validation passed for all 18 categories, sourcing profiles and image files. TypeScript, ESLint and all nine service/content tests passed. Tests covered validation, consent, missing configuration, rate limits, persistence and notification retries, changed-payload rejection, forged receipts, catalogue publication rules and shared form/API readiness.

The desktop/mobile browser suite passed all 32 applicable scenarios after focused reruns corrected narrow-phone heading overflow and entrance-animation text contrast. Coverage included all public routes, metadata, viewport fit, navigation, catalogue filtering, package carry-through, enquiry validation and disabled submission, legal content, image mapping, upload fallback and API rejection paths. Four scenarios were explicitly skipped: simulated successful submission on two viewports because live configuration was absent, and signed confirmation server checks on two viewports because no production build was available. Service tests verified signed receipt integrity. Automated axe WCAG A/AA checks passed on both viewports after the animation fix; this is not a complete manual accessibility audit.

Source design lint passed. Desktop and mobile privacy page screenshots were reviewed. The design inspector's picture/video quotas were unsuitable for a text-focused legal page; legal content remained free of decorative media. Paragraph width was reduced for readability. The existing brand and layouts were retained.

Production runtime settings did not contain the required Resend credential, verified sender, rate-limit secret or enquiry activation. The public pricing URL returned HTTP 401 from this environment. Live storage and Resend delivery were therefore not verified. Activate the service through secure production settings, deploy, verify public access and complete the real-enquiry checks in LAUNCH-CHECKLIST.md before calling online submission operational.

Website and enquiry terms and the privacy policy were completed using the owner's supplied business details and indefinite retention instruction. Enquiries are not automatically deleted; only expired security rate-limit records are cleaned up. No sales contract, ABN or registered-company status was invented.
