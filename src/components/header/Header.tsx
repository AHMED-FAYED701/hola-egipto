import Image from 'next/image'
import { getTranslations } from 'next-intl/server'

import type { Locale } from '@/i18n/routing'
import { formatMonthYear } from '@/lib/format'
import { img } from '@/lib/media'
import { getShell } from '@/lib/shell'
import { polyTrip, tripCard } from '@/lib/trips'
import { docUrl, fixedPageUrl, homeUrl } from '@/lib/urls'
import { defaultMessages } from '@/lib/whatsapp'

import { MiniTripCard } from '../Cards'
import { EgyptMap } from '../EgyptMap'
import { type Alternates, LanguageSwitcher } from '../LanguageSwitcher'
import { WhatsAppLink } from '../WhatsAppLink'
import { DrawerButton, StickyHeader } from './HeaderClient'
import s from './header.module.css'
import { MegaNav, type NavItem } from './MegaNav'
import { getMapRegions } from './regions'

export async function Header({ locale, alternates }: { locale: Locale; alternates: Alternates }) {
  const { settings, navigation, latestGuides } = await getShell(locale)
  const t = await getTranslations({ locale, namespace: 'common' })
  const th = await getTranslations({ locale, namespace: 'header' })
  const tt = await getTranslations({ locale, namespace: 'trip' })
  const regions = await getMapRegions(locale)
  const waMessage = settings.whatsapp_message_default || defaultMessages[locale]

  const items: NavItem[] = (navigation.header || []).map((h) => {
    let extra = null
    if (h.panel_extra === 'featured') {
      const p = polyTrip(h.featured)
      if (p) {
        const c = tripCard(p[1], p[0], locale, tt)
        extra = (
          <div>
            <h2>{th('featured')}</h2>
            <MiniTripCard href={c.href} title={c.title} image={c.image} sub={[c.duration, c.price ? `${t('from')} ${c.price}` : null].filter(Boolean).join(' · ')} />
          </div>
        )
      }
    } else if (h.panel_extra === 'map') {
      extra = (
        <div>
          <h2>{th('map')}</h2>
          <EgyptMap regions={regions} title={th('map')} />
        </div>
      )
    } else if (h.panel_extra === 'latest_guides') {
      extra = (
        <div>
          <h2>{th('latest')}</h2>
          <div style={{ display: 'grid', gap: 'var(--he-space-3)' }}>
            {latestGuides.map((g) => (
              <MiniTripCard key={g.id} href={docUrl('guides', g.slug || '', locale)} title={g.title} image={img(g.featured_image, 'card')} sub={formatMonthYear(locale, g.last_updated)} />
            ))}
          </div>
        </div>
      )
    }
    return {
      label: h.label,
      href: h.href,
      columns: (h.columns || []).map((c) => ({ heading: c.heading, links: (c.links || []).map((l) => ({ label: l.label, href: l.href })) })),
      extra,
    }
  })

  return (
    <StickyHeader>
      <div className={`container ${s.bar}`}>
        <a className={s.logo} href={homeUrl(locale)}>
          <Image src="/brand/header-logo.svg" alt="Hola Egipto" width={233} height={52} loading="eager" unoptimized />
        </a>
        <MegaNav items={items} label={th('mainNav')} allLabel={t('seeAll')} showSubmenu={t('menu')} />
        <div className={s.actions}>
          <LanguageSwitcher locale={locale} alternates={alternates} className={s.switcher} currentClassName={s.switcherCurrent} label={t('languageSwitcher')} />
          <WhatsAppLink number={settings.whatsapp_number} message={waMessage} location="header" label={t('whatsappLabel')} className={`btn btn--outline ${s.wa}`}>
            <span className={s.waLabel}>{t('whatsapp')}</span>
          </WhatsAppLink>
          <a className={`btn btn--primary ${s.cta}`} href={fixedPageUrl('plan-my-trip', locale)}>
            {t('planTrip')}
          </a>
          <DrawerButton label={th('openMenu')} />
        </div>
      </div>
    </StickyHeader>
  )
}
