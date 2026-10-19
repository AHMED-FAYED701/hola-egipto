import type { MetadataRoute } from 'next'

import { siteUrl } from '@/lib/site'

// Reads SITE_URL at request time (contracts §16, §19).
export const dynamic = 'force-dynamic'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api/', '/buscar/', '/en/search/'],
      },
    ],
    sitemap: `${siteUrl()}/sitemap.xml`,
  }
}
