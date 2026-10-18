
import { resolveLocale } from '@/lib/locale'

export default async function Archive({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await resolveLocale(params)
  return <h1 lang={locale}>destinations</h1>
}
