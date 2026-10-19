import Link from 'next/link'
import { notFound } from 'next/navigation'

import { adminDict } from '@/admin/server'
import { publicUrl } from '@/admin/site-url'
import { ENTITY_SPECS } from '@/admin/spec'
import { requireUser } from '@/lib/auth'
import { adminList } from '@/lib/content/admin'
import { type Ent, isTaxonomy } from '@/lib/content/tables'

type Props = { params: Promise<{ entity: string }>; searchParams: Promise<{ q?: string; deleted?: string }> }

/** Content list (contracts §18): search, language availability, sample badge. */
export default async function EntityList({ params, searchParams }: Props) {
  const { entity } = await params
  if (!(entity in ENTITY_SPECS)) notFound()
  const ent = entity as Ent
  await requireUser(`/admin/${ent}`)
  const { t } = await adminDict()
  const { q = '', deleted } = await searchParams
  const rows = await adminList(ent, q.trim().slice(0, 80))
  const badge = (on: boolean | undefined, l: string) => <span className={on ? 'adm-badge' : 'adm-badge adm-badge--off'}>{`${l} ${on ? '✓' : '–'}`}</span>
  return (
    <>
      <h1>{t[ent]}</h1>
      {deleted ? (
        <p className="adm-flash" role="status">
          {t.deleted}
        </p>
      ) : null}
      <div className="adm-toolbar">
        <form method="get" role="search">
          <input type="search" name="q" defaultValue={q} placeholder={t.searchPlaceholder} aria-label={t.search} />
          <button type="submit" className="adm-btn">
            {t.search}
          </button>
        </form>
        <Link className="adm-btn adm-btn--primary" href={`/admin/${ent}/new`}>
          + {t.new}
        </Link>
      </div>
      <div className="adm-table-wrap">
        <table className="adm-table">
          <thead>
            <tr>
              <th>{isTaxonomy(ent) ? 'Nombre / Name' : 'Título / Title'}</th>
              <th>{t.available}</th>
              {ent === 'pages' ? <th>Template</th> : null}
              <th>{t.viewOnSite}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const es = publicUrl(ent, r.es?.slug, 'es', r.extra)
              const en = publicUrl(ent, r.en?.slug, 'en', r.extra)
              return (
                <tr key={r.id}>
                  <td>
                    <Link href={`/admin/${ent}/${r.id}`}>{r.es?.title || r.en?.title || `#${r.id}`}</Link>
                    {r.en?.title && r.en.title !== r.es?.title ? <div className="adm-muted">{r.en.title}</div> : null}
                    {r.sample ? <span className="adm-badge adm-badge--sample">{t.sample}</span> : null}
                  </td>
                  <td>
                    {badge(isTaxonomy(ent) ? Boolean(r.es) : r.es?.available, 'ES')} {badge(isTaxonomy(ent) ? Boolean(r.en) : r.en?.available, 'EN')}
                  </td>
                  {ent === 'pages' ? <td>{r.extra}</td> : null}
                  <td>
                    {es && (isTaxonomy(ent) || r.es?.available) ? (
                      <a href={es} target="_blank" rel="noopener">
                        ES ↗
                      </a>
                    ) : null}{' '}
                    {en && (isTaxonomy(ent) || r.en?.available) ? (
                      <a href={en} target="_blank" rel="noopener">
                        EN ↗
                      </a>
                    ) : null}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        {!rows.length ? <p className="adm-muted">{t.noResults}</p> : null}
      </div>
    </>
  )
}
