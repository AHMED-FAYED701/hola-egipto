/** Inquiries (contracts §7): storage, thank-you tracking, rate limit counts, admin list, retention. */
import { and, count, desc, eq, gte, inArray, lt, ne, type SQL } from 'drizzle-orm'

import { getDb } from '@/db/client'
import * as s from '@/db/schema'

export type InquiryRow = typeof s.inquiries.$inferSelect
export type InquiryInsert = typeof s.inquiries.$inferInsert
export const INQUIRY_STATUSES = ['new', 'replied', 'won', 'lost'] as const
export type InquiryStatus = (typeof INQUIRY_STATUSES)[number]

export async function createInquiry(data: Omit<InquiryInsert, 'id' | 'created_at' | 'updated_at'>): Promise<InquiryRow> {
  const now = new Date()
  const [res] = await getDb()
    .insert(s.inquiries)
    .values({ ...data, created_at: now, updated_at: now })
    .$returningId()
  return (await getInquiry(res.id)) as InquiryRow
}

export async function getInquiry(id: number): Promise<InquiryRow | null> {
  const [row] = await getDb().select().from(s.inquiries).where(eq(s.inquiries.id, id)).limit(1)
  return row ?? null
}

/** Mark the conversion as tracked. Returns true only for the call that flipped it (generate_lead fires once). */
export async function markTracked(id: number): Promise<boolean> {
  const [res] = await getDb()
    .update(s.inquiries)
    .set({ tracked: true, updated_at: new Date() })
    .where(and(eq(s.inquiries.id, id), eq(s.inquiries.tracked, false)))
  return Number((res as { affectedRows?: number }).affectedRows) > 0
}

/** Inquiries from one ip_hash in the last hour (rate limit, stored in the database for Hostinger). */
export async function countRecentByIp(ipHash: string, sinceMs = 3600_000): Promise<number> {
  const [{ n }] = await getDb()
    .select({ n: count() })
    .from(s.inquiries)
    .where(and(eq(s.inquiries.ip_hash, ipHash), gte(s.inquiries.created_at, new Date(Date.now() - sinceMs)), eq(s.inquiries.hola_sample, false)))
  return Number(n)
}

export async function countInquiries(): Promise<{ total: number; sample: number; new: number }> {
  const db = getDb()
  const [[a], [b], [c]] = await Promise.all([
    db.select({ n: count() }).from(s.inquiries),
    db.select({ n: count() }).from(s.inquiries).where(eq(s.inquiries.hola_sample, true)),
    db.select({ n: count() }).from(s.inquiries).where(eq(s.inquiries.status, 'new')),
  ])
  return { total: Number(a.n), sample: Number(b.n), new: Number(c.n) }
}

export async function listInquiries(opts: { status?: string; limit?: number; offset?: number } = {}): Promise<{ rows: InquiryRow[]; total: number }> {
  const where: SQL | undefined = opts.status && (INQUIRY_STATUSES as readonly string[]).includes(opts.status) ? eq(s.inquiries.status, opts.status) : undefined
  const db = getDb()
  const [rows, [{ n }]] = await Promise.all([
    db
      .select()
      .from(s.inquiries)
      .where(where)
      .orderBy(desc(s.inquiries.created_at), desc(s.inquiries.id))
      .limit(opts.limit ?? 50)
      .offset(opts.offset ?? 0),
    db.select({ n: count() }).from(s.inquiries).where(where),
  ])
  return { rows, total: Number(n) }
}

export async function lastInquiry(): Promise<InquiryRow | null> {
  const [row] = await getDb().select().from(s.inquiries).orderBy(desc(s.inquiries.created_at), desc(s.inquiries.id)).limit(1)
  return row ?? null
}

export async function setInquiryStatus(id: number, status: InquiryStatus): Promise<void> {
  await getDb().update(s.inquiries).set({ status, updated_at: new Date() }).where(eq(s.inquiries.id, id))
}

export async function deleteInquiries(ids: number[]): Promise<number> {
  if (!ids.length) return 0
  const [res] = await getDb().delete(s.inquiries).where(inArray(s.inquiries.id, ids))
  return Number((res as { affectedRows?: number }).affectedRows) || 0
}

/** Inquiries older than `months` whose status is not `won` (contracts §7 retention). */
export function retentionWhere(months = 24): SQL {
  const cutoff = new Date()
  cutoff.setMonth(cutoff.getMonth() - months)
  return and(lt(s.inquiries.created_at, cutoff), ne(s.inquiries.status, 'won')) as SQL
}

export async function retention(dryRun: boolean): Promise<number> {
  const db = getDb()
  if (dryRun) {
    const [{ n }] = await db.select({ n: count() }).from(s.inquiries).where(retentionWhere())
    return Number(n)
  }
  const [res] = await db.delete(s.inquiries).where(retentionWhere())
  return Number((res as { affectedRows?: number }).affectedRows) || 0
}
