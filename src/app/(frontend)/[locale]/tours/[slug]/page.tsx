import type { Metadata } from 'next'

import { PageShell } from '@/components/PageShell'
import { TripPage } from '@/components/trip/TripPage'
import { formatPrice } from '@/lib/format'
import { singleMetadata } from '@/lib/meta-single'
import { loadSingle } from '@/lib/single'
import { fixedPageUrl } from '@/lib/urls'
import type { Tour } from '@/lib/content/types'

type Params = { params: Promise<{ locale: string; slug: string }> }

export const generateStaticParams = () => []

export function generateMetadata({ params }: Params): Promise<Metadata> {
  return singleMetadata('tours', params, (d, l) => {
    const n = (d as unknown as Tour).duration_days
    return l === 'es' ? `${d.title} · ${n} días por Egipto · Hola Egipto` : `${d.title} · ${n}-day Egypt tour · Hola Egipto`
  })
}

export default async function TourPage({ params }: Params) {
  const { locale, doc, alternates } = await loadSingle('tours', params)
  return (
    <PageShell
      locale={locale}
      alternates={alternates}
      stickyTrip={{ id: doc.id, type: 'tour', price: formatPrice(locale, doc.price_from_eur, doc.price_from_usd), basis: '', planHref: `${fixedPageUrl('plan-my-trip', locale)}?trip=tour-${doc.id}`, waMessage: '' }}
    >
      <TripPage collection="tours" doc={doc} locale={locale} />
    </PageShell>
  )
}
