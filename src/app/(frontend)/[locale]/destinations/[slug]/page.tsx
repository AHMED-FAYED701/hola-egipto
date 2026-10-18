import type { Metadata } from 'next'

import { DestinationPage } from '@/components/dest/DestinationPage'
import { PageShell } from '@/components/PageShell'
import { singleMetadata } from '@/lib/meta-single'
import { loadSingle } from '@/lib/single'

type Params = { params: Promise<{ locale: string; slug: string }> }

export const generateStaticParams = () => []

export function generateMetadata({ params }: Params): Promise<Metadata> {
  return singleMetadata('destinations', params, (d, l) =>
    l === 'es' ? `Qué ver en ${d.title}: guía y viajes · Hola Egipto` : `Things to do in ${d.title}: guide and trips · Hola Egipto`,
  )
}

export default async function Page({ params }: Params) {
  const { locale, doc, alternates } = await loadSingle('destinations', params)
  return (
    <PageShell locale={locale} alternates={alternates}>
      <DestinationPage doc={doc} locale={locale} />
    </PageShell>
  )
}
