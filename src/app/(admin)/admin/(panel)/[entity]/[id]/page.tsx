import Link from 'next/link'
import { notFound } from 'next/navigation'

import { previewMarkdownAction } from '@/admin/actions'
import { formOptions, toFormDoc } from '@/admin/doc'
import { deleteEntityAction, duplicateEntityAction, saveEntityAction } from '@/admin/entity-actions'
import { DocForm } from '@/admin/form/DocForm'
import { ConfirmButton } from '@/admin/form/ConfirmButton'
import { adminDict } from '@/admin/server'
import { publicUrl } from '@/admin/site-url'
import { ENTITY_SPECS } from '@/admin/spec'
import { requireUser } from '@/lib/auth'
import { durationName } from '@/lib/content/admin'
import { type Ent, isTaxonomy } from '@/lib/content/tables'
import { loadEditable } from '@/lib/content/write'

type Props = { params: Promise<{ entity: string; id: string }>; searchParams: Promise<{ saved?: string }> }

/** Edit form (`/admin/<entity>/<id>`) or create form (`/admin/<entity>/new`). */
export default async function EntityEdit({ params, searchParams }: Props) {
  const { entity, id: rawId } = await params
  if (!(entity in ENTITY_SPECS)) notFound()
  const ent = entity as Ent
  await requireUser(`/admin/${ent}/${rawId}`)
  const isNew = rawId === 'new'
  const id = isNew ? null : Number(rawId)
  if (!isNew && !(Number.isInteger(id) && (id as number) > 0)) notFound()
  const editable = id ? await loadEditable(ent, id) : null
  if (id && !editable) notFound()
  const { lang, t } = await adminDict()
  const spec = ENTITY_SPECS[ent]
  const initial = toFormDoc(editable, spec)
  if (isNew) {
    initial.i18n.es.available = isTaxonomy(ent)
    initial.i18n.en.available = isTaxonomy(ent)
    if (ent === 'pages') initial.main.template = 'default'
    if (ent === 'guides') initial.main.toc = true
    if (ent === 'tours' || ent === 'cruises' || ent === 'excursions') Object.assign(initial.main, { price_basis: 'per_person_double', group_type: 'small', booking_mode: 'inquiry', guide_languages: ['es', 'en'] })
  }
  const options = await formOptions(spec)
  if (ent === 'tours') options.readonly = { duration_label: await durationName((editable?.main.duration_id as number | null) ?? null) }
  const saved = (await searchParams).saved === '1'
  const titleKey = isTaxonomy(ent) ? 'name' : 'title'
  const heading = isNew ? `${t.new} · ${t[ent]}` : String(editable?.i18n.es?.[titleKey] || editable?.i18n.en?.[titleKey] || `#${id}`)
  const template = String(editable?.main.template || '')
  const links = (['es', 'en'] as const)
    .map((l) => ({ l, href: publicUrl(ent, editable?.i18n[l]?.slug as string | null, l, template), on: isTaxonomy(ent) || Boolean(editable?.i18n[l]?.available) }))
    .filter((x) => x.href && x.on)
  return (
    <>
      <p>
        <Link href={`/admin/${ent}`}>← {t.backToList}</Link>
      </p>
      <h1>{heading}</h1>
      {saved ? (
        <p className="adm-flash" role="status">
          {t.saved}
        </p>
      ) : null}
      {id ? (
        <div className="adm-toolbar">
          <div className="adm-row">
            {links.map((x) => (
              <a key={x.l} className="adm-btn adm-btn--small" href={x.href as string} target="_blank" rel="noopener">
                {t.viewOnSite} ({x.l.toUpperCase()}) ↗
              </a>
            ))}
          </div>
          <div className="adm-row">
            <form action={duplicateEntityAction.bind(null, ent, id)}>
              <button type="submit" className="adm-btn adm-btn--small">
                {t.duplicate}
              </button>
            </form>
            <form action={deleteEntityAction.bind(null, ent, id)}>
              <ConfirmButton label={t.delete} confirm={t.deleteConfirm} />
            </form>
          </div>
        </div>
      ) : null}
      <DocForm spec={spec} initial={initial} options={options} action={saveEntityAction.bind(null, ent, id)} preview={previewMarkdownAction} t={t} ui={lang} submitLabel={isNew ? t.create : t.save} />
    </>
  )
}
