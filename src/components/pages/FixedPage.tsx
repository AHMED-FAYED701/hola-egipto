import { Clock, Mail, MapPin, Phone } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import type { ReactNode } from 'react'

import type { Locale } from '@/i18n/routing'
import { getSettings } from '@/lib/content/read'
import { formatDate } from '@/lib/format'
import { homeUrl, pageUrl } from '@/lib/urls'
import { defaultMessages } from '@/lib/whatsapp'
import type { Page } from '@/lib/content/types'

import { AdminPending } from '../AdminPending'
import { Breadcrumbs } from '../Breadcrumbs'
import { FaqList, faqSchema } from '../Faq'
import { Blocks } from '../home/Blocks'
import { JsonLd } from '../JsonLd'
import { WithPending } from '../Pending'
import { CtaBand } from '../Sections'
import { RichText } from '../RichText'
import { WhatsAppLink } from '../WhatsAppLink'
import s from './pages.module.css'

export interface FixedPageExtras {
  /** Form or other template-specific content (plan-my-trip, contact, thank-you). */
  form?: ReactNode
  aside?: ReactNode
  below?: ReactNode
}

/** Fixed pages by template (contracts §5): default, legal, contact, faq, about, plan-my-trip, thank-you. */
export async function FixedPage({ page, locale, extras = {} }: { page: Page; locale: Locale; extras?: FixedPageExtras }) {
  const tc = await getTranslations({ locale, namespace: 'common' })
  const settings = await getSettings(locale)
  const crumbs = [
    { label: tc('home'), href: homeUrl(locale) },
    { label: page.title, href: pageUrl(page.slug || '', locale) },
  ]
  const head = (
    <header className={`container ${s.head}`}>
      <h1>{page.title}</h1>
      {page.excerpt && page.template !== 'legal' ? <p className="lead">{page.excerpt}</p> : null}
    </header>
  )

  if (page.template === 'about') {
    return (
      <>
        <Breadcrumbs items={crumbs} label={tc('breadcrumb')} />
        {head}
        <Blocks blocks={page.layout} locale={locale} />
      </>
    )
  }

  if (page.template === 'faq') {
    const groups = page.faq_groups || []
    const all = groups.flatMap((g) => (g.items || []).map((i) => ({ q: i.q, a: i.a })))
    return (
      <>
        <Breadcrumbs items={crumbs} label={tc('breadcrumb')} />
        {head}
        <div className="container container--narrow section--tight">
          {groups.map((g) => (
            <section key={g.id} className={s.faqGroup} aria-labelledby={`faq-${g.id}`}>
              <h2 id={`faq-${g.id}`}>{g.title}</h2>
              <FaqList items={(g.items || []).map((i) => ({ q: i.q, a: i.a }))} />
            </section>
          ))}
        </div>
        <JsonLd data={faqSchema(all)} />
        <CtaBand locale={locale} />
      </>
    )
  }

  if (page.template === 'legal' || page.template === 'default') {
    const updated = formatDate(locale, page.last_updated)
    return (
      <>
        <Breadcrumbs items={crumbs} label={tc('breadcrumb')} />
        <div className={`container container--narrow ${s.legal}`}>
          <header className={s.head}>
            <h1>{page.title}</h1>
            {updated ? (
              <p className={s.updated}>
                {tc('updated')}: {updated}
              </p>
            ) : null}
          </header>
          <RichText data={page.content} />
        </div>
      </>
    )
  }

  if (page.template === 'contact') {
    const t = await getTranslations({ locale, namespace: 'contact' })
    return (
      <>
        <Breadcrumbs items={crumbs} label={tc('breadcrumb')} />
        {head}
        <div className={`container ${s.twoCol}`}>
          <div>
            <RichText data={page.content} />
            {extras.form}
          </div>
          <aside className={s.panel} aria-labelledby="contact-methods">
            <h2 id="contact-methods">{t('methods')}</h2>
            <ul className={s.methods}>
              <li>
                <WhatsAppLink number={settings.whatsapp_number} message={settings.whatsapp_message_default || defaultMessages[locale]} location="page" label={tc('whatsappLabel')} className="btn btn--whatsapp">
                  WhatsApp
                </WhatsAppLink>
                {settings.whatsapp_number ? null : <AdminPending locale={locale} label="WhatsApp" />}
              </li>
              <li>
                <Mail aria-hidden="true" size={22} strokeWidth={1.75} />
                {settings.contact_email ? <a href={`mailto:${settings.contact_email}`}>{settings.contact_email}</a> : <AdminPending locale={locale} label="Email" />}
              </li>
              <li>
                <Phone aria-hidden="true" size={22} strokeWidth={1.75} />
                {settings.phone ? <a href={`tel:${settings.phone.replace(/\s+/g, '')}`}>{settings.phone}</a> : <AdminPending locale={locale} label={t('phone')} />}
              </li>
              <li>
                <Clock aria-hidden="true" size={22} strokeWidth={1.75} />
                <span>
                  {t('hours')}: <WithPending text={settings.reply_hours || (locale === 'es' ? '[pendiente]' : '[pending]')} />
                </span>
              </li>
              {settings.address ? (
                <li>
                  <MapPin aria-hidden="true" size={22} strokeWidth={1.75} />
                  <span>{settings.address}</span>
                </li>
              ) : null}
            </ul>
            <h2>{t('company')}</h2>
            <p>
              {settings.legal_name || <AdminPending locale={locale} label={t('legalName')} />}
              <br />
              {settings.licence_number ? `${t('licence')}: ${settings.licence_number}` : <AdminPending locale={locale} label={t('licence')} />}
            </p>
          </aside>
        </div>
      </>
    )
  }

  // plan-my-trip and thank-you
  return (
    <>
      <Breadcrumbs items={crumbs} label={tc('breadcrumb')} />
      {head}
      <div className={`container ${s.twoCol}`}>
        <div>
          <RichText data={page.content} />
          {extras.form}
        </div>
        {extras.aside ? <aside className={s.panel}>{extras.aside}</aside> : null}
      </div>
      {extras.below}
    </>
  )
}
