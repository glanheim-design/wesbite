# GLANHEIM design trial

Implemented with the requested [Taste skill](.agents/skills/design-taste-frontend/SKILL.md), installed from `Leonxlnx/taste-skill`. The installed revision is recorded in `skills-lock.json`.

## Direction and idea

“Photographs at uneven sizes”, seed **2075853245**. No redraws. The existing green brand and two type families were retained; the page ground is white. The owner subsequently selected the green-background logo from the PDF, with its slogan removed. The supplied wordmark, intertwined monogram and frame are preserved as vectors, with no generative redraw of the logo.

On this site, GLANHEIM’s drawing-led material package becomes a visitor-built supply brief. The working package selector carries categories into the enquiry. A role selector gives relevant information to builders, estimators, designers, developers and specialist trades. Expandable supply stages, questions, page contents and the existing searchable catalogue make the content navigable by mouse, touch and keyboard.

The architectural image study has manual image selection, pause/play and a slow crossfade. Section entrances use transform/opacity, remain readable without JavaScript, and honour reduced motion. No pinned scroll scenes were dealt or added.

## Company content

The About Us page explains operations, clients served, sourcing scope, technical coordination, manufacturing and delivery. Its generic founding story refers to Australia, New Zealand and the UK. No founder name, military biography, visa circumstances or Caribbean references appear in the public company copy.

Australian business positioning is retained. There is no public NCC/compliance page or import-led marketing, and no unverified Australian-made claim.

## Images

Every one of the 18 material categories has a distinct application image. Wall & Ceiling Systems shows an office ceiling grid; Joinery & Cabinetry shows a reception desk. Other images cover brick, stone and porcelain, metal screens, standing-seam roofing, floor tiling, bathrooms, doors and hardware, glass partitions, interior metalwork, stone counters, commercial fit-outs, structural steel, timber/aluminium, bespoke components and finish coordination.

These are generated architectural/application concepts, not copied design-site photographs or evidence of completed GLANHEIM projects. No third-party creators’ work is passed off as GLANHEIM’s. The skill’s open-collection photo search could not reach its sources, including a retry with proxy support. No found photos, clips or their licence claims are used.

The images appear without visible photo labels or captions, as requested. Provenance is retained in the category `image.licence` fields in `content/catalogue.json`, with accessible descriptive alt text. Photography can later be replaced through each category’s `image.src` and `image.alt` fields. No project testimonials, stock levels, certifications or lead times were invented.

## Final visual review

ROUND 3

Seen in one second: a green architectural wordmark, large material-supply typography and coordinated material photography on white.

Idea: GLANHEIM’s drawing-led material package becomes a visitor-built supply brief.

Live thing: package selections flow into a real enquiry; role selection and image-study controls work on touch and desktop.

Layout words by section: hero = editorial image study / collections = uneven photographic pair / scope = green working brief / process = disclosures / service = role selector / questions = photo and answers / footer = split photo and navigation.

Scores: design **7.7** · usability **8.2** · creativity **7.0** · content **8.0** → weighted overall **7.7/10**. This is an internal critique, not an external award or certification.

Caps applied: creativity is capped at 7 because the material-procurement device can also suit another supplier. No unresolved failure caps apply.

Remaining limitations:

1. No genuine business footage is supplied. Unrelated stock video would imply an unverified operation, so still photography and controlled image movement are used.
2. The material inspector warns about mixed-font headings because category navigation arrows use a symbol font. The heading words themselves use one serif face; these arrows identify real links.
3. The material palette is deliberately comprehensive and long on mobile. Search, collection links, filters and page contents support access to its categories.

Every final inspector screenshot for the homepage, About Us and material palette was opened at 1440, 768 and 390 pixels, including all full-page sheets. No clipped headings, failed reveals, broken images or horizontal overflow were observed.

## Measurements

| Check                                   | Before                           | Final                                   |
| --------------------------------------- | -------------------------------- | --------------------------------------- |
| Homepage Taste browser failures         | 14                               | 0                                       |
| Homepage Taste browser warnings         | 9                                | 1: no footage                           |
| About Us Taste browser failures         | Baseline not separately measured | 0                                       |
| About Us Taste browser warnings         | Baseline not separately measured | 1: no footage                           |
| Material palette Taste browser failures | Baseline not separately measured | 0                                       |
| Material palette Taste browser warnings | Baseline not separately measured | 2: functional symbol arrows; no footage |
| Application source Taste lint           | Baseline not separately measured | 0 failures, 0 warnings                  |

## Release validation

Production build and TypeScript checking passed, as did ESLint, content/image validation, eight service/content tests and 34 desktop/mobile Playwright checks. Browser checks cover all public routes, accessible main pages, the larger navigation at 320/390/768/1440 pixels, category images, filtering, selection carry-through, disclosure controls, generic company copy, form validation, failure fallback and signed receipt templates. A crawl of 50 pages checked 97 distinct internal destinations with zero broken links.

Live Resend delivery, Dropbox uploads and Netlify deployment are separate from local validation. No external email or upload test is claimed. Follow `README.md` and `LAUNCH-CHECKLIST.md` before enabling automated enquiries or representing supplier-specific product information as verified.

## Subsequent copy preference

The owner requested restoration of the original homepage headline, “Materials without compromise.” The existing layout, typography, green PDF logo and remaining content are retained. This owner-supplied headline takes precedence over the earlier two-word trial headline and the skill’s preferred headline length.
