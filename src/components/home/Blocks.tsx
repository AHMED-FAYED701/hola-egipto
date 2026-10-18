import Image from 'next/image'
import { getTranslations } from 'next-intl/server'

import type { Locale } from '@/i18n/routing'
import { listAvailable } from '@/lib/data'
import { formatDate } from '@/lib/format'
import { img } from '@/lib/media'
import { getShell } from '@/lib/shell'
import { tripCard, type TripDoc } from '@/lib/trips'
import { archiveUrl, docUrl, fixedPageUrl, termUrl } from '@/lib/urls'
import { defaultMessages } from '@/lib/whatsapp'
import type { Departure, Page } from '@/payload-types'

import { DestinationTile, GuideCard, TripCard } from '../Cards'
import { Icon } from '../Icon'
import { WithPending } from '../Pending'
import { RichText } from '../RichText'
import { BookingBand, CtaBand, StatsStrip, TrustBar } from '../Sections'
import { Tabs } from '../Tabs'
import { WhatsAppLink } from '../WhatsAppLink'
import s from './home.module.css'

type Block = NonNullable<Page['layout']>[number]
type B<T extends Block['blockType']> = Extract<Block, { blockType: T }>

function Head({ eyebrow, title, intro, id, more }: { eyebrow?: string | null; title?: string | null; intro?: string | null; id: string; more?: { href: string; label: string } }) {
  return (
    <div className="section-head section-head--row">
      <div>
        {eyebrow ? <span className="he-eyebrow">{eyebrow}</span> : null}
        {title ? <h2 id={id}>{title}</h2> : null}
        {intro ? <p>{intro}</p> : null}
      </div>
      {more ? (
        <a className="text-link" href={more.href}>
          {more.label}
        </a>
      ) : null}
    </div>
  )
}

const Draft = async ({ on, locale }: { on?: boolean | null; locale: Locale }) => {
  if (!on) return null
  const t = await getTranslations({ locale, namespace: 'common' })
  return <span className="draft-note">{t('draft')}</span>
}

async function Hero({ b, locale }: { b: B<'hero'>; locale: Locale }) {
  const t = await getTranslations({ locale, namespace: 'common' })
  const { settings } = await getShell(locale)
  const im = img(b.image, 'hero')
  return (
    <>
      <section className={`${s.hero} he-dark`}>
        {im ? <Image className={s.heroImg} src={im.src} alt={im.alt} fill sizes="100vw" fetchPriority="high" loading="eager" /> : null}
        <div className={`container ${s.heroText}`}>
          <h1>{b.heading}</h1>
          {b.lead ? <p>{b.lead}</p> : null}
          <div className="btn-row">
            <a className="btn btn--primary" href={fixedPageUrl('plan-my-trip', locale)}>
              {t('planTrip')}
            </a>
            <WhatsAppLink number={settings.whatsapp_number} message={settings.whatsapp_message_default || defaultMessages[locale]} location="page" label={t('whatsappLabel')} />
          </div>
        </div>
      </section>
      {b.show_stats ? (
        <div className={`container ${s.statsWrap}`}>
          <StatsStrip locale={locale} />
        </div>
      ) : null}
    </>
  )
}

async function DestinationsGrid({ b, locale }: { b: B<'destinations-grid'>; locale: Locale }) {
  const t = await getTranslations({ locale, namespace: 'common' })
  const res = await listAvailable('destinations', locale, { limit: b.limit || 6, sort: 'createdAt', depth: 1 })
  return (
    <section className="section container" aria-labelledby="home-dest">
      <Head id="home-dest" eyebrow={b.eyebrow} title={b.title} intro={b.intro} more={{ href: archiveUrl('destinations', locale), label: t('seeAll') }} />
      <div className="grid grid--3">
        {res.docs.map((d) => (
          <DestinationTile key={d.id} href={docUrl('destinations', d.slug || '', locale)} title={d.title} tagline={d.tagline} image={img(d.featured_image, 'tile')} />
        ))}
      </div>
    </section>
  )
}

async function TripsGrid({ b, locale }: { b: B<'trips-grid'>; locale: Locale }) {
  const t = await getTranslations({ locale, namespace: 'common' })
  const tt = await getTranslations({ locale, namespace: 'trip' })
  const res = await listAvailable('tours', locale, { limit: b.limit || 6, sort: '-featured', depth: 1 })
  return (
    <section className="section section--linen" aria-labelledby="home-tours">
      <div className="container">
        <Head id="home-tours" eyebrow={b.eyebrow} title={b.title} intro={b.intro} more={{ href: archiveUrl('tours', locale), label: t('seeAll') }} />
        <div className="grid grid--3">
          {res.docs.map((d) => (
            <TripCard key={d.id} trip={tripCard(d as TripDoc, 'tours', locale, tt)} fromLabel={t('from')} />
          ))}
        </div>
      </div>
    </section>
  )
}

async function CruisesSplit({ b, locale }: { b: B<'cruises-split'>; locale: Locale }) {
  const t = await getTranslations({ locale, namespace: 'common' })
  const tt = await getTranslations({ locale, namespace: 'trip' })
  const res = await listAvailable('cruises', locale, { limit: 2, sort: '-featured', depth: 1 })
  const im = img(b.image, 'card')
  return (
    <section className="section container" aria-labelledby="home-cruises">
      <div className={s.split}>
        <div className={s.splitImg}>{im ? <Image src={im.src} alt={im.alt} width={im.width} height={im.height} sizes="(min-width: 900px) 600px, 100vw" loading="lazy" /> : null}</div>
        <div>
          <Head id="home-cruises" eyebrow={b.eyebrow} title={b.title} intro={b.intro} />
          <a className="text-link" href={archiveUrl('cruises', locale)}>
            {t('seeAll')}
          </a>
        </div>
      </div>
      <div className={s.splitCards}>
        {res.docs.map((d) => (
          <TripCard key={d.id} trip={tripCard(d as TripDoc, 'cruises', locale, tt)} fromLabel={t('from')} />
        ))}
      </div>
    </section>
  )
}

async function ExcursionsByCity({ b, locale }: { b: B<'excursions-by-city'>; locale: Locale }) {
  const t = await getTranslations({ locale, namespace: 'common' })
  const tt = await getTranslations({ locale, namespace: 'trip' })
  const cities = (b.cities || []).filter((c): c is Departure => typeof c === 'object' && c !== null)
  const lists = await Promise.all(cities.map((c) => listAvailable('excursions', locale, { where: { departure: { in: [c.id] } }, limit: 4, sort: '-featured', depth: 1 })))
  const withItems = cities.map((c, i) => ({ c, docs: lists[i].docs })).filter((x) => x.docs.length)
  if (!withItems.length) return null
  return (
    <section className="section section--linen" aria-labelledby="home-exc">
      <div className="container">
        <Head id="home-exc" eyebrow={b.eyebrow} title={b.title} intro={b.intro} more={{ href: archiveUrl('excursions', locale), label: t('seeAll') }} />
        <Tabs
          label={b.title || ''}
          className={s.cityTabs}
          labels={withItems.map((x) => x.c.name)}
          panels={withItems.map((x) => (
            <div key={x.c.id}>
              <div className="grid grid--4">
                {x.docs.map((d) => (
                  <TripCard key={d.id} trip={tripCard(d as TripDoc, 'excursions', locale, tt)} fromLabel={t('from')} />
                ))}
              </div>
              {x.c.slug ? (
                <p style={{ marginTop: 'var(--he-space-4)' }}>
                  <a className="text-link" href={termUrl('departures', x.c.slug, locale)}>
                    {t('seeAll')}: {x.c.name}
                  </a>
                </p>
              ) : null}
            </div>
          ))}
        />
      </div>
    </section>
  )
}

async function Why({ b, locale }: { b: B<'why'>; locale: Locale }) {
  return (
    <section className="section container" aria-labelledby="home-why">
      <Draft on={b.draft} locale={locale} />
      <Head id="home-why" eyebrow={b.eyebrow} title={b.title} />
      <div className={s.why}>
        {(b.columns || []).map((c) => (
          <article key={c.id}>
            <Icon name={c.icon || 'compass'} size={32} />
            <h3>{c.title}</h3>
            <p>{c.text}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

async function GuidesGrid({ b, locale }: { b: B<'guides-grid'>; locale: Locale }) {
  const t = await getTranslations({ locale, namespace: 'common' })
  const res = await listAvailable('guides', locale, { limit: b.limit || 3, sort: '-last_updated', depth: 1 })
  return (
    <section className="section section--linen" aria-labelledby="home-guides">
      <div className="container">
        <Head id="home-guides" eyebrow={b.eyebrow} title={b.title} intro={b.intro} more={{ href: archiveUrl('guides', locale), label: t('seeAll') }} />
        <div className="grid grid--3">
          {res.docs.map((g) => (
            <GuideCard key={g.id} href={docUrl('guides', g.slug || '', locale)} title={g.title} excerpt={g.excerpt} image={img(g.featured_image, 'card')} meta={formatDate(locale, g.last_updated)} />
          ))}
        </div>
      </div>
    </section>
  )
}

async function TextSection({ b, locale }: { b: B<'text'>; locale: Locale }) {
  return (
    <section className="section container container--narrow" aria-labelledby={`text-${b.id}`}>
      <Draft on={b.draft} locale={locale} />
      {b.eyebrow ? <span className="he-eyebrow">{b.eyebrow}</span> : null}
      {b.title ? <h2 id={`text-${b.id}`}>{b.title}</h2> : null}
      <PendingRich data={b.body} />
    </section>
  )
}

/** Rich text where "[pendiente]" tokens get the dashed marker. */
function PendingRich({ data }: { data: unknown }) {
  const root = (data as { root?: { children?: { children?: { text?: string }[] }[] } })?.root
  const paras = (root?.children || []).map((n) => (n.children || []).map((c) => c.text || '').join(''))
  if (paras.some((p) => /\[(pendiente|pending)\]/.test(p))) {
    return (
      <div className="prose">
        {paras.map((p, i) => (
          <p key={i}>
            <WithPending text={p} />
          </p>
        ))}
      </div>
    )
  }
  return <RichText data={data} />
}

function Team({ b }: { b: B<'team'> }) {
  return (
    <section className="section section--linen" aria-labelledby={`team-${b.id}`}>
      <div className="container">
        <Head id={`team-${b.id}`} eyebrow={b.eyebrow} title={b.title} />
        <div className={s.team}>
          {(b.members || []).map((m) => {
            const ph = img(m.photo, 'tile')
            return (
              <article key={m.id} className={s.member}>
                {ph ? <Image src={ph.src} alt={ph.alt} width={160} height={160} className={s.photo} loading="lazy" /> : <div className={s.photo} aria-hidden="true" />}
                <h3 className="h4">
                  <span className="pending">{m.name}</span>
                </h3>
                {m.role ? (
                  <p>
                    <span className="pending">{m.role}</span>
                  </p>
                ) : null}
                {m.languages ? <p className="muted">{m.languages}</p> : null}
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

async function Steps({ b, locale }: { b: B<'steps'>; locale: Locale }) {
  return (
    <section className="section container" aria-labelledby={`steps-${b.id}`}>
      <Draft on={b.draft} locale={locale} />
      <Head id={`steps-${b.id}`} eyebrow={b.eyebrow} title={b.title} />
      <ol className={s.steps}>
        {(b.items || []).map((it) => (
          <li key={it.id}>
            <h3 className="h4">{it.title}</h3>
            {it.text ? <p className="muted">{it.text}</p> : null}
          </li>
        ))}
      </ol>
    </section>
  )
}

function Licence({ b }: { b: B<'licence'> }) {
  return (
    <section className="section--tight container container--narrow" aria-labelledby={`lic-${b.id}`}>
      {b.title ? <h2 id={`lic-${b.id}`}>{b.title}</h2> : null}
      {b.text ? (
        <p>
          <WithPending text={b.text} />
        </p>
      ) : null}
    </section>
  )
}

/** Render pages.layout blocks (Home and About). */
export async function Blocks({ blocks, locale }: { blocks: Page['layout']; locale: Locale }) {
  return (
    <>
      {(blocks || []).map((b) => {
        switch (b.blockType) {
          case 'hero':
            return <Hero key={b.id} b={b} locale={locale} />
          case 'booking-band':
            return <BookingBand key={b.id} locale={locale} />
          case 'trust-bar':
            return <TrustBar key={b.id} locale={locale} />
          case 'destinations-grid':
            return <DestinationsGrid key={b.id} b={b} locale={locale} />
          case 'trips-grid':
            return <TripsGrid key={b.id} b={b} locale={locale} />
          case 'cruises-split':
            return <CruisesSplit key={b.id} b={b} locale={locale} />
          case 'excursions-by-city':
            return <ExcursionsByCity key={b.id} b={b} locale={locale} />
          case 'why':
            return <Why key={b.id} b={b} locale={locale} />
          case 'guides-grid':
            return <GuidesGrid key={b.id} b={b} locale={locale} />
          case 'cta-band':
            return <CtaBand key={b.id} locale={locale} title={b.title} text={b.text} />
          case 'text':
            return <TextSection key={b.id} b={b} locale={locale} />
          case 'team':
            return <Team key={b.id} b={b} />
          case 'steps':
            return <Steps key={b.id} b={b} locale={locale} />
          case 'licence':
            return <Licence key={b.id} b={b} />
          default:
            return null
        }
      })}
    </>
  )
}
