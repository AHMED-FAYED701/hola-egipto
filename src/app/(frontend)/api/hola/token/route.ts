import { makeInquiryToken } from '@/lib/secrets'

export const dynamic = 'force-dynamic'

/** GET → {"token":"<ts>.<hmac>"} (contracts §7). */
export function GET() {
  return Response.json({ token: makeInquiryToken() }, { headers: { 'Cache-Control': 'no-store' } })
}
