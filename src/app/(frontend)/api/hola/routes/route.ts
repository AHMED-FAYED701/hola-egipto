import { locales, type Locale } from '@/i18n/routing'
import { getPayloadClient } from '@/lib/payload'
import type { RouteIndex } from '@/lib/route-match'
import type { ContentCollection, TaxonomyCollection } from '@/lib/urls'

export const dynamic = 'force-dynamic'

const CONTENT: ContentCollection[] = ['tours', 'cruises', 'excursions', 'destinations', 'guides']
const TAXONOMIES: TaxonomyCollection[] = ['durations', 'trip-styles', 'cruise-types', 'departures', 'regions', 'guide-topics']

/** Every existing public slug per collection and locale; read by src/proxy.ts to answer unknown URLs with 404. */
export async function GET() {
  const payload = await getPayloadClient()
  const index: RouteIndex = { single: {}, term: {}, page: { es: [], en: [] } }
  const slugs = async (collection: ContentCollection | TaxonomyCollection | 'pages', locale: Locale, available: boolean) => {
    const res = await payload.find({
      collection,
      locale,
      depth: 0,
      limit: 1000,
      pagination: false,
      select: { slug: true, ...(collection === 'pages' ? { template: true } : {}) },
      where: available ? { available: { equals: true } } : { slug: { exists: true } },
    })
    return res.docs as { slug?: string | null; template?: string | null }[]
  }
  await Promise.all(
    locales.flatMap((locale) => [
      ...CONTENT.map(async (c) => {
        index.single[c] ??= { es: [], en: [] }
        index.single[c][locale] = (await slugs(c, locale, true)).map((d) => d.slug).filter((s): s is string => Boolean(s))
      }),
      ...TAXONOMIES.map(async (t) => {
        index.term[t] ??= { es: [], en: [] }
        index.term[t][locale] = (await slugs(t, locale, false)).map((d) => d.slug).filter((s): s is string => Boolean(s))
      }),
      (async () => {
        index.page[locale] = (await slugs('pages', locale, true))
          .filter((d) => d.template !== 'home')
          .map((d) => d.slug)
          .filter((s): s is string => Boolean(s))
      })(),
    ]),
  )
  return Response.json(index, { headers: { 'Cache-Control': 'no-store' } })
}
