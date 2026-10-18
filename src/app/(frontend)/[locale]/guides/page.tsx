import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

import { GuidesArchive } from '@/components/guide/GuidesArchive'
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
  const h = await archiveIntro('guides', locale)
  return listingMetadata({ locale, title: `${h.h1} · Hola Egipto`, description: h.intro, path: archiveUrl('guides', locale), alternates: archiveAlternates('guides'), searchParams: await searchParams })
}

export default async function GuidesPage({ params, searchParams }: Props) {
  const locale = await resolveLocale(params)
  const heading = await archiveIntro('guides', locale)
  const tc = await getTranslations({ locale, namespace: 'common' })
  const path = archiveUrl('guides', locale)
  return (
    <PageShell locale={locale} alternates={archiveAlternates('guides')}>
      <GuidesArchive
        locale={locale}
        heading={heading}
        basePath={path}
        searchParams={await searchParams}
        crumbs={[
          { label: tc('home'), href: homeUrl(locale) },
          { label: heading.h1, href: path },
        ]}
      />
    </PageShell>
  )
}
