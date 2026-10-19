import { createHash, createHmac, timingSafeEqual } from 'node:crypto'

/** Server-only helpers around APP_SECRET. Values are never logged. */

const secret = () => process.env.APP_SECRET || ''

export function hmacHex(key: string, msg: string): string {
  return createHmac('sha256', key).update(msg).digest('hex')
}

export function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a)
  const bb = Buffer.from(b)
  return ab.length === bb.length && timingSafeEqual(ab, bb)
}

/** Value of the `hola_preview` cookie (contracts §3). */
export function previewCookieValue(): string {
  return hmacHex(secret(), 'preview|' + (process.env.HOLA_PREVIEW_KEY || ''))
}

/** Inquiry token `<ts>.<hmac>` (contracts §7). */
export function makeInquiryToken(ts = Math.floor(Date.now() / 1000)): string {
  return `${ts}.${hmacHex(secret(), 'inq|' + ts)}`
}

export function verifyInquiryToken(token: unknown, now = Math.floor(Date.now() / 1000)): boolean {
  if (typeof token !== 'string') return false
  const m = /^(\d{9,12})\.([0-9a-f]{64})$/.exec(token)
  if (!m) return false
  const ts = Number(m[1])
  const age = now - ts
  if (age < 3 || age > 48 * 3600) return false
  return safeEqual(m[2], hmacHex(secret(), 'inq|' + ts))
}

/** Thank-you reference `<id>.<hmac>` (contracts §7). */
export function makeRef(id: number | string): string {
  return `${id}.${hmacHex(secret(), 'ref|' + id)}`
}

export function parseRef(ref: unknown): string | null {
  if (typeof ref !== 'string') return null
  const m = /^(\d{1,12})\.([0-9a-f]{64})$/.exec(ref)
  if (!m) return null
  return safeEqual(m[2], hmacHex(secret(), 'ref|' + m[1])) ? m[1] : null
}

/** Hex SHA-256 of the IP plus APP_SECRET (inquiries.ip_hash, login_attempts.ip_hash). */
export function ipHash(ip: string): string {
  return createHash('sha256').update(ip + secret()).digest('hex')
}

export const flag = (name: string) => process.env[name] === '1'
