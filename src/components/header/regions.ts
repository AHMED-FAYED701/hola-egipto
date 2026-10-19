import 'server-only'

import type { Locale } from '@/i18n/routing'
import { listTerms } from '@/lib/content/read'
import { termUrl } from '@/lib/urls'

import { type MapRegion, REGION_KEYS } from '../EgyptMap'

/** Region links for the SVG map, in the page language. */
export async function getMapRegions(locale: Locale): Promise<MapRegion[]> {
  const [es, here] = await Promise.all([listTerms('regions', 'es'), listTerms('regions', locale)])
  const byId = new Map(here.map((r) => [r.id, r]))
  return es
    .filter((r) => r.slug && REGION_KEYS[r.slug])
    .map((r) => {
      const loc = byId.get(r.id)
      return {
        key: REGION_KEYS[r.slug as string],
        label: loc?.name || r.name,
        href: loc?.slug ? termUrl('regions', loc.slug, locale) : null,
      }
    })
}
