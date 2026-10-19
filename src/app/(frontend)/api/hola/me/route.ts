import { cookies } from 'next/headers'

import { SESSION_COOKIE, verifySession } from '@/lib/session'

export const dynamic = 'force-dynamic'

/** {"admin":true} for a logged-in admin/editor, so the front end can show owner-only "[pendiente]" markers. */
export async function GET() {
  const claims = await verifySession((await cookies()).get(SESSION_COOKIE)?.value)
  return Response.json({ admin: Boolean(claims) }, { headers: { 'Cache-Control': 'no-store' } })
}
