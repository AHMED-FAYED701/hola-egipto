import config from '@payload-config'
import { getPayload, type Where } from 'payload'

import { args, done, out } from './_lib'

// Delete inquiries older than 24 months unless won (contracts §7); schedule at deployment.
const dry = args().includes('--dry-run')
const cutoff = new Date()
cutoff.setMonth(cutoff.getMonth() - 24)
const where: Where = { and: [{ createdAt: { less_than: cutoff.toISOString() } }, { status: { not_equals: 'won' } }] }
const payload = await getPayload({ config })
if (dry) {
  const n = await payload.count({ collection: 'inquiries', where, overrideAccess: true })
  out({ deleted: 0, would_delete: n.totalDocs, dry_run: true })
} else {
  const res = await payload.delete({ collection: 'inquiries', where, overrideAccess: true })
  out({ deleted: res.docs.length })
}
done()
