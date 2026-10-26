import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { SITE_URL } from '../data/site';
import { getServices, getClinicians, getPosts } from '../lib/content';

// Published, indexable, canonical pages only. Category archives, /thank-you/ and 404 are excluded.
// lastmod uses the real content dates recorded in each entry (never the build date).
export const GET: APIRoute = async () => {
  const urls: { path: string; lastmod?: Date }[] = [{ path: '/' }, { path: '/our-team/' }, { path: '/contact-us/' }, { path: '/blog/' }];
  for (const s of await getServices(['specialty', 'modality', 'approach'])) urls.push({ path: `/${s.id}/`, lastmod: s.data.updated });
  for (const c of await getClinicians()) urls.push({ path: `/${c.data.path}/`, lastmod: c.data.updated });
  for (const g of (await getCollection('geo')).filter((x) => !x.data.draft)) urls.push({ path: `/${g.id}/`, lastmod: g.data.updated });
  for (const l of await getCollection('locations')) urls.push({ path: `/${l.data.path}/`, lastmod: l.data.updated });
  for (const p of (await getCollection('pages')).filter((x) => !x.data.draft && !x.data.noindex)) urls.push({ path: `/${p.id}/`, lastmod: p.data.updated });
  for (const p of await getPosts()) urls.push({ path: `/${p.id}/`, lastmod: p.data.updated ?? p.data.published });

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${SITE_URL}${u.path}</loc>${u.lastmod ? `<lastmod>${u.lastmod.toISOString().slice(0, 10)}</lastmod>` : ''}</url>`).join('\n')}
</urlset>
`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
