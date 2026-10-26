import type { APIRoute } from 'astro';
import { SITE_URL, IS_PRODUCTION } from '../data/site';

// Production: crawl everything and point to the sitemap. Previews are kept out of the index
// with a noindex meta tag on every page (and Vercel's own preview X-Robots-Tag), so they are
// NOT blocked here: crawlers must be able to read that noindex.
export const GET: APIRoute = () =>
  new Response(
    ['User-agent: *', 'Allow: /', '', ...(IS_PRODUCTION ? [`Sitemap: ${SITE_URL}/sitemap.xml`] : []), ''].join('\n'),
    { headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
  );
