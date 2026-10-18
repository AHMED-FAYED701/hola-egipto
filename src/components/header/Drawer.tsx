import Image from 'next/image'
import { getTranslations } from 'next-intl/server'

import type { Locale } from '@/i18n/routing'
import { getShell } from '@/lib/shell'
import { fixedPageUrl } from '@/lib/urls'
import { defaultMessages } from '@/lib/whatsapp'

import { type Alternates, LanguageSwitcher } from '../LanguageSwitcher'
import { WhatsAppLink } from '../WhatsAppLink'
import { Drawer } from './HeaderClient'
import s from './header.module.css'

/** Mobile drawer with accordion sections; CTA and switcher live here below 1024 px. */
export async function SiteDrawer({ locale, alternates }: { locale: Locale; alternates: Alternates }) {
  const { settings, navigation } = await getShell(locale)
  const t = await getTranslations({ locale, namespace: 'common' })
  const th = await getTranslations({ locale, namespace: 'header' })
  return (
    <Drawer closeLabel={th('closeMenu')} label={th('mainNav')} logo={<Image src="/brand/header-logo.svg" alt="Hola Egipto" width={180} height={40} unoptimized />}>
      <nav aria-label={th('mainNav')}>
        {(navigation.header || []).map((h) => (
          <details key={h.href}>
            <summary>{h.label}</summary>
            {(h.columns || []).map((c, i) => (
              <div key={i}>
                {c.heading ? <h3>{c.heading}</h3> : null}
                <ul>
                  {(c.links || []).map((l) => (
                    <li key={l.href}>
                      <a href={l.href}>{l.label}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <ul>
              <li>
                <a href={h.href}>
                  <strong>
                    {t('seeAll')}: {h.label}
                  </strong>
                </a>
              </li>
            </ul>
          </details>
        ))}
      </nav>
      <div className={s.drawerActions}>
        <a className="btn btn--primary btn--block" href={fixedPageUrl('plan-my-trip', locale)}>
          {t('planTrip')}
        </a>
        <WhatsAppLink number={settings.whatsapp_number} message={settings.whatsapp_message_default || defaultMessages[locale]} location="header" label={t('whatsappLabel')} className="btn btn--whatsapp btn--block" />
        <LanguageSwitcher locale={locale} alternates={alternates} className={`${s.switcher} ${s.drawerSwitch}`} label={t('languageSwitcher')} />
      </div>
    </Drawer>
  )
}
