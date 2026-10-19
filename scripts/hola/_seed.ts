/**
 * Seeding on the data layer (contracts §9, content rules §2): launch terms, image-library rows for the
 * placeholders, site-settings, fixed pages, navigation and the sample set. Idempotent: items are found by
 * their Spanish slug (images by path) and updated in place.
 */
import { and, eq } from 'drizzle-orm'

import { getDb } from '../../src/db/client'
import * as s from '../../src/db/schema'
import { saveNavigation, saveSettingsLocale, type NavTree } from '../../src/lib/content/globals'
import { upsertImage } from '../../src/lib/content/images'
import { TABLES, type Ent, TRIP_TYPE, type TripCollection, type TripType } from '../../src/lib/content/tables'
import { type Editable, saveDoc } from '../../src/lib/content/write'
import { slugify } from '../../src/lib/slug'
import { log } from './_cli'
import { imagePath, SIZES } from './_placeholders'
import { CRUISES } from './data/cruises'
import { DESTINATIONS } from './data/destinations'
import { EXCURSIONS } from './data/excursions'
import { GUIDE as G1 } from './data/guides/when-to-travel'
import { GUIDE as G2 } from './data/guides/luxor-2-days'
import { GUIDE as G3 } from './data/guides/red-sea-snorkel'
import { PLACEHOLDERS } from './data/media'
import { type PageBlock, PAGES, type Rich } from './data/pages'
import { NAVIGATION, SETTINGS } from './data/site'
import { TERMS } from './data/terms'
import { TOURS } from './data/tours'
import type { GuideBlock, L, TripSample } from './data/types'

export const GUIDES = [G1, G2, G3]
export const TRIPS: TripSample[] = [...TOURS, ...CRUISES, ...EXCURSIONS]
type Ids = Record<string, number>
const LOCALES = ['es', 'en'] as const
const today = () => new Date().toISOString().slice(0, 10)

// ----------------------------------------------------------------- helpers
/** Id of the item whose Spanish slug is `slug`. */
export async function idBySlug(ent: Ent, slug: string): Promise<number | null> {
  const { i18n } = TABLES[ent]
  const [row] = (await getDb()
    .select({ id: i18n.entity_id })
    .from(i18n)
    .where(and(eq(i18n.locale, 'es'), eq(i18n.slug, slug)))
    .limit(1)) as { id: number }[]
  return row?.id ?? null
}

async function upsert(ent: Ent, esSlug: string, doc: Omit<Editable, 'id'>): Promise<number> {
  const id = (await idBySlug(ent, esSlug)) ?? undefined
  return saveDoc(ent, { ...doc, id })
}

/** Spanish slug → id for every term of a taxonomy. */
async function termIds(ent: Ent): Promise<Ids> {
  const { i18n } = TABLES[ent]
  const rows = (await getDb().select({ id: i18n.entity_id, slug: i18n.slug }).from(i18n).where(eq(i18n.locale, 'es'))) as { id: number; slug: string | null }[]
  return Object.fromEntries(rows.filter((r) => r.slug).map((r) => [r.slug as string, r.id]))
}

const ref = (ids: Ids, keys: string[]) => keys.map((k) => ids[k]).filter((v): v is number => typeof v === 'number')

/** Simple block arrays of the data files → Markdown with the guide shortcodes (contracts §4). */
export function toMarkdown(blocks: (GuideBlock | Rich[number])[], trip?: (key: string) => TripRefOut | null): string {
  const out: string[] = []
  for (const b of blocks) {
    if ('h2' in b) out.push(`## ${b.h2}`)
    else if ('h3' in b) out.push(`### ${b.h3}`)
    else if ('p' in b) out.push(b.p)
    else if ('ul' in b) out.push(b.ul.map((x) => `- ${x}`).join('\n'))
    else if ('tip' in b) out.push(`:::tip${b.tip.title ? ' ' + b.tip.title : ''}\n${b.tip.text}\n:::`)
    else if ('trip' in b) {
      const r = trip?.(b.trip)
      if (r) out.push(`[[trip-card:${r.type}:${r.id}]]`)
    }
  }
  return out.join('\n\n')
}
type TripRefOut = { type: TripType; id: number }
const paragraphs = (ps: string[]) => ps.join('\n\n')

// ------------------------------------------------------------------ images
/** Image-library rows for the generated placeholders (content rules §4). Returns key → id. */
export async function seedImages(): Promise<Ids> {
  const ids: Ids = {}
  for (const ph of PLACEHOLDERS) {
    const [w, h] = SIZES[ph.size]
    ids[ph.key] = await upsertImage({ path: imagePath(ph.key), alt_es: ph.alt.es, alt_en: ph.alt.en, width: w, height: h, hola_sample: true })
  }
  log(`images: ${PLACEHOLDERS.length}`)
  return ids
}

// ------------------------------------------------------------------- terms
const TAX_ENT: Record<string, Ent> = {
  durations: 'durations',
  'trip-styles': 'trip-styles',
  'cruise-types': 'cruise-types',
  departures: 'departures',
  regions: 'regions',
  'guide-topics': 'guide-topics',
}

export async function seedTerms(): Promise<void> {
  for (const [taxonomy, terms] of Object.entries(TERMS)) {
    const ent = TAX_ENT[taxonomy]
    for (const t of terms) {
      const slug: L = t.slug ?? { es: slugify(t.name.es), en: slugify(t.name.en) }
      const main: Record<string, unknown> = { sort: t.sort }
      if (t.min_days !== undefined) Object.assign(main, { min_days: t.min_days, max_days: t.max_days ?? null })
      const loc = (l: 'es' | 'en') => ({
        name: t.name[l],
        slug: slug[l],
        available: true,
        h1: t.landing?.h1[l] ?? null,
        intro: t.landing?.intro[l] ?? null,
        seo_text: t.landing?.seo_text[l] ?? null,
        faq: t.landing?.faq[l] ?? [],
      })
      await upsert(ent, slug.es, { main, i18n: { es: loc('es'), en: loc('en') }, joins: {} })
    }
    log(`terms ${taxonomy}: ${terms.length}`)
  }
}

// ---------------------------------------------------------------- settings
const ARCHIVE_HEROES: Record<string, string> = { tours: 'hero-tours', cruises: 'hero-cruises', excursions: 'hero-excursions', destinations: 'hero-destinations', guides: 'hero-guides' }

const EN_INTROS: Record<string, { h1: string; intro: string; seo_text: string }> = {
  tours: { h1: 'Egypt tours', intro: 'Routes through Cairo, the Nile and the Red Sea, organised by a team that lives in Egypt. Every one can be adjusted.', seo_text: 'Our Egypt tours combine the Giza pyramids, the temples of Luxor and Aswan, a Nile cruise and, if you like, a few days on the Red Sea. Choose by length or style and message us to fit it to your dates.' },
  cruises: { h1: 'Nile cruises', intro: 'Cruise ships and dahabiyas between Luxor and Aswan, with guided visits at every stop.', seo_text: 'A Nile cruise is the easiest way to see the temples of Upper Egypt: the boat is your hotel and visits start by the quay. Compare routes, length and boat type.' },
  excursions: { h1: 'Egypt excursions', intro: 'Day trips from Hurghada, Marsa Alam and Cairo, with hotel pickup.', seo_text: 'Snorkelling on Red Sea reefs, Luxor in a day or the Giza pyramids: pick your departure city and we will tell you what each excursion includes.' },
  destinations: { h1: 'Egypt destinations', intro: 'From the Nile delta to the southern reefs: what is worth seeing in each place and how many days to allow.', seo_text: 'Destination guides with the essentials, the best season and how to get there, plus the trips that visit each place.' },
  guides: { h1: 'Egypt travel guide', intro: 'Practical advice written in Egypt: when to go, what to see and how to get around.', seo_text: 'Articles updated in 2026 on planning, destinations, culture and the Red Sea. Facts that change often are marked so you can check them before you travel.' },
}

/** Home texts (site-settings `home`) from the v2 home page blocks: the sections are fixed in code. */
function homeTexts(blocks: PageBlock[], media: Ids, departures: Ids): Record<string, unknown> {
  const by = (t: string) => blocks.find((b) => b.blockType === t) as Record<string, unknown> | undefined
  const pick = (b: Record<string, unknown> | undefined, keys: string[]) => Object.fromEntries(keys.filter((k) => b && k in b).map((k) => [k, b![k]]))
  const hero = by('hero')
  const cruises = by('cruises-split')
  const exc = by('excursions-by-city')
  return {
    hero: { ...pick(hero, ['heading', 'lead', 'show_stats', 'draft']), image: hero && typeof hero.image === 'string' ? (media[hero.image] ?? null) : null },
    destinations: pick(by('destinations-grid'), ['eyebrow', 'title', 'intro', 'limit']),
    trips: pick(by('trips-grid'), ['eyebrow', 'title', 'intro', 'limit']),
    cruises: { ...pick(cruises, ['eyebrow', 'title', 'intro']), image: cruises && typeof cruises.image === 'string' ? (media[cruises.image] ?? null) : null },
    excursions: { ...pick(exc, ['eyebrow', 'title', 'intro']), cities: ((exc?.cities as string[]) || []).map((c) => departures[c]).filter(Boolean) },
    why: pick(by('why'), ['eyebrow', 'title', 'draft', 'columns']),
    guides: pick(by('guides-grid'), ['eyebrow', 'title', 'intro', 'limit']),
    cta: pick(by('cta-band'), ['title', 'text']),
  }
}

export async function seedSettings(media: Ids): Promise<void> {
  const st = SETTINGS
  const departures = await termIds('departures')
  const home = PAGES.find((p) => p.template === 'home')
  for (const l of LOCALES) {
    const intros = Object.fromEntries(
      Object.entries(st.archive_intros.es).map(([k, v]) => {
        const words = l === 'es' ? { h1: v.h1, intro: v.intro, seo_text: v.seo_text } : EN_INTROS[k]
        return [k, { ...words, faq: v.faq[l], hero: media[ARCHIVE_HEROES[k]] ?? null }]
      }),
    )
    await saveSettingsLocale(l, {
      available: true,
      whatsapp_message_default: st.whatsapp_message_default[l],
      reply_hours: st.reply_hours[l],
      booking_band: st.booking_band[l],
      stats: st.stats[l],
      trust_items: st.trust_items[l],
      archive_intros: intros,
      cancellation_policies: st.cancellation_policies.map((p) => ({ key: p.key, name: p.name[l], text: p.text[l] })),
      home: home?.layout ? homeTexts(home.layout[l], media, departures) : {},
    })
  }
  log('site-settings')
}

// ------------------------------------------------------------------- pages
export async function seedPages(media: Ids): Promise<void> {
  for (const pg of PAGES) {
    const loc = (l: 'es' | 'en') => {
      const sections =
        pg.template === 'home' || !pg.layout
          ? null
          : pg.layout[l].map((b) => {
              const out: Record<string, unknown> = { ...b }
              if (typeof b.image === 'string') out.image = media[b.image] ?? null
              if (Array.isArray(b.body)) out.body = toMarkdown(b.body as Rich)
              return out
            })
      return {
        title: pg.title[l],
        slug: pg.slug[l],
        available: true,
        excerpt: pg.excerpt[l],
        seo_meta_description: pg.excerpt[l],
        content: pg.content ? toMarkdown(pg.content[l]) : null,
        sections,
        faq_groups: pg.faq_groups ? pg.faq_groups[l] : null,
      }
    }
    await upsert('pages', pg.slug.es, { main: { template: pg.template, hola_sample: false, last_updated: today() }, i18n: { es: loc('es'), en: loc('en') }, joins: {} })
  }
  log(`pages: ${PAGES.length}`)
}

// -------------------------------------------------------------- navigation
export async function seedNavigation(): Promise<void> {
  const trips: Record<string, { relationTo: TripCollection; value: number }> = {}
  for (const t of TRIPS) {
    const id = await idBySlug(t.collection, t.slug.es)
    if (id) trips[t.key] = { relationTo: t.collection, value: id }
  }
  for (const l of LOCALES) {
    const n = NAVIGATION[l]
    const tree: NavTree = {
      header: n.header.map((h) => ({ ...h, featured: h.featured ? (trips[h.featured] ?? null) : null })),
      footer_columns: n.footer_columns,
      footer_description: n.footer_description,
      legal_links: n.legal_links,
    }
    await saveNavigation(l, tree)
  }
  log('navigation')
}

// ----------------------------------------------------------------- samples
export async function createSamples(media: Ids): Promise<void> {
  const m = (k: string) => {
    if (!(k in media)) throw new Error(`unknown image key ${k}`)
    return media[k]
  }
  const [regions, styles, cruiseTypes, departures, topics] = await Promise.all(
    (['regions', 'trip-styles', 'cruise-types', 'departures', 'guide-topics'] as Ent[]).map(termIds),
  )

  // 1. Destinations (nearby in a second pass, once every id exists)
  const dest: Ids = {}
  for (const d of DESTINATIONS) {
    const loc = (l: 'es' | 'en') => ({
      title: d.title[l],
      slug: d.slug[l],
      available: true,
      excerpt: d.excerpt[l],
      content: paragraphs(d.content[l]),
      tagline: d.tagline[l],
      how_to_get_there: d.how_to_get_there[l],
      nearest_airport: d.nearest_airport[l],
      top_sights: d.top_sights[l].map((x) => ({ ...x, image: m(x.image) })),
      seo_meta_description: d.excerpt[l],
    })
    dest[d.key] = await upsert('destinations', d.slug.es, {
      main: {
        hola_sample: true,
        featured_image_id: m(d.featured_image),
        region_id: regions[d.region] ?? null,
        best_months: d.best_months,
        days_recommended: d.days_recommended,
        lat: d.lat,
        lng: d.lng,
      },
      i18n: { es: loc('es'), en: loc('en') },
      joins: {},
    })
  }
  for (const d of DESTINATIONS) await saveDoc('destinations', { id: dest[d.key], main: {}, i18n: {}, joins: { nearby: ref(dest, d.nearby) } })
  log(`destinations: ${DESTINATIONS.length}`)

  // 2. Guides (bodies with trip cards and related trips once trips exist)
  const guides: Ids = {}
  for (const g of GUIDES) {
    const loc = (l: 'es' | 'en') => ({
      title: g.title[l],
      slug: g.slug[l],
      available: true,
      excerpt: g.excerpt[l],
      content: toMarkdown(g.body[l]),
      author_name: l === 'es' ? '[pendiente]' : '[pending]',
      seo_meta_description: g.excerpt[l],
    })
    guides[g.key] = await upsert('guides', g.slug.es, {
      main: { hola_sample: true, featured_image_id: m(g.featured_image), toc: true, last_updated: today() },
      i18n: { es: loc('es'), en: loc('en') },
      joins: { guide_topic: g.guide_topic.map((x) => topics[x]).filter(Boolean), related_destinations: ref(dest, g.related_destinations) },
    })
  }

  // 3. Trips
  const trips: Record<string, TripRefOut> = {}
  for (const t of TRIPS) {
    const loc = (l: 'es' | 'en'): Record<string, unknown> => {
      const base: Record<string, unknown> = {
        title: t.title[l],
        slug: t.slug[l],
        available: true,
        excerpt: t.excerpt[l],
        subtitle: t.subtitle[l],
        overview: paragraphs(t.overview[l]),
        price_note: t.price_note[l],
        highlights: t.highlights[l],
        itinerary: t.itinerary[l].map((it) => ({ ...it, places: ref(dest, it.places), overnight: it.overnight ?? '' })),
        includes: t.includes[l],
        excludes: t.excludes[l],
        what_to_bring: t.what_to_bring[l],
        season_note: t.season_note[l],
        faq: t.faq[l],
        seo_meta_description: (t.meta_description ?? t.excerpt)[l],
      }
      if (t.collection === 'cruises') {
        base.ship_name = t.ship_name[l]
        base.start_dates = t.start_dates.map((x) => ({ date: x.date, note: x.note[l] }))
        base.cabins = t.cabins.map((c) => ({ type: c.type[l], size_m2: c.size_m2, beds: c.beds[l], price_from_eur: c.price_from_eur, price_from_usd: c.price_from_usd }))
      }
      if (t.collection === 'excursions') {
        base.pickup_areas = t.pickup_areas[l]
        base.start_times = t.start_times.map((x) => ({ time: x.time, label: x.label[l] }))
      }
      return base
    }
    const main: Record<string, unknown> = {
      hola_sample: true,
      featured_image_id: m(t.featured_image),
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
      booking_mode: 'inquiry',
      featured: t.featured,
      last_reviewed: today(),
    }
    const joins: Editable['joins'] = { destinations: ref(dest, t.destinations) }
    if (t.collection === 'tours') {
      main.duration_days = t.duration_days
      joins.trip_style = t.trip_style.map((x) => styles[x]).filter(Boolean)
      joins.guides = ref(guides, t.guides)
    } else if (t.collection === 'cruises') {
      Object.assign(main, {
        nights: t.nights,
        cruise_type_id: cruiseTypes[t.cruise_type] ?? null,
        ship_category: t.ship_category,
        embark_id: dest[t.embark] ?? null,
        disembark_id: dest[t.disembark] ?? null,
        ship_facilities: t.ship_facilities,
        deck_plan_id: m(t.deck_plan),
      })
      joins.trip_style = t.trip_style.map((x) => styles[x]).filter(Boolean)
    } else {
      Object.assign(main, {
        duration_hours: t.duration_hours,
        child_price_eur: t.child_price_eur,
        child_price_usd: t.child_price_usd,
        min_age: t.min_age,
        activity_level: t.activity_level,
      })
      joins.departure = t.departure.map((x) => departures[x]).filter(Boolean)
    }
    const id = await upsert(t.collection, t.slug.es, { main, i18n: { es: loc('es'), en: loc('en') }, joins })
    trips[t.key] = { type: TRIP_TYPE[t.collection], id }
  }
  log(`trips: ${TRIPS.length}`)
  const tripRef = (k: string) => trips[k] ?? null
  const tripRefs = (keys: string[]) => keys.map(tripRef).filter((r): r is TripRefOut => Boolean(r))

  // 4. Second pass: related trips, guide bodies with trip cards
  for (const t of TRIPS) await saveDoc(t.collection, { id: trips[t.key].id, main: {}, i18n: {}, joins: { related_trips: tripRefs(t.related_trips) } })
  for (const g of GUIDES) {
    await saveDoc('guides', {
      id: guides[g.key],
      main: {},
      i18n: { es: { content: toMarkdown(g.body.es, tripRef) }, en: { content: toMarkdown(g.body.en, tripRef) } },
      joins: { related_trips: tripRefs(g.related_trips) },
    })
  }
  log(`guides: ${GUIDES.length}`)

  // 5. Departure terms point to their destination (launch data, link only)
  for (const t of TERMS.departures) {
    const slug = t.slug?.es ?? slugify(t.name.es)
    const id = departures[slug]
    if (id && t.destination && dest[t.destination]) await saveDoc('departures', { id, main: { destination_id: dest[t.destination] }, i18n: {}, joins: {} })
  }
}

// ---------------------------------------------------------- counts/delete
const COUNTED = ['tours', 'cruises', 'excursions', 'destinations', 'guides'] as const

export async function countSamples(): Promise<Record<string, unknown>> {
  const db = getDb()
  const result: Record<string, unknown> = {}
  for (const c of COUNTED) {
    const { main, i18n } = TABLES[c]
    const per: Record<string, number> = {}
    for (const l of LOCALES) {
      const rows = (await db
        .select({ id: main.id })
        .from(main)
        .innerJoin(i18n, and(eq(i18n.entity_id, main.id), eq(i18n.locale, l)))
        .where(and(eq(main.hola_sample, true), eq(i18n.available, true)))) as unknown[]
      per[l] = rows.length
    }
    result[c] = per
  }
  result.images = (await db.select({ id: s.images.id }).from(s.images).where(eq(s.images.hola_sample, true))).length
  result.inquiries = (await db.select({ id: s.inquiries.id }).from(s.inquiries).where(eq(s.inquiries.hola_sample, true))).length
  return result
}

/** Logical name → table of every table with `hola_sample`. */
const SAMPLE_TABLES: [string, Ent | null, typeof s.images | typeof s.inquiries | null][] = [
  ['tours', 'tours', null],
  ['cruises', 'cruises', null],
  ['excursions', 'excursions', null],
  ['destinations', 'destinations', null],
  ['guides', 'guides', null],
  ['pages', 'pages', null],
  ['inquiries', null, s.inquiries],
  ['images', null, s.images],
]

/** Deletes every row with hola_sample true (image files stay in the repository). */
export async function deleteSamples(dry: boolean): Promise<Record<string, number>> {
  const { deleteDocs } = await import('../../src/lib/content/write')
  const db = getDb()
  const counts: Record<string, number> = {}
  for (const [name, ent, table] of SAMPLE_TABLES) {
    const t = ent ? TABLES[ent].main : table
    const ids = ((await db.select({ id: t.id }).from(t).where(eq(t.hola_sample, true))) as { id: number }[]).map((r) => r.id)
    if (dry || !ids.length) counts[name] = ids.length
    else if (ent) counts[name] = await deleteDocs(ent, ids)
    else {
      const { inArray } = await import('drizzle-orm')
      const [res] = await db.delete(t as typeof s.images).where(inArray((t as typeof s.images).id, ids))
      counts[name] = Number((res as { affectedRows?: number }).affectedRows) || 0
    }
  }
  return counts
}
