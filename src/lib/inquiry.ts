import 'server-only'

import type { Locale } from '@/i18n/routing'

import { createInquiry, type InquiryRow } from './content/inquiries'
import { findById, getSettings } from './content/read'
import { sendMail } from './mail'
import { makeRef } from './secrets'
import { absolute, docUrl, fixedPageUrl, TRIP_COLLECTION, type TripType } from './urls'

export type Fields = Record<string, string | string[]>

const MSG: Record<Locale, Record<string, string>> = {
  es: {
    name: 'Escribe tu nombre (entre 2 y 80 caracteres).',
    email: 'Escribe un email válido.',
    consent: 'Necesitamos tu consentimiento para responderte.',
    adults: 'Indica cuántos adultos viajan (de 1 a 30).',
    trip: 'El viaje seleccionado no está disponible.',
    message: 'El mensaje no puede superar los 2000 caracteres.',
    form: 'No hemos podido enviar el formulario. Recarga la página e inténtalo de nuevo.',
    rate: 'Has enviado varias solicitudes seguidas. Inténtalo más tarde o escríbenos por WhatsApp.',
    lang: 'Idioma no válido.',
  },
  en: {
    name: 'Enter your name (2 to 80 characters).',
    email: 'Enter a valid email address.',
    consent: 'We need your consent to reply to you.',
    adults: 'Tell us how many adults are travelling (1 to 30).',
    trip: 'The selected trip is not available.',
    message: 'The message cannot be longer than 2000 characters.',
    form: 'We could not send the form. Reload the page and try again.',
    rate: 'You have sent several requests in a row. Try again later or message us on WhatsApp.',
    lang: 'Invalid language.',
  },
}
export const message = (locale: Locale, key: string) => MSG[locale][key] ?? key

export const one = (f: Fields, k: string): string => {
  const v = f[k]
  return (Array.isArray(v) ? v[0] : v ?? '').toString().trim()
}
export const many = (f: Fields, k: string): string[] => {
  const v = f[k] ?? f[`${k}[]`]
  return (Array.isArray(v) ? v : v ? [v] : []).map((x) => String(x).trim()).filter(Boolean).slice(0, 12)
}

const EMAIL = /^[^\s@]{1,64}@[^\s@]{1,255}\.[^\s@]{2,}$/
const clip = (s: string, n = 300) => s.slice(0, n)

export interface Validated {
  data: Record<string, unknown>
  trip: { collection: string; id: number; title: string; url: string; type: TripType } | null
}

/** Field validation (contracts §7). Returns errors keyed by field, in the inquiry language. */
export async function validate(f: Fields, lang: Locale): Promise<{ errors: Record<string, string>; result?: Validated }> {
  const errors: Record<string, string> = {}
  const form = one(f, 'form') === 'contact' ? 'contact' : 'plan_my_trip'
  const name = one(f, 'name')
  const email = one(f, 'email')
  if (name.length < 2 || name.length > 80) errors.name = message(lang, 'name')
  if (!EMAIL.test(email) || email.length > 254) errors.email = message(lang, 'email')
  if (one(f, 'consent') !== '1' && one(f, 'consent') !== 'on' && one(f, 'consent') !== 'true') errors.consent = message(lang, 'consent')
  let adults: number | null = null
  const adultsRaw = one(f, 'adults')
  if (form === 'plan_my_trip' || adultsRaw) {
    adults = /^\d{1,2}$/.test(adultsRaw) ? Number(adultsRaw) : NaN
    if (!Number.isInteger(adults) || adults < 1 || adults > 30) errors.adults = message(lang, 'adults')
  }
  const msg = one(f, 'message')
  if (msg.length > 2000) errors.message = message(lang, 'message')

  let trip: Validated['trip'] = null
  // The no-JavaScript form posts `trip=<type>-<id>`; the API contract uses trip_id + trip_type.
  const combined = /^(tour|cruise|excursion)-(\d+)$/.exec(one(f, 'trip'))
  const tripId = one(f, 'trip_id') || (combined ? combined[2] : '')
  const tripType = (one(f, 'trip_type') || (combined ? combined[1] : '')) as TripType
  if (tripId || tripType) {
    const collection = TRIP_COLLECTION[tripType]
    const id = Number(tripId)
    if (!collection || !Number.isInteger(id)) errors.trip = message(lang, 'trip')
    else {
      const d = await findById<{ title: string; slug: string | null; available: boolean }>(collection, id, lang, 0)
      if (!d || !d.available) errors.trip = message(lang, 'trip')
      else trip = { collection, id, title: d.title, url: absolute(docUrl(collection, d.slug || '', lang)), type: tripType }
    }
  }
  if (Object.keys(errors).length) return { errors }

  const numOrNull = (k: string) => {
    const v = one(f, k)
    return /^\d{1,3}$/.test(v) ? Number(v) : null
  }
  const dateOrNull = (k: string) => {
    const v = one(f, k)
    return /^\d{4}-\d{2}-\d{2}$/.test(v) ? v : null
  }
  const dateMode = one(f, 'date_mode')
  const channel = one(f, 'channel')
  return {
    errors,
    result: {
      trip,
      data: {
        form,
        trip_type: trip ? trip.type : null,
        trip_id: trip ? trip.id : null,
        interests: many(f, 'interests').map((x) => clip(x, 60)),
        length: clip(one(f, 'length'), 60),
        date_mode: ['exact', 'month', 'flexible'].includes(dateMode) ? dateMode : null,
        date_from: dateOrNull('date_from'),
        date_to: dateOrNull('date_to'),
        month: clip(one(f, 'month'), 20),
        adults,
        children: numOrNull('children'),
        children_ages: clip(one(f, 'children_ages'), 80),
        budget: clip(one(f, 'budget'), 60),
        hotel: clip(one(f, 'hotel'), 40),
        group_type: clip(one(f, 'group_type'), 40),
        name,
        email,
        whatsapp: clip(one(f, 'whatsapp'), 40),
        channel: channel === 'whatsapp' || channel === 'email' ? channel : null,
        message: msg,
        consent_at: new Date(),
        marketing: ['1', 'on', 'true'].includes(one(f, 'marketing')),
        lang,
        page_url: clip(one(f, 'page_url'), 500),
        utm: {
          source: clip(one(f, 'utm_source'), 200),
          medium: clip(one(f, 'utm_medium'), 200),
          campaign: clip(one(f, 'utm_campaign'), 200),
          term: clip(one(f, 'utm_term'), 200),
          content: clip(one(f, 'utm_content'), 200),
        },
        gclid: clip(one(f, 'gclid'), 300),
        fbclid: clip(one(f, 'fbclid'), 300),
        landing: clip(one(f, 'landing'), 500),
      },
    },
  }
}

const stamp = (d: Date) => new Intl.DateTimeFormat('sv-SE', { timeZone: 'Africa/Cairo', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false }).format(d)

/** Store, mail and return the thank-you redirect path. */
export async function store(v: Validated, extra: { ipHash: string; sample: boolean }): Promise<{ doc: InquiryRow; ref: string; redirect: string }> {
  const lang = v.data.lang as Locale
  const title = `${v.data.name} · ${v.trip?.title ?? 'Sin viaje'} · ${stamp(new Date())}`.slice(0, 255)
  const doc = await createInquiry({
    ...(v.data as Omit<InquiryRow, 'id' | 'title' | 'status' | 'tracked' | 'ip_hash' | 'hola_sample' | 'created_at' | 'updated_at'>),
    title,
    status: 'new',
    tracked: false,
    ip_hash: extra.ipHash,
    hola_sample: extra.sample,
  })
  const ref = makeRef(doc.id)
  return { doc, ref, redirect: `${fixedPageUrl('thank-you', lang)}?ref=${ref}` }
}

/** Team notification + traveller auto-reply, both through sendMail(). */
export async function notify(v: Validated, id: number) {
  const lang = v.data.lang as Locale
  const settings = await getSettings(lang)
  const team = settings.contact_email || process.env.ADMIN_EMAIL || ''
  const lines = Object.entries(v.data)
    .filter(([k]) => k !== 'trip_type' && k !== 'trip_id')
    .map(([k, val]) => `${k}: ${typeof val === 'object' && val !== null ? JSON.stringify(val) : String(val ?? '')}`)
  if (v.trip) lines.unshift(`trip: ${v.trip.title} (${v.trip.url})`)
  await sendMail({
    to: team || '(team address not set)',
    replyTo: String(v.data.email),
    subject: `Nueva solicitud #${id} · ${v.data.name}${v.trip ? ` · ${v.trip.title}` : ''}`,
    text: lines.join('\n'),
  })
  const hours = settings.reply_hours || ''
  await sendMail({
    to: String(v.data.email),
    subject: lang === 'es' ? 'Hemos recibido tu solicitud · Hola Egipto' : 'We have received your request · Hola Egipto',
    text:
      lang === 'es'
        ? `Hola ${v.data.name}:\n\nGracias por escribirnos. Una persona de nuestro equipo revisará tu solicitud y te responderá. Horario de respuesta: ${hours}\n\nHola Egipto`
        : `Hi ${v.data.name},\n\nThank you for getting in touch. Someone from our team will review your request and reply. Reply hours: ${hours}\n\nHola Egipto`,
  })
}

/** n8n webhook (after the response), signed with HOLA_WEBHOOK_SECRET. */
export async function postWebhook(v: Validated, id: number, createdAt: string) {
  const url = process.env.N8N_WEBHOOK_URL
  if (!url) return
  const { createHmac } = await import('node:crypto')
  const body = JSON.stringify({
    id,
    created_at: createdAt,
    lang: v.data.lang,
    form: v.data.form,
    trip: v.trip ? { id: v.trip.id, type: v.trip.type, title: v.trip.title, url: v.trip.url } : null,
    ...v.data,
  })
  const sig = createHmac('sha256', process.env.HOLA_WEBHOOK_SECRET || '').update(body).digest('hex')
  try {
    await fetch(url, { method: 'POST', headers: { 'content-type': 'application/json', 'X-Hola-Signature': `sha256=${sig}` }, body, signal: AbortSignal.timeout(5000) })
  } catch (e) {
    console.warn(`[webhook] ${(e as Error).message}`)
  }
}
