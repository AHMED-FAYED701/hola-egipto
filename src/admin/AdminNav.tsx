'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import type { Dict } from './i18n'

const CONTENT = ['tours', 'cruises', 'excursions', 'destinations', 'guides', 'pages'] as const
const TAX = ['durations', 'trip-styles', 'cruise-types', 'departures', 'regions', 'guide-topics'] as const

export function AdminNav({ t, isAdmin }: { t: Dict; isAdmin: boolean }) {
  const path = usePathname().replace(/\/$/, '') || '/admin'
  const link = (href: string, label: string) => {
    const current = href === '/admin' ? path === '/admin' : path === href || path.startsWith(href + '/')
    return (
      <li key={href}>
        <Link href={href} aria-current={current ? 'page' : undefined}>
          {label}
        </Link>
      </li>
    )
  }
  return (
    <nav aria-label={t.admin}>
      <ul>{link('/admin', t.dashboard)}</ul>
      <h2>{t.content}</h2>
      <ul>{CONTENT.map((c) => link(`/admin/${c}`, t[c]))}</ul>
      <h2>{t.taxonomies}</h2>
      <ul>{TAX.map((c) => link(`/admin/${c}`, t[c]))}</ul>
      <h2>{t.admin}</h2>
      <ul>
        {link('/admin/inquiries', t.inquiries)}
        {link('/admin/images', t.images)}
        {isAdmin ? link('/admin/settings', t.settings) : null}
        {isAdmin ? link('/admin/navigation', t.navigation) : null}
        {isAdmin ? link('/admin/users', t.users) : null}
        {link('/admin/account', t.account)}
      </ul>
    </nav>
  )
}
