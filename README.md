# Trauma Healing Therapy website

Astro rebuild of https://www.traumahealingtherapy.com for deployment on Vercel. Static output, no CMS, no database, minimal JavaScript (menu, form validation, click-to-play video).

- **Stack:** Astro 7.4, MDX, Astro image optimization (sharp), self-hosted Fraunces + Figtree fonts. Node 24.
- **Status:** preview-ready. Read [`docs/launch-checklist.md`](docs/launch-checklist.md) before launch: the contact form has no backend yet and several items need a decision.

## Commands

| Command | What it does |
|---|---|
| `npm install` | Install dependencies (uses the committed `package-lock.json`) |
| `npm run dev` | Local dev server at http://localhost:4321 |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Serve the built `dist/` locally |
| `npm run check` | Type-check Astro files and content schemas |
| `npm run audit` | After a build: checks H1s, canonicals, internal links, JSON-LD, alt text |
| `npm run redirects` | Regenerate `vercel.json` and `docs/redirect-map.md` from `scripts/redirects.mjs` |

Local builds are treated as previews (every page gets `noindex`). To inspect production output locally, run the build with `VERCEL_ENV=production`.

## Project layout

```
src/
  content/          All page copy (MDX). See docs/content-guide.md
    services/       Specialty, modality and older approach pages
    clinicians/     Team bios
    blog/           Blog posts
    geo/            Nearby-community pages (served from Cupertino)
    locations/      The two offices (directions)
    pages/          FAQ, Rates & Fees, Testimonials, legal pages
  content.config.ts Schemas and relationships (validated at build time)
  data/site.ts      Practice facts: phone, booking link, offices, maps, env flags
  assets/           Logo and all images downloaded from the live site
  components/       Header, footer, cards, form, maps, FAQ, etc.
  layouts/          One layout per page type
  pages/            Homepage, team, contact, blog index, sitemap.xml, robots.txt, [slug] router
scripts/            Redirect generator and post-build audit
docs/               Content guide, route inventory, redirect map, launch checklist
vercel.json         Generated: redirects, trailing slashes, security and cache headers
```

## Deploy: GitHub → Vercel

1. Create an empty private GitHub repository, then from this folder:
   ```bash
   git init
   git add .
   git commit -m "Initial Astro build"
   git branch -M main
   git remote add origin https://github.com/YOUR-ORG/trauma-healing-therapy.git
   git push -u origin main
   ```
2. In Vercel: **Add New → Project → Import** the repository. The framework preset is **Astro**; build command `npm run build`, output `dist` (both also set in `vercel.json`). Node version comes from `package.json` (`24.x`).
3. **Environment variables** (Project → Settings → Environment Variables), see `.env.example`:
   - `PUBLIC_FORM_ENDPOINT`: leave empty until the form provider is approved (launch blocker).
   - `PUBLIC_GTM_ID`: optional; defaults to the live container `GTM-5956LCKN`. Set to `none` to disable.
4. Deploy and review the **preview URL**. Preview deployments are `noindex` and do not load GTM.
5. When the launch checklist is complete: add `www.traumahealingtherapy.com` as the primary domain and `traumahealingtherapy.com` redirecting to it, update DNS, then run the post-launch checks in the checklist. Production builds (`VERCEL_ENV=production`) are indexable and include the sitemap in `robots.txt`.

This is a static site; no Vercel adapter is needed. Add one only if a future feature needs server rendering.

## SEO implementation summary

- Existing URLs and trailing slashes are preserved. Changed or retired URLs have permanent redirects (`docs/redirect-map.md`).
- One H1 per page; titles follow *Service | City, State | Practice*; unique meta descriptions; canonicals always use `https://www.traumahealingtherapy.com`.
- JSON-LD: `ProfessionalService` for the practice and each office, `Service` per service page, `Person` per bio, `BlogPosting` with author per post. Facts come from `src/data/site.ts`; unknown values (ratings, prices, opening hours) are omitted.
- `sitemap.xml` lists only published, indexable pages with their real last-modified dates.
- Content hubs: each service page shows related posts (by post `category`) and the clinicians who list that service; posts link back to their service and to the author's bio; office pages link to geo pages.

## Maintenance

- Publish posts at the agreed cadence; give each one a `category` and a natural link to its service page.
- Test the contact form at least monthly once connected (confirm inbox delivery, not only the on-page message).
- Review indexing of core pages in Search Console and rankings for the real service + city terms.
- Fix broken links when reported; keep images reasonably sized (originals are optimized at build).
- Keep `src/data/site.ts`, GBP and directory listings in sync whenever hours, phone or addresses change.
- Run `npm run check`, `npm run build` and `npm run audit` before every push.

Dependency updates: `npm outdated`, update, then run the three commands above.
