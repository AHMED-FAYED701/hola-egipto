import 'server-only'

import type { DataFromCollectionSlug, PaginatedDocs, Where } from 'payload'
import { cache } from 'react'

import type { Locale } from '@/i18n/routing'

import { getPayloadClient } from './payload'
import type { ContentCollection, TaxonomyCollection } from './urls'

/** Data access for the front end (Payload Local API). Per-request memoized with React cache(). */

export const getSettings = cache(async (locale: Locale) => {
  const payload = await getPayloadClient()
  return payload.findGlobal({ slug: 'site-settings', locale, depth: 1 })
})

export const getNavigation = cache(async (locale: Locale) => {
  const payload = await getPayloadClient()
  return payload.findGlobal({ slug: 'navigation', locale, depth: 2 })
})

const availableWhere = (extra?: Where): Where => (extra ? { and: [{ available: { equals: true } }, extra] } : { available: { equals: true } })

const findAvailableBySlugCached = cache(async (collection: ContentCollection | 'pages', slug: string, locale: Locale, depth = 2) => {
  const payload = await getPayloadClient()
  const res = await payload.find({
    collection,
    locale,
    depth,
    limit: 1,
    where: availableWhere({ slug: { equals: slug } }),
  })
  return res.docs[0] ?? null
})

/** An item available in `locale` with that slug, or null. */
export function findAvailableBySlug<C extends ContentCollection | 'pages'>(
  collection: C,
  slug: string,
  locale: Locale,
  depth = 2,
): Promise<DataFromCollectionSlug<C> | null> {
  return findAvailableBySlugCached(collection, slug, locale, depth) as Promise<DataFromCollectionSlug<C> | null>
}

/** Slug of the same item in another locale when it is available there, else null. */
export const alternateSlug = cache(async (collection: ContentCollection | 'pages', id: number, locale: Locale) => {
  const payload = await getPayloadClient()
  try {
    const doc = (await payload.findByID({ collection, id, locale, depth: 0 })) as { available?: boolean | null; slug?: string | null }
    return doc.available && doc.slug ? doc.slug : null
  } catch {
    return null
  }
})

const findTermBySlugCached = cache(async (taxonomy: TaxonomyCollection, slug: string, locale: Locale, depth = 1) => {
  const payload = await getPayloadClient()
  const res = await payload.find({ collection: taxonomy, locale, depth, limit: 1, where: { slug: { equals: slug } } })
  return res.docs[0] ?? null
})

export function findTermBySlug<T extends TaxonomyCollection>(taxonomy: T, slug: string, locale: Locale, depth = 1) {
  return findTermBySlugCached(taxonomy, slug, locale, depth) as Promise<DataFromCollectionSlug<T> | null>
}

export const termSlugIn = cache(async (taxonomy: TaxonomyCollection, id: number, locale: Locale) => {
  const payload = await getPayloadClient()
  try {
    const doc = (await payload.findByID({ collection: taxonomy, id, locale, depth: 0 })) as { slug?: string | null }
    return doc.slug || null
  } catch {
    return null
  }
})

export const listTerms = cache(async (taxonomy: TaxonomyCollection, locale: Locale) => {
  const payload = await getPayloadClient()
  const res = await payload.find({ collection: taxonomy, locale, depth: 1, limit: 100, sort: 'sort' })
  return res.docs
})

export async function listAvailable<C extends ContentCollection | 'pages'>(
  collection: C,
  locale: Locale,
  opts: { where?: Where; limit?: number; sort?: string; depth?: number; page?: number } = {},
): Promise<PaginatedDocs<DataFromCollectionSlug<C>>> {
  const payload = await getPayloadClient()
  return payload.find({
    collection: collection as ContentCollection,
    locale,
    depth: opts.depth ?? 1,
    limit: opts.limit ?? 100,
    page: opts.page,
    sort: opts.sort,
    where: availableWhere(opts.where),
  }) as unknown as Promise<PaginatedDocs<DataFromCollectionSlug<C>>>
}

export const findPageByTemplate = cache(async (template: string, locale: Locale, depth = 2) => {
  const payload = await getPayloadClient()
  const res = await payload.find({
    collection: 'pages',
    locale,
    depth,
    limit: 1,
    where: availableWhere({ template: { equals: template } }),
  })
  return res.docs[0] ?? null
})
