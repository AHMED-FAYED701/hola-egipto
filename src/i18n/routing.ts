import { defineRouting } from 'next-intl/routing'

export const locales = ['es', 'en'] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = 'es'

/** Translated URL bases (contracts §5). Keys are the internal route folders under [locale]. */
export const pathnames = {
  '/': '/',
  '/tours': { es: '/viajes-a-egipto', en: '/egypt-tours' },
  '/tours/[slug]': { es: '/viajes-a-egipto/[slug]', en: '/egypt-tours/[slug]' },
  '/tours/duration/[term]': { es: '/viajes-a-egipto/duracion/[term]', en: '/egypt-tours/duration/[term]' },
  '/tours/style/[term]': { es: '/viajes-a-egipto/estilo/[term]', en: '/egypt-tours/style/[term]' },
  '/cruises': { es: '/cruceros-por-el-nilo', en: '/nile-cruises' },
  '/cruises/[slug]': { es: '/cruceros-por-el-nilo/[slug]', en: '/nile-cruises/[slug]' },
  '/cruises/type/[term]': { es: '/cruceros-por-el-nilo/tipo/[term]', en: '/nile-cruises/type/[term]' },
  '/excursions': { es: '/excursiones', en: '/excursions' },
  '/excursions/[slug]': { es: '/excursiones/[slug]', en: '/excursions/[slug]' },
  '/excursions/from/[city]': { es: '/excursiones/desde/[city]', en: '/excursions/from/[city]' },
  '/destinations': { es: '/destinos', en: '/destinations' },
  '/destinations/[slug]': { es: '/destinos/[slug]', en: '/destinations/[slug]' },
  '/destinations/region/[term]': { es: '/destinos/region/[term]', en: '/destinations/region/[term]' },
  '/guides': { es: '/guia-de-viaje', en: '/travel-guide' },
  '/guides/[slug]': { es: '/guia-de-viaje/[slug]', en: '/travel-guide/[slug]' },
  '/guides/topic/[term]': { es: '/guia-de-viaje/tema/[term]', en: '/travel-guide/topic/[term]' },
  '/search': { es: '/buscar', en: '/search' },
  '/[page]': '/[page]',
} as const

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: 'as-needed',
  localeDetection: false,
  localeCookie: false,
  alternateLinks: false,
  pathnames,
})

export const isLocale = (v: unknown): v is Locale => v === 'es' || v === 'en'
