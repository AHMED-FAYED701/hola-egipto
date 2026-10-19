/**
 * Admin authentication (contracts §18): `hola_session` cookie (HS256 JWT, APP_SECRET, `sub`/`sv`/`exp` 7 days),
 * re-checked on every admin page against the users table (user exists, `sv` = session_version).
 */
import 'server-only'

import { cookies, headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { cache } from 'react'

import { getUser, type UserRow } from './content/users'
import { ipHash } from './secrets'
import { SESSION_COOKIE, SESSION_TTL_S, signSession, verifySession } from './session'
import { siteUrl } from './site'

export type AdminUser = Pick<UserRow, 'id' | 'email' | 'role' | 'session_version' | 'last_login_at' | 'created_at'>

const secure = () => siteUrl().startsWith('https')

/** The logged-in user for this request, or null (signature, expiry, user exists, session_version matches). */
export const currentUser = cache(async (): Promise<AdminUser | null> => {
  const claims = await verifySession((await cookies()).get(SESSION_COOKIE)?.value)
  if (!claims) return null
  const id = Number(claims.sub)
  if (!Number.isInteger(id)) return null
  const user = await getUser(id)
  if (!user || user.session_version !== claims.sv) return null
  return { id: user.id, email: user.email, role: user.role, session_version: user.session_version, last_login_at: user.last_login_at, created_at: user.created_at }
})

/** Admin pages: a valid session or a redirect to the login page. */
export async function requireUser(next = '/admin'): Promise<AdminUser> {
  const user = await currentUser()
  if (!user) redirect(`/admin/login?next=${encodeURIComponent(next)}`)
  return user
}

/** Admin-role pages (users, settings, navigation). Editors are sent to the dashboard. */
export async function requireAdmin(next = '/admin'): Promise<AdminUser> {
  const user = await requireUser(next)
  if (user.role !== 'admin') redirect('/admin?denied=1')
  return user
}

export async function startSession(userId: number, sessionVersion: number): Promise<void> {
  ;(await cookies()).set(SESSION_COOKIE, await signSession(userId, sessionVersion), {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_TTL_S,
    secure: secure(),
  })
}

export async function endSession(): Promise<void> {
  ;(await cookies()).set(SESSION_COOKIE, '', { httpOnly: true, sameSite: 'lax', path: '/', maxAge: 0, secure: secure() })
}

/** ip_hash of the current request (login rate limit). */
export async function requestIpHash(): Promise<string> {
  const h = await headers()
  const ip = (h.get('x-forwarded-for') || '').split(',')[0].trim() || h.get('x-real-ip') || '0.0.0.0'
  return ipHash(ip)
}

/** Only same-site relative admin paths are allowed as a post-login destination. */
export function safeNext(next: unknown): string {
  const n = typeof next === 'string' ? next : ''
  return /^\/admin(\/[A-Za-z0-9/_?=&.%-]*)?$/.test(n) && !n.startsWith('/admin/login') ? n : '/admin'
}
