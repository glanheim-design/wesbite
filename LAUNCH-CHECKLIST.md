# GLANHEIM launch checks

The website is an enquiry-only service, operated as GLANHEIM in Queensland, Australia. Website and enquiry terms apply; orders, payments and binding supply contracts are agreed separately in writing. The enquiry and privacy inbox is info@glanheim.com. Inactive enquiries remain on file without automatic deletion.

## Submission activation

Follow [EMAIL-LAUNCH-SETUP.md](EMAIL-LAUNCH-SETUP.md) if only the receiving mailbox is currently configured.

- Configure the Resend API credential, verified sender, private rate-limit secret and enquiry activation in Netlify production runtime settings. Configure secrets securely in the dashboard, never in the repository or chat.
- Redeploy after changing runtime configuration. Confirm the pricing page no longer displays an unavailable notice.
- Open the website signed out to verify public access, HTTPS and the canonical domain.
- Submit a clearly labelled launch enquiry using a genuine monitored email address and complete all required fields and consents.
- Verify the signed confirmation reference, private enquiry record, delivered team email at info@glanheim.com and matching Resend delivery event. Verify the email Reply-To.
- Test provider failure and unchanged retries in an isolated staging environment. Service unit tests cover these behaviours with test doubles; these do not prove live delivery.

## Website checks

- Validate content, types, lint and service tests. Check public routes, metadata, mobile layout, navigation, legal links and form validation in a browser.
- Verify any configured Dropbox File Request from a signed-out browser; confirm uploaders cannot browse files. Without a configured request, use the email request for a secure upload link.
- Keep product specifications and evidence tied to the exact application. Catalogue sourcing profiles are enquiry-only and must not be presented as verified stock or completed projects.
- Handle privacy access, correction and deletion requests through the monitored inbox. The daily cleanup deletes only expired security rate-limit records, never enquiry records.

Do not treat local checks as evidence of a delivered live email. Record the actual launch-test reference and delivery result privately after deployment.
