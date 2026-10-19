import { after } from 'next/server'

import { isLocale, type Locale } from '@/i18n/routing'
import { type Fields, message, notify, one, postWebhook, store, validate } from '@/lib/inquiry'
import { countRecentByIp } from '@/lib/content/inquiries'
import { flag, ipHash, verifyInquiryToken } from '@/lib/secrets'
import { siteUrl } from '@/lib/site'
import { fixedPageUrl } from '@/lib/urls'

export const dynamic = 'force-dynamic'

/** More than 5 per ip_hash per hour (contracts §7); counted in the database, not in memory (Hostinger idles processes). */
async function rateLimited(hash: string): Promise<boolean> {
  return (await countRecentByIp(hash)) >= 5
}

async function readFields(req: Request): Promise<{ fields: Fields; isForm: boolean } | null> {
  const ct = (req.headers.get('content-type') || '').toLowerCase()
  if (ct.includes('application/json')) {
    try {
      const body = (await req.json()) as Record<string, unknown>
      const fields: Fields = {}
      for (const [k, v] of Object.entries(body)) fields[k] = Array.isArray(v) ? v.map(String) : v === null || v === undefined ? '' : String(v)
      return { fields, isForm: false }
    } catch {
      return null
    }
  }
  if (ct.includes('application/x-www-form-urlencoded') || ct.includes('multipart/form-data')) {
    const fd = await req.formData()
    const fields: Fields = {}
    fd.forEach((v, k) => {
      if (typeof v !== 'string') return
      const key = k.endsWith('[]') ? k.slice(0, -2) : k
      const prev = fields[key]
      fields[key] = prev === undefined ? (k.endsWith('[]') ? [v] : v) : ([] as string[]).concat(prev, v)
    })
    return { fields, isForm: true }
  }
  return null
}

async function verifyTurnstile(token: string, ip: string): Promise<boolean> {
  try {
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: new URLSearchParams({ secret: process.env.TURNSTILE_SECRET_KEY || '', response: token, remoteip: ip }),
      signal: AbortSignal.timeout(5000),
    })
    const data = (await res.json()) as { success?: boolean }
    return Boolean(data.success)
  } catch {
    return false
  }
}

/** Same-origin path to send a form-encoded visitor back to (never an open redirect). */
function backUrl(pageUrl: string, lang: Locale): string {
  try {
    const u = new URL(pageUrl, siteUrl())
    if (u.origin === new URL(siteUrl()).origin && u.pathname.startsWith('/')) return u.pathname
  } catch {
    // fall through
  }
  return fixedPageUrl('plan-my-trip', lang)
}

/** POST /api/hola/inquiry (contracts §7): JSON or form-encoded (the no-JavaScript path). */
export async function POST(req: Request) {
  const parsed = await readFields(req)
  const fields = parsed?.fields ?? {}
  const isForm = parsed?.isForm ?? false
  const langRaw = one(fields, 'lang')
  const lang: Locale = isLocale(langRaw) ? langRaw : 'es'
  const noStore = { 'Cache-Control': 'no-store' }

  const fail = (status: number, errors: Record<string, string>) => {
    if (isForm) {
      const back = backUrl(one(fields, 'page_url'), lang)
      const loc = `${back}?errors=${encodeURIComponent(Object.keys(errors).join(','))}#form`
      return new Response(null, { status: 303, headers: { Location: loc, ...noStore } })
    }
    return Response.json({ ok: false, errors }, { status, headers: noStore })
  }

  if (!parsed) return fail(400, { form: message(lang, 'form') })
  if (!isLocale(langRaw)) return fail(422, { lang: message(lang, 'lang') })
  // Honeypot and token
  if (one(fields, 'website')) return fail(400, { form: message(lang, 'form') })
  if (!verifyInquiryToken(one(fields, 'token'))) return fail(400, { form: message(lang, 'form') })

  const ip = (req.headers.get('x-forwarded-for') || '').split(',')[0].trim() || req.headers.get('x-real-ip') || '0.0.0.0'
  const hash = ipHash(ip)
  const dev = flag('HOLA_DEV_MODE')
  const test = dev && req.headers.get('x-hola-test') === '1'

  // Turnstile: required when both keys are set; without keys only accepted in dev mode
  const hasTurnstile = Boolean(process.env.TURNSTILE_SITE_KEY && process.env.TURNSTILE_SECRET_KEY)
  if (hasTurnstile) {
    if (!(await verifyTurnstile(one(fields, 'cf-turnstile-response'), ip))) return fail(400, { form: message(lang, 'form') })
  } else if (!dev) {
    return fail(400, { form: message(lang, 'form') })
  }

  if (!test && (await rateLimited(hash))) return fail(429, { form: message(lang, 'rate') })

  const { errors, result } = await validate(fields, lang)
  if (!result) return fail(422, errors)

  const { doc, redirect } = await store(result, { ipHash: hash, sample: test })
  await notify(result, doc.id)
  after(() => postWebhook(result, doc.id, doc.created_at.toISOString()))

  if (isForm) return new Response(null, { status: 303, headers: { Location: redirect, ...noStore } })
  return Response.json({ ok: true, id: doc.id, redirect }, { status: 201, headers: noStore })
}
