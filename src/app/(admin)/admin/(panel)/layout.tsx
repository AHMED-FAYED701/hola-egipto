import Link from 'next/link'
import type { ReactNode } from 'react'

import { logoutAction, setAdminLangAction } from '@/admin/actions'
import { AdminNav } from '@/admin/AdminNav'
import { LangToggle } from '@/admin/LangToggle'
import { adminDict } from '@/admin/server'
import { requireUser } from '@/lib/auth'

/** Signed-in area: every page below re-checks the user and session_version (contracts §18). */
export default async function PanelLayout({ children }: { children: ReactNode }) {
  const user = await requireUser()
  const { lang, t } = await adminDict()
  const other = lang === 'es' ? 'en' : 'es'
  return (
    <>
      <a className="adm-skip" href="#main">
        {lang === 'es' ? 'Saltar al contenido' : 'Skip to content'}
      </a>
      <div className="adm-shell">
        <aside className="adm-side">
          <Link className="adm-logo" href="/admin">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/footer-logo-reverse.svg" alt="Hola Egipto · Admin" width={150} height={40} />
          </Link>
          <AdminNav t={t} isAdmin={user.role === 'admin'} />
        </aside>
        <div className="adm-main">
          <div className="adm-top">
            <span className="adm-muted">
              {user.email} · {user.role === 'admin' ? t.role_admin : t.role_editor}
            </span>
            <a href="/" target="_blank" rel="noopener">
              hola-egipto ↗
            </a>
            <LangToggle action={setAdminLangAction} other={other} />
            <form action={logoutAction}>
              <button type="submit" className="adm-btn adm-btn--small">
                {t.logout}
              </button>
            </form>
          </div>
          <main id="main">{children}</main>
        </div>
      </div>
    </>
  )
}
