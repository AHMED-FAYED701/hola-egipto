import { getTranslations } from 'next-intl/server'

import type { Locale } from '@/i18n/routing'
import { getShell } from '@/lib/shell'
import { fixedPageUrl } from '@/lib/urls'
import { defaultMessages } from '@/lib/whatsapp'

import { WhatsAppLink } from '../WhatsAppLink'
import s from './header.module.css'

export interface StickyTrip {
  id: number
  type: string
  price: string | null
  basis: string
  planHref: string
  waMessage: string
}

/** Mobile sticky bottom bar (spec §4): WhatsApp + plan; on trip pages the price-from instead of WhatsApp. */
export async function MobileBar({ locale, trip }: { locale: Locale; trip?: StickyTrip | null }) {
  const { settings } = await getShell(locale)
  const t = await getTranslations({ locale, namespace: 'common' })
  if (trip) {
    return (
      <div className={s.mobileBar}>
        {trip.price ? (
          <p className={s.mobilePrice}>
            <span>{t('from')}</span>
            <strong>{trip.price}</strong>
            <span>{trip.basis}</span>
          </p>
        ) : null}
        <a className="btn btn--primary" href={trip.planHref}>
          {t('planThisTrip')}
        </a>
      </div>
    )
  }
  return (
    <div className={s.mobileBar}>
      <WhatsAppLink number={settings.whatsapp_number} message={settings.whatsapp_message_default || defaultMessages[locale]} location="sticky" label={t('whatsappLabel')} className="btn btn--whatsapp">
        {t('whatsapp')}
      </WhatsAppLink>
      <a className="btn btn--primary" href={fixedPageUrl('plan-my-trip', locale)}>
        {t('planTrip')}
      </a>
    </div>
  )
}
