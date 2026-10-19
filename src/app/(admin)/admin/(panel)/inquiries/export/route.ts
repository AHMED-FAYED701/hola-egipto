import { currentUser } from '@/lib/auth'
import { INQUIRY_STATUSES, listInquiries } from '@/lib/content/inquiries'

export const dynamic = 'force-dynamic'

const COLS = [
  'id', 'created_at', 'status', 'form', 'lang', 'name', 'email', 'whatsapp', 'channel', 'trip_type', 'trip_id', 'interests', 'length', 'date_mode',
  'date_from', 'date_to', 'month', 'adults', 'children', 'children_ages', 'budget', 'hotel', 'group_type', 'message', 'consent_at', 'marketing',
  'page_url', 'landing', 'utm', 'gclid', 'fbclid', 'tracked', 'hola_sample',
] as const

const cell = (v: unknown) => {
  const s = v === null || v === undefined ? '' : v instanceof Date ? v.toISOString() : typeof v === 'object' ? JSON.stringify(v) : String(v)
  // Quote every cell; neutralise spreadsheet formulas.
  return `"${(/^[=+\-@]/.test(s) ? "'" + s : s).replace(/"/g, '""')}"`
}

/** CSV export of inquiries (signed-in users only; the interceptor also guards /admin…). */
export async function GET(req: Request) {
  if (!(await currentUser())) return new Response(null, { status: 307, headers: { Location: '/admin/login?next=%2Fadmin%2Finquiries' } })
  const status = new URL(req.url).searchParams.get('status') || ''
  const { rows } = await listInquiries({ status: (INQUIRY_STATUSES as readonly string[]).includes(status) ? status : '', limit: 100000 })
  const lines = [COLS.join(','), ...rows.map((r) => COLS.map((c) => cell(r[c])).join(','))]
  return new Response('﻿' + lines.join('\r\n') + '\r\n', {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="inquiries-${new Date().toISOString().slice(0, 10)}.csv"`,
      'Cache-Control': 'no-store',
    },
  })
}
