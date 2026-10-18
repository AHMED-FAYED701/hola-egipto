import Image from 'next/image'
import { getTranslations } from 'next-intl/server'

import type { Locale } from '@/i18n/routing'
import { pageNumber, type SP } from '@/lib/archive'
import { listAvailable, listTerms } from '@/lib/data'
import { formatDate } from '@/lib/format'
import { img } from '@/lib/media'
import { archiveUrl, docUrl, termUrl } from '@/lib/urls'

import s from '../archive/archive.module.css'
import type { ArchiveHeading } from '../archive/TripArchive'
import { Breadcrumbs, type Crumb } from '../Breadcrumbs'
import { GuideCard } from '../Cards'
import { FaqSection } from '../Faq'
import { PageHero } from '../PageHero'
import { CtaBand } from '../Sections'

/** Guide archive and topic landing: featured article, topic chips, card grid, pagination. */
export async function GuidesArchive({ locale, heading, crumbs, topicId, basePath, searchParams }: { locale: Locale; heading: ArchiveHeading; crumbs: Crumb[]; topicId?: number; basePath: string; searchParams: SP }) {
  const t = await getTranslations({ locale, namespace: 'archive' })
  const tc = await getTranslations({ locale, namespace: 'common' })
  const tt = await getTranslations({ locale, namespace: 'trip' })
  const page = pageNumber(searchParams)
  const [topics, res] = await Promise.all([
    listTerms('guide-topics', locale),
    listAvailable('guides', locale, { where: topicId ? { guide_topic: { in: [topicId] } } : undefined, sort: '-last_updated', limit: 12, page, depth: 1 }),
  ])
  const [first, ...rest] = res.docs
  const showFeatured = page === 1 && first
  const firstImg = first ? img(first.featured_image, 'hero') : null
  return (
    <>
      <Breadcrumbs items={crumbs} label={tc('breadcrumb')} />
      <PageHero title={heading.h1} intro={heading.intro} image={heading.hero} />
      <div className="container section--tight">
        <nav aria-label={t('topics')}>
          <ul className="chips" style={{ marginBottom: 'var(--he-space-6)' }}>
            <li>
              <a className="chip" href={archiveUrl('guides', locale)} aria-current={!topicId ? 'page' : undefined}>
                {t('allTopics')}
              </a>
            </li>
            {topics.map((tp) => (
              <li key={tp.id}>
                <a className="chip" href={tp.slug ? termUrl('guide-topics', tp.slug, locale) : '#'} aria-current={topicId === tp.id ? 'page' : undefined}>
                  {tp.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        {showFeatured ? (
          <article className={s.featuredGuide}>
            {firstImg ? <Image src={firstImg.src} alt={firstImg.alt} width={firstImg.width} height={firstImg.height} sizes="(min-width: 768px) 640px, 100vw" loading="lazy" /> : <div />}
            <div>
              <span className="he-eyebrow">{t('featuredArticle')}</span>
              <h2>
                <a href={docUrl('guides', first.slug || '', locale)}>{first.title}</a>
              </h2>
              {first.excerpt ? <p className="muted">{first.excerpt}</p> : null}
              <p className="caption">{formatDate(locale, first.last_updated)}</p>
            </div>
          </article>
        ) : null}
        {res.docs.length === 0 ? <p className={s.empty}>{t('results', { n: 0 })}</p> : null}
        <div className="grid grid--3">
          {(showFeatured ? rest : res.docs).map((g) => (
            <GuideCard key={g.id} href={docUrl('guides', g.slug || '', locale)} title={g.title} excerpt={g.excerpt} image={img(g.featured_image, 'card')} meta={formatDate(locale, g.last_updated)} />
          ))}
        </div>
        {res.totalPages > 1 ? (
          <nav aria-label={tc('pagination')}>
            <ul className={s.pager}>
              {Array.from({ length: res.totalPages }, (_, i) => i + 1).map((n) => (
                <li key={n}>{n === page ? <span aria-current="page">{n}</span> : <a href={n === 1 ? basePath : `${basePath}?page=${n}`}>{n}</a>}</li>
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
