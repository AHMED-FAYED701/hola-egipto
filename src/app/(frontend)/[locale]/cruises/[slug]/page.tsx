import type { Metadata } from 'next'

import { PageShell } from '@/components/PageShell'
import { TripPage } from '@/components/trip/TripPage'
import { formatPrice } from '@/lib/format'
import { singleMetadata } from '@/lib/meta-single'
import { loadSingle } from '@/lib/single'
import { fixedPageUrl } from '@/lib/urls'

type Params = { params: Promise<{ locale: string; slug: string }> }

export const generateStaticParams = () => []

export function generateMetadata({ params }: Params): Promise<Metadata> {
  return singleMetadata('cruises', params, (d, l) => (l === 'es' ? `${d.title} · crucero por el Nilo · Hola Egipto` : `${d.title} · Nile cruise · Hola Egipto`))
}

export default async function CruisePage({ params }: Params) {
  const { locale, doc, alternates } = await loadSingle('cruises', params)
  return (
    <PageShell
      locale={locale}
      alternates={alternates}
      stickyTrip={{ id: doc.id, type: 'cruise', price: formatPrice(locale, doc.price_from_eur, doc.price_from_usd), basis: '', planHref: `${fixedPageUrl('plan-my-trip', locale)}?trip=cruise-${doc.id}`, waMessage: '' }}
    >
      <TripPage collection="cruises" doc={doc} locale={locale} />
    </PageShell>
  )
}
