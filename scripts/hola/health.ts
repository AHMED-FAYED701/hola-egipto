import config from '@payload-config'
import { getPayload } from 'payload'

import { done, out } from './_lib'

let db = false
let ok = false
let collections = 0
try {
  const payload = await getPayload({ config })
  ok = true
  collections = payload.config.collections.filter((c) => !c.slug.startsWith('payload-')).length
  await payload.count({ collection: 'users', overrideAccess: true })
  db = true
} catch (e) {
  process.stderr.write(`health: ${(e as Error).message}\n`)
}
out({ db, payload: ok, collections })
done(db && ok ? 0 : 1)
