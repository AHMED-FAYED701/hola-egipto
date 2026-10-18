import type { Metadata } from 'next'

import { GuidePage } from '@/components/guide/GuidePage'
import { PageShell } from '@/components/PageShell'
import { singleMetadata } from '@/lib/meta-single'
import { loadSingle } from '@/lib/single'

type Params = { params: Promise<{ locale: string; slug: string }> }

export const generateStaticParams = () => []

export function generateMetadata({ params }: Params): Promise<Metadata> {
  return singleMetadata('guides', params, (d, l) => (l === 'es' ? `${d.title} · Guía de viaje Hola Egipto` : `${d.title} · Hola Egipto Travel Guide`), 'article')
}

export default async function Page({ params }: Params) {
  const { locale, doc, alternates } = await loadSingle('guides', params, 3)
  return (
    <PageShell locale={locale} alternates={alternates}>
      <GuidePage doc={doc} locale={locale} />
    </PageShell>
  )
}
