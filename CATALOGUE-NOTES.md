# GLANHEIM product catalogue

The product experience adds `/products`, nine collection pages and an individual page for each reviewed product/design reference. Existing material sourcing pages, business pages, legal policies and the enquiry integration are retained. The approved visual direction uses the existing GLANHEIM vector logos, deep green, white, generous space and clean source photography.

## Content and maintenance

`content/products.json` contains the enquiry-only product records. Each record has a stable ID/slug, collection, category, original printed code (or null when none is supplied), source page, clean photo and any related imagery. `content/product-sources.json` maps records back to the user-supplied catalogue and source page; it is internal provenance and is not rendered as supplier advertising. Duplicate codes have distinct IDs and a design variant label. Additional printed identifiers are retained as alternative codes. Window profile series are identified explicitly as series rather than invented unique model numbers.

No prices, checkout, stock levels, lead times, certification identifiers or technical approvals have been inferred. Product descriptions have been rewritten around project selection and coordination. Dimensions, hardware, finishes, substrate and installation requirements remain for project-specific confirmation. Collection application imagery is labelled separately from matched product detail views.

Public assets are extracted photographs, finish swatches and profile crops from the supplied catalogues. Catalogue covers, contact details, Chinese captions, supplier marks, promotional badges, decorative graphics and unrelated hardware advertisements are excluded. Clean source crops preserve the pictured products. Original PDFs are not published. Image filenames do not assert GLANHEIM manufacture or completed GLANHEIM projects.

The railing/staircase PDF could not transfer because it exceeds the 32 MiB attachment limit. This range requires a compressed or split copy. The ghost-track door AN-GD003 has overlapping arrows and inset advertisements baked into its only image; a clean supplier image is needed for that design. The remaining source identifiers have been retained without guessed corrections.

## Enquiries

Shortlists store only product IDs in browser local storage (up to 40 selections). Search and collection/category/stage filters use URL parameters and support browser navigation. Each collection displays 24 products initially, with a load-more control. Product links have stable routes and appear in the sitemap.

The selection query is resolved against known catalogue IDs, then original references, collections and variants prefill the existing enquiry form. The server continues to validate the submission. The selected-product field accommodates the full shortlist. No online submission is enabled by this change: existing runtime readiness and fail-closed behaviour are preserved. When the sending integration is unavailable, existing email contact remains available.

## Validation

Run `npm run content:check`, `npm run typecheck`, `npm test`, and `npm run build`. Content validation checks unique IDs/routes, known collections, image/gallery existence, English-only rendered product copy and absence of supplier marketing names. Browser QA covers search, filtering, individual detail pages, persistent selections, selection transfer into the enquiry, and mobile layout.

## Enquiry and project collection update

The compressed railing/staircase PDF has now been processed: 152 additional records, including 79 source-coded stair variants, take the catalogue to 1,197 entries across ten product families. Door, opening and staircase titles have been differentiated using visible design features; original codes and durable IDs/routes remain unchanged. Eight annotated or watermarked railing source images were excluded. AN-GD003 remains pending a clean image.

`/collections` introduces Commercial, Residential, Fit-out, Exterior and Interior contexts, with Project packages as the sixth entry. Each context groups relevant products and three coordinated supply scopes. Contexts are selection aids, not technical suitability or certification findings. `/commercial` adds office fit-out, curtain-wall, partition and shared-space presentations. `public/images/commercial-curtain-wall.png` is a newly generated architectural application concept; existing office concept imagery and labelled supplier staircase application photos are also used. None is claimed as a completed GLANHEIM project.

`/enquiry` is an editable enquiry basket, with persistent quantities, customer-supplied measurements and notes, removal/clear controls, and v1 selection migration. Product IDs and line data remain on the customer's browser; a tab-scoped unfinished form draft avoids losing contact details while editing items. Successful online submission clears the tab form draft. The full item schedule and drawing-review request are included in both supported online transports and downloadable/email briefs. Measurements are reviewed against the intended application; no automated drawing analysis is claimed.

On Netlify, native Forms is used when the optional Resend/Blobs transport is not configured. `public/__forms.html` registers `glanheim-project-enquiry` for Netlify detection. Native POST errors and a raw detection-page response cannot produce a success state. This mode stores submissions in Netlify Forms; email notifications must be enabled in the Netlify account for `info@glanheim.com`. That setting cannot be enabled by a repository commit. Native acceptance is not proof of inbox delivery. The original API transport remains available where its credentials are configured.

Outside configured hosting, the customer can download the full brief and open a prepared email. Long briefs are downloaded instead of silently truncated into a mailto URL. The interface makes clear that the customer must send the email; opening a draft is not a submission receipt.

Production publication is separately blocked by the owner's Netlify screenshot showing a deploy-credit pause. Restore deploy credits or wait for the billing reset, enable form detection if needed, redeploy the updated `main`, add the form email notification, and verify a genuine submission and its inbox arrival.
