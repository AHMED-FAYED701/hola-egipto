import config from '@payload-config'
import { getPayload } from 'payload'

import type { Locale } from '../../src/i18n/routing'
import {
  archiveUrl,
  type ContentCollection,
  docUrl,
  FIXED_PAGES,
  homeUrl,
  pageUrl,
  type TaxonomyCollection,
  termUrl,
} from '../../src/lib/urls'
import { done, out } from './_lib'

/** TSV rows `group lang path expect index` for every URL to test (contracts §9). */
const payload = await getPayload({ config })
const LOCALES: Locale[] = ['es', 'en']
const CONTENT: ContentCollection[] = ['tours', 'cruises', 'excursions', 'destinations', 'guides']
// taxonomy → [collection holding the relation, relation field]
const TERM_SOURCES: Record<TaxonomyCollection, [ContentCollection, string]> = {
  durations: ['tours', 'duration'],
  'trip-styles': ['tours', 'trip_style'],
  'cruise-types': ['cruises', 'cruise_type'],
  departures: ['excursions', 'departure'],
  regions: ['destinations', 'region'],
  'guide-topics': ['guides', 'guide_topic'],
}
const rows: string[][] = []
const row = (group: string, lang: Locale, path: string, expect: number, index: 0 | 1) =>
  rows.push([group, lang, path, String(expect), String(index)])

for (const l of LOCALES) row('home', l, homeUrl(l), 200, 1)
for (const c of CONTENT) for (const l of LOCALES) row('archive', l, archiveUrl(c, l), 200, 1)

for (const c of CONTENT) {
  for (const l of LOCALES) {
    const res = await payload.find({ collection: c, locale: l, depth: 0, limit: 1000, pagination: false, where: { available: { equals: true } } })
    for (const d of res.docs) if (d.slug) row('single', l, docUrl(c, d.slug, l), 200, 1)
  }
}

for (const [tax, [coll, field]] of Object.entries(TERM_SOURCES) as [TaxonomyCollection, [ContentCollection, string]][]) {
  for (const l of LOCALES) {
    const terms = await payload.find({ collection: tax, locale: l, depth: 0, limit: 1000, pagination: false })
    for (const t of terms.docs) {
      if (!t.slug) continue
      const n = await payload.count({
        collection: coll,
        locale: l,
        where: { and: [{ available: { equals: true } }, { [field]: { in: [t.id] } }] },
      })
      if (n.totalDocs > 0) row('term', l, termUrl(tax, t.slug, l), 200, 1)
    }
  }
}

for (const p of Object.values(FIXED_PAGES)) for (const l of LOCALES) row('page', l, pageUrl(p[l], l), 200, p.index ? 1 : 0)

row('search', 'es', '/buscar/?q=luxor', 200, 0)
row('search', 'en', '/en/search/?q=luxor', 200, 0)
row('404', 'es', '/viajes-a-egipto/no-existe-hola-404/', 404, 0)
row('404', 'en', '/en/egypt-tours/no-existe-hola-404/', 404, 0)

out(rows.map((r) => r.join('\t')).join('\n'))
done()
