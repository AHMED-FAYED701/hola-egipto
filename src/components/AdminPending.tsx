'use client'

import { useEffect, useState } from 'react'

let adminPromise: Promise<boolean> | null = null

/** True once the visitor is a logged-in admin/editor (`hola_session`); preview-cookie visitors are not. */
function isAdmin(): Promise<boolean> {
  if (!adminPromise) {
    adminPromise = fetch('/api/hola/me', { credentials: 'same-origin', cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => Boolean(d && d.admin))
      .catch(() => false)
  }
  return adminPromise
}

/** `[pendiente]` shown only to logged-in admins (content rules §6); renders nothing for everyone else. */
export function AdminPending({ label, locale }: { label?: string; locale: 'es' | 'en' }) {
  const [show, setShow] = useState(false)
  useEffect(() => {
    let alive = true
    isAdmin().then((v) => alive && setShow(v))
    return () => {
      alive = false
    }
  }, [])
  if (!show) return null
  return (
    <span className="pending">
      {label ? `${label}: ` : ''}
      {locale === 'en' ? '[pending]' : '[pendiente]'}
    </span>
  )
}
