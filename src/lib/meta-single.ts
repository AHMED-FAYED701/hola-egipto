import 'server-only'

import type { Metadata } from 'next'

import type { Locale } from '@/i18n/routing'

import { alternateSlug, findAvailableBySlug, getSettings } from './data'
import { img } from './media'
import { buildMetadata } from './seo'
import { type ContentCollection, docUrl, otherLocale } from './urls'

type Doc = {
  id: number
  title: string
  slug?: string | null
  excerpt?: string | null
  featured_image?: unknown
  seo?: { meta_title?: string | null; meta_description?: string | null; og_image?: unknown } | null
}

/** generateMetadata for single items: title template, description, canonical, hreflang, OG image fallback chain. */
export async function singleMetadata(
  collection: ContentCollection,
  params: Promise<{ locale: string; slug: string }>,
  titleFor: (doc: Doc, locale: Locale) => string,
  type: 'website' | 'article' = 'website',
): Promise<Metadata> {
  const { locale: l, slug } = await params
  if (l !== 'es' && l !== 'en') return {}
  const locale = l as Locale
  const doc = (await findAvailableBySlug(collection, slug, locale, 2)) as Doc | null
  if (!doc) return { robots: { index: false, follow: true } }
  const other = otherLocale(locale)
  const otherSlug = await alternateSlug(collection, doc.id, other)
  const here = docUrl(collection, slug, locale)
  const alternates = { [locale]: here, [other]: otherSlug ? docUrl(collection, otherSlug, other) : null } as { es: string | null; en: string | null }
  const settings = await getSettings(locale)
  const og = img(doc.seo?.og_image, 'hero') || img(doc.featured_image, 'hero') || img(settings.og_default, 'hero')
  return buildMetadata({
    locale,
    title: doc.seo?.meta_title || titleFor(doc, locale),
    description: doc.seo?.meta_description || doc.excerpt,
    path: here,
    alternates,
    image: og ? { url: og.src, width: og.width, height: og.height, alt: og.alt } : null,
    type,
  })
}
