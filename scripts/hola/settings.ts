import config from '@payload-config'
import { getPayload } from 'payload'

import { args, done, log, out, revalidateSite } from './_lib'

// Shared (not localized) site-settings fields (contracts §4).
const SHARED = ['whatsapp_number', 'contact_email', 'phone', 'address', 'legal_name', 'licence_number', 'gtm_id']

const [cmd, field, ...rest] = args()
if (!SHARED.includes(field || '')) {
  log(`usage: hola:settings get|set <${SHARED.join('|')}> [value]`)
  done(2)
}
const payload = await getPayload({ config })

if (cmd === 'get') {
  const doc = (await payload.findGlobal({ slug: 'site-settings', depth: 0, overrideAccess: true })) as unknown as Record<string, unknown>
  const v = doc[field]
  out(JSON.stringify(v === null || v === undefined ? '' : v))
  done()
} else if (cmd === 'set') {
  const raw = rest.join(' ')
  const value = raw === "''" || raw === '""' ? '' : raw
  await payload.updateGlobal({
    slug: 'site-settings',
    data: { [field]: value === '' ? null : value },
    overrideAccess: true,
    context: { disableRevalidate: true },
  })
  await revalidateSite()
  out({ ok: true })
  done()
} else {
  log('usage: hola:settings get|set <field> [value]')
  done(2)
}
