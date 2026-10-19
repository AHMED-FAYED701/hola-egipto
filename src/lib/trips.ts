import type { Cruise, Destination, Excursion, Guide, Tour } from '@/lib/content/types'
import type { Locale } from '@/i18n/routing'

import { formatPrice } from './format'
import { img, type Img } from './media'
import { docUrl, TRIP_TYPE, type TripCollection, type TripType } from './urls'

export type TripDoc = Tour | Cruise | Excursion

export interface TripCardData {
  id: number
  type: TripType
  collection: TripCollection
  href: string
  title: string
  image: Img | null
  duration: string
  destinations: string
  price: string | null
  basis: string
}

type T = (key: string, values?: Record<string, string | number>) => string

export function durationLabel(collection: TripCollection, doc: TripDoc, t: T): string {
  if (collection === 'tours') return t('days', { n: (doc as Tour).duration_days ?? 0 })
  if (collection === 'cruises') return t('nights', { n: (doc as Cruise).nights ?? 0 })
  return t('hours', { n: (doc as Excursion).duration_hours ?? 0 })
}

export function destinationNames(v: unknown): string[] {
  if (!Array.isArray(v)) return []
  return v.map((d) => (d && typeof d === 'object' && 'title' in d ? String((d as Destination).title) : '')).filter(Boolean)
}

/** Card model for a trip (needs depth ≥ 1 for image and destinations). `t` is the "trip" namespace. */
export function tripCard(doc: TripDoc, collection: TripCollection, locale: Locale, t: T): TripCardData {
  return {
    id: doc.id,
    type: TRIP_TYPE[collection],
    collection,
    href: docUrl(collection, doc.slug || '', locale),
    title: doc.title,
    image: img(doc.featured_image, 'card'),
    duration: durationLabel(collection, doc, t),
    destinations: destinationNames(doc.destinations).join(' · '),
    price: formatPrice(locale, doc.price_from_eur, doc.price_from_usd),
    basis: t(`basis_${doc.price_basis || 'per_person'}`),
  }
}

/** Resolve a polymorphic {relationTo, value} to [collection, doc] when populated. */
export function polyTrip(rel: unknown): [TripCollection, TripDoc] | null {
  if (!rel || typeof rel !== 'object') return null
  const r = rel as { relationTo?: string; value?: unknown }
  if (!r.relationTo || !r.value || typeof r.value !== 'object') return null
  if (r.relationTo !== 'tours' && r.relationTo !== 'cruises' && r.relationTo !== 'excursions') return null
  return [r.relationTo, r.value as TripDoc]
}

export interface GuideCardData {
  href: string
  title: string
  excerpt: string
  image: Img | null
  updated: string | null | undefined
}

export const isPopulated = <D extends { id: number }>(v: unknown): v is D => Boolean(v && typeof v === 'object' && 'id' in (v as object))
export type { Guide }
