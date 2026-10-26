import { defineCollection, reference } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const mdx = (base: string) => glob({ pattern: '**/[^_]*.mdx', base: `./src/content/${base}` });
const isoDate = z.coerce.date();

// Specialty, modality and older "approach" pages. The file name is the URL slug.
const services = defineCollection({
  loader: mdx('services'),
  schema: ({ image }) => z.object({
    title: z.string(),
    description: z.string().optional(),
    kind: z.enum(['specialty', 'modality', 'approach']),
    navLabel: z.string(),
    order: z.number(),
    h1: z.string(),
    eyebrow: z.string().optional(),
    subtitle: z.string().optional(),
    locationLabel: z.string(),
    sfLabel: z.string().optional(),
    banner: image().optional(),
    card: z.object({ image: image(), alt: z.string() }).optional(),
    lang: z.enum(['en', 'it']).default('en'),
    draft: z.boolean().default(false),
    updated: isoDate.optional(),
  }),
});

const clinicians = defineCollection({
  loader: mdx('clinicians'),
  schema: ({ image }) => z.object({
    path: z.string(),
    name: z.string(),
    honorific: z.string().optional(),
    credentials: z.string().optional(),
    role: z.string(),
    roleSecondary: z.string().optional(),
    group: z.enum(['therapist', 'support', 'founder']),
    order: z.number(),
    status: z.string().optional(),
    availability: z.string().optional(),
    modalitiesSummary: z.string().optional(),
    populationsSummary: z.string().optional(),
    summary: z.string().optional(),
    locations: z.array(z.enum(['cupertino', 'san-francisco', 'online'])).default([]),
    services: z.array(reference('services')).default([]),
    photo: image(),
    bioPhoto: image().optional(),
    pronouns: z.string().optional(),
    psychologyToday: z.url().optional(),
    h1: z.string(),
    tagline: z.string().optional(),
    title: z.string(),
    description: z.string().optional(),
    readyIntro: z.string().optional(),
    draft: z.boolean().default(false),
    updated: isoDate.optional(),
  }),
});

const blog = defineCollection({
  loader: mdx('blog'),
  schema: ({ image }) => z.object({
    title: z.string(),
    description: z.string().optional(),
    // One primary category per post; it is the related specialty/modality ID.
    category: reference('services'),
    author: reference('clinicians'),
    published: isoDate,
    updated: isoDate.optional(),
    heroImage: image().optional(),
    heroAlt: z.string().optional(),
    lang: z.enum(['en', 'it']).default('en'),
    draft: z.boolean().default(false),
  }),
});

// Nearby communities served from the Cupertino office. These are not office locations.
const geo = defineCollection({
  loader: mdx('geo'),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    city: z.string(),
    h1: z.string(),
    draft: z.boolean().default(false),
    updated: isoDate.optional(),
  }),
});

// Actual offices. Address/hours/maps live in src/data/site.ts; the body holds directions.
const locations = defineCollection({
  loader: mdx('locations'),
  schema: z.object({
    path: z.string(),
    title: z.string(),
    description: z.string().optional(),
    h1: z.string(),
    welcomeVideo: z.string().optional(),
    officeVideo: z.string().optional(),
    updated: isoDate.optional(),
  }),
});

// Simple content pages (FAQ, rates, testimonials, legal).
const pages = defineCollection({
  loader: mdx('pages'),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    h1: z.string(),
    navLabel: z.string(),
    group: z.enum(['page', 'legal']),
    // true when the body is built from <Section> bands (rendered full width, not as an article)
    sections: z.boolean().default(false),
    noindex: z.boolean().default(false),
    draft: z.boolean().default(false),
    updated: isoDate.optional(),
  }),
});

export const collections = { services, clinicians, blog, geo, locations, pages };
