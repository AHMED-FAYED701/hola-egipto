/** Admin lists and option lists (contracts §18). */
import { and, asc, desc, eq, like, or } from 'drizzle-orm'

import { getDb } from '@/db/client'
import * as s from '@/db/schema'

import { type Ent, isTaxonomy, TABLES, TRIP_TYPE, TRIPS, type TripType } from './tables'

export interface AdminRow {
  id: number
  es: { title: string; slug: string | null; available: boolean } | null
  en: { title: string; slug: string | null; available: boolean } | null
  sample: boolean
  updated: Date | null
  extra?: string
}

/** Every item of an entity with both language rows (search on titles/slugs in either language). */
export async function adminList(ent: Ent, q = ''): Promise<AdminRow[]> {
  const { main, i18n } = TABLES[ent]
  const db = getDb()
  const titleCol = isTaxonomy(ent) ? i18n.name : i18n.title
  let ids: number[] | null = null
  if (q) {
    const hits = (await db
      .select({ id: i18n.entity_id })
      .from(i18n)
      .where(or(like(titleCol, `%${q}%`), like(i18n.slug, `%${q}%`)))) as { id: number }[]
    ids = [...new Set(hits.map((h) => h.id))]
    if (!ids.length) return []
  }
  const mains = (await db
    .select()
    .from(main)
    .orderBy(isTaxonomy(ent) ? asc(main.sort) : desc(main.id), desc(main.id))) as Record<string, unknown>[]
  const locs = (await db.select({ id: i18n.entity_id, locale: i18n.locale, title: titleCol, slug: i18n.slug, available: i18n.available }).from(i18n)) as {
    id: number
    locale: string
    title: string
    slug: string | null
    available: boolean
  }[]
  const by = new Map<string, (typeof locs)[number]>(locs.map((r) => [`${r.id}|${r.locale}`, r]))
  return mains
    .filter((m) => !ids || ids.includes(m.id as number))
    .map((m) => {
      const id = m.id as number
      const pick = (l: string) => {
        const r = by.get(`${id}|${l}`)
        return r ? { title: r.title, slug: r.slug, available: Boolean(r.available) } : null
      }
      return {
        id,
        es: pick('es'),
        en: pick('en'),
        sample: Boolean(m.hola_sample),
        updated: (m.updated_at as Date) ?? null,
        extra: ent === 'pages' ? String(m.template) : undefined,
      }
    })
}

/** Counts for the dashboard: items and items available per language. */
export async function adminCounts(ent: Ent): Promise<{ total: number; es: number; en: number; sample: number }> {
  const rows = await adminList(ent)
  return {
    total: rows.length,
    es: rows.filter((r) => r.es?.available).length,
    en: rows.filter((r) => r.en?.available).length,
    sample: rows.filter((r) => r.sample).length,
  }
}

/** id + Spanish label (falls back to English) for relationship pickers. */
export async function refOptions(ent: Ent): Promise<{ id: number; label: string }[]> {
  const rows = await adminList(ent)
  return rows.map((r) => ({ id: r.id, label: r.es?.title || r.en?.title || `#${r.id}` })).sort((a, b) => a.label.localeCompare(b.label, 'es'))
}

export async function tripOptions(): Promise<{ type: TripType; id: number; label: string }[]> {
  const out: { type: TripType; id: number; label: string }[] = []
  for (const c of TRIPS) for (const o of await refOptions(c)) out.push({ type: TRIP_TYPE[c], id: o.id, label: `${o.label} · ${c}` })
  return out
}

/** Is `slug` free in `locale` for this entity (other than `id`)? */
export async function slugTaken(ent: Ent, locale: string, slug: string, id?: number): Promise<boolean> {
  const { i18n } = TABLES[ent]
  const rows = (await getDb()
    .select({ id: i18n.entity_id })
    .from(i18n)
    .where(and(eq(i18n.locale, locale), eq(i18n.slug, slug)))) as { id: number }[]
  return rows.some((r) => r.id !== id)
}

export async function durationName(id: number | null): Promise<string> {
  if (!id) return ''
  const [r] = await getDb()
    .select({ name: s.durations_i18n.name })
    .from(s.durations_i18n)
    .where(and(eq(s.durations_i18n.entity_id, id), eq(s.durations_i18n.locale, 'es')))
    .limit(1)
  return r?.name ?? ''
}
