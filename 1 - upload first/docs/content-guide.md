# Content editing guide

All content lives in `src/content/` as `.mdx` files (Markdown with a few components). Layouts never need editing to add or change content. After any change, run `npm run build && npm run audit` before pushing.

The file name is the URL. `src/content/services/anxiety-therapy.mdx` is published at `/anxiety-therapy/`. Clinicians and offices are the exception: their URL is the `path` field, so existing URLs such as `/meet-steph-abe/` are kept.

Practice facts (phone, booking link, addresses, office hours, map embeds, Mentaya links) live in **`src/data/site.ts`**. Change them there once and every page, the footer, the top bar and the structured data update together.

## Collections

| Folder | What it holds | Key fields |
|---|---|---|
| `services/` | Specialty, modality and older approach pages | `kind` (`specialty` / `modality` / `approach`), `navLabel`, `order`, `h1`, `card.image` (homepage tile), `banner` |
| `clinicians/` | Team bios | `path` (URL), `group` (`therapist` / `support` / `founder`), `services` (service IDs this person offers), `status`, `availability` |
| `blog/` | Blog posts | `category` (one service ID), `author` (clinician ID), `published`, `updated`, `heroImage` |
| `geo/` | Nearby communities served from Cupertino (not offices) | `city`, `h1` |
| `locations/` | The two real offices; body holds the directions | `path`, `welcomeVideo`, `officeVideo` |
| `pages/` | FAQ, Rates & Fees, Testimonials, legal pages | `group` (`page` / `legal`), `noindex` |

Every collection accepts `draft: true`. Draft entries are excluded from routes, menus, listings and the sitemap.

## How relationships work

- **Service page → blog posts.** A post's `category` is the ID of its service page. That page's "From Our Blog" section automatically shows up to three newest published posts in that category. The section is hidden if there are none.
- **Service page → clinicians.** A clinician's `services` list drives the "Clinicians Who Offer …" cards on each service page and the "Services … Offers" cards on the bio. Edit the list on the clinician, not on the service.
- **Blog post → bio.** `author` links the byline to the clinician's bio. No author archive pages are generated.
- **Office page → geo pages.** Every published geo page is listed on `/cupertino-ca/` and `/contact-us/`.
- The build fails if two entries claim the same URL or a reference points to a missing entry.

## Components you can use inside MDX

| Component | Use |
|---|---|
| `<Section variant="default" tone="paper">…</Section>` | Service pages only: one layout band. Put a photo in `<div slot="media">` (blank lines around the Markdown image) to show it beside the text; add `flip` to swap sides. `variant="faq"` puts a `<div slot="aside">` heading beside the questions, `variant="form"` puts `<ContactForm slot="media" />` beside the heading, `variant="closing"` is the dark centered call to action. `tone` is `paper`, `tint`, `sand` or `dark`. Copy one of the existing service files to see the pattern. |
| `<CtaPair />` | Free Consultation + Contact Us buttons |
| `<Button href="/contact-us/" label="Contact Us" />` | One button |
| `<ContactForm />` | Inquiry form (see the form note in the launch checklist) |
| `<Faq question="…">Answer in Markdown</Faq>` | Expandable question |
| `<YouTube id="VIDEO_ID" title="…" />` | Click-to-play video (nothing loads until clicked) |
| `<MapEmbed office="cupertino" />` | Google Business Profile map (`cupertino` or `san-francisco`) |
| `<MentayaWidget />` | Out-of-network benefits checker |
| `<GeoServices city="…" />`, `<OfficeCard city="…" />` | Geo pages only |

## Add a blog post

1. Put the image in `src/assets/blog/` (JPG or PNG; it is resized and converted automatically).
2. Create `src/content/blog/your-post-slug.mdx`:

```mdx
---
title: "How EMDR Helps With Panic Attacks"
description: "One or two sentences for search results (about 150 characters)."
category: "emdr-therapy"
author: "julianna-bianes"
published: "2026-11-05"
heroImage: "../../assets/blog/emdr-panic.jpg"
heroAlt: "Woman breathing calmly by a window"
---

Opening paragraph…

## A subheading

Body copy with a natural link to [EMDR therapy in Cupertino](/emdr-therapy/).
```

3. The post appears on `/blog/`, on its service page, in the sitemap, and gets a Contact button at the end automatically. Set `updated:` only when the post's content really changes.

## Add a specialty or modality page

CounselingWise supplies the copy. Create `src/content/services/new-slug.mdx` with the frontmatter used by the existing pages (copy one and change the values), paste the approved copy, and use `<CtaPair />`, `<ContactForm />` and `<Faq>` where the layout calls for them. The hero, location section, related posts, clinician cards and closing contact block are added by the layout. Set `kind: "specialty"` or `kind: "modality"` so it appears in the right menu, and give it a `card` image to appear on the homepage and geo pages. Then add the new ID to the relevant clinicians' `services`.

## Add or update a clinician

Copy an existing file in `src/content/clinicians/`, change `path` to the URL you want, add a photo under `src/assets/`, and list the service IDs they offer. Set `draft: true` to hide someone without deleting their file.

## Add a geo page

Copy a file in `src/content/geo/` and write unique local copy and verified directions. Do not reuse another city's paragraphs with the name swapped, and never describe the area as having an office.

## Redirects

Edit `scripts/redirects.mjs` (or `scripts/retired-posts.json`), then run `npm run redirects` to regenerate `vercel.json` and `docs/redirect-map.md`. Point every redirect at a final URL.
