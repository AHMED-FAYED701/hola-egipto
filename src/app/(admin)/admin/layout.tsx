import '@/styles/tokens.css'
import '@/styles/fonts.css'
import './admin.css'

import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'

import { adminLang } from '@/admin/server'

// Every admin page reads the session cookie: rendered per request, never at build time (contracts §16).
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: { default: 'Admin · Hola Egipto', template: '%s · Admin · Hola Egipto' },
  robots: { index: false, follow: false },
}

export const viewport: Viewport = { themeColor: '#133232', width: 'device-width', initialScale: 1 }

/** Admin root layout (outside [locale], no next-intl; contracts §1, §18). */
export default async function AdminRootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang={await adminLang()}>
      <body className="adm">{children}</body>
    </html>
  )
}
