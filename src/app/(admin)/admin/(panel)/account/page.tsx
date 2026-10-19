import { OwnPasswordForm } from '@/admin/form/UserForms'
import { changeOwnPasswordAction } from '@/admin/people-actions'
import { adminDict } from '@/admin/server'
import { requireUser } from '@/lib/auth'

export const metadata = { title: 'Account' }

/** Change own password (contracts §18). */
export default async function AccountPage() {
  const me = await requireUser('/admin/account')
  const { t } = await adminDict()
  return (
    <>
      <h1>{t.account}</h1>
      <p className="adm-muted">
        {me.email} · {me.role === 'admin' ? t.role_admin : t.role_editor}
      </p>
      <section className="adm-panel">
        <h2>{t.changePassword}</h2>
        <OwnPasswordForm action={changeOwnPasswordAction} t={t} />
      </section>
    </>
  )
}
