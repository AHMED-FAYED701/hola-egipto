import { getTranslations } from 'next-intl/server'

import type { Locale } from '@/i18n/routing'
import { type Preset, queryTrips, type SP, sp, withParams } from '@/lib/archive'
import { listAvailable, listTerms } from '@/lib/data'
import type { Img } from '@/lib/media'
import { tripCard } from '@/lib/trips'
import { termUrl, type TripCollection } from '@/lib/urls'

import { Breadcrumbs, type Crumb } from '../Breadcrumbs'
import { TripCard } from '../Cards'
import { FaqSection, type QA } from '../Faq'
import { PageHero } from '../PageHero'
import { CtaBand } from '../Sections'
import s from './archive.module.css'
import { FilterForm } from './FilterForm'

export interface ArchiveHeading {
  h1: string
  intro?: string | null
  hero?: Img | null
  seo_text?: string | null
  faq?: QA[]
}

/** Trip archive and term landing (spec "Trip archives" / "Trip taxonomy landings"). */
export async function TripArchive({
  locale,
  collection,
  searchParams,
  basePath,
  heading,
  crumbs,
  preset = {},
  hide = [],
}: {
  locale: Locale
  collection: TripCollection
  searchParams: SP
  basePath: string
  heading: ArchiveHeading
  crumbs: Crumb[]
  preset?: Preset
  hide?: string[]
}) {
  const t = await getTranslations({ locale, namespace: 'archive' })
  const tt = await getTranslations({ locale, namespace: 'trip' })
  const tc = await getTranslations({ locale, namespace: 'common' })
  const res = await queryTrips(collection, locale, searchParams, preset)
  const [durations, styles, departures, dests] = await Promise.all([
    collection === 'tours' ? listTerms('durations', locale) : Promise.resolve([]),
    collection !== 'excursions' ? listTerms('trip-styles', locale) : Promise.resolve([]),
    collection === 'excursions' ? listTerms('departures', locale) : Promise.resolve([]),
    listAvailable('destinations', locale, { depth: 0, sort: 'title', limit: 100 }),
  ])
  const v = (k: string) => sp(searchParams, k)
  const show = (k: string) => !hide.includes(k)

  return (
    <>
      <Breadcrumbs items={crumbs} label={tc('breadcrumb')} />
      <PageHero title={heading.h1} intro={heading.intro} image={heading.hero} />
      <div className="container section--tight">
        {collection === 'excursions' && show('city') ? (
          <nav aria-label={t('city')} className={s.cities}>
            <ul className="chips">
              <li>
                <a className="chip" href={`${basePath}${withParams(searchParams, { city: null, page: null })}`} aria-current={!v('city') && !preset.city ? 'page' : undefined}>
                  {t('allCities')}
                </a>
              </li>
              {departures.map((d) => (
                <li key={d.id}>
                  <a className="chip" href={d.slug ? termUrl('departures', d.slug, locale) : '#'} aria-current={preset.city === d.id ? 'page' : undefined}>
                    {d.name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        ) : null}

        <FilterForm action={basePath} language={locale} className={s.filters} label={t('filters')}>
          <div className={s.filterGrid}>
            {collection === 'tours' && show('duration') ? (
              <div className="field">
                <label htmlFor="f-duration">{t('duration')}</label>
                <select id="f-duration" name="duration" defaultValue={v('duration')}>
                  <option value="">{t('any')}</option>
                  {durations.map((d) => (
                    <option key={d.id} value={d.slug || ''}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>
            ) : null}
            {collection !== 'excursions' && show('style') ? (
              <div className="field">
                <label htmlFor="f-style">{t('style')}</label>
                <select id="f-style" name="style" defaultValue={v('style')}>
                  <option value="">{t('any')}</option>
                  {styles.map((d) => (
                    <option key={d.id} value={d.slug || ''}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>
            ) : null}
            <div className="field">
              <label htmlFor="f-dest">{t('destination')}</label>
              <select id="f-dest" name="dest" defaultValue={v('dest')}>
                <option value="">{t('any')}</option>
                {dests.docs.map((d) => (
                  <option key={d.id} value={d.slug || ''}>
                    {d.title}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="f-price">
                {t('priceMax')} ({locale === 'es' ? '€' : '$'})
              </label>
              <input id="f-price" type="number" name="price_max" min={0} step={50} inputMode="numeric" defaultValue={v('price_max')} />
            </div>
            <div className="field">
              <label htmlFor="f-group">{t('group')}</label>
              <select id="f-group" name="group" defaultValue={v('group')}>
                <option value="">{t('any')}</option>
                <option value="private">{tt('group_private')}</option>
                <option value="small">{tt('group_small')}</option>
                <option value="shared">{tt('group_shared')}</option>
              </select>
            </div>
            <div className="field">
              <label htmlFor="f-sort">{t('sort')}</label>
              <select id="f-sort" name="sort" defaultValue={v('sort')}>
                <option value="">{t('sort_featured')}</option>
                <option value="price_asc">{t('sort_price_asc')}</option>
                <option value="price_desc">{t('sort_price_desc')}</option>
                <option value="duration">{t('sort_duration')}</option>
              </select>
            </div>
            <button type="submit" className="btn btn--outline">
              {t('apply')}
            </button>
          </div>
        </FilterForm>

        <div className={s.resultsBar}>
          <p className={s.count} role="status">
            {t('results', { n: res.totalDocs })}
          </p>
          {Object.keys(searchParams).length ? (
            <a className="text-link" href={basePath}>
              {t('clear')}
            </a>
          ) : null}
        </div>

        {res.docs.length ? (
          <div className="grid grid--3">
            {res.docs.map((d) => (
              <TripCard key={d.id} trip={tripCard(d, collection, locale, tt)} fromLabel={tc('from')} headingLevel={2} />
            ))}
          </div>
        ) : (
          <p className={s.empty}>{t('empty')}</p>
        )}

        {res.totalPages > 1 ? (
          <nav aria-label={tc('pagination')}>
            <ul className={s.pager}>
              {Array.from({ length: res.totalPages }, (_, i) => i + 1).map((n) => (
                <li key={n}>
                  {n === res.page ? (
                    <span aria-current="page">{n}</span>
                  ) : (
                    <a href={`${basePath}${withParams(searchParams, { page: n === 1 ? null : String(n) })}`} aria-label={tc('page', { n })}>
                      {n}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        ) : null}
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
