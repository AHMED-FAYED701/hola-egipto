import type { Metadata } from 'next'

import { TripArchive } from '@/components/archive/TripArchive'
import { PageShell } from '@/components/PageShell'
import type { SP } from '@/lib/archive'
import { loadTerm, termMetadata } from '@/lib/listing'

// Reads searchParams (filters, pagination, ?q, ?ref, ?trip): always rendered per request (contracts §16).
export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ locale: string; term: string }>; searchParams: Promise<SP> }

export function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  return termMetadata('trip-styles', params, 'term', searchParams)
}

export default async function TermLanding({ params, searchParams }: Props) {
  const { locale, term, alternates, heading, path, crumbs } = await loadTerm('trip-styles', params, 'term')
  return (
    <PageShell locale={locale} alternates={alternates}>
      <TripArchive locale={locale} collection="tours" searchParams={await searchParams} basePath={path} heading={heading} crumbs={crumbs} preset={{ style: term.id }} hide={['style']} />
    </PageShell>
  )
}
