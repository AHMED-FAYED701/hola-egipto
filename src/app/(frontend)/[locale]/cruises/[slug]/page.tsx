import { notFound } from 'next/navigation'

import { resolveLocale } from '@/lib/locale'
import { findAvailableBySlug } from '@/lib/data'

export const generateStaticParams = () => []

export default async function Single({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const locale = await resolveLocale(params)
  const { slug } = await params
  const doc = await findAvailableBySlug('cruises', slug, locale)
  if (!doc) notFound()
  return <h1>{doc.title}</h1>
}
