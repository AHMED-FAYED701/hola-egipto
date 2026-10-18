import { notFound } from 'next/navigation'
import { hasLocale, NextIntlClientProvider } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'
import type { ReactNode } from 'react'

import { routing } from '@/i18n/routing'

export const generateStaticParams = () => []

export default async function LocaleLayout({ children, params }: { children: ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  setRequestLocale(locale)
  return (
    <html lang={locale}>
      <body>
        <a className="skip-link" href="#main">
          Skip
        </a>
        <NextIntlClientProvider>
          <main id="main">{children}</main>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
