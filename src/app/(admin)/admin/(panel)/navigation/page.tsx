import { previewMarkdownAction } from '@/admin/actions'
import { formOptions, toFormDoc } from '@/admin/doc'
import { DocForm } from '@/admin/form/DocForm'
import { saveNavigationAction } from '@/admin/global-actions'
import { adminDict } from '@/admin/server'
import { NAVIGATION_SPEC } from '@/admin/spec'
import { requireAdmin } from '@/lib/auth'
import { getNavigationRaw } from '@/lib/content/globals'

export const metadata = { title: 'Navigation' }

/** Header items and footer columns per language: add/remove/reorder (contracts §18). */
export default async function NavigationPage({ searchParams }: { searchParams: Promise<{ saved?: string }> }) {
  await requireAdmin('/admin/navigation')
  const { lang, t } = await adminDict()
  const [es, en] = await Promise.all([getNavigationRaw('es'), getNavigationRaw('en')])
  const initial = toFormDoc({ main: {}, i18n: { es: (es || {}) as never, en: (en || {}) as never }, joins: {} }, NAVIGATION_SPEC)
  const saved = (await searchParams).saved === '1'
  return (
    <>
      <h1>{t.navigation}</h1>
      {saved ? (
        <p className="adm-flash" role="status">
          {t.saved}
        </p>
      ) : null}
      <DocForm spec={NAVIGATION_SPEC} initial={initial} options={await formOptions(NAVIGATION_SPEC)} action={saveNavigationAction} preview={previewMarkdownAction} t={t} ui={lang} />
    </>
  )
}
