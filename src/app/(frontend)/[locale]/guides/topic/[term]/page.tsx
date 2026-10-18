import { notFound } from 'next/navigation'

import { resolveLocale } from '@/lib/locale'
import { findTermBySlug } from '@/lib/data'

export const generateStaticParams = () => []

export default async function Term({ params }: { params: Promise<{ locale: string; term: string }> }) {
  const locale = await resolveLocale(params)
  const { term } = await params
  const doc = await findTermBySlug('guide-topics', term, locale)
  if (!doc) notFound()
  return <h1>{doc.h1 || doc.name}</h1>
}
