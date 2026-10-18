'use client'

import { ChevronDown } from 'lucide-react'
import { type KeyboardEvent, type ReactNode, useCallback, useEffect, useRef, useState } from 'react'

import s from './header.module.css'

export interface NavColumn {
  heading?: string | null
  links: { label: string; href: string }[]
}
export interface NavItem {
  label: string
  href: string
  columns: NavColumn[]
  extra?: ReactNode
}

/**
 * Header mega menu (spec §4): each item is a link plus a toggle button that opens its panel on click/Enter.
 * Esc closes and returns focus; ←/→ move between top-level items; ↓ moves into the open panel.
 */
export function MegaNav({ items, label, allLabel, showSubmenu }: { items: NavItem[]; label: string; allLabel: string; showSubmenu: string }) {
  const [open, setOpen] = useState<number | null>(null)
  const navRef = useRef<HTMLElement>(null)
  const toggles = useRef<(HTMLButtonElement | null)[]>([])

  const close = useCallback((focus = false) => {
    setOpen((cur) => {
      if (focus && cur !== null) toggles.current[cur]?.focus()
      return null
    })
  }, [])

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) close()
    }
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') close(true)
    }
    document.addEventListener('click', onDoc)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('click', onDoc)
      document.removeEventListener('keydown', onKey)
    }
  }, [close])

  const onKeyDown = (i: number) => (e: KeyboardEvent<HTMLElement>) => {
    const n = items.length
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      e.preventDefault()
      const next = (i + (e.key === 'ArrowRight' ? 1 : -1) + n) % n
      toggles.current[next]?.focus()
      if (open !== null) setOpen(next)
    } else if (e.key === 'ArrowDown' && open === i) {
      e.preventDefault()
      document.getElementById(`mega-${i}`)?.querySelector<HTMLAnchorElement>('a')?.focus()
    }
  }

  return (
    <nav className={s.nav} aria-label={label} ref={navRef}>
      <ul className={s.navList}>
        {items.map((it, i) => (
          <li key={it.href} className={s.navItem} onKeyDown={onKeyDown(i)}>
            <a className={s.navLink} href={it.href}>
              {it.label}
            </a>
            {it.columns.length || it.extra ? (
              <>
                <button
                  type="button"
                  className={s.toggle}
                  aria-expanded={open === i}
                  aria-controls={`mega-${i}`}
                  aria-label={`${showSubmenu}: ${it.label}`}
                  ref={(el) => {
                    toggles.current[i] = el
                  }}
                  onClick={() => setOpen(open === i ? null : i)}
                >
                  <ChevronDown aria-hidden="true" strokeWidth={1.75} />
                </button>
                <div id={`mega-${i}`} className={s.panel} hidden={open !== i}>
                  <div className={`container ${s.panelGrid}`}>
                    {it.columns.map((c, ci) => (
                      <div key={ci}>
                        {c.heading ? <h2>{c.heading}</h2> : null}
                        <ul>
                          {c.links.map((l) => (
                            <li key={l.href}>
                              <a href={l.href}>{l.label}</a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                    <div className={s.panelExtra}>
                      {it.extra}
                      <a className={`${s.all} text-link`} href={it.href}>
                        {allLabel}: {it.label}
                      </a>
                    </div>
                  </div>
                </div>
              </>
            ) : null}
          </li>
        ))}
      </ul>
    </nav>
  )
}
