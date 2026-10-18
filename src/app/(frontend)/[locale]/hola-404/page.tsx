import type { Metadata } from 'next'

import { NotFoundView } from '@/components/NotFoundView'
import { resolveLocale } from '@/lib/locale'

/** Localized 404 page; src/proxy.ts rewrites unknown URLs here with status 404. */
export const metadata: Metadata = { robots: { index: false, follow: true } }

export default async function Hola404({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await resolveLocale(params)
  return <NotFoundView locale={locale} />
}
