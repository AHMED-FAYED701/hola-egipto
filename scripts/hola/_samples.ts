import type { Payload } from 'payload'

import { log } from './_lib'
import { paragraphsToLexical, toLexical } from './_rich'
import { CRUISES } from './data/cruises'
import { DESTINATIONS } from './data/destinations'
import { EXCURSIONS } from './data/excursions'
import { GUIDE as G1 } from './data/guides/when-to-travel'
import { GUIDE as G2 } from './data/guides/luxor-2-days'
import { GUIDE as G3 } from './data/guides/red-sea-snorkel'
import { TOURS } from './data/tours'
import type { L, TripSample } from './data/types'
import { ensurePlaceholders } from './_placeholders'

export const GUIDES = [G1, G2, G3]
export const TRIPS: TripSample[] = [...TOURS, ...CRUISES, ...EXCURSIONS]

const SAMPLE_COLLECTIONS = ['tours', 'cruises', 'excursions', 'destinations', 'guides', 'pages', 'inquiries', 'media'] as const
const LOCALIZED_COUNT = ['tours', 'cruises', 'excursions', 'destinations', 'guides'] as const
const ctx = { disableRevalidate: true }
const today = () => new Date().toISOString().slice(0, 10)

type Ids = Record<string, number>
type AnyData = Record<string, unknown>

/** Find a document by its Spanish slug. */
async function findBySlug(payload: Payload, collection: string, slug: string): Promise<number | null> {
  const res = await payload.find({ collection: collection as 'tours', locale: 'es', where: { slug: { equals: slug } }, limit: 1, depth: 0, overrideAccess: true })
  return res.docs[0]?.id ?? null
}

/** Create or update one document with shared data + per-locale data. Returns its id. */
export async function upsert(payload: Payload, collection: string, esSlug: string, shared: AnyData, loc: L<AnyData>): Promise<number> {
  const existing = await findBySlug(payload, collection, esSlug)
  let id: number
  if (existing) {
    await payload.update({ collection: collection as 'tours', id: existing, locale: 'es', data: { ...shared, ...loc.es }, overrideAccess: true, context: ctx })
    id = existing
  } else {
    const created = await payload.create({ collection: collection as 'tours', locale: 'es', data: { ...shared, ...loc.es } as never, overrideAccess: true, context: ctx })
    id = created.id
  }
  await payload.update({ collection: collection as 'tours', id, locale: 'en', data: loc.en, overrideAccess: true, context: ctx })
  return id
}

export async function termIds(payload: Payload, taxonomy: string): Promise<Ids> {
  const res = await payload.find({ collection: taxonomy as 'regions', locale: 'es', limit: 200, depth: 0, pagination: false, overrideAccess: true })
  return Object.fromEntries(res.docs.filter((d) => d.slug).map((d) => [d.slug as string, d.id]))
}

const pick = <T,>(v: L<T>, l: 'es' | 'en') => v[l]
const texts = (xs: string[]) => xs.map((text) => ({ text }))
const ref = (ids: Ids, keys: string[]) => keys.map((k) => ids[k]).filter((v): v is number => typeof v === 'number')

export async function createSamples(payload: Payload): Promise<void> {
  const media = await ensurePlaceholders(false)
  const m = (k: string) => {
    if (!(k in media)) throw new Error(`unknown media key ${k}`)
    return media[k]
  }
  const regions = await termIds(payload, 'regions')
  const styles = await termIds(payload, 'trip-styles')
  const cruiseTypes = await termIds(payload, 'cruise-types')
  const departures = await termIds(payload, 'departures')
  const topics = await termIds(payload, 'guide-topics')

  // 1. Destinations (nearby in a second pass)
  const dest: Ids = {}
  for (const d of DESTINATIONS) {
    const loc = (l: 'es' | 'en') => ({
      title: d.title[l],
      slug: d.slug[l],
      available: true,
      excerpt: d.excerpt[l],
      content: paragraphsToLexical(d.content[l]),
      tagline: d.tagline[l],
      how_to_get_there: d.how_to_get_there[l],
      nearest_airport: d.nearest_airport[l],
      top_sights: d.top_sights[l].map((s) => ({ ...s, image: m(s.image) })),
      seo: { meta_description: d.excerpt[l] },
    })
    dest[d.key] = await upsert(
      payload,
      'destinations',
      d.slug.es,
      {
        holaSample: true,
        featured_image: m(d.featured_image),
        region: regions[d.region] ?? null,
        best_months: d.best_months,
        days_recommended: d.days_recommended,
        lat: d.lat,
        lng: d.lng,
      },
      { es: loc('es'), en: loc('en') },
    )
    log(`destination ${d.slug.es}`)
  }
  for (const d of DESTINATIONS) {
    await payload.update({ collection: 'destinations', id: dest[d.key], data: { nearby: ref(dest, d.nearby) }, overrideAccess: true, context: ctx })
  }

  // 2. Guides (body with trip cards and related trips in a later pass)
  const guides: Ids = {}
  for (const g of GUIDES) {
    const loc = (l: 'es' | 'en') => ({
      title: g.title[l],
      slug: g.slug[l],
      available: true,
      excerpt: g.excerpt[l],
      content: toLexical(g.body[l]),
      last_updated: today(),
      author_name: l === 'es' ? '[pendiente]' : '[pending]',
      seo: { meta_description: g.excerpt[l] },
    })
    guides[g.key] = await upsert(
      payload,
      'guides',
      g.slug.es,
      {
        holaSample: true,
        featured_image: m(g.featured_image),
        guide_topic: g.guide_topic.map((s) => topics[s]).filter(Boolean),
        related_destinations: ref(dest, g.related_destinations),
        toc: true,
      },
      { es: loc('es'), en: loc('en') },
    )
    log(`guide ${g.slug.es}`)
  }

  // 3. Trips
  const trips: Ids = {}
  const tripCollection: Record<string, string> = {}
  for (const t of TRIPS) {
    tripCollection[t.key] = t.collection
    const loc = (l: 'es' | 'en'): AnyData => {
      const base: AnyData = {
        title: t.title[l],
        slug: t.slug[l],
        available: true,
        excerpt: t.excerpt[l],
        subtitle: t.subtitle[l],
        overview: paragraphsToLexical(t.overview[l]),
        price_note: t.price_note[l],
        highlights: texts(t.highlights[l]),
        itinerary: t.itinerary[l].map((it) => ({ ...it, places: ref(dest, it.places), overnight: it.overnight ?? '' })),
        includes: texts(t.includes[l]),
        excludes: texts(t.excludes[l]),
        what_to_bring: texts(t.what_to_bring[l]),
        season_note: t.season_note[l],
        faq: t.faq[l],
        last_reviewed: today(),
        seo: { meta_description: (t.meta_description ?? t.excerpt)[l] },
      }
      if (t.collection === 'cruises') base.ship_name = pick(t.ship_name, l)
      if (t.collection === 'excursions') base.pickup_areas = texts(t.pickup_areas[l])
      return base
    }
    const shared: AnyData = {
      holaSample: true,
      featured_image: m(t.featured_image),
      gallery: t.gallery.map(m),
      price_from_eur: t.price_from_eur,
      price_from_usd: t.price_from_usd,
      price_basis: t.price_basis,
      group_type: t.group_type,
      group_min: t.group_min,
      group_max: t.group_max,
      guide_languages: t.guide_languages,
      availability_days: t.availability_days,
      cancellation_policy: t.cancellation_policy,
      destinations: ref(dest, t.destinations),
      booking_mode: 'inquiry',
      featured: t.featured,
    }
    if (t.collection === 'tours') {
      Object.assign(shared, { duration_days: t.duration_days, trip_style: t.trip_style.map((s) => styles[s]).filter(Boolean), guides: ref(guides, t.guides) })
    } else if (t.collection === 'cruises') {
      Object.assign(shared, {
        nights: t.nights,
        cruise_type: cruiseTypes[t.cruise_type] ?? null,
        trip_style: t.trip_style.map((s) => styles[s]).filter(Boolean),
        ship_category: t.ship_category,
        embark: dest[t.embark] ?? null,
        disembark: dest[t.disembark] ?? null,
        ship_facilities: t.ship_facilities,
        deck_plan: m(t.deck_plan),
      })
    } else {
      Object.assign(shared, {
        duration_hours: t.duration_hours,
        departure: t.departure.map((s) => departures[s]).filter(Boolean),
        child_price_eur: t.child_price_eur,
        child_price_usd: t.child_price_usd,
        min_age: t.min_age,
        activity_level: t.activity_level,
      })
    }
    const es = loc('es')
    const en = loc('en')
    // Shared arrays with localized children: written in es, then the en values on the same row ids.
    if (t.collection === 'cruises') {
      es.start_dates = t.start_dates.map((s) => ({ date: s.date, note: s.note.es }))
      es.cabins = t.cabins.map((c) => ({ type: c.type.es, size_m2: c.size_m2, beds: c.beds.es, price_from_eur: c.price_from_eur, price_from_usd: c.price_from_usd }))
    }
    if (t.collection === 'excursions') es.start_times = t.start_times.map((s) => ({ time: s.time, label: s.label.es }))
    const id = await upsert(payload, t.collection, t.slug.es, shared, { es, en })
    const saved = (await payload.findByID({ collection: t.collection, id, locale: 'es', depth: 0, overrideAccess: true })) as unknown as AnyData
    if (t.collection === 'cruises') {
      const sd = (saved.start_dates as { id: string }[]) || []
      const cb = (saved.cabins as { id: string }[]) || []
      en.start_dates = t.start_dates.map((s, i) => ({ id: sd[i]?.id, date: s.date, note: s.note.en }))
      en.cabins = t.cabins.map((c, i) => ({ id: cb[i]?.id, type: c.type.en, size_m2: c.size_m2, beds: c.beds.en, price_from_eur: c.price_from_eur, price_from_usd: c.price_from_usd }))
    }
    if (t.collection === 'excursions') {
      const st = (saved.start_times as { id: string }[]) || []
      en.start_times = t.start_times.map((s, i) => ({ id: st[i]?.id, time: s.time, label: s.label.en }))
    }
    if (t.collection !== 'tours') {
      const rows: AnyData = {}
      for (const k of ['start_dates', 'cabins', 'start_times']) if (en[k]) rows[k] = en[k]
      await payload.update({ collection: t.collection, id, locale: 'en', data: rows, overrideAccess: true, context: ctx })
    }
    trips[t.key] = id
    log(`${t.collection} ${t.slug.es}`)
  }
  const tripRef = (k: string) => (trips[k] ? { relationTo: tripCollection[k], value: trips[k] } : null)
  const tripRefs = (keys: string[]) => keys.map(tripRef).filter((r): r is { relationTo: string; value: number } => Boolean(r))

  // 4. Second pass: related trips, guide bodies with trip cards
  for (const t of TRIPS) {
    await payload.update({ collection: t.collection, id: trips[t.key], data: { related_trips: tripRefs(t.related_trips) } as never, overrideAccess: true, context: ctx })
  }
  for (const g of GUIDES) {
    for (const l of ['es', 'en'] as const) {
      await payload.update({
        collection: 'guides',
        id: guides[g.key],
        locale: l,
        data: { content: toLexical(g.body[l], tripRef), ...(l === 'es' ? { related_trips: tripRefs(g.related_trips) } : {}) } as never,
        overrideAccess: true,
        context: ctx,
      })
    }
  }

  // 5. Departure terms point to their destination (launch data, link only)
  const { TERMS } = await import('./data/terms')
  for (const t of TERMS.departures) {
    const slug = t.slug?.es
    const id = departures[slug ?? ''] ?? Object.entries(departures).find(([s]) => s === slugOf(t.name.es))?.[1]
    if (id && t.destination && dest[t.destination]) {
      await payload.update({ collection: 'departures', id, data: { destination: dest[t.destination] }, overrideAccess: true, context: ctx })
    }
  }
}

function slugOf(s: string) {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
}

export async function countSamples(payload: Payload) {
  const result: Record<string, unknown> = {}
  for (const c of LOCALIZED_COUNT) {
    const per: Record<string, number> = {}
    for (const l of ['es', 'en'] as const) {
      const n = await payload.count({ collection: c, locale: l, where: { and: [{ holaSample: { equals: true } }, { available: { equals: true } }] }, overrideAccess: true })
      per[l] = n.totalDocs
    }
    result[c] = per
  }
  result.media = (await payload.count({ collection: 'media', where: { holaSample: { equals: true } }, overrideAccess: true })).totalDocs
  result.inquiries = (await payload.count({ collection: 'inquiries', where: { holaSample: { equals: true } }, overrideAccess: true })).totalDocs
  return result
}

export async function deleteSamples(payload: Payload, dry: boolean) {
  const counts: Record<string, number> = {}
  for (const c of SAMPLE_COLLECTIONS) {
    const where = { holaSample: { equals: true } }
    if (dry) {
      counts[c] = (await payload.count({ collection: c, where, overrideAccess: true })).totalDocs
    } else {
      const res = await payload.delete({ collection: c, where, overrideAccess: true, context: ctx })
      counts[c] = res.docs.length
      if (res.errors.length) log(`delete ${c}: ${res.errors.length} error(s)`)
    }
  }
  return counts
}
