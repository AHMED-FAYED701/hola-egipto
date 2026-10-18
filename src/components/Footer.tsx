import Image from 'next/image'
import { Globe, Mail } from 'lucide-react'
import { getTranslations } from 'next-intl/server'

import type { Locale } from '@/i18n/routing'
import { getShell } from '@/lib/shell'
import { defaultMessages } from '@/lib/whatsapp'

import { AdminPending } from './AdminPending'
import { ConsentManageButton } from './Consent'
import s from './footer.module.css'
import { type Alternates, LanguageSwitcher } from './LanguageSwitcher'
import { WhatsAppLink } from './WhatsAppLink'

export async function Footer({ locale, alternates }: { locale: Locale; alternates: Alternates }) {
  const { settings, navigation } = await getShell(locale)
  const t = await getTranslations({ locale, namespace: 'footer' })
  const tc = await getTranslations({ locale, namespace: 'common' })
  const tk = await getTranslations({ locale, namespace: 'consent' })
  const social = settings.social || []
  return (
    <footer className={`${s.footer} he-dark`}>
      <div className={`container ${s.grid}`}>
        <div className={s.brand}>
          <Image src="/brand/footer-logo-reverse.svg" alt="Hola Egipto" width={150} height={111} unoptimized />
          <p>{navigation.footer_description}</p>
          <div className={s.contact}>
            <WhatsAppLink number={settings.whatsapp_number} message={settings.whatsapp_message_default || defaultMessages[locale]} location="footer" label={tc('whatsappLabel')} className="">
              WhatsApp
            </WhatsAppLink>
            {settings.contact_email ? (
              <a href={`mailto:${settings.contact_email}`}>
                <Mail aria-hidden="true" size={20} strokeWidth={1.75} />
                {settings.contact_email}
              </a>
            ) : (
              <AdminPending locale={locale} label="Email" />
            )}
            {social.length ? (
              <ul aria-label={t('social')} style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexWrap: 'wrap', gap: '0 1rem' }}>
                {social.map((so) => (
                  <li key={so.url}>
                    <a href={so.url} rel="noopener me" target="_blank">
                      <Globe aria-hidden="true" size={20} strokeWidth={1.75} /> {so.network}
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>
        {(navigation.footer_columns || []).map((c, i) => (
          <div key={i} className={s.col}>
            <h2>{c.heading}</h2>
            <ul>
              {(c.links || []).map((l) => (
                <li key={l.href}>
                  <a href={l.href}>{l.label}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className={`container ${s.bottom}`}>
        <ul className={s.legal} aria-label={t('legal')}>
          {(navigation.legal_links || []).map((l) => (
            <li key={l.href}>
              <a href={l.href}>{l.label}</a>
            </li>
          ))}
          <li>
            <ConsentManageButton className={s.linkBtn} label={tk('manage')} />
          </li>
        </ul>
        <p className={s.company}>
          {settings.legal_name ? <span>{settings.legal_name}</span> : <AdminPending locale={locale} label={locale === 'es' ? 'Razón social' : 'Legal name'} />}
          {settings.licence_number ? (
            <span>
              {' '}
              · {t('licence')} {settings.licence_number}
            </span>
          ) : (
            <>
              {' '}
              <AdminPending locale={locale} label={t('licence')} />
            </>
          )}{' '}
          · {t('rights')}
        </p>
        <LanguageSwitcher locale={locale} alternates={alternates} className={s.switcher} label={tc('languageSwitcher')} />
      </div>
    </footer>
  )
}
