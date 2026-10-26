# Launch checklist

Status as of 2026-10-26: **preview-ready, not production-ready.** The items under "Launch blockers" must be resolved before the domain is pointed at Vercel.

## Launch blockers

- [ ] **Contact form backend.** Deferred by the agency; no provider has been chosen. Every page's form renders, but submission is disabled and visitors are told to call or book instead. To connect: choose an approved provider (for example HIPAAtizer or another service that will sign a BAA), set `PUBLIC_FORM_ENDPOINT` in Vercel, confirm the field names the provider expects (`name`, `email`, `phone`, `source`, `message`, honeypot `website`), redeploy, then send a test submission from each page type and confirm it **arrives in the inbox**. The form only shows a success message after the endpoint returns a 2xx response.
- [ ] **Form disclaimer wording.** The note under the form ("…This form is not for emergencies. If you are in crisis, call 911 or call or text 988.") was drafted for this build because no approved wording existed on the live site. Approve or replace it in `src/components/mdx/ContactForm.astro`.
- [ ] **Release of Information.** `/release-of-information/` (in the live Resources menu) and the two intake-form pages are password-protected in WordPress, so their content could not be retrieved. They are not built and the menu link was removed. Decide on a replacement (for example a Jane App form) and add it before launch so clients are not sent to a 404.
- [ ] **`/group-therapy/`.** The live page is unfinished Lorem ipsum placeholder text, so it was not published (it will 404). Supply real copy, or choose a redirect target and add it in `scripts/redirects.mjs`.
- [ ] **Blog carry-over decision.** Per the questionnaire ("the most recent post for each specialty/modality page"), 12 posts were kept and the other 84 now 301 to their category's service page. Retiring 84 indexed URLs can lose search traffic and backlinks. Confirm this before launch; any post can be restored by re-importing it into `src/content/blog/` and removing it from `scripts/retired-posts.json`.
- [ ] **Domain and redirects.** In Vercel: add `www.traumahealingtherapy.com` (primary) and `traumahealingtherapy.com` (redirect to www), update DNS at the registrar, and confirm HTTPS. Then test on the production domain: `http://` → `https://www.`, apex → `www`, `/emdr-therapy` → `/emdr-therapy/`, a retired post URL, a deep path with a query string, and a non-existent URL (must return 404, not the homepage).

## Content to review (CW / client)

Copy was transferred word for word from the live site. These issues already exist on the live site or come from the structural changes the brief requires; none were rewritten without approval.

- **Service H1s** now add the location (for example "EMDR Therapy in Cupertino, CA"); see `docs/route-inventory.md`. The homepage H1 "Therapy in Cupertino, CA & Online Across California" is new (the live homepage had no H1). Keyword research was not supplied, so focus keywords follow the live titles and are unverified.
- **San Francisco wording.** `/emdr-therapy/` body copy ends with "…offers in-person and online EMDR therapy for clients in Cupertino and San Francisco…", which could be read as in-person care in San Francisco. Flag to CW for revision. (Its meta description had the same issue and was rewritten: "In person in Cupertino and online in San Francisco and across California.") Other live meta descriptions say "Located in Cupertino and San Francisco", matching how the live site lists both offices; they were kept.
- **Dr. Mariella Lauriola is not accepting new clients**, but `/terapia-in-italiano/` and `/emotionally-focused-therapy-eft/` are written in her first person, and the Good Faith Estimate page says "Start moving toward a new, fulfilling path with Dr. Mariella Lauriola". The old geo/office meta descriptions that named her were replaced.
- **"No Waitlist"** on the homepage vs. Dr. Julianna Bianes' "Currently has a waitlist".
- **Dr. Bianes' child age range** is "6+" on one version of the live team page and "8+" on her bio and the other version. The build uses 8+.
- **Rates & Fees** lists fees for Dr. Bianes and Claudia Narváez-Meza only, not Alyssa Hurtado.
- **Jane App links differ by page**: most use treatment 154, the FAQ uses treatment 12, Rates & Fees uses treatment 11, and one ADHD link goes to staff member 9. Confirm which are current.
- **Clinician ↔ service links** (which therapists appear on which service page) were derived from each bio's published focus areas, because no explicit list exists. Confirm in `src/content/clinicians/*.mdx` → `services`.
- **Older approach pages** (Flash Technique, Psychodynamic, Hypnotherapy, Client-Centered/Humanistic, EFT) are kept at their URLs, indexable, and linked from Our Team → "Other Approaches" rather than the main menu. Their copy is short (about 100–170 words) and none of them is in the agreed primary navigation; CW may want to refresh or consolidate them.
- **`/relationships/`, `/italiano/`, `/trauma/`** (WordPress archive-style pages) are rebuilt as `noindex` post listings and left out of the sitemap.
- **Testimonials** are carried over as on the live site. Psychologist ethics codes and state boards restrict the use of client testimonials; the practice may want to confirm they are comfortable keeping them.
- **Fixes made while transferring**: Steph Abe's "Read Full Bio" button pointed to Tuyet's bio; photo alt text on two bios read "Amber Stewart"; "For the the fastest way" and "will be with your shortly" typos; a broken `cms.gov/nosuprises` link; tracking parameters stripped from Jane links; old links to `/contact-me/` and `/free-consultation-request/` now go straight to `/contact-us/`.
- **Google reviews widget removed.** The live Trauma Therapy page embeds a Trustindex Google-reviews widget; the first migration pass had scraped it in as raw text, which has now been removed. If the practice wants it back, add the Trustindex embed code as a component rather than copying review text into the page.
- **Design-layer wording added in the redesign** (eyebrows and section titles only, no service copy changed): "How we help", "Not sure? Get matched", "Meet the people who will walk alongside you", "Insights for your healing", "Visit or meet online", "Get started", "Keep reading", "Your therapist", "At a glance", "Ready to talk?", "More from our toolkit", "Near Cupertino", hero fact chips ("In person in Cupertino", "Online in San Francisco & across California", "Free consultation"), and Italian equivalents on Italian pages ("Consulenza gratuita", "Scopri di più", "Pronto per iniziare?", "min di lettura"). Italic emphasis on parts of existing headings is styling only.
- **New interface wording** written for this build (headings and labels only): "Clinicians Who Offer …", "Services … Offers", "Other Approaches", "Communities We Serve", "Send us a message", the "In person in Cupertino · Online in San Francisco and across California" hero line, the geo office note, and Italian labels "I nostri terapeuti", "Contattaci", "Di". Meta descriptions were written for the 23 pages that had none.

## Integrations

- [ ] **Google Tag Manager** `GTM-5956LCKN` (found on the live site) loads on production builds only. Confirm the container's tags (GA4 etc.), that no tag reads form fields, and remove any old WordPress-specific triggers. Buttons carry `data-cta="consultation"` / `data-cta="contact"` for click triggers; a click is not a confirmed booking or submission.
- [ ] **Search Console**: no verification tag was found on the live site; verify with a DNS (domain) property. After launch, submit `https://www.traumahealingtherapy.com/sitemap.xml` and review indexing of the core pages.
- [ ] **Jane App** booking links: click through each variant above.
- [ ] **Mentaya** widget on `/rates-insurance/` (embed copied from the live page) and the `mentaya.co/b/o0REePusDeDgQe41bfKn` benefits link: confirm both still work for the practice.
- [ ] **Google Maps embeds** for both offices were copied from the live site's GBP embeds; confirm they open the correct profiles.
- [ ] **YouTube videos** (welcome video, Cupertino office video, EMDR Intensives video) are click-to-play and use youtube-nocookie.com.
- [ ] **Hours** (Mon–Fri 8AM–8PM, from the live office pages) are shown on the office pages but deliberately not added to structured data; add them in `src/lib/schema.ts` if they reflect real availability.

## External actions (not done by code)

- [ ] GBP: confirm ownership/verification of both profiles (SF is online-only; follow Google's eligibility rules), align name/address/phone/hours/website with the site, set the Jane link as the appointment URL, review categories, services and description, add photos (agency standard: at least 10), add product/service cards linking to the service pages, and post an initial update from an approved blog post. Ongoing weekly posting and checks are maintenance.
- [ ] Keep Psychology Today and other directory listings consistent with the site.
- [ ] Coordinate any Google Ads landing-page URLs with the agency (retired posts now redirect).
- [ ] Old image URLs under `/wp-content/uploads/` will stop working after cutover. Images now ship inside the site.

## What was verified for this handoff

| Check | Result |
|---|---|
| `npm install` | OK, 0 vulnerabilities reported |
| `npm run check` (astro check) | 0 errors, 0 warnings, 0 hints |
| `npm run build` | 59 pages, all images optimized |
| `npm run audit` | 59 pages: exactly one H1 each, correct canonicals, every internal link resolves (pages or redirects), 59 JSON-LD blocks parse, every image has alt (empty for decorative), no `wp-content`/preview links |
| Production vs preview build | `VERCEL_ENV=production`: `index, follow`, GTM present, sitemap in robots.txt (54 URLs; archives, thank-you and 404 excluded). `preview`: `noindex, nofollow`, no GTM |
| Mobile layout | No horizontal overflow at 375px on 18 representative pages; mobile menu, submenus and Escape-to-close tested |
| Visual review | Desktop screenshots of homepage, specialty, team, bio, contact, geo, rates (Mentaya widget loads) and blog post |
| Colour contrast | Body text 14.7:1, links 9.0:1, button text 9.1:1, rose accent 5.2–5.9:1, form borders 3.7:1 |

**Not verified:** form delivery (no backend), the Vercel deployment itself and redirect behaviour on Vercel (configuration only), Lighthouse/Core Web Vitals, screen-reader testing, Google Rich Results validation, and external link checking (the live site started returning HTTP 403 to automated requests during the build).
