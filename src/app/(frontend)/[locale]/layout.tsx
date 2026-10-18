import '@/styles/tokens.css'
import '@/styles/fonts.css'
import '@/styles/global.css'

import type { Metadata, Viewport } from 'next'
import { notFound } from 'next/navigation'
import { hasLocale } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { ReactNode } from 'react'

import { ConsentBanner } from '@/components/Consent'
import { Tracking } from '@/components/Tracking'
import { routing } from '@/i18n/routing'
import { getSettings } from '@/lib/data'
import { siteUrl } from '@/lib/site'
import { DATALAYER_BOOTSTRAP, gtmSnippet } from '@/lib/tracking'
import { fixedPageUrl } from '@/lib/urls'

export const generateStaticParams = () => []

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: { default: 'Hola Egipto', template: '%s' },
  applicationName: 'Hola Egipto',
}

export const viewport: Viewport = { themeColor: '#133232', width: 'device-width', initialScale: 1 }

export default async function LocaleLayout({ children, params }: { children: ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  setRequestLocale(locale)
  const settings = await getSettings(locale)
  const t = await getTranslations({ locale, namespace: 'common' })
  const tc = await getTranslations({ locale, namespace: 'consent' })
  const gtm = settings.gtm_id?.trim()
  return (
    <html lang={locale}>
      <head>
        {/* dataLayer + Consent Mode v2 defaults: first inline script in <head> (contracts §15) */}
        <script dangerouslySetInnerHTML={{ __html: DATALAYER_BOOTSTRAP }} />
        {gtm ? <script dangerouslySetInnerHTML={{ __html: gtmSnippet(gtm) }} /> : null}
        <link rel="preload" href="/fonts/fraunces-latin-600-normal.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/plus-jakarta-sans-latin-400-normal.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      </head>
      <body>
        <a className="skip-link" href="#main">
          {t('skip')}
        </a>
        {children}
        <ConsentBanner
          title={tc('title')}
          text={tc('text')}
          accept={tc('accept')}
          reject={tc('reject')}
          policyLabel={tc('policy')}
          policyHref={fixedPageUrl('cookies', locale)}
        />
        <Tracking language={locale} />
      </body>
    </html>
  )
}
