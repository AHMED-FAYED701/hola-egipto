import { revalidatePath } from 'next/cache'

import { revalidateSite } from '@/lib/revalidate'
import { safeEqual } from '@/lib/secrets'

export const dynamic = 'force-dynamic'

/** POST {"all":true} with header x-hola-revalidate: <HOLA_PREVIEW_KEY> → revalidate the whole site (contracts §16). */
export async function POST(req: Request) {
  const key = process.env.HOLA_PREVIEW_KEY || ''
  const given = req.headers.get('x-hola-revalidate') || ''
  if (!key || !given || !safeEqual(given, key)) {
    return Response.json({ ok: false }, { status: 401, headers: { 'Cache-Control': 'no-store' } })
  }
  let body: { all?: boolean; paths?: string[] } = {}
  try {
    body = await req.json()
  } catch {
    body = {}
  }
  if (Array.isArray(body.paths) && !body.all) {
    for (const p of body.paths) if (typeof p === 'string' && p.startsWith('/')) revalidatePath(p)
  } else {
    revalidateSite()
  }
  return Response.json({ ok: true }, { headers: { 'Cache-Control': 'no-store' } })
}
