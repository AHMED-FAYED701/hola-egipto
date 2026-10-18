import type { Locale } from '@/i18n/routing'

import { siteUrl } from './site'

/** Localized URL builders (contracts §5). Every path starts and ends with "/". */

export type ContentCollection = 'tours' | 'cruises' | 'excursions' | 'destinations' | 'guides'
export type TaxonomyCollection = 'durations' | 'trip-styles' | 'cruise-types' | 'departures' | 'regions' | 'guide-topics'
export type TripCollection = 'tours' | 'cruises' | 'excursions'
export type TripType = 'tour' | 'cruise' | 'excursion'

const prefix = (locale: Locale) => (locale === 'en' ? '/en' : '')

export const ARCHIVE_BASE: Record<ContentCollection, Record<Locale, string>> = {
  tours: { es: 'viajes-a-egipto', en: 'egypt-tours' },
  cruises: { es: 'cruceros-por-el-nilo', en: 'nile-cruises' },
  excursions: { es: 'excursiones', en: 'excursions' },
  destinations: { es: 'destinos', en: 'destinations' },
  guides: { es: 'guia-de-viaje', en: 'travel-guide' },
}

/** Taxonomy → [archive collection, term segment per locale]. */
export const TERM_BASE: Record<TaxonomyCollection, { archive: ContentCollection; seg: Record<Locale, string> }> = {
  durations: { archive: 'tours', seg: { es: 'duracion', en: 'duration' } },
  'trip-styles': { archive: 'tours', seg: { es: 'estilo', en: 'style' } },
  'cruise-types': { archive: 'cruises', seg: { es: 'tipo', en: 'type' } },
  departures: { archive: 'excursions', seg: { es: 'desde', en: 'from' } },
  regions: { archive: 'destinations', seg: { es: 'region', en: 'region' } },
  'guide-topics': { archive: 'guides', seg: { es: 'tema', en: 'topic' } },
}

export const TRIP_TYPE: Record<TripCollection, TripType> = { tours: 'tour', cruises: 'cruise', excursions: 'excursion' }
export const TRIP_COLLECTION: Record<TripType, TripCollection> = { tour: 'tours', cruise: 'cruises', excursion: 'excursions' }

export const homeUrl = (locale: Locale) => (locale === 'en' ? '/en/' : '/')

export const archiveUrl = (collection: ContentCollection, locale: Locale) =>
  `${prefix(locale)}/${ARCHIVE_BASE[collection][locale]}/`

export const docUrl = (collection: ContentCollection, slug: string, locale: Locale) =>
  `${prefix(locale)}/${ARCHIVE_BASE[collection][locale]}/${slug}/`

export const termUrl = (taxonomy: TaxonomyCollection, slug: string, locale: Locale) => {
  const t = TERM_BASE[taxonomy]
  return `${prefix(locale)}/${ARCHIVE_BASE[t.archive][locale]}/${t.seg[locale]}/${slug}/`
}

export const pageUrl = (slug: string, locale: Locale) => `${prefix(locale)}/${slug}/`

export const searchUrl = (locale: Locale) => (locale === 'en' ? '/en/search/' : '/buscar/')

/** Fixed page slugs (contracts §5), keyed by a stable id. */
export const FIXED_PAGES = {
  'plan-my-trip': { es: 'planifica-tu-viaje', en: 'plan-my-trip', template: 'plan-my-trip', index: true },
  'thank-you': { es: 'gracias', en: 'thank-you', template: 'thank-you', index: false },
  about: { es: 'sobre-nosotros', en: 'about-us', template: 'about', index: true },
  contact: { es: 'contacto', en: 'contact', template: 'contact', index: true },
  faq: { es: 'preguntas-frecuentes', en: 'faq', template: 'faq', index: true },
  'legal-notice': { es: 'aviso-legal', en: 'legal-notice', template: 'legal', index: true },
  privacy: { es: 'politica-de-privacidad', en: 'privacy-policy', template: 'legal', index: true },
  cookies: { es: 'politica-de-cookies', en: 'cookie-policy', template: 'legal', index: true },
  terms: { es: 'condiciones-y-cancelacion', en: 'terms-and-cancellation', template: 'legal', index: true },
} as const
export type FixedPageKey = keyof typeof FIXED_PAGES

export const fixedPageUrl = (key: FixedPageKey, locale: Locale) => pageUrl(FIXED_PAGES[key][locale], locale)

export const absolute = (path: string) => siteUrl() + path

export const otherLocale = (locale: Locale): Locale => (locale === 'es' ? 'en' : 'es')
