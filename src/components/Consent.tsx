'use client'

import { useEffect, useState } from 'react'

import s from './consent.module.css'

const COOKIE = 'hola_consent'
const OPEN_EVT = 'he:consent-open'

type Choice = 'granted' | 'denied'

function readChoice(): Choice | null {
  const m = document.cookie.match(/(?:^|; )hola_consent=([^;]+)/)
  return m && (m[1] === 'granted' || m[1] === 'denied') ? m[1] : null
}

/** Same shape as the bootstrap's gtag(): pushes the arguments object. */
function gtag(..._args: unknown[]) {
  const w = window as unknown as { dataLayer: unknown[] }
  w.dataLayer = w.dataLayer || []
  // eslint-disable-next-line prefer-rest-params
  w.dataLayer.push(arguments)
}

function save(choice: Choice) {
  const secure = location.protocol === 'https:' ? '; Secure' : ''
  document.cookie = `${COOKIE}=${choice}; Path=/; Max-Age=31536000; SameSite=Lax${secure}`
  const v = choice === 'granted' ? 'granted' : 'denied'
  gtag('consent', 'update', { analytics_storage: v, ad_storage: v, ad_user_data: v, ad_personalization: v })
  ;(window as unknown as { dataLayer: unknown[] }).dataLayer.push({ event: 'consent_update', consent: choice })
}

/** Own consent banner with Consent Mode v2 (contracts §15). Rendered after <main>. */
export function ConsentBanner({ title, text, accept, reject, policyLabel, policyHref }: { title: string; text: string; accept: string; reject: string; policyLabel: string; policyHref: string }) {
  const [open, setOpen] = useState(false)
  useEffect(() => {
    // Deferred: the banner only exists on the client (no cookie read during SSR).
    queueMicrotask(() => {
      if (!readChoice()) setOpen(true)
    })
    const on = () => setOpen(true)
    document.addEventListener(OPEN_EVT, on)
    return () => document.removeEventListener(OPEN_EVT, on)
  }, [])
  if (!open) return null
  const choose = (c: Choice) => {
    save(c)
    setOpen(false)
  }
  return (
    <section className={s.banner} role="region" aria-labelledby="consent-title">
      <h2 id="consent-title">{title}</h2>
      <p>
        {text} <a href={policyHref}>{policyLabel}</a>
      </p>
      <div className={s.buttons}>
        <button type="button" onClick={() => choose('denied')}>
          {reject}
        </button>
        <button type="button" onClick={() => choose('granted')}>
          {accept}
        </button>
      </div>
    </section>
  )
}

export function ConsentManageButton({ className, label }: { className?: string; label: string }) {
  return (
    <button type="button" className={className} onClick={() => document.dispatchEvent(new CustomEvent(OPEN_EVT))}>
      {label}
    </button>
  )
}
