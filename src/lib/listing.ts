import 'server-only'

import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'

import type { Locale } from '@/i18n/routing'

import { isFiltered, pageNumber, type SP } from './archive'
import { findTermBySlug, getSettings, termSlugIn } from './content/read'
import { resolveLocale } from './locale'
import { img } from './media'
import { buildMetadata } from './seo'
import { archiveUrl, type ContentCollection, homeUrl, otherLocale, type TaxonomyCollection, TERM_BASE, termUrl } from './urls'

/** Metadata for archives and landings: filtered → noindex, follow, no canonical; ?page=N → self-canonical. */
export function listingMetadata(o: {
  locale: Locale
  title: string
  description?: string | null
  path: string
  alternates: { es: string | null; en: string | null }
  searchParams: SP
  image?: { url: string; width: number; height: number; alt: string } | null
}): Metadata {
  if (isFiltered(o.searchParams)) {
    return buildMetadata({ locale: o.locale, title: o.title, description: o.description, path: o.path, index: false, image: o.image })
  }
  const page = pageNumber(o.searchParams)
  const q = page > 1 ? `?page=${page}` : ''
  return buildMetadata({
    locale: o.locale,
    title: o.title,
    description: o.description,
    path: o.path + q,
    alternates: {
      es: o.alternates.es ? o.alternates.es + q : null,
      en: o.alternates.en ? o.alternates.en + q : null,
    },
    image: o.image,
  })
}

export async function archiveIntro(collection: ContentCollection, locale: Locale) {
  const settings = await getSettings(locale)
  const intro = settings.archive_intros?.[collection]
  return {
    h1: intro?.h1 || collection,
    intro: intro?.intro,
    hero: img(intro?.hero, 'hero'),
    seo_text: intro?.seo_text,
    faq: (intro?.faq || []).map((f) => ({ q: f.q, a: f.a })),
  }
}

export const archiveAlternates = (collection: ContentCollection) => ({ es: archiveUrl(collection, 'es'), en: archiveUrl(collection, 'en') })

/** Load a taxonomy term for a landing page; 404 when unknown. */
export async function loadTerm<T extends TaxonomyCollection>(taxonomy: T, params: Promise<{ locale: string } & Record<string, string>>, key: string) {
  const locale = await resolveLocale(params)
  const slug = (await params)[key]
  const term = await findTermBySlug(taxonomy, slug, locale, 1)
  if (!term) notFound()
  const other = otherLocale(locale)
  const otherSlug = await termSlugIn(taxonomy, term.id, other)
  const alternates = { [locale]: termUrl(taxonomy, slug, locale), [other]: otherSlug ? termUrl(taxonomy, otherSlug, other) : null } as { es: string | null; en: string | null }
  const archive = TERM_BASE[taxonomy].archive
  const intro = await archiveIntro(archive, locale)
  const tc = await getTranslations({ locale, namespace: 'common' })
  const t = term as unknown as { name: string; h1?: string | null; intro?: string | null; seo_text?: string | null; hero?: unknown; faq?: { q: string; a: string }[] | null }
  const heading = {
    h1: t.h1 || t.name,
    intro: t.intro,
    hero: img(t.hero, 'hero') || intro.hero,
    seo_text: t.seo_text,
    faq: (t.faq || []).map((f) => ({ q: f.q, a: f.a })),
  }
  const path = termUrl(taxonomy, slug, locale)
  const crumbs = [
    { label: tc('home'), href: homeUrl(locale) },
    { label: intro.h1, href: archiveUrl(archive, locale) },
    { label: t.name, href: path },
  ]
  return { locale, term, alternates, heading, path, crumbs }
}

export async function termMetadata(taxonomy: TaxonomyCollection, params: Promise<{ locale: string } & Record<string, string>>, key: string, searchParams: Promise<SP>): Promise<Metadata> {
  const { locale: l } = await params
  if (l !== 'es' && l !== 'en') return {}
  const { locale, heading, alternates, path } = await loadTerm(taxonomy, params, key)
  return listingMetadata({
    locale,
    title: `${heading.h1} · Hola Egipto`,
    description: heading.intro,
    path,
    alternates,
    searchParams: await searchParams,
    image: heading.hero ? { url: heading.hero.src, width: heading.hero.width, height: heading.hero.height, alt: heading.hero.alt } : null,
  })
}
