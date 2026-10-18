'use client'

import { useEffect } from 'react'

const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'fbclid'] as const
export const ATTRIBUTION_KEY = 'hola_attribution'

function push(obj: Record<string, unknown>) {
  const w = window as unknown as { dataLayer: unknown[] }
  w.dataLayer = w.dataLayer || []
  w.dataLayer.push(obj)
}

/**
 * Site-wide client tracking:
 * - click delegation for [data-he-event] links (whatsapp_click, language_switch) — contracts §15;
 * - first-touch attribution (utm_*, gclid, fbclid, landing page) kept in sessionStorage and sent only with the form.
 */
export function Tracking({ language }: { language: string }) {
  useEffect(() => {
    try {
      if (!sessionStorage.getItem(ATTRIBUTION_KEY)) {
        const q = new URLSearchParams(location.search)
        const data: Record<string, string> = { landing: location.origin + location.pathname }
        for (const k of UTM_KEYS) {
          const v = q.get(k)
          if (v) data[k] = v.slice(0, 200)
        }
        sessionStorage.setItem(ATTRIBUTION_KEY, JSON.stringify(data))
      }
    } catch {
      // storage unavailable
    }
    const onClick = (e: MouseEvent) => {
      const el = (e.target as Element | null)?.closest?.('[data-he-event]') as HTMLElement | null
      if (!el) return
      const ev = el.dataset.heEvent
      if (ev === 'whatsapp_click') {
        push({ event: 'whatsapp_click', location: el.dataset.heLocation || 'page', trip_id: el.dataset.heTrip || null, language })
      } else if (ev === 'language_switch') {
        push({ event: 'language_switch', from: el.dataset.heFrom, to: el.dataset.heTo })
      }
    }
    document.addEventListener('click', onClick, true)
    return () => document.removeEventListener('click', onClick, true)
  }, [language])
  return null
}
