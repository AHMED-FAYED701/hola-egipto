import type { ReactNode } from 'react'

import type { Locale } from '@/i18n/routing'
import { getShell } from '@/lib/shell'
import { siteUrl } from '@/lib/site'
import { homeUrl } from '@/lib/urls'

import { Footer } from './Footer'
import { Header } from './header/Header'
import { SiteDrawer } from './header/Drawer'
import { MobileBar, type StickyTrip } from './header/MobileBar'
import { JsonLd } from './JsonLd'
import type { Alternates } from './LanguageSwitcher'

/** Site-wide TravelAgency node (contracts §10). */
export async function travelAgency(locale: Locale) {
  const { settings } = await getShell(locale)
  const base = siteUrl()
  const node: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'TravelAgency',
    '@id': `${base}/#organization`,
    name: 'Hola Egipto',
    url: base + homeUrl(locale),
    logo: `${base}/brand/hola-egipto-logo-stacked-color.svg`,
    image: `${base}/brand/og/og-default-${locale}-1200x630.png`,
    areaServed: { '@type': 'Country', name: 'Egypt' },
    availableLanguage: [
      { '@type': 'Language', name: 'Spanish', alternateName: 'es' },
      { '@type': 'Language', name: 'English', alternateName: 'en' },
    ],
  }
  if (settings.whatsapp_number) {
    node.contactPoint = {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      url: `https://wa.me/${settings.whatsapp_number}`,
      availableLanguage: ['es', 'en'],
    }
  }
  if (settings.licence_number) node.identifier = settings.licence_number
  if (settings.legal_name) node.legalName = settings.legal_name
  const sameAs = (settings.social || []).map((s) => s.url).filter(Boolean)
  if (sameAs.length) node.sameAs = sameAs
  return node
}

/**
 * Header + <main id="main"> + footer for every page. The drawer, the mobile bar and (in the layout) the
 * consent banner come after <main>, so the layout's skip link stays the first link in the document.
 */
export async function PageShell({
  locale,
  alternates,
  stickyTrip,
  children,
}: {
  locale: Locale
  alternates: Alternates
  stickyTrip?: StickyTrip | null
  children: ReactNode
}) {
  return (
    <>
      <Header locale={locale} alternates={alternates} />
      <main id="main" tabIndex={-1}>
        {children}
      </main>
      <Footer locale={locale} alternates={alternates} />
      <MobileBar locale={locale} trip={stickyTrip} />
      <SiteDrawer locale={locale} alternates={alternates} />
      <JsonLd data={await travelAgency(locale)} />
    </>
  )
}
