import type { MetadataRoute } from 'next'

import type { Locale } from '@/i18n/routing'
import { publicUrls, type UrlPair } from '@/lib/content/routes'
import { siteUrl } from '@/lib/site'

export const dynamic = 'force-dynamic'

const LOCALES: Locale[] = ['es', 'en']

type Entry = MetadataRoute.Sitemap[number]

/** Every indexable, available URL in both languages, with xhtml:link alternates where both exist (contracts §10). */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl()
  const out: Entry[] = []
  const pair = ({ urls, lastModified }: UrlPair) => {
    const both = urls.es && urls.en
    for (const l of LOCALES) {
      const u = urls[l]
      if (!u) continue
      out.push({
        url: base + u,
        lastModified: lastModified ?? undefined,
        ...(both ? { alternates: { languages: { es: base + urls.es, en: base + urls.en, 'x-default': base + urls.es } } } : {}),
      })
    }
  }
  const all = await publicUrls()
  all.home.forEach(pair)
  all.archive.forEach(pair)
  all.single.forEach(pair)
  all.term.forEach(({ urls }) => pair({ urls }))
  all.page.filter((p) => p.index).forEach(pair)
  return out
}
