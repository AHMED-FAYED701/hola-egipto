import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { Blocks } from '@/components/home/Blocks'
import { PageShell } from '@/components/PageShell'
import { findPageByTemplate } from '@/lib/data'
import { resolveLocale } from '@/lib/locale'
import { img } from '@/lib/media'
import { buildMetadata } from '@/lib/seo'
import { homeUrl } from '@/lib/urls'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await resolveLocale(params)
  const page = await findPageByTemplate('home', locale)
  const og = img(page?.seo?.og_image, 'hero')
  return buildMetadata({
    locale,
    title: page?.seo?.meta_title || (locale === 'es' ? 'Hola Egipto · Viajes a Egipto, cruceros por el Nilo y excursiones' : 'Hola Egipto · Egypt tours, Nile cruises and excursions'),
    description: page?.seo?.meta_description || page?.excerpt,
    path: homeUrl(locale),
    alternates: { es: '/', en: '/en/' },
    image: og ? { url: og.src, width: og.width, height: og.height, alt: og.alt } : null,
  })
}

export default async function Home({ params }: Props) {
  const locale = await resolveLocale(params)
  const page = await findPageByTemplate('home', locale, 2)
  if (!page) notFound()
  return (
    <PageShell locale={locale} alternates={{ es: '/', en: '/en/' }}>
      <Blocks blocks={page.layout} locale={locale} />
    </PageShell>
  )
}
