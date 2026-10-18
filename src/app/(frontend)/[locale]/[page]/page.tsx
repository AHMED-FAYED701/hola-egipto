import { notFound } from 'next/navigation'

import { resolveLocale } from '@/lib/locale'
import { findAvailableBySlug } from '@/lib/data'

export const generateStaticParams = () => []

export default async function FixedPage({ params }: { params: Promise<{ locale: string; page: string }> }) {
  const locale = await resolveLocale(params)
  const { page } = await params
  const doc = await findAvailableBySlug('pages', page, locale)
  if (!doc || doc.template === 'home') notFound()
  return <h1>{doc.title}</h1>
}
