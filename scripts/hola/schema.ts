import config from '@payload-config'
import { getPayload } from 'payload'

import { done, fieldNames, out } from './_lib'

const payload = await getPayload({ config })
const collections: Record<string, string[]> = {}
for (const c of payload.config.collections) {
  if (c.slug.startsWith('payload-')) continue
  collections[c.slug] = fieldNames(c.fields).filter((n) => n !== 'id')
}
const globals: Record<string, string[]> = {}
for (const g of payload.config.globals) globals[g.slug] = fieldNames(g.fields)
const loc = payload.config.localization
out({
  collections,
  globals,
  locales: loc ? loc.localeCodes : [],
  defaultLocale: loc ? loc.defaultLocale : null,
})
done()
