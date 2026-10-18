/**
 * Structural matcher for localized front-end paths (contracts §5). Pure: used by src/proxy.ts
 * (to answer unknown paths with a real 404 page) and by /api/hola/routes.
 */
import type { Locale } from '@/i18n/routing'

import { ARCHIVE_BASE, type ContentCollection, TERM_BASE, type TaxonomyCollection } from './urls'

export type RouteMatch =
  | { kind: 'home'; locale: Locale }
  | { kind: 'archive'; locale: Locale; collection: ContentCollection }
  | { kind: 'search'; locale: Locale }
  | { kind: 'single'; locale: Locale; collection: ContentCollection; slug: string }
  | { kind: 'term'; locale: Locale; taxonomy: TaxonomyCollection; slug: string }
  | { kind: 'page'; locale: Locale; slug: string }

const SEARCH: Record<Locale, string> = { es: 'buscar', en: 'search' }
const SEG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

/** `pathname` must end with "/". Returns null for paths that cannot exist. */
export function matchPath(pathname: string): RouteMatch | null {
  let locale: Locale = 'es'
  let rest = pathname
  if (pathname === '/en/' || pathname.startsWith('/en/')) {
    locale = 'en'
    rest = pathname.slice(3)
  }
  const segs = rest.split('/').filter(Boolean)
  if (segs.length === 0) return { kind: 'home', locale }
  if (!segs.every((s) => SEG_RE.test(s))) return null
  const [a, b, c] = segs
  const collection = (Object.keys(ARCHIVE_BASE) as ContentCollection[]).find((k) => ARCHIVE_BASE[k][locale] === a)
  if (segs.length === 1) {
    if (collection) return { kind: 'archive', locale, collection }
    if (a === SEARCH[locale]) return { kind: 'search', locale }
    return { kind: 'page', locale, slug: a }
  }
  if (!collection) return null
  if (segs.length === 2) return { kind: 'single', locale, collection, slug: b }
  if (segs.length === 3) {
    const taxonomy = (Object.keys(TERM_BASE) as TaxonomyCollection[]).find(
      (t) => TERM_BASE[t].archive === collection && TERM_BASE[t].seg[locale] === b,
    )
    if (taxonomy) return { kind: 'term', locale, taxonomy, slug: c }
  }
  return null
}

/** Index of existing slugs, as served by /api/hola/routes. */
export interface RouteIndex {
  single: Record<string, Record<Locale, string[]>>
  term: Record<string, Record<Locale, string[]>>
  page: Record<Locale, string[]>
}

export function existsIn(index: RouteIndex, m: RouteMatch): boolean {
  switch (m.kind) {
    case 'home':
    case 'archive':
    case 'search':
      return true
    case 'single':
      return Boolean(index.single[m.collection]?.[m.locale]?.includes(m.slug))
    case 'term':
      return Boolean(index.term[m.taxonomy]?.[m.locale]?.includes(m.slug))
    case 'page':
      return index.page[m.locale].includes(m.slug)
  }
}
