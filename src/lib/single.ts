import 'server-only'

import { notFound } from 'next/navigation'

import type { Locale } from '@/i18n/routing'

import { alternateSlug, findAvailableBySlug } from './data'
import { resolveLocale } from './locale'
import { type ContentCollection, docUrl, otherLocale } from './urls'

/** Load an available item by slug, plus its URL in each language (null when not available there). */
export async function loadSingle<C extends ContentCollection>(collection: C, params: Promise<{ locale: string; slug: string }>, depth = 2) {
  const locale = await resolveLocale(params)
  const { slug } = await params
  const doc = await findAvailableBySlug(collection, slug, locale, depth)
  if (!doc) notFound()
  const other = otherLocale(locale)
  const otherSlug = await alternateSlug(collection, (doc as { id: number }).id, other)
  const alternates = {
    [locale]: docUrl(collection, slug, locale),
    [other]: otherSlug ? docUrl(collection, otherSlug, other) : null,
  } as { es: string | null; en: string | null }
  return { locale: locale as Locale, doc, alternates, path: docUrl(collection, slug, locale) }
}
