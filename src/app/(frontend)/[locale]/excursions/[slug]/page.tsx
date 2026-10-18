import type { Metadata } from 'next'

import { PageShell } from '@/components/PageShell'
import { TripPage } from '@/components/trip/TripPage'
import { formatPrice } from '@/lib/format'
import { singleMetadata } from '@/lib/meta-single'
import { loadSingle } from '@/lib/single'
import { fixedPageUrl } from '@/lib/urls'
import type { Excursion } from '@/payload-types'

type Params = { params: Promise<{ locale: string; slug: string }> }

export const generateStaticParams = () => []

export function generateMetadata({ params }: Params): Promise<Metadata> {
  return singleMetadata('excursions', params, (d, l) => {
    const dep = (d as unknown as Excursion).departure?.[0]
    const city = dep && typeof dep === 'object' ? dep.name : ''
    // Avoid "… desde Hurghada desde Hurghada" when the title already names the city.
    if (!city || d.title.toLowerCase().includes(city.toLowerCase())) return `${d.title} · Hola Egipto`
    return l === 'es' ? `${d.title} desde ${city} · Hola Egipto` : `${d.title} from ${city} · Hola Egipto`
  })
}

export default async function ExcursionPage({ params }: Params) {
  const { locale, doc, alternates } = await loadSingle('excursions', params)
  return (
    <PageShell
      locale={locale}
      alternates={alternates}
      stickyTrip={{ id: doc.id, type: 'excursion', price: formatPrice(locale, doc.price_from_eur, doc.price_from_usd), basis: '', planHref: `${fixedPageUrl('plan-my-trip', locale)}?trip=excursion-${doc.id}`, waMessage: '' }}
    >
      <TripPage collection="excursions" doc={doc} locale={locale} />
    </PageShell>
  )
}
