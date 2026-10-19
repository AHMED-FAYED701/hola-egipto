import Link from 'next/link'
import { notFound } from 'next/navigation'

import { ConfirmButton } from '@/admin/form/ConfirmButton'
import { deleteInquiryAction, setInquiryStatusAction } from '@/admin/people-actions'
import { adminDict } from '@/admin/server'
import { requireUser } from '@/lib/auth'
import { getInquiry, INQUIRY_STATUSES } from '@/lib/content/inquiries'
import { findById } from '@/lib/content/read'
import { TRIP_COLLECTION, type TripType } from '@/lib/urls'

export const metadata = { title: 'Inquiry' }

/** Inquiry detail: every field, change status, delete (contracts §18). */
export default async function InquiryPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ saved?: string }> }) {
  const { id: raw } = await params
  await requireUser(`/admin/inquiries/${raw}`)
  const id = Number(raw)
  const inq = Number.isInteger(id) && id > 0 ? await getInquiry(id) : null
  if (!inq) notFound()
  const { lang, t } = await adminDict()
  const trip = inq.trip_type && inq.trip_id ? await findById<{ title: string }>(TRIP_COLLECTION[inq.trip_type as TripType], inq.trip_id, 'es', 0) : null
  const dt = new Intl.DateTimeFormat(lang === 'es' ? 'es-ES' : 'en-GB', { dateStyle: 'full', timeStyle: 'short', timeZone: 'Africa/Cairo' })
  const show = (v: unknown) => (v === null || v === undefined || v === '' ? '—' : typeof v === 'object' ? (v instanceof Date ? dt.format(v) : JSON.stringify(v)) : String(v))
  const fields: [string, unknown][] = [
    ['id', inq.id],
    [t.received, inq.created_at],
    ['form', inq.form],
    ['trip', trip ? `${trip.title} (${inq.trip_type} ${inq.trip_id})` : inq.trip_type ? `${inq.trip_type} ${inq.trip_id}` : null],
    ...(['name', 'email', 'whatsapp', 'channel', 'lang', 'interests', 'length', 'date_mode', 'date_from', 'date_to', 'month', 'adults', 'children', 'children_ages', 'budget', 'hotel', 'group_type', 'message', 'consent_at', 'marketing', 'page_url', 'landing', 'utm', 'gclid', 'fbclid', 'tracked', 'hola_sample'] as const).map(
      (k) => [k, inq[k]] as [string, unknown],
    ),
  ]
  return (
    <>
      <p>
        <Link href="/admin/inquiries">← {t.backToList}</Link>
      </p>
      <h1>{inq.title}</h1>
      {(await searchParams).saved ? (
        <p className="adm-flash" role="status">
          {t.saved}
        </p>
      ) : null}
      <div className="adm-toolbar">
        <form action={setInquiryStatusAction.bind(null, inq.id)} className="adm-row">
          <label htmlFor="status">{t.changeStatus}</label>
          <select id="status" name="status" defaultValue={inq.status}>
            {INQUIRY_STATUSES.map((s) => (
              <option key={s} value={s}>
                {t[`status_${s}` as keyof typeof t]}
              </option>
            ))}
          </select>
          <button type="submit" className="adm-btn adm-btn--primary">
            {t.save}
          </button>
        </form>
        <form action={deleteInquiryAction.bind(null, inq.id)}>
          <ConfirmButton label={t.delete} confirm={t.deleteConfirm} />
        </form>
      </div>
      <section className="adm-panel">
        <dl className="adm-dl">
          {fields.map(([k, v]) => (
            <div key={k} style={{ display: 'contents' }}>
              <dt>{k}</dt>
              <dd>{show(v)}</dd>
            </div>
          ))}
        </dl>
      </section>
    </>
  )
}
