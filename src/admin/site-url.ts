import type { Locale } from '@/i18n/routing'
import { type Ent, isTaxonomy } from '@/lib/content/tables'
import { docUrl, pageUrl, termUrl } from '@/lib/urls'

/** Public URL of an item in one language ("view on site"), or null when it has no slug there. */
export function publicUrl(ent: Ent, slug: string | null | undefined, locale: Locale, template?: string): string | null {
  if (!slug) return null
  if (ent === 'pages') return template === 'home' ? (locale === 'en' ? '/en/' : '/') : pageUrl(slug, locale)
  if (isTaxonomy(ent)) return termUrl(ent, slug, locale)
  return docUrl(ent, slug, locale)
}
