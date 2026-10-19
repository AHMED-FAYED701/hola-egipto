import { currentUser } from '@/lib/auth'

export const dynamic = 'force-dynamic'

/** {"admin":true} for a signed-in admin/editor, so the front end can show owner-only "[pendiente]" markers. */
export async function GET() {
  return Response.json({ admin: Boolean(await currentUser()) }, { headers: { 'Cache-Control': 'no-store' } })
}
