import { ConfirmButton } from '@/admin/form/ConfirmButton'
import { AddUserForm, ResetPasswordForm } from '@/admin/form/UserForms'
import { addUserAction, deleteUserAction, resetPasswordAction, setRoleAction } from '@/admin/people-actions'
import { adminDict } from '@/admin/server'
import { requireAdmin } from '@/lib/auth'
import { listUsers } from '@/lib/content/users'

export const metadata = { title: 'Users' }

/** Users (admin role): list, add, reset password (shown once), change role, delete (contracts §18). */
export default async function UsersPage({ searchParams }: { searchParams: Promise<{ saved?: string; deleted?: string }> }) {
  const me = await requireAdmin('/admin/users')
  const { lang, t } = await adminDict()
  const users = await listUsers()
  const sp = await searchParams
  const dt = new Intl.DateTimeFormat(lang === 'es' ? 'es-ES' : 'en-GB', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Africa/Cairo' })
  return (
    <>
      <h1>{t.users}</h1>
      {sp.saved || sp.deleted ? (
        <p className="adm-flash" role="status">
          {sp.deleted ? t.deleted : t.saved}
        </p>
      ) : null}
      <section className="adm-panel">
        <h2>{t.addUser}</h2>
        <AddUserForm action={addUserAction} t={t} />
      </section>
      <div className="adm-table-wrap">
        <table className="adm-table">
          <thead>
            <tr>
              <th>{t.email}</th>
              <th>{t.role}</th>
              <th>{t.lastLogin}</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>
                  {u.email} {u.id === me.id ? <span className="adm-badge">{t.you}</span> : null}
                </td>
                <td>
                  {u.id === me.id ? (
                    t[`role_${u.role}` as 'role_admin']
                  ) : (
                    <form action={setRoleAction.bind(null, u.id)} className="adm-row">
                      <select name="role" defaultValue={u.role} aria-label={t.role}>
                        <option value="admin">{t.role_admin}</option>
                        <option value="editor">{t.role_editor}</option>
                      </select>
                      <button type="submit" className="adm-btn adm-btn--small">
                        {t.save}
                      </button>
                    </form>
                  )}
                </td>
                <td>{u.last_login_at ? dt.format(u.last_login_at) : '—'}</td>
                <td>
                  {u.id !== me.id ? (
                    <div className="adm-row">
                      <ResetPasswordForm action={resetPasswordAction.bind(null, u.id)} t={t} />
                      <form action={deleteUserAction.bind(null, u.id)}>
                        <ConfirmButton label={t.delete} confirm={t.deleteConfirm} />
                      </form>
                    </div>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
