
import { resolveLocale } from '@/lib/locale'

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await resolveLocale(params)
  return <h1>{locale === 'en' ? 'Your Egypt trip, planned with people who live here' : 'Tu viaje a Egipto, planificado con gente de aquí'}</h1>
}
