import { notFound } from 'next/navigation'

import { SetupForm } from '@/admin/AuthForms'
import { adminDict } from '@/admin/server'
import { countUsers } from '@/lib/content/users'
import { safeEqual } from '@/lib/secrets'

export const metadata = { title: 'Setup' }

/** First admin account (contracts §18): 404 unless there are 0 users and ?key= equals HOLA_PREVIEW_KEY. */
export default async function SetupPage({ searchParams }: { searchParams: Promise<{ key?: string }> }) {
  const key = String((await searchParams).key || '')
  const expected = process.env.HOLA_PREVIEW_KEY || ''
  if (!expected || !key || !safeEqual(key, expected)) notFound()
  if ((await countUsers()) > 0) notFound()
  const { t } = await adminDict()
  return (
    <main className="adm-auth" id="main">
      <h1>{t.setupTitle}</h1>
      <p className="adm-muted">{t.setupIntro}</p>
      <SetupForm setupKey={key} t={t} />
    </main>
  )
}
