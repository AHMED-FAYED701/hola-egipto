'use client'

import { useEffect, useRef, useState } from 'react'

import { ATTRIBUTION_KEY } from '../Tracking'
import s from './forms.module.css'

type L = Record<string, string>

export interface PlanTripFormProps {
  lang: 'es' | 'en'
  token: string
  pageUrl: string
  privacyHref: string
  trips: { value: string; label: string }[]
  selectedTrip: string
  serverErrors: string[]
  l: L
}

const STEP_FIELDS: Record<number, string[]> = { 1: [], 2: ['adults'], 3: [], 4: ['name', 'email', 'consent'] }
const ATTR = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'fbclid', 'landing']

function push(obj: Record<string, unknown>) {
  const w = window as unknown as { dataLayer: unknown[] }
  w.dataLayer = w.dataLayer || []
  w.dataLayer.push(obj)
}

/**
 * "Plan my trip": one page, 4 steps. Server-rendered as one long form that posts form-encoded (303) without
 * JavaScript; with JavaScript: step navigation, aria-live step changes, error summary, a fresh token on
 * first focus, plan_trip_start / plan_trip_step events, and the stored first-touch attribution.
 */
export function PlanTripForm({ lang, token, pageUrl, privacyHref, trips, selectedTrip, serverErrors, l }: PlanTripFormProps) {
  const [enhanced, setEnhanced] = useState(false)
  const [step, setStep] = useState(1)
  const [errors, setErrors] = useState<string[]>(serverErrors)
  const [live, setLive] = useState('')
  const started = useRef(false)
  const form = useRef<HTMLFormElement>(null)
  const summary = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Progressive enhancement: switch to steps only once JavaScript runs (deferred to avoid a sync setState).
    queueMicrotask(() => {
      setEnhanced(true)
      if (serverErrors.some((e) => STEP_FIELDS[4].includes(e))) setStep(4)
      else if (serverErrors.includes('adults')) setStep(2)
    })
    try {
      const data = JSON.parse(sessionStorage.getItem(ATTRIBUTION_KEY) || '{}') as Record<string, string>
      for (const k of ATTR) {
        const el = form.current?.elements.namedItem(k) as HTMLInputElement | null
        if (el && data[k]) el.value = data[k]
      }
    } catch {
      // no stored attribution
    }
  }, [serverErrors])

  useEffect(() => {
    if (errors.length) summary.current?.focus()
  }, [errors])

  const onFirstFocus = async () => {
    if (started.current) return
    started.current = true
    const sel = form.current?.elements.namedItem('trip') as HTMLSelectElement | null
    push({ event: 'plan_trip_start', trip_id: sel?.value ? sel.value.split('-')[1] : null, entry_page: pageUrl, language: lang })
    try {
      const r = await fetch('/api/hola/token', { cache: 'no-store' })
      const d = (await r.json()) as { token?: string }
      const el = form.current?.elements.namedItem('token') as HTMLInputElement | null
      // A just-issued token is younger than the 3 s minimum; keep the server one if the visitor is fast.
      if (el && d.token) setTimeout(() => (el.value = d.token as string), 3500)
    } catch {
      // keep the server-rendered token
    }
  }

  const invalid = (names: string[]) =>
    names.filter((n) => {
      const el = form.current?.elements.namedItem(n) as HTMLInputElement | null
      if (!el) return false
      if (el.type === 'checkbox') return !el.checked
      if (n === 'email') return !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(el.value.trim())
      if (n === 'adults') return !(Number(el.value) >= 1 && Number(el.value) <= 30)
      return el.value.trim().length < 2
    })

  const goTo = (n: number) => {
    setStep(n)
    setLive(l.step.replace('{n}', String(n)))
    requestAnimationFrame(() => document.getElementById(`step-${n}`)?.querySelector<HTMLElement>('input, select, textarea')?.focus())
  }

  const next = () => {
    const bad = invalid(STEP_FIELDS[step])
    setErrors(bad)
    if (bad.length) return
    push({ event: 'plan_trip_step', step, language: lang })
    goTo(step + 1)
  }

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    const bad = invalid([...STEP_FIELDS[2], ...STEP_FIELDS[4]])
    if (bad.length) {
      e.preventDefault()
      setErrors(bad)
      if (enhanced) goTo(bad.includes('adults') ? 2 : 4)
      return
    }
    push({ event: 'plan_trip_step', step: 4, language: lang })
    // Split trip=<type>-<id> into the API's trip_type / trip_id
    const sel = e.currentTarget.elements.namedItem('trip') as HTMLSelectElement | null
    const [type, id] = (sel?.value || '').split('-')
    ;(e.currentTarget.elements.namedItem('trip_type') as HTMLInputElement).value = id ? type : ''
    ;(e.currentTarget.elements.namedItem('trip_id') as HTMLInputElement).value = id || ''
  }

  const err = (n: string) => errors.includes(n)
  const label: Record<string, string> = { name: l.name, email: l.email, adults: l.adults, consent: l.privacy, trip: l.trip, form: l.errorGeneric }
  const stepAttr = (n: number) => ({ 'data-active': String(!enhanced || step === n) })
  const opts = (k: string) => l[k].split('|')

  return (
    <form id="form" ref={form} method="post" action="/api/hola/inquiry" className={`${s.form} ${enhanced ? s.enhanced : ''}`} onSubmit={onSubmit} onFocus={onFirstFocus} noValidate={enhanced}>
      <div aria-live="polite" className="visually-hidden">
        {live}
      </div>
      {errors.length ? (
        <div className={s.summary} ref={summary} tabIndex={-1} role="alert">
          <h2>{l.errorsTitle}</h2>
          <ul>
            {errors.map((e) => (
              <li key={e}>{e in label ? <a href={`#f-${e}`}>{label[e]}</a> : l.errorGeneric}</li>
            ))}
          </ul>
        </div>
      ) : null}
      {enhanced ? (
        <ol className={s.progress} aria-hidden="true">
          {[1, 2, 3, 4].map((n) => (
            <li key={n} data-done={String(n <= step)} />
          ))}
        </ol>
      ) : null}

      <input type="hidden" name="form" value="plan_my_trip" />
      <input type="hidden" name="lang" value={lang} />
      <input type="hidden" name="token" defaultValue={token} />
      <input type="hidden" name="page_url" value={pageUrl} />
      <input type="hidden" name="trip_id" defaultValue="" />
      <input type="hidden" name="trip_type" defaultValue="" />
      {ATTR.map((k) => (
        <input key={k} type="hidden" name={k} defaultValue="" />
      ))}
      <div className={s.hp} aria-hidden="true">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
        </label>
      </div>

      <fieldset id="step-1" className={s.step} {...stepAttr(1)}>
        <legend>
          <span className={s.stepNo}>{l.step.replace('{n}', '1')}</span>
          {l.s1}
        </legend>
        <div className="field">
          <label htmlFor="f-trip">{l.trip}</label>
          <select id="f-trip" name="trip" defaultValue={selectedTrip}>
            <option value="">{l.notSure}</option>
            {trips.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
        <fieldset className="field">
          <legend>{l.interests}</legend>
          <div className={s.checks}>
            {['cairo', 'nile', 'luxor', 'abusimbel', 'beach', 'diving', 'desert'].map((k) => (
              <label key={k} className="check">
                <input type="checkbox" name="interests[]" value={k} />
                {l[`i_${k}`]}
              </label>
            ))}
          </div>
        </fieldset>
        <div className="field">
          <label htmlFor="f-length">{l.length}</label>
          <select id="f-length" name="length" defaultValue="">
            <option value="">—</option>
            {opts('length_opts').map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
        </div>
        {enhanced ? (
          <div className={s.nav}>
            <span />
            <button type="button" className="btn btn--primary" onClick={next}>
              {l.next}
            </button>
          </div>
        ) : null}
      </fieldset>

      <fieldset id="step-2" className={s.step} {...stepAttr(2)}>
        <legend>
          <span className={s.stepNo}>{l.step.replace('{n}', '2')}</span>
          {l.s2}
        </legend>
        <fieldset className="field">
          <legend>{l.dates}</legend>
          <div className={s.checks}>
            {(['exact', 'month', 'flexible'] as const).map((m) => (
              <label key={m} className="check">
                <input type="radio" name="date_mode" value={m} defaultChecked={m === 'flexible'} />
                {l[`date_${m}`]}
              </label>
            ))}
          </div>
        </fieldset>
        <div className={s.row}>
          <div className="field">
            <label htmlFor="f-from">{l.from}</label>
            <input id="f-from" type="date" name="date_from" />
          </div>
          <div className="field">
            <label htmlFor="f-to">{l.to}</label>
            <input id="f-to" type="date" name="date_to" />
          </div>
          <div className="field">
            <label htmlFor="f-month">{l.month}</label>
            <input id="f-month" type="month" name="month" />
          </div>
        </div>
        <div className={s.row}>
          <div className="field">
            <label htmlFor="f-adults">
              {l.adults} ({l.required})
            </label>
            <input id="f-adults" type="number" name="adults" min={1} max={30} defaultValue={2} required aria-invalid={err('adults') || undefined} aria-describedby={err('adults') ? 'e-adults' : undefined} />
            {err('adults') ? (
              <span id="e-adults" className="error">
                {l.adults}
              </span>
            ) : null}
          </div>
          <div className="field">
            <label htmlFor="f-children">{l.children}</label>
            <input id="f-children" type="number" name="children" min={0} max={20} defaultValue={0} />
          </div>
          <div className="field">
            <label htmlFor="f-ages">{l.childrenAges}</label>
            <input id="f-ages" type="text" name="children_ages" />
          </div>
        </div>
        {enhanced ? (
          <div className={s.nav}>
            <button type="button" className="btn btn--outline" onClick={() => goTo(1)}>
              {l.back}
            </button>
            <button type="button" className="btn btn--primary" onClick={next}>
              {l.next}
            </button>
          </div>
        ) : null}
      </fieldset>

      <fieldset id="step-3" className={s.step} {...stepAttr(3)}>
        <legend>
          <span className={s.stepNo}>{l.step.replace('{n}', '3')}</span>
          {l.s3}
        </legend>
        <div className={s.row}>
          <div className="field">
            <label htmlFor="f-budget">{l.budget}</label>
            <select id="f-budget" name="budget" defaultValue="">
              <option value="">—</option>
              {opts('budget_opts').map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="f-hotel">{l.hotel}</label>
            <select id="f-hotel" name="hotel" defaultValue="">
              <option value="">—</option>
              {opts('hotel_opts').map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
          </div>
        </div>
        <fieldset className="field">
          <legend>{l.groupType}</legend>
          <div className={s.checks}>
            {(['private', 'group', 'either'] as const).map((g) => (
              <label key={g} className="check">
                <input type="radio" name="group_type" value={g} defaultChecked={g === 'either'} />
                {l[g]}
              </label>
            ))}
          </div>
        </fieldset>
        {enhanced ? (
          <div className={s.nav}>
            <button type="button" className="btn btn--outline" onClick={() => goTo(2)}>
              {l.back}
            </button>
            <button type="button" className="btn btn--primary" onClick={next}>
              {l.next}
            </button>
          </div>
        ) : null}
      </fieldset>

      <fieldset id="step-4" className={s.step} {...stepAttr(4)}>
        <legend>
          <span className={s.stepNo}>{l.step.replace('{n}', '4')}</span>
          {l.s4}
        </legend>
        <div className={s.row}>
          <div className="field">
            <label htmlFor="f-name">
              {l.name} ({l.required})
            </label>
            <input id="f-name" type="text" name="name" autoComplete="name" required minLength={2} maxLength={80} aria-invalid={err('name') || undefined} />
          </div>
          <div className="field">
            <label htmlFor="f-email">
              {l.email} ({l.required})
            </label>
            <input id="f-email" type="email" name="email" autoComplete="email" required aria-invalid={err('email') || undefined} />
          </div>
        </div>
        <div className={s.row}>
          <div className="field">
            <label htmlFor="f-wa">{l.whatsapp}</label>
            <input id="f-wa" type="tel" name="whatsapp" autoComplete="tel" />
          </div>
          <fieldset className="field">
            <legend>{l.channel}</legend>
            <div className={s.checks}>
              <label className="check">
                <input type="radio" name="channel" value="email" defaultChecked />
                Email
              </label>
              <label className="check">
                <input type="radio" name="channel" value="whatsapp" />
                WhatsApp
              </label>
            </div>
          </fieldset>
        </div>
        <div className="field">
          <label htmlFor="f-message">{l.message}</label>
          <textarea id="f-message" name="message" maxLength={2000} aria-describedby="h-message" />
          <span id="h-message" className="hint">
            {l.messageHint}
          </span>
        </div>
        <label className="check" id="f-consent-wrap">
          <input id="f-consent" type="checkbox" name="consent" value="1" required aria-invalid={err('consent') || undefined} />
          <span>
            {l.consent.split(l.privacy)[0]}
            <a href={privacyHref} target="_blank" rel="noopener">
              {l.privacy}
            </a>
            {l.consent.split(l.privacy)[1] ?? ''}
          </span>
        </label>
        <label className="check">
          <input type="checkbox" name="marketing" value="1" />
          {l.marketing}
        </label>
        <div className={s.nav}>
          {enhanced ? (
            <button type="button" className="btn btn--outline" onClick={() => goTo(3)}>
              {l.back}
            </button>
          ) : (
            <span />
          )}
          <button type="submit" className="btn btn--primary">
            {l.submit}
          </button>
        </div>
      </fieldset>
    </form>
  )
}
