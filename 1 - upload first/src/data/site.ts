// Central practice facts. Every value here was taken from the live site
// (https://www.traumahealingtherapy.com) on 2026-10-26. Change facts here, not in layouts.

export const SITE_URL = 'https://www.traumahealingtherapy.com';

export const practice = {
  name: 'Trauma Healing Therapy',
  legalName: 'Mariella Lauriola Psychologist Inc, DBA Trauma Healing Therapy',
  phone: '(408) 389-4075',
  phoneHref: 'tel:+14083894075',
  phoneE164: '+14083894075',
  // Shared booking destination used by every "Free Consultation" button on the live site.
  bookingUrl: 'https://traumahealingtherapy.janeapp.com/#/discipline/2/treatment/154',
  mentayaUrl: 'https://mentaya.co/b/o0REePusDeDgQe41bfKn',
  mentayaWidgetUrl: 'https://app.mentaya.com/public/practices/pGF8gBwF5wnYnmXiSte6/eligibility/widget',
  serviceArea: 'We offer online therapy to clients in the State of California',
  responseTime: 'Our team will respond typically within 24–48 hours.',
  sameAs: [
    'https://www.psychologytoday.com/us/therapists/trauma-healing-therapy-cupertino-ca/778701',
    'https://www.facebook.com/DrMariella',
    'https://www.linkedin.com/in/dr-mariella-lauriola-ph-d-47774a54/',
  ],
  psychologyTodayUrl: 'https://www.psychologytoday.com/us/therapists/trauma-healing-therapy-cupertino-ca/778701',
};

export type OfficeId = 'cupertino' | 'san-francisco';

export const offices: Record<OfficeId, {
  id: OfficeId;
  name: string;
  city: string;
  slug: string;
  inPerson: boolean;
  availability: string;
  street: string;
  locality: string;
  region: string;
  postalCode: string;
  hours: string;
  // Google Business Profile map embeds copied from the live site.
  mapEmbed: string;
  mapLink: string;
  geo: { lat: number; lng: number };
}> = {
  cupertino: {
    id: 'cupertino',
    name: 'Cupertino Office',
    city: 'Cupertino',
    slug: 'cupertino-ca',
    inPerson: true,
    availability: 'In Person & Online Available',
    street: '21710 Stevens Creek Blvd #140',
    locality: 'Cupertino',
    region: 'CA',
    postalCode: '95014',
    hours: 'Monday – Friday: 8AM – 8PM',
    mapEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3172.8377342528393!2d-122.05679992378488!3d37.32267117210275!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8a0fda4582381cd5%3A0x34a1faeb03b81aaf!2sTrauma%20Healing%20Therapy!5e0!3m2!1sen!2sus!4v1718373138312!5m2!1sen!2sus',
    mapLink: 'https://www.google.com/maps/search/?api=1&query=Trauma+Healing+Therapy+21710+Stevens+Creek+Blvd+140+Cupertino+CA+95014',
    geo: { lat: 37.3226712, lng: -122.054225 },
  },
  'san-francisco': {
    id: 'san-francisco',
    name: 'San Francisco Office',
    city: 'San Francisco',
    slug: 'san-francisco-ca',
    inPerson: false,
    availability: 'Online Services Only',
    street: '2211 Post St #300',
    locality: 'San Francisco',
    region: 'CA',
    postalCode: '94115',
    hours: 'Monday – Friday: 8AM – 8PM',
    mapEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.2424535307227!2d-122.44089642387908!3d37.784357411607566!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x808581c810c12d13%3A0x7c7b1c2de706e50f!2sTrauma%20Healing%20Therapy%20SF!5e0!3m2!1sen!2sus!4v1717446257702!5m2!1sen!2sus',
    mapLink: 'https://www.google.com/maps/search/?api=1&query=Trauma+Healing+Therapy+SF+2211+Post+St+300+San+Francisco+CA+94115',
    geo: { lat: 37.7843532, lng: -122.4383215 },
  },
};

export const fullAddress = (id: OfficeId) => {
  const o = offices[id];
  return `${o.street}, ${o.locality}, ${o.region} ${o.postalCode}`;
};

// Footer legal links (existing URLs, including the original /hippa-policy/ slug).
export const legalLinks = [
  { label: 'Privacy Policy', href: '/privacy-policy/' },
  { label: 'Terms of Use', href: '/terms-of-use/' },
  { label: 'Good Faith Estimate', href: '/good-faith-estimate/' },
  { label: 'HIPAA Policy', href: '/hippa-policy/' },
];

// Build-time environment. Vercel sets VERCEL_ENV to production/preview/development.
const vercelEnv = import.meta.env.VERCEL_ENV ?? process.env.VERCEL_ENV;
export const IS_PRODUCTION = vercelEnv === 'production' || import.meta.env.SITE_INDEXABLE === 'true';
// GTM container found on the live site. Override with PUBLIC_GTM_ID, or set it to "none" to disable.
const gtm = import.meta.env.PUBLIC_GTM_ID ?? 'GTM-5956LCKN';
export const GTM_ID: string | undefined = gtm && gtm !== 'none' ? gtm : undefined;
export const FORM_ENDPOINT: string | undefined = import.meta.env.PUBLIC_FORM_ENDPOINT || undefined;
