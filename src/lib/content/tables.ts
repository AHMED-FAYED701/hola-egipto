/** Logical collection name → Drizzle tables (contracts §4). */
import * as s from '@/db/schema'
import type { ContentCollection, TaxonomyCollection, TripCollection } from '@/lib/urls'

export type { ContentCollection, TaxonomyCollection, TripCollection, TripType } from '@/lib/urls'
export { TRIP_COLLECTION, TRIP_TYPE } from '@/lib/urls'
export type Ent = ContentCollection | 'pages' | TaxonomyCollection

/* eslint-disable @typescript-eslint/no-explicit-any */
export type AnyTable = any
/* eslint-enable @typescript-eslint/no-explicit-any */

export const TABLES: Record<Ent, { main: AnyTable; i18n: AnyTable }> = {
  tours: { main: s.tours, i18n: s.tours_i18n },
  cruises: { main: s.cruises, i18n: s.cruises_i18n },
  excursions: { main: s.excursions, i18n: s.excursions_i18n },
  destinations: { main: s.destinations, i18n: s.destinations_i18n },
  guides: { main: s.guides, i18n: s.guides_i18n },
  pages: { main: s.pages, i18n: s.pages_i18n },
  durations: { main: s.durations, i18n: s.durations_i18n },
  'trip-styles': { main: s.trip_styles, i18n: s.trip_styles_i18n },
  'cruise-types': { main: s.cruise_types, i18n: s.cruise_types_i18n },
  departures: { main: s.departures, i18n: s.departures_i18n },
  regions: { main: s.regions, i18n: s.regions_i18n },
  'guide-topics': { main: s.guide_topics, i18n: s.guide_topics_i18n },
}

export const TAXONOMIES: TaxonomyCollection[] = ['durations', 'trip-styles', 'cruise-types', 'departures', 'regions', 'guide-topics']
export const CONTENT: ContentCollection[] = ['tours', 'cruises', 'excursions', 'destinations', 'guides']
export const TRIPS: TripCollection[] = ['tours', 'cruises', 'excursions']

export const isTaxonomy = (e: string): e is TaxonomyCollection => (TAXONOMIES as string[]).includes(e)
export const isTrip = (e: string): e is TripCollection => (TRIPS as string[]).includes(e)
