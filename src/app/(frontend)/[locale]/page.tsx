import { getTranslations } from 'next-intl/server'

import { PageShell } from '@/components/PageShell'
import { BookingBand, CtaBand, StatsStrip, TrustBar } from '@/components/Sections'
import { resolveLocale } from '@/lib/locale'

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await resolveLocale(params)
  const t = await getTranslations({ locale, namespace: 'common' })
  return (
    <PageShell locale={locale} alternates={{ es: '/', en: '/en/' }}>
      <section className="section container">
        <h1>{locale === 'en' ? 'Your Egypt trip, planned with people who live here' : 'Tu viaje a Egipto, planificado con gente de aquí'}</h1>
        <p className="lead">{t('planTrip')}</p>
        <StatsStrip locale={locale} />
      </section>
      <BookingBand locale={locale} />
      <TrustBar locale={locale} />
      <CtaBand locale={locale} />
    </PageShell>
  )
}
