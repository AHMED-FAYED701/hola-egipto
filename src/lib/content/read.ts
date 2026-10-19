/**
 * Read functions for the front end (contracts §1: every page reads through src/lib/content/*).
 * Memoized per request with React cache(); outside React (scripts) cache() is a pass-through.
 * No module-level queries: nothing here touches the database until called (contracts §16).
 */
import { and, asc, count, desc, eq, inArray, like, lte, ne, or, type SQL, sql } from 'drizzle-orm'
import { cache } from 'react'

import { getDb } from '@/db/client'
import * as s from '@/db/schema'
import type { Locale } from '@/i18n/routing'

import { hydrate, loadImages } from './hydrate'
import { type AnyTable, type ContentCollection, type Ent, isTrip, TABLES, TRIP_TYPE, type TaxonomyCollection } from './tables'
import type { Media, Navigation, Op, Page, Paginated, SiteSetting, Where } from './types'

/* eslint-disable @typescript-eslint/no-explicit-any */
type Doc = any
/* eslint-enable @typescript-eslint/no-explicit-any */

// --------------------------------------------------------- where → SQL
function joinSubquery(ent: Ent, field: string): { table: AnyTable; owner: AnyTable; target: AnyTable; extra?: SQL } | null {
  const tripType = isTrip(ent) ? TRIP_TYPE[ent] : null
  if (field === 'destinations' && tripType)
    return { table: s.trip_destinations, owner: s.trip_destinations.trip_id, target: s.trip_destinations.destination_id, extra: eq(s.trip_destinations.trip_type, tripType) }
  if (field === 'trip_style' && tripType)
    return { table: s.trip_trip_styles, owner: s.trip_trip_styles.trip_id, target: s.trip_trip_styles.trip_style_id, extra: eq(s.trip_trip_styles.trip_type, tripType) }
  if (field === 'departure' && ent === 'excursions')
    return { table: s.excursion_departures, owner: s.excursion_departures.excursion_id, target: s.excursion_departures.departure_id }
  if (field === 'guide_topic' && ent === 'guides')
    return { table: s.guide_guide_topics, owner: s.guide_guide_topics.guide_id, target: s.guide_guide_topics.guide_topic_id }
  if (field === 'related_destinations' && ent === 'guides')
    return { table: s.guide_destinations, owner: s.guide_destinations.guide_id, target: s.guide_destinations.destination_id }
  if (field === 'guides' && ent === 'tours') return { table: s.tour_guides, owner: s.tour_guides.tour_id, target: s.tour_guides.guide_id }
  return null
}

const MAIN_ALIAS: Record<string, string> = {
  duration: 'duration_id',
  region: 'region_id',
  cruise_type: 'cruise_type_id',
  featured_image: 'featured_image_id',
  holaSample: 'hola_sample',
}
const I18N_FIELDS = new Set(['title', 'slug', 'excerpt', 'name', 'available'])

function condition(ent: Ent, field: string, op: Op): SQL | undefined {
  const { main, i18n } = TABLES[ent]
  const j = joinSubquery(ent, field)
  if (j) {
    const ids = (op.in ?? (op.equals !== undefined ? [op.equals] : [])) as number[]
    if (!ids.length) return sql`false`
    const where = j.extra ? and(j.extra, inArray(j.target, ids)) : inArray(j.target, ids)
    return inArray(main.id, getDb().select({ id: j.owner }).from(j.table).where(where))
  }
  const col = I18N_FIELDS.has(field) ? i18n[field] : main[MAIN_ALIAS[field] ?? field]
  if (!col) throw new Error(`unknown filter field ${ent}.${field}`)
  const parts: SQL[] = []
  if (op.equals !== undefined) parts.push(op.equals === null ? sql`${col} is null` : eq(col, op.equals))
  if (op.not_equals !== undefined) parts.push(ne(col, op.not_equals))
  if (op.in !== undefined) parts.push(op.in.length ? inArray(col, op.in) : sql`false`)
  if (op.less_than_equal !== undefined) parts.push(lte(col, op.less_than_equal))
  if (op.like !== undefined) parts.push(like(col, `%${String(op.like).replace(/[\\%_]/g, (c) => '\\' + c)}%`))
  return and(...parts)
}

function whereSql(ent: Ent, w: Where | undefined): SQL | undefined {
  if (!w) return undefined
  const parts: (SQL | undefined)[] = []
  for (const [k, v] of Object.entries(w)) {
    if (v === undefined) continue
    if (k === 'and') parts.push(and(...(v as Where[]).map((x) => whereSql(ent, x))))
    else if (k === 'or') parts.push(or(...(v as Where[]).map((x) => whereSql(ent, x))))
    else parts.push(condition(ent, k, v as Op))
  }
  return and(...parts)
}

function orderSql(ent: Ent, sort: string | string[] | undefined): SQL[] {
  const { main, i18n } = TABLES[ent]
  const keys = Array.isArray(sort) ? sort : sort ? [sort] : []
  const out: SQL[] = []
  for (const raw of keys) {
    const dir = raw.startsWith('-') ? desc : asc
    const k = raw.replace(/^-/, '')
    // Ids grow with creation time (and are finer than created_at's seconds).
    const col =
      k === 'createdAt' ? main.id : k === 'updatedAt' ? main.updated_at : I18N_FIELDS.has(k) ? i18n[k] : main[MAIN_ALIAS[k] ?? k]
    if (col) out.push(dir(col))
  }
  // Ties: newest first, as the v2 Local API did (its default order was -createdAt).
  out.push(desc(main.id))
  return out
}

export interface ListOpts {
  where?: Where
  limit?: number
  sort?: string | string[]
  depth?: number
  page?: number
}

/** Items available in `locale`, filtered, sorted and paginated on the server (contracts §5). */
async function listAvailableImpl(collection: ContentCollection | 'pages', locale: Locale, opts: ListOpts = {}): Promise<Paginated<Doc>> {
  const { main, i18n } = TABLES[collection]
  const limit = Math.max(1, opts.limit ?? 100)
  const page = Math.max(1, opts.page ?? 1)
  const cond = and(eq(i18n.available, true), whereSql(collection, opts.where))
  const join = and(eq(i18n.entity_id, main.id), eq(i18n.locale, locale))
  const db = getDb()
  const [ids, [{ n }]] = await Promise.all([
    db
      .select({ id: main.id })
      .from(main)
      .innerJoin(i18n, join)
      .where(cond)
      .orderBy(...orderSql(collection, opts.sort))
      .limit(limit)
      .offset((page - 1) * limit) as Promise<{ id: number }[]>,
    db.select({ n: count() }).from(main).innerJoin(i18n, join).where(cond) as Promise<{ n: number }[]>,
  ])
  const docs = await hydrate(
    collection,
    ids.map((r) => r.id),
    { locale, depth: opts.depth ?? 1 },
  )
  const totalDocs = Number(n)
  const totalPages = Math.max(1, Math.ceil(totalDocs / limit))
  return { docs, totalDocs, totalPages, page, limit, hasNextPage: page < totalPages, hasPrevPage: page > 1 }
}

const listAvailableCached = cache(
  (collection: ContentCollection | 'pages', locale: Locale, key: string) => listAvailableImpl(collection, locale, JSON.parse(key) as ListOpts),
)

export function listAvailable<T = Doc>(collection: ContentCollection | 'pages', locale: Locale, opts: ListOpts = {}): Promise<Paginated<T>> {
  return listAvailableCached(collection, locale, JSON.stringify(opts)) as Promise<Paginated<T>>
}

/** Count of available items matching `where` (sitemap: terms with ≥ 1 item). */
export async function countAvailable(collection: ContentCollection, locale: Locale, where?: Where): Promise<number> {
  const { main, i18n } = TABLES[collection]
  const [{ n }] = (await getDb()
    .select({ n: count() })
    .from(main)
    .innerJoin(i18n, and(eq(i18n.entity_id, main.id), eq(i18n.locale, locale)))
    .where(and(eq(i18n.available, true), whereSql(collection, where)))) as { n: number }[]
  return Number(n)
}

// ------------------------------------------------------------- singles
const findAvailableBySlugCached = cache(async (collection: ContentCollection | 'pages', slug: string, locale: Locale, depth: number) => {
  const res = await listAvailableImpl(collection, locale, { where: { slug: { equals: slug } }, limit: 1, depth })
  return res.docs[0] ?? null
})

/** An item available in `locale` with that slug, or null. */
export function findAvailableBySlug<T = Doc>(collection: ContentCollection | 'pages', slug: string, locale: Locale, depth = 2): Promise<T | null> {
  return findAvailableBySlugCached(collection, slug, locale, depth) as Promise<T | null>
}

/** Slug of the same item in another locale when it is available there, else null. */
export const alternateSlug = cache(async (collection: ContentCollection | 'pages', id: number, locale: Locale): Promise<string | null> => {
  const { i18n } = TABLES[collection]
  const rows = (await getDb()
    .select({ slug: i18n.slug, available: i18n.available })
    .from(i18n)
    .where(and(eq(i18n.entity_id, id), eq(i18n.locale, locale)))
    .limit(1)) as { slug: string | null; available: boolean }[]
  const r = rows[0]
  return r && r.available && r.slug ? r.slug : null
})

/** Any document by id (admin previews, inquiries' trips), regardless of availability. */
export async function findById<T = Doc>(ent: Ent, id: number, locale: Locale, depth = 0): Promise<T | null> {
  const docs = await hydrate(ent, [id], { locale, depth })
  return (docs[0] as T) ?? null
}

export const findPageByTemplate = cache(async (template: string, locale: Locale, depth = 2): Promise<Page | null> => {
  const res = await listAvailableImpl('pages', locale, { where: { template: { equals: template } }, limit: 1, depth })
  return (res.docs[0] as Page) ?? null
})

// ------------------------------------------------------------ taxonomies
const findTermBySlugCached = cache(async (taxonomy: TaxonomyCollection, slug: string, locale: Locale, depth: number) => {
  const { i18n } = TABLES[taxonomy]
  const rows = (await getDb()
    .select({ id: i18n.entity_id })
    .from(i18n)
    .where(and(eq(i18n.locale, locale), eq(i18n.slug, slug)))
    .limit(1)) as { id: number }[]
  if (!rows[0]) return null
  return (await hydrate(taxonomy, [rows[0].id], { locale, depth }))[0] ?? null
})

export function findTermBySlug<T = Doc>(taxonomy: TaxonomyCollection, slug: string, locale: Locale, depth = 1): Promise<T | null> {
  return findTermBySlugCached(taxonomy, slug, locale, depth) as Promise<T | null>
}

export const termSlugIn = cache(async (taxonomy: TaxonomyCollection, id: number, locale: Locale): Promise<string | null> => {
  const { i18n } = TABLES[taxonomy]
  const rows = (await getDb()
    .select({ slug: i18n.slug })
    .from(i18n)
    .where(and(eq(i18n.entity_id, id), eq(i18n.locale, locale)))
    .limit(1)) as { slug: string | null }[]
  return rows[0]?.slug || null
})

/** Every term of a taxonomy that has a row in `locale`, by `sort`. */
export const listTerms = cache(async (taxonomy: TaxonomyCollection, locale: Locale): Promise<Doc[]> => {
  const { main, i18n } = TABLES[taxonomy]
  const rows = (await getDb()
    .select({ id: main.id })
    .from(main)
    .innerJoin(i18n, and(eq(i18n.entity_id, main.id), eq(i18n.locale, locale)))
    .orderBy(asc(main.sort), asc(main.id))) as { id: number }[]
  return hydrate(
    taxonomy,
    rows.map((r) => r.id),
    { locale, depth: 1 },
  )
})

// --------------------------------------------------------------- settings
/** Shared + localized site settings; images populated. Empty values when the rows do not exist yet. */
export const getSettings = cache(async (locale: Locale): Promise<SiteSetting> => {
  const db = getDb()
  const [main] = await db.select().from(s.site_settings).orderBy(asc(s.site_settings.id)).limit(1)
  const loc = main
    ? (await db.select().from(s.site_settings_i18n).where(and(eq(s.site_settings_i18n.entity_id, main.id), eq(s.site_settings_i18n.locale, locale))).limit(1))[0]
    : undefined
  type Intro = { h1?: string; intro?: string; hero?: number | Media | null; seo_text?: string; faq?: { q: string; a: string }[] }
  const intros = (loc?.archive_intros || {}) as Record<string, Intro>
  const home = (loc?.home || {}) as Record<string, Record<string, unknown>>
  const imageIds = [loc?.og_default_id, home.hero?.image as number, home.cruises?.image as number, ...Object.values(intros).map((i) => i?.hero as number)]
  const images = await loadImages(imageIds, locale)
  const img = (v: unknown) => (typeof v === 'number' ? (images.get(v) ?? null) : null)
  const archive_intros = Object.fromEntries(
    Object.entries(intros).map(([k, v]) => [k, { ...v, hero: img(v?.hero), faq: (v?.faq || []).map((f, i) => ({ ...f, id: String(i + 1) })) }]),
  )
  const cities = (home.excursions?.cities as number[] | undefined) || []
  const departures = cities.length ? await hydrate('departures', cities, { locale, depth: 0 }) : []
  return {
    id: main?.id ?? 0,
    whatsapp_number: main?.whatsapp_number ?? null,
    contact_email: main?.contact_email ?? null,
    phone: main?.phone ?? null,
    address: main?.address ?? null,
    legal_name: main?.legal_name ?? null,
    licence_number: main?.licence_number ?? null,
    gtm_id: main?.gtm_id ?? null,
    social: (main?.social || []).map((x, i) => ({ ...x, id: String(i + 1) })) as SiteSetting['social'],
    whatsapp_message_default: loc?.whatsapp_message_default ?? null,
    reply_hours: loc?.reply_hours ?? null,
    booking_band: (loc?.booking_band || {}) as SiteSetting['booking_band'],
    stats: (loc?.stats || []).map((x, i) => ({ ...x, id: String(i + 1) })),
    trust_items: (loc?.trust_items || []).map((x, i) => ({ ...x, id: String(i + 1) })) as SiteSetting['trust_items'],
    archive_intros: archive_intros as SiteSetting['archive_intros'],
    cancellation_policies: (loc?.cancellation_policies || []).map((x, i) => ({ ...x, id: String(i + 1) })),
    og_default: img(loc?.og_default_id),
    home: {
      ...home,
      hero: home.hero ? { ...home.hero, image: img(home.hero.image) } : undefined,
      cruises: home.cruises ? { ...home.cruises, image: img(home.cruises.image) } : undefined,
      excursions: home.excursions ? { ...home.excursions, cities: departures } : undefined,
    } as SiteSetting['home'],
    updatedAt: main?.updated_at ? main.updated_at.toISOString() : null,
  }
})

/** Navigation tree of one language; featured trips populated (depth 1). */
export const getNavigation = cache(async (locale: Locale): Promise<Navigation> => {
  const db = getDb()
  const [main] = await db.select().from(s.navigation).orderBy(asc(s.navigation.id)).limit(1)
  const loc = main
    ? (await db.select().from(s.navigation_i18n).where(and(eq(s.navigation_i18n.entity_id, main.id), eq(s.navigation_i18n.locale, locale))).limit(1))[0]
    : undefined
  type Item = { label: string; href: string; columns?: unknown[]; panel_extra?: string; featured?: { relationTo: 'tours' | 'cruises' | 'excursions'; value: number } | null }
  const tree = (loc?.tree || {}) as { header?: Item[]; footer_columns?: unknown[]; footer_description?: string; legal_links?: unknown[] }
  const header = await Promise.all(
    (tree.header || []).map(async (it, i) => {
      let featured = null
      if (it.featured && typeof it.featured.value === 'number') {
        const [doc] = await hydrate(it.featured.relationTo, [it.featured.value], { locale, depth: 1 })
        featured = doc ? { relationTo: it.featured.relationTo, value: doc } : null
      }
      return { ...it, id: String(i + 1), featured }
    }),
  )
  return {
    id: main?.id ?? 0,
    header: header as Navigation['header'],
    footer_columns: (tree.footer_columns || []) as Navigation['footer_columns'],
    footer_description: tree.footer_description ?? null,
    legal_links: (tree.legal_links || []) as Navigation['legal_links'],
  }
})

/** Shared settings for the coming-soon page (outside the localized front end). */
export async function getSharedSettings(): Promise<{ whatsapp_number: string; whatsapp_message_es: string; whatsapp_message_en: string }> {
  const [es, en] = await Promise.all([getSettings('es'), getSettings('en')])
  return {
    whatsapp_number: es.whatsapp_number || '',
    whatsapp_message_es: es.whatsapp_message_default || '',
    whatsapp_message_en: en.whatsapp_message_default || '',
  }
}
