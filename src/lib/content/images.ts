/** Image library (contracts §13): rows for files in public/images/, no uploads. */
import { asc, count, eq, inArray, like, or } from 'drizzle-orm'

import { getDb } from '@/db/client'
import * as s from '@/db/schema'

export type ImageRow = typeof s.images.$inferSelect

export async function listImages(q = ''): Promise<ImageRow[]> {
  const db = getDb()
  const where = q ? or(like(s.images.path, `%${q}%`), like(s.images.alt_es, `%${q}%`), like(s.images.alt_en, `%${q}%`)) : undefined
  return db.select().from(s.images).where(where).orderBy(asc(s.images.path))
}

export async function getImage(id: number): Promise<ImageRow | null> {
  const [row] = await getDb().select().from(s.images).where(eq(s.images.id, id)).limit(1)
  return row ?? null
}

export async function imagesByIds(ids: number[]): Promise<ImageRow[]> {
  if (!ids.length) return []
  return getDb().select().from(s.images).where(inArray(s.images.id, ids))
}

/** Insert or update the row for `path` (unique). Returns its id. */
export async function upsertImage(v: { path: string; alt_es: string; alt_en: string; width: number; height: number; hola_sample?: boolean }): Promise<number> {
  const db = getDb()
  const [row] = await db.select({ id: s.images.id }).from(s.images).where(eq(s.images.path, v.path)).limit(1)
  if (row) {
    await db
      .update(s.images)
      .set({ ...v, updated_at: new Date() })
      .where(eq(s.images.id, row.id))
    return row.id
  }
  const now = new Date()
  const [res] = await db
    .insert(s.images)
    .values({ hola_sample: false, ...v, created_at: now, updated_at: now })
    .$returningId()
  return res.id
}

export async function updateImageAlt(id: number, alt_es: string, alt_en: string): Promise<void> {
  await getDb().update(s.images).set({ alt_es, alt_en, updated_at: new Date() }).where(eq(s.images.id, id))
}

export async function deleteImage(id: number): Promise<void> {
  await getDb().delete(s.images).where(eq(s.images.id, id))
}

export async function countImages(): Promise<{ total: number; sample: number }> {
  const db = getDb()
  const [[a], [b]] = await Promise.all([db.select({ n: count() }).from(s.images), db.select({ n: count() }).from(s.images).where(eq(s.images.hola_sample, true))])
  return { total: Number(a.n), sample: Number(b.n) }
}
