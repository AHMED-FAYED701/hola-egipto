import 'server-only'

import type { Where } from '@/lib/content/types'

import type { Locale } from '@/i18n/routing'

import { findAvailableBySlug, findTermBySlug, listAvailable } from './content/read'
import type { TripDoc } from './trips'
import type { TripCollection } from './urls'

export const FILTER_KEYS = ['duration', 'style', 'dest', 'price_max', 'group', 'city', 'sort'] as const
export const PER_PAGE = 12

export type SP = Record<string, string | string[] | undefined>
export const sp = (params: SP, k: string) => {
  const v = params[k]
  return (Array.isArray(v) ? v[0] : v)?.trim() || ''
}

/** A filtered state is any filter parameter except `page` (contracts §5). */
export const isFiltered = (params: SP) => FILTER_KEYS.some((k) => sp(params, k))

export const pageNumber = (params: SP) => {
  const n = parseInt(sp(params, 'page'), 10)
  return Number.isFinite(n) && n >= 2 ? n : 1
}

export interface Preset {
  duration?: number
  style?: number
  cruiseType?: number
  city?: number
}

/** Server-side filtering of a trip archive (contracts §5). */
export async function queryTrips(collection: TripCollection, locale: Locale, params: SP, preset: Preset = {}) {
  const and: Where[] = []
  const duration = sp(params, 'duration')
  const style = sp(params, 'style')
  const dest = sp(params, 'dest')
  const priceMax = parseInt(sp(params, 'price_max'), 10)
  const group = sp(params, 'group')
  const city = sp(params, 'city')

  if (preset.duration) and.push({ duration: { equals: preset.duration } })
  else if (duration && collection === 'tours') {
    const t = await findTermBySlug('durations', duration, locale)
    and.push({ duration: { equals: t?.id ?? -1 } })
  }
  if (preset.style) and.push({ trip_style: { in: [preset.style] } })
  else if (style && collection !== 'excursions') {
    const t = await findTermBySlug('trip-styles', style, locale)
    and.push({ trip_style: { in: [t?.id ?? -1] } })
  }
  if (preset.cruiseType) and.push({ cruise_type: { equals: preset.cruiseType } })
  if (preset.city) and.push({ departure: { in: [preset.city] } })
  else if (city && collection === 'excursions') {
    const t = await findTermBySlug('departures', city, locale)
    and.push({ departure: { in: [t?.id ?? -1] } })
  }
  if (dest) {
    const d = await findAvailableBySlug('destinations', dest, locale, 0)
    and.push({ destinations: { in: [d?.id ?? -1] } })
  }
  if (Number.isFinite(priceMax) && priceMax > 0) {
    and.push({ [locale === 'es' ? 'price_from_eur' : 'price_from_usd']: { less_than_equal: priceMax } })
  }
  if (group === 'private' || group === 'small' || group === 'shared') and.push({ group_type: { equals: group } })

  const priceField = locale === 'es' ? 'price_from_eur' : 'price_from_usd'
  const durField = collection === 'tours' ? 'duration_days' : collection === 'cruises' ? 'nights' : 'duration_hours'
  const sortKey = sp(params, 'sort')
  const sort =
    sortKey === 'price_asc' ? priceField : sortKey === 'price_desc' ? `-${priceField}` : sortKey === 'duration' ? durField : ['-featured', priceField]

  const res = await listAvailable(collection, locale, {
    where: and.length ? { and } : undefined,
    sort: sort as string,
    limit: PER_PAGE,
    page: pageNumber(params),
    depth: 1,
  })
  return { ...res, docs: res.docs as TripDoc[] }
}

/** Query string for links that keep the current filters. */
export function withParams(params: SP, patch: Record<string, string | null>): string {
  const q = new URLSearchParams()
  for (const k of [...FILTER_KEYS, 'page']) {
    const v = k in patch ? patch[k] : sp(params, k)
    if (v) q.set(k, v)
  }
  const s = q.toString()
  return s ? `?${s}` : ''
}
