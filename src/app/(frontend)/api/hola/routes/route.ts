import { routeIndex } from '@/lib/content/routes'

export const dynamic = 'force-dynamic'

/** Every existing public slug per collection and locale; read by src/proxy.ts to answer unknown URLs with 404. */
export async function GET() {
  return Response.json(await routeIndex(), { headers: { 'Cache-Control': 'no-store' } })
}
