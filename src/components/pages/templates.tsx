import { getTranslations } from 'next-intl/server'

import type { Locale } from '@/i18n/routing'
import { type SP, sp } from '@/lib/archive'
import { getSettings, listAvailable } from '@/lib/data'
import { formatDate } from '@/lib/format'
import { img } from '@/lib/media'
import { getPayloadClient } from '@/lib/payload'
import { makeInquiryToken, parseRef } from '@/lib/secrets'
import { pushScript } from '@/lib/tracking'
import { polyTrip } from '@/lib/trips'
import { absolute, docUrl, fixedPageUrl, TRIP_TYPE, type TripCollection } from '@/lib/urls'
import { defaultMessages } from '@/lib/whatsapp'
import type { Page } from '@/payload-types'

import { GuideCard } from '../Cards'
import { ContactForm } from '../forms/ContactForm'
import { PlanTripForm } from '../forms/PlanTripForm'
import { WithPending } from '../Pending'
import { WhatsAppLink } from '../WhatsAppLink'
import type { FixedPageExtras } from './FixedPage'

const FORM_KEYS = [
  'step', 's1', 's2', 's3', 's4', 'trip', 'notSure', 'interests', 'length', 'length_opts', 'i_cairo', 'i_nile', 'i_luxor', 'i_abusimbel', 'i_beach', 'i_diving', 'i_desert',
  'dates', 'date_exact', 'date_month', 'date_flexible', 'from', 'to', 'month', 'adults', 'children', 'childrenAges', 'budget', 'budget_opts', 'hotel', 'hotel_opts',
  'groupType', 'private', 'group', 'either', 'name', 'email', 'whatsapp', 'channel', 'message', 'messageHint', 'consent', 'privacy', 'marketing', 'next', 'back', 'submit',
  'required', 'errorsTitle', 'errorGeneric',
]

const errorList = (params: SP) =>
  sp(params, 'errors')
    .split(',')
    .map((e) => e.trim())
    .filter((e) => /^[a-z_]{2,20}$/.test(e))

async function formLabels(locale: Locale) {
  const t = await getTranslations({ locale, namespace: 'form' })
  return Object.fromEntries(FORM_KEYS.map((k) => [k, t.raw(k) as string]))
}

async function sidePanel(locale: Locale) {
  const t = await getTranslations({ locale, namespace: 'form' })
  const tc = await getTranslations({ locale, namespace: 'common' })
  const settings = await getSettings(locale)
  return (
    <>
      <h2>{t('nextTitle')}</h2>
      <ol>
        <li>{t('next1')}</li>
        <li>{t('next2')}</li>
        <li>{t('next3')}</li>
      </ol>
      <p>
        <strong>{t('replyHours')}:</strong> <WithPending text={settings.reply_hours || (locale === 'es' ? '[pendiente]' : '[pending]')} />
      </p>
      {settings.whatsapp_number ? (
        <>
          <h2>{t('waAlt')}</h2>
          <WhatsAppLink number={settings.whatsapp_number} message={settings.whatsapp_message_default || defaultMessages[locale]} location="page" label={tc('whatsappLabel')} className="btn btn--whatsapp btn--block">
            {tc('whatsapp')}
          </WhatsAppLink>
        </>
      ) : null}
    </>
  )
}

/** Template-specific parts: plan-my-trip form, contact form, thank-you (generate_lead once per ref). */
export async function renderTemplateExtras(page: Page, locale: Locale, params: SP): Promise<FixedPageExtras> {
  if (page.template === 'plan-my-trip') {
    const tt = await getTranslations({ locale, namespace: 'trip' })
    const cols: TripCollection[] = ['tours', 'cruises', 'excursions']
    const lists = await Promise.all(cols.map((c) => listAvailable(c, locale, { depth: 0, limit: 200, sort: 'title' })))
    const trips = cols.flatMap((c, i) =>
      lists[i].docs.map((d) => ({ value: `${TRIP_TYPE[c]}-${d.id}`, label: `${d.title} (${tt(c === 'tours' ? 'days' : c === 'cruises' ? 'nights' : 'hours', { n: (d as { duration_days?: number; nights?: number; duration_hours?: number }).duration_days ?? (d as { nights?: number }).nights ?? (d as { duration_hours?: number }).duration_hours ?? 0 })})` })),
    )
    const wanted = sp(params, 'trip')
    const selectedTrip = trips.some((t) => t.value === wanted) ? wanted : ''
    return {
      form: (
        <PlanTripForm
          lang={locale}
          token={makeInquiryToken(Math.floor(Date.now() / 1000) - 5)}
          pageUrl={absolute(fixedPageUrl('plan-my-trip', locale))}
          privacyHref={fixedPageUrl('privacy', locale)}
          trips={trips}
          selectedTrip={selectedTrip}
          serverErrors={errorList(params)}
          l={await formLabels(locale)}
        />
      ),
      aside: await sidePanel(locale),
    }
  }

  if (page.template === 'contact') {
    const tk = await getTranslations({ locale, namespace: 'contact' })
    const l = { ...(await formLabels(locale)), formTitle: tk('formTitle'), send: tk('send') }
    return {
      form: (
        <ContactForm
          lang={locale}
          token={makeInquiryToken(Math.floor(Date.now() / 1000) - 5)}
          pageUrl={absolute(fixedPageUrl('contact', locale))}
          privacyHref={fixedPageUrl('privacy', locale)}
          serverErrors={errorList(params)}
          l={l}
        />
      ),
    }
  }

  if (page.template === 'thank-you') {
    const t = await getTranslations({ locale, namespace: 'form' })
    const tc = await getTranslations({ locale, namespace: 'common' })
    const settings = await getSettings(locale)
    const id = parseRef(sp(params, 'ref'))
    let lead: Record<string, unknown> | null = null
    if (id) {
      const payload = await getPayloadClient()
      try {
        const inq = await payload.findByID({ collection: 'inquiries', id: Number(id), depth: 1, overrideAccess: true })
        if (inq && !inq.tracked) {
          const trip = polyTrip(inq.trip)
          lead = {
            event: 'generate_lead',
            trip_id: trip ? String(trip[1].id) : null,
            trip_name: trip ? trip[1].title : null,
            trip_type: trip ? TRIP_TYPE[trip[0]] : null,
            language: inq.lang,
            form: inq.form,
          }
          // Mark as tracked so a reload never fires the conversion again (no revalidation on inquiries).
          await payload.update({ collection: 'inquiries', id: inq.id, data: { tracked: true }, overrideAccess: true })
        }
      } catch {
        lead = null
      }
    }
    const guides = await listAvailable('guides', locale, { limit: 3, sort: '-last_updated', depth: 1 })
    return {
      form: (
        <>
          {lead ? <script dangerouslySetInnerHTML={{ __html: pushScript(lead) }} /> : null}
          {!id ? <p className="muted">{t('thanksInvalid')}</p> : null}
          <p>{t('thanksNext')}</p>
          <WhatsAppLink number={settings.whatsapp_number} message={settings.whatsapp_message_default || defaultMessages[locale]} location="page" label={tc('whatsappLabel')}>
            {tc('whatsappLabel')}
          </WhatsAppLink>
        </>
      ),
      below: guides.docs.length ? (
        <section className="section section--linen" aria-labelledby="thanks-guides">
          <div className="container">
            <h2 id="thanks-guides">{t('thanksGuides')}</h2>
            <div className="grid grid--3">
              {guides.docs.map((g) => (
                <GuideCard key={g.id} href={docUrl('guides', g.slug || '', locale)} title={g.title} excerpt={g.excerpt} image={img(g.featured_image, 'card')} meta={formatDate(locale, g.last_updated)} />
              ))}
            </div>
          </div>
        </section>
      ) : null,
    }
  }
  return {}
}
