/** `pnpm -s hola:settings get <field>` / `set <field> [value]`: shared site-settings fields (contracts §9). */
import { getSharedSetting, saveSettingsShared, SHARED_SETTING_FIELDS, type SharedSettingField } from '../../src/lib/content/globals'
import { args, log, main, out, revalidateSite } from './_cli'

const [cmd, field, ...value] = args()
await main(async () => {
  if (!(SHARED_SETTING_FIELDS as readonly string[]).includes(field || '')) {
    log(`usage: hola:settings get|set <${SHARED_SETTING_FIELDS.join('|')}> [value]`)
    throw Object.assign(new Error('usage'), { code: 'USAGE' })
  }
  const f = field as SharedSettingField
  if (cmd === 'get') out(JSON.stringify(await getSharedSetting(f)))
  else if (cmd === 'set') {
    let v = value.join(' ').trim()
    if (v === "''" || v === '""') v = ''
    if (f === 'whatsapp_number') v = v.replace(/\D/g, '')
    await saveSettingsShared({ [f]: v || null })
    await revalidateSite()
    out({ ok: true, field: f, set: Boolean(v) })
  } else {
    log('usage: hola:settings get|set <field> [value]')
    throw Object.assign(new Error('usage'), { code: 'USAGE' })
  }
})
