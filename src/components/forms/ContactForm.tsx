'use client'

import { useEffect, useRef } from 'react'

import { ATTRIBUTION_KEY } from '../Tracking'
import s from './forms.module.css'

const ATTR = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'fbclid', 'landing']

/** Short contact form (form=contact) on the same inquiry endpoint; works without JavaScript. */
export function ContactForm({ lang, token, pageUrl, privacyHref, serverErrors, l }: { lang: 'es' | 'en'; token: string; pageUrl: string; privacyHref: string; serverErrors: string[]; l: Record<string, string> }) {
  const form = useRef<HTMLFormElement>(null)
  useEffect(() => {
    try {
      const data = JSON.parse(sessionStorage.getItem(ATTRIBUTION_KEY) || '{}') as Record<string, string>
      for (const k of ATTR) {
        const el = form.current?.elements.namedItem(k) as HTMLInputElement | null
        if (el && data[k]) el.value = data[k]
      }
    } catch {
      // nothing stored
    }
  }, [])
  const err = (n: string) => serverErrors.includes(n)
  return (
    <form id="form" ref={form} method="post" action="/api/hola/inquiry" className={s.form} aria-labelledby="contact-form-title">
      <h2 id="contact-form-title">{l.formTitle}</h2>
      {serverErrors.length ? (
        <div className={s.summary} role="alert">
          <h3 className="h4">{l.errorsTitle}</h3>
          <p>{l.errorGeneric}</p>
        </div>
      ) : null}
      <input type="hidden" name="form" value="contact" />
      <input type="hidden" name="lang" value={lang} />
      <input type="hidden" name="token" defaultValue={token} />
      <input type="hidden" name="page_url" value={pageUrl} />
      {ATTR.map((k) => (
        <input key={k} type="hidden" name={k} defaultValue="" />
      ))}
      <div className={s.hp} aria-hidden="true">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
        </label>
      </div>
      <div className={s.row}>
        <div className="field">
          <label htmlFor="c-name">
            {l.name} ({l.required})
          </label>
          <input id="c-name" type="text" name="name" autoComplete="name" required minLength={2} maxLength={80} aria-invalid={err('name') || undefined} />
        </div>
        <div className="field">
          <label htmlFor="c-email">
            {l.email} ({l.required})
          </label>
          <input id="c-email" type="email" name="email" autoComplete="email" required aria-invalid={err('email') || undefined} />
        </div>
      </div>
      <div className="field">
        <label htmlFor="c-message">{l.message}</label>
        <textarea id="c-message" name="message" maxLength={2000} />
      </div>
      <label className="check">
        <input type="checkbox" name="consent" value="1" required aria-invalid={err('consent') || undefined} />
        <span>
          {l.consent.split(l.privacy)[0]}
          <a href={privacyHref} target="_blank" rel="noopener">
            {l.privacy}
          </a>
          {l.consent.split(l.privacy)[1] ?? ''}
        </span>
      </label>
      <button type="submit" className="btn btn--primary" style={{ marginTop: 'var(--he-space-4)' }}>
        {l.send}
      </button>
    </form>
  )
}
