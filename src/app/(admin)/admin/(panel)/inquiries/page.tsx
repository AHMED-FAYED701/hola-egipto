import Link from 'next/link'

import { adminDict } from '@/admin/server'
import { requireUser } from '@/lib/auth'
import { INQUIRY_STATUSES, listInquiries } from '@/lib/content/inquiries'

export const metadata = { title: 'Inquiries' }

const PER_PAGE = 50
type Props = { searchParams: Promise<{ status?: string; page?: string; deleted?: string }> }

/** Inquiries: newest first, status filter, CSV export (contracts §18). */
export default async function InquiriesPage({ searchParams }: Props) {
  await requireUser('/admin/inquiries')
  const { lang, t } = await adminDict()
  const sp = await searchParams
  const status = (INQUIRY_STATUSES as readonly string[]).includes(sp.status || '') ? (sp.status as string) : ''
  const page = Math.max(1, parseInt(sp.page || '1', 10) || 1)
  const { rows, total } = await listInquiries({ status, limit: PER_PAGE, offset: (page - 1) * PER_PAGE })
  const dt = new Intl.DateTimeFormat(lang === 'es' ? 'es-ES' : 'en-GB', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Africa/Cairo' })
  const st = (s: string) => t[`status_${s}` as keyof typeof t] || s
  const pages = Math.max(1, Math.ceil(total / PER_PAGE))
  return (
    <>
      <h1>{t.inquiries}</h1>
      {sp.deleted ? (
        <p className="adm-flash" role="status">
          {t.deleted}
        </p>
      ) : null}
      <div className="adm-toolbar">
        <nav className="adm-row" aria-label={t.status}>
          <Link className="adm-btn adm-btn--small" aria-current={!status ? 'page' : undefined} href="/admin/inquiries">
            {t.all}
          </Link>
          {INQUIRY_STATUSES.map((s) => (
            <Link key={s} className="adm-btn adm-btn--small" aria-current={status === s ? 'page' : undefined} href={`/admin/inquiries?status=${s}`}>
              {st(s)}
            </Link>
          ))}
        </nav>
        <a className="adm-btn" href={`/admin/inquiries/export${status ? `?status=${status}` : ''}`}>
          {t.exportCsv}
        </a>
      </div>
      <div className="adm-table-wrap">
        <table className="adm-table">
          <thead>
            <tr>
              <th>{t.received}</th>
              <th>{t.inquiries}</th>
              <th>{t.email}</th>
              <th>{t.status}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <td>{dt.format(r.created_at)}</td>
                <td>
                  <Link href={`/admin/inquiries/${r.id}`}>{r.title}</Link> {r.hola_sample ? <span className="adm-badge adm-badge--sample">{t.sample}</span> : null}
                </td>
                <td>{r.email}</td>
                <td>{st(r.status)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {!rows.length ? <p className="adm-muted">{t.noResults}</p> : null}
      </div>
      {pages > 1 ? (
        <p className="adm-row">
          {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
            <Link key={n} className="adm-btn adm-btn--small" aria-current={n === page ? 'page' : undefined} href={`/admin/inquiries?${status ? `status=${status}&` : ''}page=${n}`}>
              {n}
            </Link>
          ))}
        </p>
      ) : null}
    </>
  )
}
