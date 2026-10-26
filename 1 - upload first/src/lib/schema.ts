// Structured data built from the same confirmed facts the pages display.
// Opening hours are omitted: the live site lists office hours, but they have not been
// confirmed as appointment availability for every clinician. Add them in site.ts if approved.
import { SITE_URL, practice, offices, type OfficeId } from '../data/site';

export const ids = {
  practice: `${SITE_URL}/#practice`,
  website: `${SITE_URL}/#website`,
  office: (id: OfficeId) => `${SITE_URL}/${offices[id].slug}/#office`,
  person: (slug: string) => `${SITE_URL}/${slug}/#person`,
};

const postal = (id: OfficeId) => ({
  '@type': 'PostalAddress',
  streetAddress: offices[id].street,
  addressLocality: offices[id].locality,
  addressRegion: offices[id].region,
  postalCode: offices[id].postalCode,
  addressCountry: 'US',
});

export function practiceSchema(logoUrl: string) {
  return [
    {
      '@type': 'WebSite',
      '@id': ids.website,
      url: `${SITE_URL}/`,
      name: practice.name,
      publisher: { '@id': ids.practice },
    },
    {
      '@type': 'ProfessionalService',
      '@id': ids.practice,
      name: practice.name,
      legalName: practice.legalName,
      url: `${SITE_URL}/`,
      telephone: practice.phoneE164,
      logo: logoUrl,
      image: logoUrl,
      address: postal('cupertino'),
      geo: { '@type': 'GeoCoordinates', latitude: offices.cupertino.geo.lat, longitude: offices.cupertino.geo.lng },
      areaServed: { '@type': 'State', name: 'California' },
      sameAs: practice.sameAs,
      department: [{ '@id': ids.office('cupertino') }, { '@id': ids.office('san-francisco') }],
    },
  ];
}

export function officeSchema(id: OfficeId) {
  const o = offices[id];
  return {
    '@type': 'ProfessionalService',
    '@id': ids.office(id),
    name: id === 'san-francisco' ? `${practice.name} SF` : practice.name,
    url: `${SITE_URL}/${o.slug}/`,
    telephone: practice.phoneE164,
    address: postal(id),
    geo: { '@type': 'GeoCoordinates', latitude: o.geo.lat, longitude: o.geo.lng },
    parentOrganization: { '@id': ids.practice },
    ...(id === 'san-francisco' ? { description: 'Online services only.' } : {}),
  };
}

export function serviceSchema(opts: { url: string; name: string; description?: string }) {
  return {
    '@type': 'Service',
    '@id': `${opts.url}#service`,
    name: opts.name,
    serviceType: opts.name,
    url: opts.url,
    description: opts.description,
    provider: { '@id': ids.practice },
    areaServed: [{ '@type': 'City', name: 'Cupertino, CA' }, { '@type': 'State', name: 'California' }],
  };
}

export function personSchema(opts: { slug: string; name: string; jobTitle: string; image?: string; description?: string }) {
  return {
    '@type': 'Person',
    '@id': ids.person(opts.slug),
    name: opts.name,
    jobTitle: opts.jobTitle,
    url: `${SITE_URL}/${opts.slug}/`,
    image: opts.image,
    description: opts.description,
    worksFor: { '@id': ids.practice },
  };
}

export function articleSchema(opts: { url: string; headline: string; description?: string; image?: string; published: Date; updated?: Date; authorSlug: string; authorName: string; lang: string }) {
  return {
    '@type': 'BlogPosting',
    '@id': `${opts.url}#article`,
    headline: opts.headline,
    description: opts.description,
    image: opts.image,
    url: opts.url,
    mainEntityOfPage: opts.url,
    inLanguage: opts.lang === 'it' ? 'it-IT' : 'en-US',
    datePublished: opts.published.toISOString(),
    dateModified: (opts.updated ?? opts.published).toISOString(),
    author: { '@type': 'Person', '@id': ids.person(opts.authorSlug), name: opts.authorName, url: `${SITE_URL}/${opts.authorSlug}/` },
    publisher: { '@id': ids.practice },
  };
}
