// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

// Canonical production origin. Used for canonicals, sitemap, social metadata and JSON-LD.
export default defineConfig({
  site: 'https://www.traumahealingtherapy.com',
  output: 'static',
  trailingSlash: 'always',
  build: { format: 'directory' },
  // HTML-aware whitespace (Astro 7 defaults to JSX rules, which drop spaces between inline elements).
  compressHTML: true,
  integrations: [mdx()],
  image: {
    responsiveStyles: true,
    layout: 'constrained',
  },
});
