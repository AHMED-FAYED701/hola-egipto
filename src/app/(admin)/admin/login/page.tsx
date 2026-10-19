import { redirect } from 'next/navigation'

import { LoginForm } from '@/admin/AuthForms'
import { adminDict } from '@/admin/server'
import { currentUser, safeNext } from '@/lib/auth'

export const metadata = { title: 'Login' }

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const next = safeNext((await searchParams).next)
  if (await currentUser()) redirect(next)
  const { t } = await adminDict()
  return (
    <main className="adm-auth" id="main">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/brand/header-logo.svg" alt="Hola Egipto" width={200} height={50} style={{ height: 'auto' }} />
      <h1>{t.login}</h1>
      <LoginForm next={next} t={t} />
    </main>
  )
}
