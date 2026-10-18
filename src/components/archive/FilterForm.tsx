'use client'

import type { ReactNode } from 'react'

/** GET form (works without JavaScript); pushes filter_use when submitted. */
export function FilterForm({ action, language, children, className, label }: { action: string; language: string; children: ReactNode; className?: string; label: string }) {
  return (
    <form
      action={action}
      method="get"
      className={className}
      aria-label={label}
      onSubmit={(e) => {
        const data = new FormData(e.currentTarget)
        const filters: Record<string, string> = {}
        data.forEach((v, k) => {
          if (typeof v === 'string' && v) filters[k] = v
        })
        // Drop empty fields from the URL so a clean archive stays clean.
        for (const el of Array.from(e.currentTarget.elements) as HTMLInputElement[]) {
          if (el.name && !el.value) el.disabled = true
        }
        const w = window as unknown as { dataLayer: unknown[] }
        w.dataLayer = w.dataLayer || []
        w.dataLayer.push({ event: 'filter_use', filters, language })
      }}
    >
      {children}
    </form>
  )
}
