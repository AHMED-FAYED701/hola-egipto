import { getTranslations } from 'next-intl/server'

import type { Locale } from '@/i18n/routing'
import { listAvailable } from '@/lib/content/read'
import { tripCard, type TripDoc } from '@/lib/trips'
import { archiveUrl, searchUrl, type ContentCollection } from '@/lib/urls'

import { TripCard } from './Cards'
import { getShell } from '@/lib/shell'

/** 404: short message, search, 4 featured trips, links to the archives. */
export async function NotFoundView({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: 'notFound' })
  const tc = await getTranslations({ locale, namespace: 'common' })
  const tt = await getTranslations({ locale, namespace: 'trip' })
  const { settings } = await getShell(locale)
  const featured = await listAvailable('tours', locale, { where: { featured: { equals: true } }, limit: 4, depth: 1 })
  const more = featured.docs.length < 4 ? await listAvailable('excursions', locale, { where: { featured: { equals: true } }, limit: 4 - featured.docs.length, depth: 1 }) : null
  const cols: ContentCollection[] = ['tours', 'cruises', 'excursions', 'destinations', 'guides']
  return (
    <>
      <section className="section container container--narrow">
        <h1>{t('title')}</h1>
        <p className="lead">{t('text')}</p>
        <form action={searchUrl(locale)} method="get" role="search" className="field" style={{ marginTop: 'var(--he-space-6)' }}>
          <label htmlFor="nf-q">{tc('search')}</label>
          <div style={{ display: 'flex', gap: 'var(--he-space-3)' }}>
            <input id="nf-q" type="search" name="q" placeholder={tc('searchPlaceholder')} />
            <button className="btn btn--outline" type="submit">
              {tc('search')}
            </button>
          </div>
        </form>
        <h2 className="h4">{t('archives')}</h2>
        <ul className="chips">
          {cols.map((c) => (
            <li key={c}>
              <a className="chip" href={archiveUrl(c, locale)}>
                {settings.archive_intros?.[c]?.h1 || c}
              </a>
            </li>
          ))}
        </ul>
      </section>
      <section className="section section--linen" aria-label={tt('related')}>
        <div className="container grid grid--4">
          {featured.docs.map((d) => (
            <TripCard key={`t${d.id}`} trip={tripCard(d as TripDoc, 'tours', locale, tt)} fromLabel={tc('from')} />
          ))}
          {(more?.docs || []).map((d) => (
            <TripCard key={`e${d.id}`} trip={tripCard(d as TripDoc, 'excursions', locale, tt)} fromLabel={tc('from')} />
          ))}
        </div>
      </section>
    </>
  )
}
