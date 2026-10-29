import fs from 'node:fs/promises'
import path from 'node:path'

import { UPLOAD_TYPES, UPLOAD_URL_PREFIX, uploadFileFor } from '@/lib/uploads'

export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ path: string[] }> }

/** Serves admin uploads (src/lib/uploads.ts). Names are unique, so files are cached for a year. */
export async function GET(_req: Request, { params }: Props) {
  const { path: segs } = await params
  const abs = uploadFileFor(UPLOAD_URL_PREFIX + segs.join('/'))
  if (!abs) return new Response('Not found', { status: 404 })
  let body: Buffer
  try {
    body = await fs.readFile(abs)
  } catch {
    return new Response('Not found', { status: 404 })
  }
  return new Response(new Uint8Array(body), {
    headers: {
      'Content-Type': UPLOAD_TYPES[path.extname(abs).toLowerCase()],
      'Content-Length': String(body.length),
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  })
}
