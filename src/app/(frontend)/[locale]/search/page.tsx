
import { resolveLocale } from '@/lib/locale'

export default async function Search({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await resolveLocale(params)
  return <h1>{locale === 'en' ? 'Search' : 'Buscar'}</h1>
}
