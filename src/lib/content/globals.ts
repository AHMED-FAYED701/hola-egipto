/** Single-row globals (contracts §4): site-settings and navigation. Raw reads/writes for the admin and scripts. */
import { and, asc, eq } from 'drizzle-orm'

import { getDb } from '@/db/client'
import * as s from '@/db/schema'
import type { Locale } from '@/i18n/routing'

export type SettingsShared = Omit<typeof s.site_settings.$inferInsert, 'id' | 'updated_at'>
export type SettingsLocal = Omit<typeof s.site_settings_i18n.$inferInsert, 'id' | 'entity_id' | 'locale'>
export type SettingsSharedRow = typeof s.site_settings.$inferSelect
export type SettingsLocalRow = typeof s.site_settings_i18n.$inferSelect

/** Shared columns that `hola:settings get|set` may touch (contracts §9). */
export const SHARED_SETTING_FIELDS = ['whatsapp_number', 'contact_email', 'phone', 'address', 'legal_name', 'licence_number', 'gtm_id'] as const
export type SharedSettingField = (typeof SHARED_SETTING_FIELDS)[number]

/** Id of the one site_settings row, created when missing. */
export async function ensureSettingsRow(): Promise<number> {
  const db = getDb()
  const [row] = await db.select({ id: s.site_settings.id }).from(s.site_settings).orderBy(asc(s.site_settings.id)).limit(1)
  if (row) return row.id
  const [res] = await db.insert(s.site_settings).values({ updated_at: new Date() }).$returningId()
  return res.id
}

export async function getSettingsRaw(): Promise<{ shared: SettingsSharedRow | null; i18n: Partial<Record<Locale, SettingsLocalRow>> }> {
  const db = getDb()
  const [shared] = await db.select().from(s.site_settings).orderBy(asc(s.site_settings.id)).limit(1)
  if (!shared) return { shared: null, i18n: {} }
  const rows = await db.select().from(s.site_settings_i18n).where(eq(s.site_settings_i18n.entity_id, shared.id))
  return { shared, i18n: Object.fromEntries(rows.map((r) => [r.locale, r])) }
}

export async function saveSettingsShared(values: Partial<SettingsShared>): Promise<void> {
  const id = await ensureSettingsRow()
  await getDb()
    .update(s.site_settings)
    .set({ ...values, updated_at: new Date() })
    .where(eq(s.site_settings.id, id))
}

export async function saveSettingsLocale(locale: Locale, values: Partial<SettingsLocal>): Promise<void> {
  const id = await ensureSettingsRow()
  const db = getDb()
  const [row] = await db
    .select({ id: s.site_settings_i18n.id })
    .from(s.site_settings_i18n)
    .where(and(eq(s.site_settings_i18n.entity_id, id), eq(s.site_settings_i18n.locale, locale)))
    .limit(1)
  if (row) await db.update(s.site_settings_i18n).set(values).where(eq(s.site_settings_i18n.id, row.id))
  else await db.insert(s.site_settings_i18n).values({ available: true, ...values, entity_id: id, locale })
  await db.update(s.site_settings).set({ updated_at: new Date() }).where(eq(s.site_settings.id, id))
}

export async function getSharedSetting(field: SharedSettingField): Promise<string> {
  const { shared } = await getSettingsRaw()
  return (shared?.[field] as string | null) ?? ''
}

// ------------------------------------------------------------- navigation
export interface NavLink {
  label: string
  href: string
}
export interface NavTree {
  header: { label: string; href: string; columns: { heading: string; links: NavLink[] }[]; panel_extra: string; featured: { relationTo: 'tours' | 'cruises' | 'excursions'; value: number } | null }[]
  footer_columns: { heading: string; links: NavLink[] }[]
  footer_description: string
  legal_links: NavLink[]
}

async function ensureNavigationRow(): Promise<number> {
  const db = getDb()
  const [row] = await db.select({ id: s.navigation.id }).from(s.navigation).orderBy(asc(s.navigation.id)).limit(1)
  if (row) return row.id
  const [res] = await db.insert(s.navigation).values({ updated_at: new Date() }).$returningId()
  return res.id
}

export async function getNavigationRaw(locale: Locale): Promise<NavTree | null> {
  const db = getDb()
  const [main] = await db.select().from(s.navigation).orderBy(asc(s.navigation.id)).limit(1)
  if (!main) return null
  const [row] = await db
    .select()
    .from(s.navigation_i18n)
    .where(and(eq(s.navigation_i18n.entity_id, main.id), eq(s.navigation_i18n.locale, locale)))
    .limit(1)
  return (row?.tree as unknown as NavTree) ?? null
}

export async function saveNavigation(locale: Locale, tree: NavTree): Promise<void> {
  const id = await ensureNavigationRow()
  const db = getDb()
  const [row] = await db
    .select({ id: s.navigation_i18n.id })
    .from(s.navigation_i18n)
    .where(and(eq(s.navigation_i18n.entity_id, id), eq(s.navigation_i18n.locale, locale)))
    .limit(1)
  const value = tree as unknown as Record<string, unknown>
  if (row) await db.update(s.navigation_i18n).set({ tree: value }).where(eq(s.navigation_i18n.id, row.id))
  else await db.insert(s.navigation_i18n).values({ entity_id: id, locale, available: true, tree: value })
  await db.update(s.navigation).set({ updated_at: new Date() }).where(eq(s.navigation.id, id))
}
