import type { Metadata } from 'next'

import { NotFoundView } from '@/components/NotFoundView'
import { PageShell } from '@/components/PageShell'
import { resolveLocale } from '@/lib/locale'

/** Localized 404 page; src/proxy.ts rewrites unknown URLs here with status 404. */
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  return { title: locale === 'en' ? 'Page not found · Hola Egipto' : 'Página no encontrada · Hola Egipto', robots: { index: false, follow: true } }
}

export default async function Hola404({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await resolveLocale(params)
  return (
    <PageShell locale={locale} alternates={{ es: '/', en: '/en/' }}>
      <NotFoundView locale={locale} />
    </PageShell>
  )
}
