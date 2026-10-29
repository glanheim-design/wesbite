# Connect website enquiries to the business inbox

The existing mailbox receives email. Resend is the separate sending service used by the website. Creating a mailbox does not configure the Resend API integration.

The website already validates and privately saves enquiries, requests a Resend notification, and issues a signed confirmation only after the notification is accepted. The notification goes to the configured business recipient, defaulting to info@glanheim.com. Reply-To is the customer's email address. Resend acceptance and final inbox delivery are separate checks.

## 1. Verify a sending domain in Resend

Create or sign in to the business-owned account at https://resend.com. In Domains, add a sending domain you control. A dedicated sending subdomain keeps transactional sending separate from the existing mailbox service.

Add the DNS records shown by Resend through the domain's DNS settings. Use the names and records Resend supplies, then wait for its verification status. Keep the existing mailbox provider's records in place; a new sending service does not replace the receiving mailbox. Do not replace the main domain's receiving MX records with a sending subdomain's records.

Choose a sender address on the domain that Resend has verified. The sender and the receiving business inbox can be different addresses. If only a subdomain is verified, use a sender on that subdomain.

## 2. Add the secure Netlify configuration

Create a Resend API key with permission to send email for the verified domain. In the GLANHEIM project at https://app.netlify.com/projects/glanheim, open Project configuration, then Environment variables. Configure the production context and Functions/runtime scope for these settings:

| Setting | What to configure securely |
| --- | --- |
| `RESEND_API_KEY` | The sending credential created in Resend. |
| `ENQUIRY_FROM_EMAIL` | The sender address on the verified domain, optionally with the GLANHEIM display name. |
| `BUSINESS_NOTIFICATION_EMAIL` | The monitored business inbox. If omitted, the code uses info@glanheim.com. |
| `RATE_LIMIT_SALT` | A unique, cryptographically random private secret generated with a password manager or secure generator; use at least 32 random bytes. |
| `ENQUIRIES_ENABLED` | The explicit activation switch required by the website's shared readiness check. Its exact enabled representation is defined in `lib/enquiry-config.ts`. |

Enter credentials directly into secure settings. Do not put them in chat, source files, screenshots or documentation. Leave customer acknowledgement disabled unless an additional customer email is wanted; it is not required for business notifications.

Save the settings and trigger a new production deploy so the runtime receives the changes. The pricing page stays unavailable unless the activation switch, sender, credential and secret are configured and the request runs on Netlify.

## 3. Verify a real submission

Open https://glanheim.com/request-pricing in a signed-out browser. If the page returns an access error, resolve the site's access setting before testing. The online-submission unavailable notice should disappear after a correctly configured deployment.

Complete all six steps with a genuine monitored email address, one material package, a clearly labelled launch-test scope and both consent confirmations. Submit once. Verify all of the following:

1. The browser shows a signed confirmation and an enquiry reference.
2. The matching enquiry is privately saved.
3. The notification arrives in info@glanheim.com's inbox or spam folder.
4. Resend's email activity shows the matching message as delivered, rather than only accepted or queued.
5. Replying to the notification addresses the submitter.

Keep the test reference and delivery result privately. A local test or a passing build does not establish live delivery.

## Troubleshooting

An unavailable notice means the shared configuration check has not passed; check the production context, runtime scope, sender, credential, activation switch and secret, then redeploy.

A saved-enquiry/notification error means receipt was stored but Resend acceptance could not be confirmed. Retry without editing the form. Check the sending domain's verification, the key's send permission and Resend's activity. The same submission identifier is reused to protect retries.

A signed confirmation with no inbox message means provider acceptance succeeded but final delivery still needs investigation. Check Resend delivery or bounce events, the recipient setting and the receiving mailbox's spam/quarantine folders.

For a stalled connection, retry the same enquiry. Do not assume a timeout means nothing was saved. The visible email fallback remains available throughout.
