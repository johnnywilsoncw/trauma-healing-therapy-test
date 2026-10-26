// Post-build checks over dist/: internal links, one H1, canonical, robots, JSON-LD, alt text.
// Usage: npm run build && npm run audit
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const DIST = new URL('../dist/', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');
const SITE = 'https://www.traumahealingtherapy.com';
const vercel = JSON.parse(readFileSync(new URL('../vercel.json', import.meta.url), 'utf8'));
const redirectSources = new Set(vercel.redirects.map((r) => r.source));

const pages = [];
const walk = (d) => readdirSync(d).forEach((f) => {
  const p = join(d, f);
  if (statSync(p).isDirectory()) walk(p);
  else if (f.endsWith('.html')) pages.push(p);
});
walk(DIST);

const problems = [];
const exists = (path) => {
  const clean = decodeURI(path.split('#')[0].split('?')[0]);
  if (redirectSources.has(clean)) return true;
  if (clean === '/') return existsSync(join(DIST, 'index.html'));
  if (/\.[a-z0-9]+$/i.test(clean)) return existsSync(join(DIST, clean));
  return existsSync(join(DIST, clean, 'index.html'));
};
let jsonLd = 0;
for (const file of pages) {
  const rel = '/' + relative(DIST, file).split(sep).join('/').replace(/index\.html$/, '');
  const html = readFileSync(file, 'utf8');
  const h1s = (html.match(/<h1[\s>]/g) || []).length;
  if (h1s !== 1) problems.push(`${rel}: ${h1s} <h1> elements`);
  const canonical = (html.match(/<link rel="canonical" href="([^"]+)"/) || [])[1];
  if (!canonical) problems.push(`${rel}: missing canonical`);
  else if (rel !== '/404.html' && canonical !== SITE + rel) problems.push(`${rel}: canonical ${canonical}`);
  if (!/<meta name="description"/.test(html) && !/noindex/.test(html)) problems.push(`${rel}: missing meta description`);
  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try { JSON.parse(m[1]); jsonLd++; } catch (e) { problems.push(`${rel}: invalid JSON-LD (${e.message})`); }
  }
  for (const m of html.matchAll(/<img\b[^>]*>/g)) {
    if (!/\salt(=|\s|>)/.test(m[0])) problems.push(`${rel}: <img> without alt ${m[0].slice(0, 80)}`);
    // only optimized local images and YouTube thumbnails are expected
    const src = (m[0].match(/\ssrc="([^"]+)"/) || [])[1] || '';
    if (/^https?:/.test(src) && !src.startsWith('https://i.ytimg.com/')) problems.push(`${rel}: external image ${src.slice(0, 80)}`);
  }
  for (const m of html.matchAll(/\shref="([^"]+)"/g)) {
    const href = m[1].replace(/&amp;/g, '&');
    if (href.startsWith('/') && !href.startsWith('//') && !href.startsWith('/_astro/') && !exists(href)) problems.push(`${rel}: broken link ${href}`);
    if (/traumahealingtherapy\.com\/(?!$)/.test(href) && !href.includes('janeapp') && !/canonical/.test(m.input.slice(m.index - 30, m.index))) problems.push(`${rel}: absolute self link ${href}`);
    if (/wp-content|vercel\.app|localhost/.test(href)) problems.push(`${rel}: suspicious link ${href}`);
  }
}
console.log(`${pages.length} HTML files checked, ${jsonLd} JSON-LD blocks parsed.`);
if (problems.length) {
  console.log(`${problems.length} problem(s):`);
  problems.forEach((p) => console.log(' - ' + p));
  process.exitCode = 1;
} else console.log('No problems found.');
