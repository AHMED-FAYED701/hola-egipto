/**
 * Write functions shared by the admin and the scripts. They never call revalidatePath (contracts §16):
 * the admin revalidates after saving, scripts call POST /api/hola/revalidate.
 */
import { and, asc, eq, inArray, or } from 'drizzle-orm'

import { getDb } from '@/db/client'
import * as s from '@/db/schema'
import type { Locale } from '@/i18n/routing'

import { type Ent, isTrip, TABLES, TRIP_TYPE, type TripCollection, type TripType } from './tables'

/* eslint-disable @typescript-eslint/no-explicit-any */
type Row = Record<string, any>
/* eslint-enable @typescript-eslint/no-explicit-any */

export type TripRef = { type: TripType; id: number }

/** Relations stored in join tables, by logical name. */
export interface Joins {
  destinations?: number[]
  related_trips?: TripRef[]
  trip_style?: number[]
  departure?: number[]
  guides?: number[]
  guide_topic?: number[]
  related_destinations?: number[]
  nearby?: number[]
}

/** A document as physical columns: shared row, one row per locale, join lists. */
export interface Editable {
  id?: number
  main: Row
  i18n: Partial<Record<Locale, Row>>
  joins: Joins
}

/** Duration term slug for a number of days (contracts §4). */
export function durationSlugForDays(days: number): string {
  if (days <= 6) return 'hasta-6-dias'
  if (days <= 9) return '7-9-dias'
  if (days <= 12) return '10-12-dias'
  return '13-dias-o-mas'
}

async function durationIdForDays(days: number | null | undefined): Promise<number | null> {
  if (!days || days < 1) return null
  const [row] = await getDb()
    .select({ id: s.durations_i18n.entity_id })
    .from(s.durations_i18n)
    .where(and(eq(s.durations_i18n.locale, 'es'), eq(s.durations_i18n.slug, durationSlugForDays(days))))
    .limit(1)
  return row?.id ?? null
}

const ownerType = (ent: Ent): string | null => (isTrip(ent) ? TRIP_TYPE[ent] : ent === 'guides' ? 'guide' : null)

async function replaceJoins(ent: Ent, id: number, joins: Joins): Promise<void> {
  const db = getDb()
  const tripType = isTrip(ent) ? TRIP_TYPE[ent] : null
  const pos = <T>(list: T[] | undefined) => (list || []).map((v, position) => ({ v, position }))
  if (joins.destinations && tripType) {
    await db.delete(s.trip_destinations).where(and(eq(s.trip_destinations.trip_type, tripType), eq(s.trip_destinations.trip_id, id)))
    const rows = pos(joins.destinations).map(({ v, position }) => ({ trip_type: tripType, trip_id: id, destination_id: v, position }))
    if (rows.length) await db.insert(s.trip_destinations).values(rows)
  }
  if (joins.trip_style && tripType) {
    await db.delete(s.trip_trip_styles).where(and(eq(s.trip_trip_styles.trip_type, tripType), eq(s.trip_trip_styles.trip_id, id)))
    const rows = pos(joins.trip_style).map(({ v, position }) => ({ trip_type: tripType, trip_id: id, trip_style_id: v, position }))
    if (rows.length) await db.insert(s.trip_trip_styles).values(rows)
  }
  const owner = ownerType(ent)
  if (joins.related_trips && owner) {
    await db.delete(s.related_trips).where(and(eq(s.related_trips.owner_type, owner), eq(s.related_trips.owner_id, id)))
    const rows = pos(joins.related_trips.slice(0, 3)).map(({ v, position }) => ({ owner_type: owner, owner_id: id, trip_type: v.type, trip_id: v.id, position }))
    if (rows.length) await db.insert(s.related_trips).values(rows)
  }
  if (joins.departure && ent === 'excursions') {
    await db.delete(s.excursion_departures).where(eq(s.excursion_departures.excursion_id, id))
    const rows = pos(joins.departure).map(({ v, position }) => ({ excursion_id: id, departure_id: v, position }))
    if (rows.length) await db.insert(s.excursion_departures).values(rows)
  }
  if (joins.guides && ent === 'tours') {
    await db.delete(s.tour_guides).where(eq(s.tour_guides.tour_id, id))
    const rows = pos(joins.guides).map(({ v, position }) => ({ tour_id: id, guide_id: v, position }))
    if (rows.length) await db.insert(s.tour_guides).values(rows)
  }
  if (joins.guide_topic && ent === 'guides') {
    await db.delete(s.guide_guide_topics).where(eq(s.guide_guide_topics.guide_id, id))
    const rows = pos(joins.guide_topic.slice(0, 2)).map(({ v, position }) => ({ guide_id: id, guide_topic_id: v, position }))
    if (rows.length) await db.insert(s.guide_guide_topics).values(rows)
  }
  if (joins.related_destinations && ent === 'guides') {
    await db.delete(s.guide_destinations).where(eq(s.guide_destinations.guide_id, id))
    const rows = pos(joins.related_destinations).map(({ v, position }) => ({ guide_id: id, destination_id: v, position }))
    if (rows.length) await db.insert(s.guide_destinations).values(rows)
  }
  if (joins.nearby && ent === 'destinations') {
    await db.delete(s.destination_nearby).where(eq(s.destination_nearby.destination_id, id))
    const rows = pos(joins.nearby.filter((n) => n !== id)).map(({ v, position }) => ({ destination_id: id, nearby_id: v, position }))
    if (rows.length) await db.insert(s.destination_nearby).values(rows)
  }
}

/** Empty strings become NULL for nullable text columns (slugs stay unique only among real values). */
function clean(row: Row): Row {
  const out: Row = {}
  for (const [k, v] of Object.entries(row)) out[k] = v === '' ? null : v
  return out
}

/** Create (no id) or update a document: main row, i18n upserts, join lists. Returns the id. */
export async function saveDoc(ent: Ent, doc: Editable): Promise<number> {
  const { main, i18n } = TABLES[ent]
  const db = getDb()
  const now = new Date()
  const mainRow: Row = clean({ ...doc.main })
  delete mainRow.id
  delete mainRow.created_at
  if (ent === 'tours' && 'duration_days' in mainRow) mainRow.duration_id = await durationIdForDays(Number(mainRow.duration_days))
  if ('updated_at' in main) mainRow.updated_at = now

  let id = doc.id
  if (id) {
    if (Object.keys(mainRow).length) await db.update(main).set(mainRow).where(eq(main.id, id))
  } else {
    const [res] = await db
      .insert(main)
      .values({ ...mainRow, ...('created_at' in main ? { created_at: now } : {}) })
      .$returningId()
    id = (res as { id: number }).id
  }

  for (const [locale, row] of Object.entries(doc.i18n) as [Locale, Row][]) {
    if (!row) continue
    const values = clean({ ...row })
    delete values.id
    delete values.entity_id
    delete values.locale
    const [existing] = (await db
      .select({ id: i18n.id })
      .from(i18n)
      .where(and(eq(i18n.entity_id, id), eq(i18n.locale, locale)))
      .limit(1)) as { id: number }[]
    if (existing) await db.update(i18n).set(values).where(eq(i18n.id, existing.id))
    else await db.insert(i18n).values({ ...values, entity_id: id, locale })
  }
  await replaceJoins(ent, id as number, doc.joins)
  return id as number
}

/** Raw editable form of a document (physical columns), for the admin. */
export async function loadEditable(ent: Ent, id: number): Promise<Editable | null> {
  const { main, i18n } = TABLES[ent]
  const db = getDb()
  const [m] = (await db.select().from(main).where(eq(main.id, id)).limit(1)) as Row[]
  if (!m) return null
  const locs = (await db.select().from(i18n).where(eq(i18n.entity_id, id))) as Row[]
  const joins: Joins = {}
  const ids = async (table: Row, ownerCol: string, targetCol: string, extra?: [string, string]) => {
    const cond = extra ? and(eq(table[ownerCol], id), eq(table[extra[0]], extra[1])) : eq(table[ownerCol], id)
    const rows = (await db
      .select()
      .from(table as typeof s.tour_guides)
      .where(cond)
      .orderBy(asc(table.position), asc(table.id))) as Row[]
    return rows.map((r) => r[targetCol] as number)
  }
  const tripType = isTrip(ent) ? TRIP_TYPE[ent] : null
  if (tripType) {
    joins.destinations = await ids(s.trip_destinations, 'trip_id', 'destination_id', ['trip_type', tripType])
    if (ent !== 'excursions') joins.trip_style = await ids(s.trip_trip_styles, 'trip_id', 'trip_style_id', ['trip_type', tripType])
  }
  if (ent === 'excursions') joins.departure = await ids(s.excursion_departures, 'excursion_id', 'departure_id')
  if (ent === 'tours') joins.guides = await ids(s.tour_guides, 'tour_id', 'guide_id')
  if (ent === 'guides') {
    joins.guide_topic = await ids(s.guide_guide_topics, 'guide_id', 'guide_topic_id')
    joins.related_destinations = await ids(s.guide_destinations, 'guide_id', 'destination_id')
  }
  if (ent === 'destinations') joins.nearby = await ids(s.destination_nearby, 'destination_id', 'nearby_id')
  const owner = ownerType(ent)
  if (owner) {
    const rows = await db
      .select()
      .from(s.related_trips)
      .where(and(eq(s.related_trips.owner_type, owner), eq(s.related_trips.owner_id, id)))
      .orderBy(asc(s.related_trips.position), asc(s.related_trips.id))
    joins.related_trips = rows.map((r) => ({ type: r.trip_type as TripType, id: r.trip_id }))
  }
  return { id, main: m, i18n: Object.fromEntries(locs.map((r) => [r.locale, r])) as Editable['i18n'], joins }
}

/** Delete a document; i18n rows and FK joins cascade, polymorphic rows are removed here. */
export async function deleteDoc(ent: Ent, id: number): Promise<void> {
  await deleteDocs(ent, [id])
}

export async function deleteDocs(ent: Ent, ids: number[]): Promise<number> {
  if (!ids.length) return 0
  const db = getDb()
  const { main } = TABLES[ent]
  if (isTrip(ent)) {
    const type = TRIP_TYPE[ent as TripCollection]
    await db.delete(s.trip_destinations).where(and(eq(s.trip_destinations.trip_type, type), inArray(s.trip_destinations.trip_id, ids)))
    await db.delete(s.trip_trip_styles).where(and(eq(s.trip_trip_styles.trip_type, type), inArray(s.trip_trip_styles.trip_id, ids)))
    await db
      .delete(s.related_trips)
      .where(
        or(
          and(eq(s.related_trips.trip_type, type), inArray(s.related_trips.trip_id, ids)),
          and(eq(s.related_trips.owner_type, type), inArray(s.related_trips.owner_id, ids)),
        ),
      )
  }
  if (ent === 'guides') await db.delete(s.related_trips).where(and(eq(s.related_trips.owner_type, 'guide'), inArray(s.related_trips.owner_id, ids)))
  const [res] = await db.delete(main).where(inArray(main.id, ids))
  return Number((res as { affectedRows?: number }).affectedRows) || 0
}

/** Copy of a document with "(copia)/(copy)" titles, no slugs and not available. */
export async function duplicateDoc(ent: Ent, id: number): Promise<number | null> {
  const doc = await loadEditable(ent, id)
  if (!doc) return null
  const i18n: Editable['i18n'] = {}
  for (const [l, row] of Object.entries(doc.i18n) as [Locale, Row][]) {
    const titleKey = 'title' in row ? 'title' : 'name'
    i18n[l] = { ...row, [titleKey]: `${row[titleKey]} (${l === 'es' ? 'copia' : 'copy'})`, slug: null, available: false }
  }
  return saveDoc(ent, { main: { ...doc.main }, i18n, joins: doc.joins })
}
