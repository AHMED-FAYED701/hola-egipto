import { getTranslations } from 'next-intl/server'

import type { Locale } from '@/i18n/routing'
import { getShell } from '@/lib/shell'
import { fixedPageUrl } from '@/lib/urls'
import { defaultMessages } from '@/lib/whatsapp'

import { Icon } from './Icon'
import s from './sections.module.css'
import { WhatsAppLink } from './WhatsAppLink'

export async function StatsStrip({ locale, className }: { locale: Locale; className?: string }) {
  const { settings } = await getShell(locale)
  const stats = settings.stats || []
  if (!stats.length) return null
  return (
    <ul className={`${s.stats} ${className || ''}`}>
      {stats.map((st, i) => (
        <li key={i}>
          <strong>{st.value}</strong>
          <span>{st.label}</span>
        </li>
      ))}
    </ul>
  )
}

export async function BookingBand({ locale }: { locale: Locale }) {
  const { settings } = await getShell(locale)
  const b = settings.booking_band
  const t = await getTranslations({ locale, namespace: 'common' })
  if (!b?.enabled) return null
  return (
    <section className={`${s.band} he-dark section--tight`} aria-labelledby="booking-band-title">
      <div className={`container ${s.bandInner}`}>
        <div>
          {b.badge ? <span className={`he-badge ${s.badge}`}>{b.badge}</span> : null}
          <h2 id="booking-band-title">{b.title}</h2>
          {b.text ? <p>{b.text}</p> : null}
        </div>
        <div className={s.bandActions}>
          <a className="btn btn--primary" href={fixedPageUrl('plan-my-trip', locale)}>
            {b.primary_label || t('planTrip')}
          </a>
          <WhatsAppLink number={settings.whatsapp_number} message={settings.whatsapp_message_default || defaultMessages[locale]} location="page" label={b.secondary_label || t('whatsappLabel')} />
        </div>
      </div>
    </section>
  )
}

export async function TrustBar({ locale }: { locale: Locale }) {
  const { settings } = await getShell(locale)
  const items = (settings.trust_items || []).filter((i) => i.enabled)
  if (!items.length) return null
  return (
    <section className={`${s.trust} he-dark`} aria-label={locale === 'es' ? 'Por qué confiar en nosotros' : 'Why travel with us'}>
      <div className="container">
        <ul>
          {items.map((i, k) => (
            <li key={k}>
              <Icon name={i.icon || 'check'} />
              {i.text}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export async function CtaBand({ locale, title, text }: { locale: Locale; title?: string | null; text?: string | null }) {
  const { settings } = await getShell(locale)
  const t = await getTranslations({ locale, namespace: 'cta' })
  const tc = await getTranslations({ locale, namespace: 'common' })
  return (
    <section className={`${s.band} ${s.cta} he-dark section`} aria-labelledby="cta-band-title">
      <div className="container">
        <h2 id="cta-band-title">{title || t('title')}</h2>
        <p>{text || t('text')}</p>
        <div className={`btn-row ${s.ctaActions}`}>
          <a className="btn btn--primary" href={fixedPageUrl('plan-my-trip', locale)}>
            {tc('planTrip')}
          </a>
          <WhatsAppLink number={settings.whatsapp_number} message={settings.whatsapp_message_default || defaultMessages[locale]} location="page" label={tc('whatsappLabel')} />
        </div>
      </div>
    </section>
  )
}
