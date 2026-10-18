import type { Metadata } from 'next'

import { GuidesArchive } from '@/components/guide/GuidesArchive'
import { PageShell } from '@/components/PageShell'
import type { SP } from '@/lib/archive'
import { loadTerm, termMetadata } from '@/lib/listing'

// Reads searchParams (filters, pagination, ?q, ?ref, ?trip): always rendered per request (contracts §16).
export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ locale: string; term: string }>; searchParams: Promise<SP> }

export function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  return termMetadata('guide-topics', params, 'term', searchParams)
}

export default async function TopicPage({ params, searchParams }: Props) {
  const { locale, term, alternates, heading, crumbs, path } = await loadTerm('guide-topics', params, 'term')
  return (
    <PageShell locale={locale} alternates={alternates}>
      <GuidesArchive locale={locale} heading={heading} crumbs={crumbs} topicId={term.id} basePath={path} searchParams={await searchParams} />
    </PageShell>
  )
}
