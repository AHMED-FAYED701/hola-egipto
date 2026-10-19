import Link from 'next/link'
import { adminDict } from '@/admin/server'
import { requireUser } from '@/lib/auth'
import { adminCounts } from '@/lib/content/admin'
import { countImages } from '@/lib/content/images'
import { countInquiries, listInquiries } from '@/lib/content/inquiries'
import type { Ent } from '@/lib/content/tables'

export const metadata = { title: 'Dashboard' }

const ENTS: Ent[] = ['tours', 'cruises', 'excursions', 'destinations', 'guides', 'pages']

/** Dashboard (contracts §18): counts, newest inquiries, links. */
export default async function Dashboard({ searchParams }: { searchParams: Promise<{ denied?: string }> }) {
  await requireUser('/admin')
  const { lang, t } = await adminDict()
  const denied = (await searchParams).denied === '1'
  const [counts, inq, images, newest] = await Promise.all([
    Promise.all(ENTS.map(async (e) => [e, await adminCounts(e)] as const)),
    countInquiries(),
    countImages(),
    listInquiries({ limit: 5 }),
  ])
  const dt = new Intl.DateTimeFormat(lang === 'es' ? 'es-ES' : 'en-GB', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Africa/Cairo' })
  return (
    <>
      <h1>{t.dashboard}</h1>
      {denied ? (
        <p className="adm-flash adm-flash--error" role="alert">
          {t.denied}
        </p>
      ) : null}
      <h2>{t.counts}</h2>
      <div className="adm-cards">
        {counts.map(([e, c]) => (
          <Link key={e} className="adm-card" href={`/admin/${e}`}>
            <strong>{c.total}</strong>
            {t[e]}
            <span className="adm-muted">
              {' '}
              · ES {c.es} · EN {c.en}
              {c.sample ? ` · ${t.sample} ${c.sample}` : ''}
            </span>
          </Link>
        ))}
        <Link className="adm-card" href="/admin/inquiries">
          <strong>{inq.new}</strong>
          {t.inquiries} ({t.status_new.toLowerCase()})<span className="adm-muted"> · {t.total} {inq.total}</span>
        </Link>
        <Link className="adm-card" href="/admin/images">
          <strong>{images.total}</strong>
          {t.images}
          <span className="adm-muted">{images.sample ? ` · ${t.sample} ${images.sample}` : ''}</span>
        </Link>
      </div>
      <section className="adm-panel" aria-labelledby="newest">
        <h2 id="newest">{t.newest}</h2>
        {newest.rows.length ? (
          <div className="adm-table-wrap">
            <table className="adm-table">
              <thead>
                <tr>
                  <th>{t.received}</th>
                  <th>{t.inquiries}</th>
                  <th>{t.status}</th>
                </tr>
              </thead>
              <tbody>
                {newest.rows.map((r) => (
                  <tr key={r.id}>
                    <td>{dt.format(r.created_at)}</td>
                    <td>
                      <Link href={`/admin/inquiries/${r.id}`}>{r.title}</Link>
                    </td>
                    <td>{t[`status_${r.status}` as keyof typeof t] || r.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="adm-muted">{t.noResults}</p>
        )}
      </section>
    </>
  )
}
