import config from '@payload-config'
import { getPayload } from 'payload'

import { args, done, log, out } from './_lib'

const [cmd] = args()
const payload = await getPayload({ config })

if (cmd === 'count') {
  const total = await payload.count({ collection: 'inquiries', overrideAccess: true })
  const sample = await payload.count({ collection: 'inquiries', where: { holaSample: { equals: true } }, overrideAccess: true })
  out({ total: total.totalDocs, sample: sample.totalDocs })
  done()
} else if (cmd === 'last') {
  const res = await payload.find({ collection: 'inquiries', sort: '-createdAt', limit: 1, depth: 0, overrideAccess: true })
  const d = res.docs[0]
  out(
    d
      ? {
          id: d.id,
          form: d.form,
          lang: d.lang,
          name: d.name,
          email: d.email,
          status: d.status,
          tracked: Boolean(d.tracked),
          holaSample: Boolean(d.holaSample),
          utm: d.utm ?? {},
        }
      : null,
  )
  done()
} else {
  log('usage: hola:inquiries count|last')
  done(2)
}
