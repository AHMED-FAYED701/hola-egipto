import Image from 'next/image'
import { getTranslations } from 'next-intl/server'

import type { Destination, Region } from '@/lib/content/types'
import type { Locale } from '@/i18n/routing'
import { getSettings, listAvailable } from '@/lib/content/read'
import { formatMonthYear, MONTHS } from '@/lib/format'
import { img } from '@/lib/media'
import { tripCard, type TripDoc } from '@/lib/trips'
import { absolute, archiveUrl, docUrl, homeUrl, termUrl, type TripCollection } from '@/lib/urls'

import { Breadcrumbs } from '../Breadcrumbs'
import { DestinationTile, GuideCard, TripCard } from '../Cards'
import { EgyptMap } from '../EgyptMap'
import { JsonLd } from '../JsonLd'
import { WithPending } from '../Pending'
import { RichText } from '../RichText'
import { CtaBand } from '../Sections'
import { Tabs } from '../Tabs'
import s from './dest.module.css'

export async function DestinationPage({ doc, locale }: { doc: Destination; locale: Locale }) {
  const t = await getTranslations({ locale, namespace: 'destination' })
  const tm = await getTranslations({ locale, namespace: 'months' })
  const tt = await getTranslations({ locale, namespace: 'trip' })
  const tc = await getTranslations({ locale, namespace: 'common' })
  const settings = await getSettings(locale)
  const url = docUrl('destinations', doc.slug || '', locale)
  const hero = img(doc.featured_image, 'hero')
  const region = doc.region && typeof doc.region === 'object' ? (doc.region as Region) : null
  const sights = doc.top_sights || []
  const nearby = (doc.nearby || []).filter((n): n is Destination => typeof n === 'object' && n !== null)

  const tripCols: TripCollection[] = ['tours', 'cruises', 'excursions']
  const trips = await Promise.all(tripCols.map((c) => listAvailable(c, locale, { where: { destinations: { in: [doc.id] } }, limit: 6 })))
  const guides = await listAvailable('guides', locale, { where: { related_destinations: { in: [doc.id] } }, limit: 3 })
  const tabs = tripCols.map((c, i) => ({ c, label: t(c), docs: trips[i].docs as TripDoc[] })).filter((x) => x.docs.length)

  const ld = {
    '@context': 'https://schema.org',
    '@type': 'TouristDestination',
    name: doc.title,
    description: doc.excerpt || doc.tagline || '',
    url: absolute(url),
    image: hero ? absolute(hero.src) : undefined,
    ...(doc.lat && doc.lng ? { geo: { '@type': 'GeoCoordinates', latitude: doc.lat, longitude: doc.lng } } : {}),
    includesAttraction: sights.map((sg) => ({ '@type': 'TouristAttraction', name: sg.name, description: sg.text || undefined })),
    containedInPlace: { '@type': 'Country', name: 'Egypt' },
  }

  return (
    <>
      <Breadcrumbs
        items={[
          { label: tc('home'), href: homeUrl(locale) },
          { label: settings.archive_intros?.destinations?.h1 || t('region'), href: archiveUrl('destinations', locale) },
          { label: doc.title, href: url },
        ]}
        label={tc('breadcrumb')}
      />
      <section className={`${s.hero} he-dark`}>
        {hero ? <Image src={hero.src} alt={hero.alt} fill sizes="100vw" fetchPriority="high" loading="eager" /> : null}
        <div className={`container ${s.heroText}`}>
          <h1>{doc.title}</h1>
          {doc.tagline ? <p>{doc.tagline}</p> : null}
        </div>
      </section>

      <div className="container">
        <section aria-labelledby="facts">
          <h2 id="facts" className="visually-hidden">
            {t('quickFacts')}
          </h2>
          <dl className={s.facts}>
            {region ? (
              <div>
                <dt>{t('region')}</dt>
                <dd>{region.slug ? <a href={termUrl('regions', region.slug, locale)}>{region.name}</a> : region.name}</dd>
              </div>
            ) : null}
            {doc.best_months?.length ? (
              <div style={{ gridColumn: 'span 2' }}>
                <dt>{t('bestMonths')}</dt>
                <dd>
                  <ul className={s.months}>
                    {MONTHS.map((m) => (
                      <li key={m} data-on={doc.best_months?.includes(m) ? 'true' : 'false'}>
                        {tm(m)}
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
            ) : null}
            {doc.days_recommended ? (
              <div>
                <dt>{t('daysRecommended')}</dt>
                <dd>{tt('days', { n: doc.days_recommended })}</dd>
              </div>
            ) : null}
            {doc.nearest_airport ? (
              <div>
                <dt>{t('airport')}</dt>
                <dd>{doc.nearest_airport}</dd>
              </div>
            ) : null}
          </dl>
        </section>

        <div className={`${s.split} section--tight`}>
          <div>
            <RichText data={doc.content} />
            {doc.how_to_get_there ? (
              <>
                <h2>{t('gettingThere')}</h2>
                <p>
                  <WithPending text={doc.how_to_get_there} />
                </p>
              </>
            ) : null}
          </div>
          <aside className={s.map} aria-label={t('map')}>
            <EgyptMap title={`${t('map')}: ${doc.title}`} route={doc.lat && doc.lng ? [{ label: doc.title, lat: doc.lat, lng: doc.lng }] : []} />
          </aside>
        </div>

        {sights.length ? (
          <section className="section--tight" aria-labelledby="sights">
            <h2 id="sights">{t('topSights')}</h2>
            <div className={s.sights}>
              {sights.map((sg) => {
                const im = img(sg.image, 'card')
                return (
                  <article key={sg.id} className={s.sight}>
                    {im ? <Image src={im.src} alt={im.alt} width={im.width} height={im.height} sizes="(min-width: 1024px) 280px, 100vw" loading="lazy" /> : null}
                    <div>
                      <h3>{sg.name}</h3>
                      {sg.text ? (
                        <p>
                          <WithPending text={sg.text} />
                        </p>
                      ) : null}
                      {sg.map_link ? (
                        <a href={sg.map_link} rel="noopener" target="_blank" className="text-link">
                          {t('viewMap')}
                        </a>
                      ) : null}
                    </div>
                  </article>
                )
              })}
            </div>
          </section>
        ) : null}
      </div>

      <section className="section section--linen" aria-labelledby="dest-trips">
        <div className="container">
          <h2 id="dest-trips">{t('tripsVisiting', { name: doc.title })}</h2>
          {tabs.length ? (
            <Tabs
              label={t('tripsVisiting', { name: doc.title })}
              className={s.tabs}
              labels={tabs.map((x) => x.label)}
              panels={tabs.map((x) => (
                <div key={x.c} className="grid grid--3">
                  {x.docs.map((d) => (
                    <TripCard key={d.id} trip={tripCard(d, x.c, locale, tt)} fromLabel={tc('from')} />
                  ))}
                </div>
              ))}
            />
          ) : (
            <p>{t('noTrips')}</p>
          )}
        </div>
      </section>

      {nearby.length ? (
        <section className="section container" aria-labelledby="nearby">
          <h2 id="nearby">{t('nearby')}</h2>
          <div className="grid grid--4">
            {nearby.map((n) => (
              <DestinationTile key={n.id} href={docUrl('destinations', n.slug || '', locale)} title={n.title} tagline={n.tagline} image={img(n.featured_image, 'tile')} />
            ))}
          </div>
        </section>
      ) : null}

      {guides.docs.length ? (
        <section className="section section--linen" aria-labelledby="dest-guides">
          <div className="container">
            <h2 id="dest-guides">{t('guides', { name: doc.title })}</h2>
            <div className="grid grid--3">
              {guides.docs.map((g) => (
                <GuideCard key={g.id} href={docUrl('guides', g.slug || '', locale)} title={g.title} excerpt={g.excerpt} image={img(g.featured_image, 'card')} meta={formatMonthYear(locale, g.last_updated)} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
      <CtaBand locale={locale} />
      <JsonLd data={ld} />
    </>
  )
}
