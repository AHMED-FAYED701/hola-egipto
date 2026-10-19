import { previewMarkdownAction } from '@/admin/actions'
import { formOptions, toFormDoc } from '@/admin/doc'
import { DocForm } from '@/admin/form/DocForm'
import { saveSettingsAction } from '@/admin/global-actions'
import { adminDict } from '@/admin/server'
import { SETTINGS_SPEC } from '@/admin/spec'
import { requireAdmin } from '@/lib/auth'
import { getSettingsRaw } from '@/lib/content/globals'

export const metadata = { title: 'Settings' }

const CONTACT = ['whatsapp_number', 'contact_email', 'phone', 'address', 'legal_name', 'licence_number', 'gtm_id'] as const

/** site-settings grouped as in contracts §4; shows which owner inputs are still empty (hidden on the site). */
export default async function SettingsPage({ searchParams }: { searchParams: Promise<{ saved?: string }> }) {
  await requireAdmin('/admin/settings')
  const { lang, t } = await adminDict()
  const raw = await getSettingsRaw()
  const initial = toFormDoc(raw.shared ? { main: raw.shared as never, i18n: raw.i18n as never, joins: {} } : null, SETTINGS_SPEC)
  const empty = CONTACT.filter((k) => !raw.shared?.[k])
  const saved = (await searchParams).saved === '1'
  return (
    <>
      <h1>{t.settings}</h1>
      {saved ? (
        <p className="adm-flash" role="status">
          {t.saved}
        </p>
      ) : null}
      {empty.length ? (
        <p className="adm-flash adm-flash--error">
          {t.emptyFields} <strong>{empty.join(', ')}</strong>
        </p>
      ) : null}
      <DocForm spec={SETTINGS_SPEC} initial={initial} options={await formOptions(SETTINGS_SPEC)} action={saveSettingsAction} preview={previewMarkdownAction} t={t} ui={lang} />
    </>
  )
}
