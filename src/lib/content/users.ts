/** Admin users and the login rate limit (contracts §18). Passwords: bcryptjs, cost 12. */
import bcrypt from 'bcryptjs'
import { and, asc, count, eq, gte, like, or, sql } from 'drizzle-orm'

import { getDb } from '@/db/client'
import * as s from '@/db/schema'

export type UserRow = typeof s.users.$inferSelect
export type Role = 'admin' | 'editor'
export const MIN_PASSWORD = 10

export const hashPassword = (pw: string) => bcrypt.hash(pw, 12)
export const checkPassword = (pw: string, hash: string) => bcrypt.compare(pw, hash)

export async function countUsers(): Promise<number> {
  const [{ n }] = await getDb().select({ n: count() }).from(s.users)
  return Number(n)
}

export async function listUsers(): Promise<UserRow[]> {
  return getDb().select().from(s.users).orderBy(asc(s.users.email))
}

export async function getUser(id: number): Promise<UserRow | null> {
  const [u] = await getDb().select().from(s.users).where(eq(s.users.id, id)).limit(1)
  return u ?? null
}

export async function getUserByEmail(email: string): Promise<UserRow | null> {
  const [u] = await getDb().select().from(s.users).where(eq(s.users.email, email.trim().toLowerCase())).limit(1)
  return u ?? null
}

export async function createUser(email: string, password: string, role: Role): Promise<number> {
  const [res] = await getDb()
    .insert(s.users)
    .values({ email: email.trim().toLowerCase(), password_hash: await hashPassword(password), role, session_version: 1, created_at: new Date() })
    .$returningId()
  return res.id
}

/** New password; bumps session_version so every existing session ends. */
export async function setPassword(id: number, password: string): Promise<void> {
  await getDb()
    .update(s.users)
    .set({ password_hash: await hashPassword(password), session_version: sql`${s.users.session_version} + 1` })
    .where(eq(s.users.id, id))
}

export async function setRole(id: number, role: Role): Promise<void> {
  await getDb().update(s.users).set({ role }).where(eq(s.users.id, id))
}

export async function deleteUser(id: number): Promise<void> {
  await getDb().delete(s.users).where(eq(s.users.id, id))
}

export async function touchLogin(id: number): Promise<void> {
  await getDb().update(s.users).set({ last_login_at: new Date() }).where(eq(s.users.id, id))
}

/** Temporary test users (`@hola.test`, contracts §9). */
export async function deleteTestUsers(): Promise<number> {
  const [res] = await getDb().delete(s.users).where(like(s.users.email, '%@hola.test'))
  return Number((res as { affectedRows?: number }).affectedRows) || 0
}

// --------------------------------------------------------- login attempts
const WINDOW_MS = 15 * 60_000
export const MAX_FAILED = 5

export async function failedAttempts(ipHash: string, email: string): Promise<number> {
  const since = new Date(Date.now() - WINDOW_MS)
  const db = getDb()
  const [[a], [b]] = await Promise.all([
    db.select({ n: count() }).from(s.login_attempts).where(and(eq(s.login_attempts.ip_hash, ipHash), gte(s.login_attempts.created_at, since))),
    db.select({ n: count() }).from(s.login_attempts).where(and(eq(s.login_attempts.email, email), gte(s.login_attempts.created_at, since))),
  ])
  return Math.max(Number(a.n), Number(b.n))
}

export async function recordFailedAttempt(ipHash: string, email: string): Promise<void> {
  await getDb().insert(s.login_attempts).values({ ip_hash: ipHash, email: email.slice(0, 191), created_at: new Date() })
}

export async function clearAttempts(ipHash: string, email: string): Promise<void> {
  await getDb()
    .delete(s.login_attempts)
    .where(or(eq(s.login_attempts.ip_hash, ipHash), eq(s.login_attempts.email, email)))
}
