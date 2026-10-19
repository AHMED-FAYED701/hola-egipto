/**
 * Slug indexes for the interceptor's 404 answers, the sitemap and `hola:urls` (contracts §5, §9, §10).
 */
import { and, eq, isNotNull } from 'drizzle-orm'

import { getDb } from '@/db/client'
import { locales, type Locale } from '@/i18n/routing'
import type { RouteIndex } from '@/lib/route-match'
import { archiveUrl, docUrl, FIXED_PAGES, homeUrl, pageUrl, termUrl } from '@/lib/urls'

import { countAvailable } from './read'
import { CONTENT, type ContentCollection, TABLES, TAXONOMIES, type TaxonomyCollection } from './tables'

/** Taxonomy → [collection that references it, relation field] (terms are listed only when they have items). */
export const TERM_SOURCES: Record<TaxonomyCollection, [ContentCollection, string]> = {
  durations: ['tours', 'duration'],
  'trip-styles': ['tours', 'trip_style'],
  'cruise-types': ['cruises', 'cruise_type'],
  departures: ['excursions', 'departure'],
  regions: ['destinations', 'region'],
  'guide-topics': ['guides', 'guide_topic'],
}

type SlugRow = { id: number; locale: string; slug: string | null; available: boolean; updated: Date | null; template?: string }

async function slugRows(ent: ContentCollection | TaxonomyCollection | 'pages', onlyAvailable: boolean): Promise<SlugRow[]> {
  const { main, i18n } = TABLES[ent]
  const cols = {
    id: main.id,
    locale: i18n.locale,
    slug: i18n.slug,
    available: i18n.available,
    updated: main.updated_at,
    ...(ent === 'pages' ? { template: main.template } : {}),
  }
  return (await getDb()
    .select(cols)
    .from(main)
    .innerJoin(i18n, eq(i18n.entity_id, main.id))
    .where(onlyAvailable ? and(eq(i18n.available, true), isNotNull(i18n.slug)) : isNotNull(i18n.slug))) as SlugRow[]
}

/** Every existing public slug per collection and locale (read by src/proxy.ts through /api/hola/routes). */
export async function routeIndex(): Promise<RouteIndex> {
  const index: RouteIndex = { single: {}, term: {}, page: { es: [], en: [] } }
  await Promise.all([
    ...CONTENT.map(async (c) => {
      const rows = await slugRows(c, true)
      index.single[c] = { es: [], en: [] }
      for (const r of rows) index.single[c][r.locale as Locale]?.push(r.slug as string)
    }),
    ...TAXONOMIES.map(async (t) => {
      const rows = await slugRows(t, false)
      index.term[t] = { es: [], en: [] }
      for (const r of rows) index.term[t][r.locale as Locale]?.push(r.slug as string)
    }),
    (async () => {
      for (const r of await slugRows('pages', true)) if (r.template !== 'home') index.page[r.locale as Locale]?.push(r.slug as string)
    })(),
  ])
  return index
}

export interface UrlPair {
  urls: Partial<Record<Locale, string>>
  lastModified?: Date | null
}

/** Groups of URLs per item (both languages), for the sitemap and `hola:urls`. */
export async function publicUrls(): Promise<{ home: UrlPair[]; archive: UrlPair[]; single: UrlPair[]; term: UrlPair[]; page: (UrlPair & { index: boolean })[] }> {
  const home: UrlPair[] = [{ urls: { es: homeUrl('es'), en: homeUrl('en') } }]
  const archive: UrlPair[] = CONTENT.map((c) => ({ urls: { es: archiveUrl(c, 'es'), en: archiveUrl(c, 'en') } }))

  const single: UrlPair[] = []
  for (const c of CONTENT) {
    const byId = new Map<number, UrlPair>()
    for (const r of await slugRows(c, true)) {
      const p = byId.get(r.id) ?? { urls: {}, lastModified: r.updated }
      p.urls[r.locale as Locale] = docUrl(c, r.slug as string, r.locale as Locale)
      byId.set(r.id, p)
    }
    single.push(...byId.values())
  }

  const term: UrlPair[] = []
  for (const tax of TAXONOMIES) {
    const [coll, field] = TERM_SOURCES[tax]
    const byId = new Map<number, UrlPair>()
    for (const r of await slugRows(tax, false)) {
      const n = await countAvailable(coll, r.locale as Locale, { [field]: { in: [r.id] } })
      if (!n) continue
      const p = byId.get(r.id) ?? { urls: {} }
      p.urls[r.locale as Locale] = termUrl(tax, r.slug as string, r.locale as Locale)
      byId.set(r.id, p)
    }
    term.push(...byId.values())
  }

  // Fixed pages: the contract slugs (§5), served when the page exists and is available.
  const avail = new Map<string, Date | null>()
  for (const r of await slugRows('pages', true)) avail.set(`${r.locale}|${r.slug}`, r.updated)
  const page = Object.values(FIXED_PAGES).map((p) => {
    const urls: Partial<Record<Locale, string>> = {}
    let lastModified: Date | null = null
    for (const l of locales) {
      if (!avail.has(`${l}|${p[l]}`)) continue
      urls[l] = pageUrl(p[l], l)
      lastModified = avail.get(`${l}|${p[l]}`) ?? lastModified
    }
    return { urls, lastModified, index: p.index }
  })
  return { home, archive, single, term, page }
}
