import type { MetadataRoute } from 'next'

import type { Locale } from '@/i18n/routing'
import { getPayloadClient } from '@/lib/payload'
import { siteUrl } from '@/lib/site'
import { archiveUrl, type ContentCollection, docUrl, FIXED_PAGES, homeUrl, pageUrl, type TaxonomyCollection, termUrl } from '@/lib/urls'

export const dynamic = 'force-dynamic'

const LOCALES: Locale[] = ['es', 'en']
const CONTENT: ContentCollection[] = ['tours', 'cruises', 'excursions', 'destinations', 'guides']
const TERM_SOURCES: Record<TaxonomyCollection, [ContentCollection, string]> = {
  durations: ['tours', 'duration'],
  'trip-styles': ['tours', 'trip_style'],
  'cruise-types': ['cruises', 'cruise_type'],
  departures: ['excursions', 'departure'],
  regions: ['destinations', 'region'],
  'guide-topics': ['guides', 'guide_topic'],
}

type Entry = MetadataRoute.Sitemap[number]

/** Every indexable, available URL in both languages, with xhtml:link alternates where both exist (contracts §10). */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl()
  const payload = await getPayloadClient()
  const out: Entry[] = []
  const pair = (urls: Partial<Record<Locale, string>>, lastModified?: string | Date) => {
    const both = urls.es && urls.en
    for (const l of LOCALES) {
      const u = urls[l]
      if (!u) continue
      out.push({
        url: base + u,
        lastModified,
        ...(both ? { alternates: { languages: { es: base + urls.es, en: base + urls.en, 'x-default': base + urls.es } } } : {}),
      })
    }
  }

  pair({ es: homeUrl('es'), en: homeUrl('en') })
  for (const c of CONTENT) pair({ es: archiveUrl(c, 'es'), en: archiveUrl(c, 'en') })

  for (const c of CONTENT) {
    const all = await payload.find({ collection: c, locale: 'all', depth: 0, limit: 1000, pagination: false })
    for (const d of all.docs as unknown as { slug: Record<Locale, string | null>; available: Record<Locale, boolean | null>; updatedAt: string }[]) {
      const urls: Partial<Record<Locale, string>> = {}
      for (const l of LOCALES) if (d.available?.[l] && d.slug?.[l]) urls[l] = docUrl(c, d.slug[l] as string, l)
      pair(urls, d.updatedAt)
    }
  }

  for (const [tax, [coll, field]] of Object.entries(TERM_SOURCES) as [TaxonomyCollection, [ContentCollection, string]][]) {
    const terms = await payload.find({ collection: tax, locale: 'all', depth: 0, limit: 1000, pagination: false })
    for (const t of terms.docs as unknown as { id: number; slug: Record<Locale, string | null> }[]) {
      const urls: Partial<Record<Locale, string>> = {}
      for (const l of LOCALES) {
        if (!t.slug?.[l]) continue
        const n = await payload.count({ collection: coll, locale: l, where: { and: [{ available: { equals: true } }, { [field]: { in: [t.id] } }] } })
        if (n.totalDocs > 0) urls[l] = termUrl(tax, t.slug[l] as string, l)
      }
      pair(urls)
    }
  }

  const pages = await payload.find({ collection: 'pages', locale: 'all', depth: 0, limit: 100, pagination: false })
  const indexable = new Set<string>(Object.values(FIXED_PAGES).filter((p) => p.index).map((p) => p.template))
  for (const p of pages.docs as unknown as { template: string; slug: Record<Locale, string | null>; available: Record<Locale, boolean | null>; updatedAt: string }[]) {
    if (p.template === 'home' || !indexable.has(p.template)) continue
    const urls: Partial<Record<Locale, string>> = {}
    for (const l of LOCALES) if (p.available?.[l] && p.slug?.[l]) urls[l] = pageUrl(p.slug[l] as string, l)
    pair(urls, p.updatedAt)
  }
  return out
}
