import { getTranslations } from 'next-intl/server'

import type { Locale } from '@/i18n/routing'
import { listAvailable, listTerms } from '@/lib/data'
import { img } from '@/lib/media'
import { archiveUrl, docUrl, termUrl } from '@/lib/urls'

import s from '../archive/archive.module.css'
import { type ArchiveHeading } from '../archive/TripArchive'
import { Breadcrumbs, type Crumb } from '../Breadcrumbs'
import { DestinationTile } from '../Cards'
import { EgyptMap } from '../EgyptMap'
import { FaqSection } from '../Faq'
import { getMapRegions } from '../header/regions'
import { PageHero } from '../PageHero'
import { CtaBand } from '../Sections'

/** Destinations archive and region landing: H1 + intro, region tabs, 3:4 tiles, SVG map with region links. */
export async function DestinationsArchive({ locale, heading, crumbs, regionId }: { locale: Locale; heading: ArchiveHeading; crumbs: Crumb[]; regionId?: number }) {
  const t = await getTranslations({ locale, namespace: 'archive' })
  const tc = await getTranslations({ locale, namespace: 'common' })
  const tt = await getTranslations({ locale, namespace: 'trip' })
  const [regions, mapRegions, dests] = await Promise.all([
    listTerms('regions', locale),
    getMapRegions(locale),
    listAvailable('destinations', locale, { where: regionId ? { region: { equals: regionId } } : undefined, sort: 'title', limit: 100, depth: 1 }),
  ])
  return (
    <>
      <Breadcrumbs items={crumbs} label={tc('breadcrumb')} />
      <PageHero title={heading.h1} intro={heading.intro} image={heading.hero} />
      <div className="container section--tight">
        <nav aria-label={t('regions')}>
          <ul className="chips" style={{ marginBottom: 'var(--he-space-6)' }}>
            <li>
              <a className="chip" href={archiveUrl('destinations', locale)} aria-current={!regionId ? 'page' : undefined}>
                {t('allRegions')}
              </a>
            </li>
            {regions.map((r) => (
              <li key={r.id}>
                <a className="chip" href={r.slug ? termUrl('regions', r.slug, locale) : '#'} aria-current={regionId === r.id ? 'page' : undefined}>
                  {r.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className={s.split}>
          <div>
            <p className={s.count} role="status" style={{ marginBottom: 'var(--he-space-4)' }}>
              {t('results', { n: dests.totalDocs })}
            </p>
            {dests.docs.length ? (
              <div className={s.tiles}>
                {dests.docs.map((d) => (
                  <DestinationTile key={d.id} href={docUrl('destinations', d.slug || '', locale)} title={d.title} tagline={d.tagline} image={img(d.featured_image, 'tile')} />
                ))}
              </div>
            ) : (
              <p className={s.empty}>{t('results', { n: 0 })}</p>
            )}
          </div>
          <aside className={s.map} aria-label={t('map')}>
            <h2 className="he-eyebrow">{t('map')}</h2>
            <EgyptMap regions={mapRegions} title={t('map')} />
          </aside>
        </div>
      </div>
      {heading.seo_text || heading.faq?.length ? (
        <div className="container section">
          {heading.seo_text ? <p className={`lead ${s.seo}`}>{heading.seo_text}</p> : null}
          {heading.faq?.length ? <FaqSection title={tt('faq')} items={heading.faq} id="archive-faq" /> : null}
        </div>
      ) : null}
      <CtaBand locale={locale} />
    </>
  )
}
