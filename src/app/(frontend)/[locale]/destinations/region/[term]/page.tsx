import type { Metadata } from 'next'

import { DestinationsArchive } from '@/components/dest/DestinationsArchive'
import { PageShell } from '@/components/PageShell'
import type { SP } from '@/lib/archive'
import { loadTerm, termMetadata } from '@/lib/listing'

// Reads searchParams (filters, pagination, ?q, ?ref, ?trip): always rendered per request (contracts §16).
export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ locale: string; term: string }>; searchParams: Promise<SP> }

export function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  return termMetadata('regions', params, 'term', searchParams)
}

export default async function RegionPage({ params }: Props) {
  const { locale, term, alternates, heading, crumbs } = await loadTerm('regions', params, 'term')
  return (
    <PageShell locale={locale} alternates={alternates}>
      <DestinationsArchive locale={locale} heading={heading} crumbs={crumbs} regionId={term.id} />
    </PageShell>
  )
}
