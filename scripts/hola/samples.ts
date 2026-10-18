import config from '@payload-config'
import { getPayload } from 'payload'

import { args, done, log, out, revalidateSite } from './_lib'
import { countSamples, createSamples, deleteSamples } from './_samples'

const [cmd] = args()
const dry = args().includes('--dry-run')
const payload = await getPayload({ config })
if (cmd === 'create') {
  await createSamples(payload)
  await revalidateSite()
  out(await countSamples(payload))
} else if (cmd === 'delete') {
  const counts = await deleteSamples(payload, dry)
  if (dry) out({ would_delete: counts })
  else {
    await revalidateSite()
    out({ deleted: counts })
  }
} else if (cmd === 'count') {
  out(await countSamples(payload))
} else {
  log('usage: hola:samples create | delete [--dry-run] | count')
  done(2)
}
done()
