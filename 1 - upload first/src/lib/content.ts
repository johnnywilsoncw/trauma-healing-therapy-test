import { getCollection, type CollectionEntry } from 'astro:content';

export type Service = CollectionEntry<'services'>;
export type Clinician = CollectionEntry<'clinicians'>;
export type Post = CollectionEntry<'blog'>;

const published = <T extends { data: { draft?: boolean } }>(items: T[]) => items.filter((i) => !i.data.draft);

export async function getServices(kinds: Service['data']['kind'][] = ['specialty', 'modality']) {
  const all = published(await getCollection('services'));
  return all.filter((s) => kinds.includes(s.data.kind)).sort((a, b) => a.data.order - b.data.order);
}

export async function getClinicians() {
  return published(await getCollection('clinicians')).sort((a, b) => a.data.order - b.data.order);
}

export async function getPosts() {
  const services = new Set(published(await getCollection('services')).map((s) => s.id));
  const posts = published(await getCollection('blog'));
  // Posts whose category page is unpublished stay out of listings and routes.
  return posts.filter((p) => services.has(p.data.category.id)).sort((a, b) => b.data.published.valueOf() - a.data.published.valueOf());
}

/** Clinicians who list this service on their record (relationship lives on the clinician). */
export async function cliniciansForService(serviceId: string) {
  return (await getClinicians()).filter((c) => c.data.services.some((s) => s.id === serviceId));
}

export async function postsForService(serviceId: string, limit = 3) {
  return (await getPosts()).filter((p) => p.data.category.id === serviceId).slice(0, limit);
}

export const clinicianName = (c: Clinician) =>
  [c.data.honorific, c.data.name].filter(Boolean).join(' ') + (c.data.credentials ? `, ${c.data.credentials}` : '');

/**
 * All root-level routes come from several collections. This throws during the build if two
 * entries claim the same URL, or a reference points to a missing/unpublished entry.
 */
export async function assertUniqueRoutes(extraStatic: string[] = []) {
  const seen = new Map<string, string>();
  const add = (slug: string, owner: string) => {
    if (seen.has(slug)) throw new Error(`Duplicate URL "/${slug}/" claimed by ${seen.get(slug)} and ${owner}`);
    seen.set(slug, owner);
  };
  extraStatic.forEach((s) => add(s, 'src/pages'));
  (await getServices(['specialty', 'modality', 'approach'])).forEach((s) => add(s.id, `services/${s.id}`));
  (await getClinicians()).forEach((c) => add(c.data.path, `clinicians/${c.id}`));
  published(await getCollection('geo')).forEach((g) => add(g.id, `geo/${g.id}`));
  (await getCollection('locations')).forEach((l) => add(l.data.path, `locations/${l.id}`));
  published(await getCollection('pages')).forEach((p) => add(p.id, `pages/${p.id}`));
  (await getPosts()).forEach((p) => add(p.id, `blog/${p.id}`));

  const serviceIds = new Set((await getServices(['specialty', 'modality', 'approach'])).map((s) => s.id));
  const clinicianIds = new Set((await getClinicians()).map((c) => c.id));
  for (const c of await getClinicians()) {
    for (const s of c.data.services) if (!serviceIds.has(s.id)) throw new Error(`clinicians/${c.id} lists unknown service "${s.id}"`);
  }
  for (const p of published(await getCollection('blog'))) {
    if (!clinicianIds.has(p.data.author.id)) throw new Error(`blog/${p.id} has unknown author "${p.data.author.id}"`);
  }
  return seen;
}
