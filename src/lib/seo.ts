import type { Metadata } from 'next'

import type { Locale } from '@/i18n/routing'

import { siteUrl } from './site'

export interface SeoInput {
  locale: Locale
  title: string
  description?: string | null
  /** Path of this page (with trailing slash, plus query for paginated pages). */
  path: string
  /** Same page in each language; hreflang only when both exist. */
  alternates?: { es: string | null; en: string | null } | null
  index?: boolean
  image?: { url: string; width?: number; height?: number; alt?: string } | null
  type?: 'website' | 'article'
}

const clip = (s: string, n = 155) => (s.length <= n ? s : s.slice(0, n - 1).replace(/\s+\S*$/, '') + '…')

/** Metadata per contracts §10: self-canonical + hreflang on indexable pages, robots, Open Graph. */
export function buildMetadata(i: SeoInput): Metadata {
  const base = siteUrl()
  const index = i.index !== false
  const md: Metadata = {
    title: i.title,
    description: i.description ? clip(i.description) : undefined,
    robots: index ? { index: true, follow: true } : { index: false, follow: true },
  }
  if (index) {
    const languages: Record<string, string> = {}
    if (i.alternates?.es && i.alternates?.en) {
      languages.es = base + i.alternates.es
      languages.en = base + i.alternates.en
      languages['x-default'] = base + i.alternates.es
    }
    md.alternates = { canonical: base + i.path, ...(Object.keys(languages).length ? { languages } : {}) }
  }
  const img = i.image ?? { url: `/brand/og/og-default-${i.locale}-1200x630.png`, width: 1200, height: 630, alt: 'Hola Egipto' }
  md.openGraph = {
    title: i.title,
    description: i.description ? clip(i.description, 200) : undefined,
    url: base + i.path,
    siteName: 'Hola Egipto',
    locale: i.locale === 'es' ? 'es_ES' : 'en_US',
    alternateLocale: i.locale === 'es' ? ['en_US'] : ['es_ES'],
    type: i.type ?? 'website',
    images: [{ url: img.url.startsWith('http') ? img.url : base + img.url, width: img.width, height: img.height, alt: img.alt }],
  }
  md.twitter = { card: 'summary_large_image' }
  return md
}
