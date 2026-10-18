'use client'

import { Menu, X } from 'lucide-react'
import { type ReactNode, useEffect, useRef, useState } from 'react'

import s from './header.module.css'

/** Sticky header: sets data-scrolled after 120 px (88 → 64 px tall). */
export function StickyHeader({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    let last = false
    const on = () => {
      const v = window.scrollY > 120
      if (v !== last) {
        last = v
        el.dataset.scrolled = String(v)
      }
    }
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])
  return (
    <header className={s.header} ref={ref} data-scrolled="false">
      {children}
    </header>
  )
}

const EVT = 'he:drawer'

export function DrawerButton({ label }: { label: string }) {
  const [open, setOpen] = useState(false)
  useEffect(() => {
    const on = (e: Event) => setOpen(Boolean((e as CustomEvent).detail))
    document.addEventListener(EVT + ':state', on)
    return () => document.removeEventListener(EVT + ':state', on)
  }, [])
  return (
    <button
      type="button"
      className={s.burger}
      aria-expanded={open}
      aria-controls="site-drawer"
      aria-label={label}
      onClick={() => document.dispatchEvent(new CustomEvent(EVT, { detail: true }))}
    >
      <Menu aria-hidden="true" strokeWidth={1.75} />
    </button>
  )
}

/** Off-canvas drawer (< 1024 px). Rendered after <main>; opened by DrawerButton. Esc / backdrop close it. */
export function Drawer({ children, closeLabel, label, logo }: { children: ReactNode; closeLabel: string; label: string; logo: ReactNode }) {
  const [open, setOpen] = useState(false)
  const panel = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const on = (e: Event) => setOpen(Boolean((e as CustomEvent).detail))
    document.addEventListener(EVT, on)
    return () => document.removeEventListener(EVT, on)
  }, [])
  useEffect(() => {
    document.dispatchEvent(new CustomEvent(EVT + ':state', { detail: open }))
    if (!open) return
    const prev = document.activeElement as HTMLElement | null
    panel.current?.querySelector<HTMLElement>('button, a')?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
      if (e.key === 'Tab' && panel.current) {
        const f = panel.current.querySelectorAll<HTMLElement>('a[href], button, summary')
        const first = f[0]
        const last = f[f.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last?.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first?.focus()
        }
      }
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
      prev?.focus()
    }
  }, [open])
  return (
    <div id="site-drawer" className={s.drawer} hidden={!open} onClick={(e) => e.target === e.currentTarget && setOpen(false)}>
      <div className={s.drawerPanel} ref={panel} role="dialog" aria-modal="true" aria-label={label}>
        <div className={s.drawerTop}>
          {logo}
          <button type="button" className={s.burger} style={{ display: 'inline-flex' }} onClick={() => setOpen(false)} aria-label={closeLabel}>
            <X aria-hidden="true" strokeWidth={1.75} />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
