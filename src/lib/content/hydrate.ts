/**
 * Row → document hydration. Builds the document shapes of ./types from the main row, the `_i18n` row of
 * one locale and the join tables, then (depth ≥ 1) populates relations with documents hydrated at depth − 1,
 * like the v2 Local API did. Unavailable related items are still populated; pages filter where needed.
 */
import { and, asc, eq, inArray } from 'drizzle-orm'

import { getDb } from '@/db/client'
import * as s from '@/db/schema'
import type { Locale } from '@/i18n/routing'

import { type Ent, isTaxonomy, isTrip, TABLES, TRIP_COLLECTION, TRIP_TYPE, type TripType } from './tables'
import type { Media } from './types'

/* eslint-disable @typescript-eslint/no-explicit-any */
type Row = Record<string, any>
type Doc = Record<string, any>
/* eslint-enable @typescript-eslint/no-explicit-any */

const uniq = (ids: (number | null | undefined)[]) => [...new Set(ids.filter((x): x is number => typeof x === 'number' && x > 0))]
const iso = (d: unknown) => (d instanceof Date ? d.toISOString() : d ? String(d) : null)
const arr = <T>(v: T[] | null | undefined): T[] => (Array.isArray(v) ? v : [])
const textList = (v: string[] | null | undefined) => arr(v).map((text, i) => ({ text, id: String(i + 1) }))
const withIds = <T extends object>(v: T[] | null | undefined) => arr(v).map((x, i) => ({ ...x, id: String(i + 1) }))

// ----------------------------------------------------------------- images
export function imageDoc(r: Row, locale: Locale): Media {
  return {
    id: r.id,
    path: r.path,
    url: r.path,
    alt: (locale === 'en' ? r.alt_en : r.alt_es) || '',
    alt_es: r.alt_es,
    alt_en: r.alt_en,
    width: r.width,
    height: r.height,
    holaSample: Boolean(r.hola_sample),
  }
}

export async function loadImages(ids: (number | null | undefined)[], locale: Locale): Promise<Map<number, Media>> {
  const list = uniq(ids)
  const out = new Map<number, Media>()
  if (!list.length) return out
  const rows = await getDb().select().from(s.images).where(inArray(s.images.id, list))
  for (const r of rows) out.set(r.id, imageDoc(r, locale))
  return out
}

// ------------------------------------------------------------------ joins
type JoinMap = Map<number, number[]>

async function joinIds(table: Row, ownerCol: string, targetCol: string, ids: number[], extra?: [string, string]): Promise<JoinMap> {
  const out: JoinMap = new Map()
  if (!ids.length) return out
  const cond = extra ? and(inArray(table[ownerCol], ids), eq(table[extra[0]], extra[1])) : inArray(table[ownerCol], ids)
  const rows = (await getDb()
    .select()
    .from(table as typeof s.trip_destinations)
    .where(cond)
    .orderBy(asc(table.position), asc(table.id))) as Row[]
  for (const r of rows) {
    const k = r[ownerCol] as number
    if (!out.has(k)) out.set(k, [])
    out.get(k)!.push(r[targetCol] as number)
  }
  return out
}

type PolyRef = { relationTo: 'tours' | 'cruises' | 'excursions'; value: number }

async function relatedTrips(ownerType: string, ids: number[]): Promise<Map<number, PolyRef[]>> {
  const out = new Map<number, PolyRef[]>()
  if (!ids.length) return out
  const rows = await getDb()
    .select()
    .from(s.related_trips)
    .where(and(eq(s.related_trips.owner_type, ownerType), inArray(s.related_trips.owner_id, ids)))
    .orderBy(asc(s.related_trips.position), asc(s.related_trips.id))
  for (const r of rows) {
    const coll = TRIP_COLLECTION[r.trip_type as TripType]
    if (!coll) continue
    if (!out.has(r.owner_id)) out.set(r.owner_id, [])
    out.get(r.owner_id)!.push({ relationTo: coll, value: r.trip_id })
  }
  return out
}

// ------------------------------------------------------------ base docs
function common(m: Row, t: Row | undefined) {
  return {
    id: m.id as number,
    title: (t?.title as string) ?? '',
    slug: (t?.slug as string | null) ?? null,
    available: Boolean(t?.available),
    excerpt: (t?.excerpt as string | null) ?? null,
    featured_image: (m.featured_image_id as number | null) ?? null,
    seo: { meta_title: t?.seo_meta_title ?? null, meta_description: t?.seo_meta_description ?? null, og_image: m.seo_og_image_id ?? null },
    holaSample: Boolean(m.hola_sample),
    createdAt: iso(m.created_at),
    updatedAt: iso(m.updated_at),
  }
}

function tripBase(m: Row, t: Row | undefined) {
  return {
    ...common(m, t),
    subtitle: t?.subtitle ?? null,
    overview: t?.overview ?? null,
    gallery: arr<number>(m.gallery),
    price_from_eur: m.price_from_eur ?? null,
    price_from_usd: m.price_from_usd ?? null,
    price_basis: m.price_basis ?? null,
    price_note: t?.price_note ?? null,
    group_type: m.group_type ?? null,
    group_min: m.group_min ?? null,
    group_max: m.group_max ?? null,
    guide_languages: arr<string>(m.guide_languages),
    highlights: textList(t?.highlights),
    itinerary: withIds<Row>(t?.itinerary).map((it) => ({ ...it, places: arr<number>(it.places), meals: arr<string>(it.meals) })),
    includes: textList(t?.includes),
    excludes: textList(t?.excludes),
    what_to_bring: textList(t?.what_to_bring),
    availability_days: arr<string>(m.availability_days),
    season_note: t?.season_note ?? null,
    cancellation_policy: m.cancellation_policy ?? null,
    cancellation_override: t?.cancellation_override ?? null,
    faq: withIds<Row>(t?.faq),
    booking_mode: m.booking_mode ?? 'inquiry',
    booking_url: m.booking_url ?? null,
    last_reviewed: m.last_reviewed ?? null,
    featured: Boolean(m.featured),
  }
}

function taxonomyDoc(ent: Ent, m: Row, t: Row | undefined): Doc {
  const d: Doc = {
    id: m.id,
    name: t?.name ?? '',
    slug: t?.slug ?? null,
    available: Boolean(t?.available),
    hero: m.hero_id ?? null,
    h1: t?.h1 ?? null,
    intro: t?.intro ?? null,
    seo_text: t?.seo_text ?? null,
    faq: withIds<Row>(t?.faq),
    sort: m.sort ?? 0,
    updatedAt: iso(m.updated_at),
    createdAt: iso(m.created_at),
  }
  if (ent === 'durations') Object.assign(d, { min_days: m.min_days ?? null, max_days: m.max_days ?? null })
  if (ent === 'departures') d.destination = m.destination_id ?? null
  return d
}

// --------------------------------------------------------------- hydrate
export interface HydrateOpts {
  locale: Locale
  depth: number
}

/** Documents of `ent` by id (order of `ids` kept; missing ids dropped). */
export async function hydrate(ent: Ent, ids: number[], opts: HydrateOpts): Promise<Doc[]> {
  const list = uniq(ids)
  if (!list.length) return []
  const { main, i18n } = TABLES[ent]
  const db = getDb()
  const [mains, locs] = await Promise.all([
    db.select().from(main).where(inArray(main.id, list)) as Promise<Row[]>,
    db
      .select()
      .from(i18n)
      .where(and(inArray(i18n.entity_id, list), eq(i18n.locale, opts.locale))) as Promise<Row[]>,
  ])
  const tBy = new Map<number, Row>(locs.map((r) => [r.entity_id as number, r]))
  const docs = new Map<number, Doc>()

  if (isTaxonomy(ent)) {
    for (const m of mains) docs.set(m.id, taxonomyDoc(ent, m, tBy.get(m.id)))
  } else if (isTrip(ent)) {
    const type = TRIP_TYPE[ent]
    const [dest, rel, styles, deps, tg] = await Promise.all([
      joinIds(s.trip_destinations, 'trip_id', 'destination_id', list, ['trip_type', type]),
      relatedTrips(type, list),
      ent !== 'excursions' ? joinIds(s.trip_trip_styles, 'trip_id', 'trip_style_id', list, ['trip_type', type]) : Promise.resolve(new Map() as JoinMap),
      ent === 'excursions' ? joinIds(s.excursion_departures, 'excursion_id', 'departure_id', list) : Promise.resolve(new Map() as JoinMap),
      ent === 'tours' ? joinIds(s.tour_guides, 'tour_id', 'guide_id', list) : Promise.resolve(new Map() as JoinMap),
    ])
    for (const m of mains) {
      const t = tBy.get(m.id)
      const d: Doc = { ...tripBase(m, t), destinations: dest.get(m.id) || [], related_trips: rel.get(m.id) || [] }
      if (ent === 'tours') Object.assign(d, { duration_days: m.duration_days, duration: m.duration_id ?? null, trip_style: styles.get(m.id) || [], guides: tg.get(m.id) || [] })
      if (ent === 'cruises')
        Object.assign(d, {
          nights: m.nights,
          cruise_type: m.cruise_type_id ?? null,
          trip_style: styles.get(m.id) || [],
          ship_name: t?.ship_name ?? null,
          ship_category: m.ship_category ?? null,
          embark: m.embark_id ?? null,
          disembark: m.disembark_id ?? null,
          start_dates: withIds<Row>(t?.start_dates),
          cabins: withIds<Row>(t?.cabins),
          ship_facilities: arr<string>(m.ship_facilities),
          deck_plan: m.deck_plan_id ?? null,
        })
      if (ent === 'excursions')
        Object.assign(d, {
          duration_hours: m.duration_hours,
          departure: deps.get(m.id) || [],
          start_times: withIds<Row>(t?.start_times),
          pickup_areas: textList(t?.pickup_areas),
          child_price_eur: m.child_price_eur ?? null,
          child_price_usd: m.child_price_usd ?? null,
          min_age: m.min_age ?? null,
          activity_level: m.activity_level ?? null,
        })
      docs.set(m.id, d)
    }
  } else if (ent === 'destinations') {
    const nearby = await joinIds(s.destination_nearby, 'destination_id', 'nearby_id', list)
    for (const m of mains) {
      const t = tBy.get(m.id)
      docs.set(m.id, {
        ...common(m, t),
        content: t?.content ?? null,
        region: m.region_id ?? null,
        tagline: t?.tagline ?? null,
        best_months: arr<string>(m.best_months),
        days_recommended: m.days_recommended ?? null,
        how_to_get_there: t?.how_to_get_there ?? null,
        nearest_airport: t?.nearest_airport ?? null,
        top_sights: withIds<Row>(t?.top_sights),
        lat: m.lat ?? null,
        lng: m.lng ?? null,
        nearby: nearby.get(m.id) || [],
      })
    }
  } else if (ent === 'guides') {
    const [topics, gd, rel] = await Promise.all([
      joinIds(s.guide_guide_topics, 'guide_id', 'guide_topic_id', list),
      joinIds(s.guide_destinations, 'guide_id', 'destination_id', list),
      relatedTrips('guide', list),
    ])
    for (const m of mains) {
      const t = tBy.get(m.id)
      docs.set(m.id, {
        ...common(m, t),
        content: t?.content ?? null,
        guide_topic: topics.get(m.id) || [],
        last_updated: m.last_updated ?? null,
        toc: Boolean(m.toc),
        related_destinations: gd.get(m.id) || [],
        related_trips: rel.get(m.id) || [],
        author_name: t?.author_name ?? null,
      })
    }
  } else if (ent === 'pages') {
    for (const m of mains) {
      const t = tBy.get(m.id)
      docs.set(m.id, {
        ...common(m, t),
        content: t?.content ?? null,
        template: m.template,
        layout: withIds<Row>(t?.sections),
        faq_groups: withIds<Row>(t?.faq_groups).map((g) => ({ ...g, items: withIds<Row>(g.items) })),
        last_updated: m.last_updated ?? null,
      })
    }
  }

  if (opts.depth >= 1) await populate(ent, [...docs.values()], opts)
  return list.map((i) => docs.get(i)).filter((d): d is Doc => Boolean(d))
}

/** Replace relation ids by documents (depth − 1); images always become image docs. */
async function populate(ent: Ent, docs: Doc[], opts: HydrateOpts): Promise<void> {
  const next = { locale: opts.locale, depth: opts.depth - 1 }
  const imageIds: number[] = []
  const want: Partial<Record<Ent, number[]>> = {}
  const need = (e: Ent, ids: unknown) => {
    const l = (want[e] ??= [])
    for (const i of Array.isArray(ids) ? ids : [ids]) if (typeof i === 'number') l.push(i)
  }
  for (const d of docs) {
    imageIds.push(d.featured_image, d.seo?.og_image, d.hero, d.deck_plan, ...arr<number>(d.gallery))
    for (const sg of arr<Row>(d.top_sights)) imageIds.push(sg.image)
    if (ent === 'pages') {
      for (const b of arr<Row>(d.layout)) {
        imageIds.push(b.image)
        for (const mbr of arr<Row>(b.members)) imageIds.push(mbr.photo)
      }
    }
    if (isTrip(ent)) {
      need('destinations', d.destinations)
      for (const it of arr<Row>(d.itinerary)) need('destinations', it.places)
      for (const r of arr<PolyRef>(d.related_trips)) need(r.relationTo, r.value)
    }
    if (ent === 'tours') {
      need('durations', d.duration)
      need('trip-styles', d.trip_style)
      need('guides', d.guides)
    }
    if (ent === 'cruises') {
      need('cruise-types', d.cruise_type)
      need('trip-styles', d.trip_style)
      need('destinations', [d.embark, d.disembark])
    }
    if (ent === 'excursions') need('departures', d.departure)
    if (ent === 'destinations') {
      need('regions', d.region)
      need('destinations', d.nearby)
    }
    if (ent === 'guides') {
      need('guide-topics', d.guide_topic)
      need('destinations', d.related_destinations)
      for (const r of arr<PolyRef>(d.related_trips)) need(r.relationTo, r.value)
    }
    if (ent === 'departures') need('destinations', d.destination)
  }
  const [images, ...loaded] = await Promise.all([
    loadImages(imageIds, opts.locale),
    ...(Object.entries(want) as [Ent, number[]][]).map(async ([e, ids]) => [e, new Map((await hydrate(e, ids, next)).map((x) => [x.id as number, x]))] as const),
  ])
  const by = Object.fromEntries(loaded) as Partial<Record<Ent, Map<number, Doc>>>
  const one = (e: Ent, v: unknown) => (typeof v === 'number' ? (by[e]?.get(v) ?? null) : (v ?? null))
  const many = (e: Ent, v: unknown) => arr<unknown>(v as unknown[]).map((x) => one(e, x)).filter(Boolean)
  const img = (v: unknown) => (typeof v === 'number' ? (images.get(v) ?? null) : (v ?? null))

  for (const d of docs) {
    if ('featured_image' in d) d.featured_image = img(d.featured_image)
    if (d.seo) d.seo.og_image = img(d.seo.og_image)
    if ('hero' in d) d.hero = img(d.hero)
    if ('deck_plan' in d) d.deck_plan = img(d.deck_plan)
    if ('gallery' in d) d.gallery = arr<unknown>(d.gallery).map(img).filter(Boolean)
    if ('top_sights' in d) d.top_sights = arr<Row>(d.top_sights).map((sg) => ({ ...sg, image: img(sg.image) }))
    if (ent === 'pages')
      d.layout = arr<Row>(d.layout).map((b) => ({
        ...b,
        ...('image' in b ? { image: img(b.image) } : {}),
        ...(Array.isArray(b.members) ? { members: b.members.map((mb: Row) => ({ ...mb, photo: img(mb.photo) })) } : {}),
      }))
    if (isTrip(ent)) {
      d.destinations = many('destinations', d.destinations)
      d.itinerary = arr<Row>(d.itinerary).map((it) => ({ ...it, places: many('destinations', it.places) }))
      d.related_trips = arr<PolyRef>(d.related_trips)
        .map((r) => ({ relationTo: r.relationTo, value: one(r.relationTo, r.value) }))
        .filter((r) => r.value)
    }
    if (ent === 'tours') {
      d.duration = one('durations', d.duration)
      d.trip_style = many('trip-styles', d.trip_style)
      d.guides = many('guides', d.guides)
    }
    if (ent === 'cruises') {
      d.cruise_type = one('cruise-types', d.cruise_type)
      d.trip_style = many('trip-styles', d.trip_style)
      d.embark = one('destinations', d.embark)
      d.disembark = one('destinations', d.disembark)
    }
    if (ent === 'excursions') d.departure = many('departures', d.departure)
    if (ent === 'destinations') {
      d.region = one('regions', d.region)
      d.nearby = many('destinations', d.nearby)
    }
    if (ent === 'guides') {
      d.guide_topic = many('guide-topics', d.guide_topic)
      d.related_destinations = many('destinations', d.related_destinations)
      d.related_trips = arr<PolyRef>(d.related_trips)
        .map((r) => ({ relationTo: r.relationTo, value: one(r.relationTo, r.value) }))
        .filter((r) => r.value)
    }
    if (ent === 'departures') d.destination = one('destinations', d.destination)
  }
}
