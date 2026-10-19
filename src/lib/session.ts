/**
 * `hola_session` JWT (contracts §3, §18): HS256 signed with APP_SECRET, claims `sub` (user id),
 * `sv` (session_version), `exp` (7 days). This module only signs and verifies; it never touches the
 * database, so the request interceptor can use it.
 */
import { jwtVerify, SignJWT } from 'jose'

export const SESSION_COOKIE = 'hola_session'
export const SESSION_TTL_S = 7 * 24 * 3600

const key = () => new TextEncoder().encode(process.env.APP_SECRET || '')

export interface SessionClaims {
  sub: string
  sv: number
}

export async function signSession(userId: number, sessionVersion: number): Promise<string> {
  return new SignJWT({ sv: sessionVersion })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(String(userId))
    .setIssuedAt()
    .setExpirationTime(Math.floor(Date.now() / 1000) + SESSION_TTL_S)
    .sign(key())
}

/** Claims of a valid (signature + expiry) token, else null. */
export async function verifySession(token: string | null | undefined): Promise<SessionClaims | null> {
  if (!token || !process.env.APP_SECRET) return null
  try {
    const { payload } = await jwtVerify(token, key(), { algorithms: ['HS256'] })
    if (typeof payload.sub !== 'string' || typeof payload.sv !== 'number') return null
    return { sub: payload.sub, sv: payload.sv }
  } catch {
    return null
  }
}
