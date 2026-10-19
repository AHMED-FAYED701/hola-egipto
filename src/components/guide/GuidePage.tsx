import Image from 'next/image'
import { Lightbulb } from 'lucide-react'
import { getTranslations } from 'next-intl/server'

import type { Destination, Guide, GuideTopic } from '@/lib/content/types'
import type { Locale } from '@/i18n/routing'
import { findById, getSettings, listAvailable } from '@/lib/content/read'
import { formatDate } from '@/lib/format'
import { img } from '@/lib/media'
import { readingMinutes } from '@/lib/format'
import { polyTrip, tripCard, type TripDoc } from '@/lib/trips'
import { absolute, archiveUrl, docUrl, homeUrl, termUrl, TRIP_COLLECTION, type TripCollection } from '@/lib/urls'

import { Breadcrumbs } from '../Breadcrumbs'
import { DestinationTile, GuideCard, TripCard } from '../Cards'
import { JsonLd } from '../JsonLd'
import { WithPending } from '../Pending'
import { headings, plainText, type RichBlocks, RichText } from '../RichText'
import { CtaBand } from '../Sections'
import s from './guide.module.css'

export async function GuidePage({ doc, locale }: { doc: Guide; locale: Locale }) {
  const t = await getTranslations({ locale, namespace: 'guide' })
  const tt = await getTranslations({ locale, namespace: 'trip' })
  const tc = await getTranslations({ locale, namespace: 'common' })
  const settings = await getSettings(locale)
  const url = docUrl('guides', doc.slug || '', locale)
  const cover = img(doc.featured_image, 'hero')
  const topics = (doc.guide_topic || []).filter((x): x is GuideTopic => typeof x === 'object' && x !== null)
  const toc = doc.toc ? headings(doc.content) : []
  const minutes = readingMinutes(plainText(doc.content))
  const updated = formatDate(locale, doc.last_updated)
  const dests = (doc.related_destinations || []).filter((x): x is Destination => typeof x === 'object' && x !== null)
  const trips = (doc.related_trips || []).map(polyTrip).filter((x): x is [TripCollection, TripDoc] => Boolean(x))
  const more = await listAvailable('guides', locale, { where: { id: { not_equals: doc.id } }, limit: 3, sort: '-last_updated' })
  const author = doc.author_name || (locale === 'es' ? '[pendiente]' : '[pending]')

  const blocks: RichBlocks = {
    'tip-box': (f) => (
      <aside className={s.tip}>
        <Lightbulb aria-hidden="true" size={24} strokeWidth={1.75} />
        <div>
          <strong>{(f.title as string) || t('tip')}</strong>
          <p>
            <WithPending text={String(f.text || '')} />
          </p>
        </div>
      </aside>
    ),
    'trip-card': async (f) => {
      const collection = TRIP_COLLECTION[f.tripType]
      const trip = await findById<TripDoc>(collection, f.id, locale, 1)
      if (!trip || !trip.available) return null
      return (
        <div className={s.tripCard}>
          <TripCard trip={tripCard(trip, collection, locale, tt)} fromLabel={tc('from')} />
        </div>
      )
    },
  }

  const ld = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: doc.title,
    description: doc.excerpt || undefined,
    url: absolute(url),
    mainEntityOfPage: absolute(url),
    inLanguage: locale,
    image: cover ? absolute(cover.src) : undefined,
    author: { '@type': 'Person', name: author },
    publisher: { '@type': 'TravelAgency', name: 'Hola Egipto', url: absolute(homeUrl(locale)) },
    datePublished: doc.createdAt,
    dateModified: doc.last_updated || doc.updatedAt,
  }

  return (
    <>
      <Breadcrumbs
        items={[
          { label: tc('home'), href: homeUrl(locale) },
          { label: settings.archive_intros?.guides?.h1 || 'Guía', href: archiveUrl('guides', locale) },
          { label: doc.title, href: url },
        ]}
        label={tc('breadcrumb')}
      />
      <article>
        <div className="container">
          <header className={s.header}>
            {topics.length ? (
              <ul className="chips" style={{ marginBottom: 'var(--he-space-4)' }}>
                {topics.map((tp) => (
                  <li key={tp.id}>
                    <a className="chip" href={tp.slug ? termUrl('guide-topics', tp.slug, locale) : '#'}>
                      {tp.name}
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
            <h1>{doc.title}</h1>
            <p className={s.meta}>
              <span>{t('readingTime', { n: minutes })}</span>
              {updated ? (
                <span>
                  {tc('updated')}: {updated}
                </span>
              ) : null}
              <span>
                <WithPending text={t('by', { name: author })} />
              </span>
            </p>
          </header>
          {cover ? (
            <div className={s.cover}>
              <Image src={cover.src} alt={cover.alt} width={cover.width} height={cover.height} sizes="(min-width: 1248px) 1200px, 100vw" fetchPriority="high" loading="eager" />
            </div>
          ) : null}
          <div className={s.layout}>
            {toc.length ? (
              <nav className={s.toc} aria-labelledby="toc-title">
                <h2 id="toc-title">{t('toc')}</h2>
                <ol>
                  {toc.map((h) => (
                    <li key={h.id}>
                      <a href={`#${h.id}`}>{h.text}</a>
                    </li>
                  ))}
                </ol>
              </nav>
            ) : (
              <div />
            )}
            <div>
              <RichText data={doc.content} blocks={blocks} />
              <section className={s.author} aria-label={t('author')}>
                <span className={s.avatar} aria-hidden="true" />
                <div>
                  <strong>
                    <WithPending text={author} />
                  </strong>
                  <p>{t('authorText')}</p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </article>

      {dests.length ? (
        <section className="section container" aria-labelledby="g-dests">
          <h2 id="g-dests">{t('relatedDestinations')}</h2>
          <div className="grid grid--4">
            {dests.map((d) => (
              <DestinationTile key={d.id} href={docUrl('destinations', d.slug || '', locale)} title={d.title} tagline={d.tagline} image={img(d.featured_image, 'tile')} />
            ))}
          </div>
        </section>
      ) : null}
      {trips.length ? (
        <section className="section section--linen" aria-labelledby="g-trips">
          <div className="container">
            <h2 id="g-trips">{t('relatedTrips')}</h2>
            <div className="grid grid--3">
              {trips.map(([c, d]) => (
                <TripCard key={`${c}-${d.id}`} trip={tripCard(d, c, locale, tt)} fromLabel={tc('from')} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
      {more.docs.length ? (
        <section className="section container" aria-labelledby="g-more">
          <h2 id="g-more">{t('relatedGuides')}</h2>
          <div className="grid grid--3">
            {more.docs.map((g) => (
              <GuideCard key={g.id} href={docUrl('guides', g.slug || '', locale)} title={g.title} excerpt={g.excerpt} image={img(g.featured_image, 'card')} meta={formatDate(locale, g.last_updated)} />
            ))}
          </div>
        </section>
      ) : null}
      <CtaBand locale={locale} />
      <JsonLd data={ld} />
    </>
  )
}
