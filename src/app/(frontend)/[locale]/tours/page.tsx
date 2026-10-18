import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

import { TripArchive } from '@/components/archive/TripArchive'
import { PageShell } from '@/components/PageShell'
import type { SP } from '@/lib/archive'
import { archiveAlternates, archiveIntro, listingMetadata } from '@/lib/listing'
import { resolveLocale } from '@/lib/locale'
import { archiveUrl, homeUrl } from '@/lib/urls'

// Reads searchParams (filters, pagination, ?q, ?ref, ?trip): always rendered per request (contracts §16).
export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ locale: string }>; searchParams: Promise<SP> }

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const locale = await resolveLocale(params)
  const h = await archiveIntro('tours', locale)
  return listingMetadata({
    locale,
    title: `${h.h1} · Hola Egipto`,
    description: h.intro,
    path: archiveUrl('tours', locale),
    alternates: archiveAlternates('tours'),
    searchParams: await searchParams,
    image: h.hero ? { url: h.hero.src, width: h.hero.width, height: h.hero.height, alt: h.hero.alt } : null,
  })
}

export default async function Archive({ params, searchParams }: Props) {
  const locale = await resolveLocale(params)
  const heading = await archiveIntro('tours', locale)
  const tc = await getTranslations({ locale, namespace: 'common' })
  const path = archiveUrl('tours', locale)
  return (
    <PageShell locale={locale} alternates={archiveAlternates('tours')}>
      <TripArchive
        locale={locale}
        collection="tours"
        searchParams={await searchParams}
        basePath={path}
        heading={heading}
        crumbs={[
          { label: tc('home'), href: homeUrl(locale) },
          { label: heading.h1, href: path },
        ]}
      />
    </PageShell>
  )
}
