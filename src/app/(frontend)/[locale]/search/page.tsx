import type { Metadata } from 'next'
import type { Where } from '@/lib/content/types'
import { getTranslations } from 'next-intl/server'

import { DestinationTile, GuideCard, TripCard } from '@/components/Cards'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { PageShell } from '@/components/PageShell'
import { type SP, sp } from '@/lib/archive'
import { listAvailable } from '@/lib/content/read'
import { formatDate } from '@/lib/format'
import { resolveLocale } from '@/lib/locale'
import { img } from '@/lib/media'
import { buildMetadata } from '@/lib/seo'
import { pushScript } from '@/lib/tracking'
import { tripCard, type TripDoc } from '@/lib/trips'
import { docUrl, homeUrl, searchUrl, type TripCollection } from '@/lib/urls'

// Reads searchParams (filters, pagination, ?q, ?ref, ?trip): always rendered per request (contracts §16).
export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ locale: string }>; searchParams: Promise<SP> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await resolveLocale(params)
  const t = await getTranslations({ locale, namespace: 'search' })
  return buildMetadata({ locale, title: `${t('title')} · Hola Egipto`, path: searchUrl(locale), index: false })
}

const match = (q: string): Where => ({ or: [{ title: { like: q } }, { excerpt: { like: q } }] })

export default async function SearchPage({ params, searchParams }: Props) {
  const locale = await resolveLocale(params)
  const q = sp(await searchParams, 'q').slice(0, 80)
  const t = await getTranslations({ locale, namespace: 'search' })
  const tc = await getTranslations({ locale, namespace: 'common' })
  const tt = await getTranslations({ locale, namespace: 'trip' })
  const cols: TripCollection[] = ['tours', 'cruises', 'excursions']
  const [trips, dests, guides] = q
    ? await Promise.all([
        Promise.all(cols.map((c) => listAvailable(c, locale, { where: match(q), limit: 12, depth: 1 }))),
        listAvailable('destinations', locale, { where: match(q), limit: 12, depth: 1 }),
        listAvailable('guides', locale, { where: match(q), limit: 12, depth: 1 }),
      ])
    : [[], null, null]
  const tripCards = (trips as { docs: unknown[] }[]).flatMap((r, i) => r.docs.map((d) => tripCard(d as TripDoc, cols[i], locale, tt)))
  const total = tripCards.length + (dests?.docs.length || 0) + (guides?.docs.length || 0)
  return (
    <PageShell locale={locale} alternates={{ es: '/buscar/', en: '/en/search/' }}>
      {q ? <script dangerouslySetInnerHTML={{ __html: pushScript({ event: 'search', search_term: q, language: locale }) }} /> : null}
      <Breadcrumbs
        items={[
          { label: tc('home'), href: homeUrl(locale) },
          { label: t('title'), href: searchUrl(locale) },
        ]}
        label={tc('breadcrumb')}
      />
      <section className="container section--tight">
        <h1>{q ? t('resultsFor', { q }) : t('title')}</h1>
        <form action={searchUrl(locale)} method="get" role="search" className="field">
          <label htmlFor="q">{tc('search')}</label>
          <div style={{ display: 'flex', gap: 'var(--he-space-3)' }}>
            <input id="q" type="search" name="q" defaultValue={q} placeholder={tc('searchPlaceholder')} />
            <button className="btn btn--primary" type="submit">
              {tc('search')}
            </button>
          </div>
        </form>
        {!q ? <p className="muted">{t('prompt')}</p> : total === 0 ? <p>{t('none', { q })}</p> : null}
      </section>
      {tripCards.length ? (
        <section className="container section--tight" aria-labelledby="r-trips">
          <h2 id="r-trips">{t('trips')}</h2>
          <div className="grid grid--3">
            {tripCards.map((c) => (
              <TripCard key={`${c.collection}-${c.id}`} trip={c} fromLabel={tc('from')} headingLevel={3} />
            ))}
          </div>
        </section>
      ) : null}
      {dests?.docs.length ? (
        <section className="container section--tight" aria-labelledby="r-dests">
          <h2 id="r-dests">{t('destinations')}</h2>
          <div className="grid grid--4">
            {dests.docs.map((d) => (
              <DestinationTile key={d.id} href={docUrl('destinations', d.slug || '', locale)} title={d.title} tagline={d.tagline} image={img(d.featured_image, 'tile')} />
            ))}
          </div>
        </section>
      ) : null}
      {guides?.docs.length ? (
        <section className="container section--tight" aria-labelledby="r-guides">
          <h2 id="r-guides">{t('guides')}</h2>
          <div className="grid grid--3">
            {guides.docs.map((g) => (
              <GuideCard key={g.id} href={docUrl('guides', g.slug || '', locale)} title={g.title} excerpt={g.excerpt} image={img(g.featured_image, 'card')} meta={formatDate(locale, g.last_updated)} />
            ))}
          </div>
        </section>
      ) : null}
    </PageShell>
  )
}
