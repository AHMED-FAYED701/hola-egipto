/** `pnpm -s hola:inquiries count | last` (contracts §9). */
import { countInquiries, lastInquiry } from '../../src/lib/content/inquiries'
import { args, log, main, out } from './_cli'

const [cmd] = args()
await main(async () => {
  if (cmd === 'count') {
    const c = await countInquiries()
    out({ total: c.total, sample: c.sample })
  } else if (cmd === 'last') {
    const d = await lastInquiry()
    out(
      d
        ? { id: d.id, form: d.form, lang: d.lang, name: d.name, email: d.email, status: d.status, tracked: Boolean(d.tracked), holaSample: Boolean(d.hola_sample), utm: d.utm ?? {} }
        : null,
    )
  } else {
    log('usage: hola:inquiries count | last')
    throw Object.assign(new Error('usage'), { code: 'USAGE' })
  }
})
