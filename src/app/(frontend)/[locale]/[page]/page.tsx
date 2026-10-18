import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { PageShell } from '@/components/PageShell'
import { FixedPage } from '@/components/pages/FixedPage'
import { renderTemplateExtras } from '@/components/pages/templates'
import type { SP } from '@/lib/archive'
import { alternateSlug, findAvailableBySlug } from '@/lib/data'
import { resolveLocale } from '@/lib/locale'
import { buildMetadata } from '@/lib/seo'
import { otherLocale, pageUrl } from '@/lib/urls'

// Reads searchParams (filters, pagination, ?q, ?ref, ?trip): always rendered per request (contracts §16).
export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ locale: string; page: string }>; searchParams: Promise<SP> }

async function load(params: Props['params']) {
  const locale = await resolveLocale(params)
  const { page: slug } = await params
  const page = await findAvailableBySlug('pages', slug, locale, 2)
  if (!page || page.template === 'home') notFound()
  const other = otherLocale(locale)
  const otherSlug = await alternateSlug('pages', page.id, other)
  const alternates = { [locale]: pageUrl(slug, locale), [other]: otherSlug ? pageUrl(otherSlug, other) : null } as { es: string | null; en: string | null }
  return { locale, page, alternates, path: pageUrl(slug, locale) }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: l } = await params
  if (l !== 'es' && l !== 'en') return {}
  const { locale, page, alternates, path } = await load(params)
  return buildMetadata({
    locale,
    title: page.seo?.meta_title || `${page.title} · Hola Egipto`,
    description: page.seo?.meta_description || page.excerpt,
    path,
    alternates,
    index: page.template !== 'thank-you',
  })
}

export default async function FixedPageRoute({ params, searchParams }: Props) {
  const { locale, page, alternates } = await load(params)
  const extras = await renderTemplateExtras(page, locale, await searchParams)
  return (
    <PageShell locale={locale} alternates={alternates}>
      <FixedPage page={page} locale={locale} extras={extras} />
    </PageShell>
  )
}
