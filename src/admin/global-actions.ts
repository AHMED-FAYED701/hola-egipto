'use server'

import { redirect } from 'next/navigation'

import { requireAdmin, requireUser } from '@/lib/auth'
import { saveNavigation, saveSettingsLocale, saveSettingsShared, type NavTree, type SettingsLocal, type SettingsShared } from '@/lib/content/globals'
import { deleteImage, updateImageAlt, upsertImage, listImages } from '@/lib/content/images'
import { revalidateSite } from '@/lib/revalidate'

import { validateDoc } from './doc'
import type { FormState } from './form/types'
import { DICTS } from './i18n'
import { scanPublicImages } from './scan'
import { adminLang } from './server'
import { NAVIGATION_SPEC, SETTINGS_SPEC } from './spec'

async function parse(data: FormData): Promise<unknown> {
  try {
    return JSON.parse(String(data.get('doc') || '{}'))
  } catch {
    return {}
  }
}

/** site-settings (contracts §4): shared row + one row per language; revalidates the whole site (§16). */
export async function saveSettingsAction(_prev: FormState, data: FormData): Promise<FormState> {
  await requireAdmin('/admin/settings')
  const ui = await adminLang()
  const t = DICTS[ui]
  const { doc, issues } = validateDoc(await parse(data), SETTINGS_SPEC, t)
  if (doc) {
    const wa = String(doc.main.whatsapp_number || '')
    if (wa && !/^\d{8,15}$/.test(wa)) issues['main.whatsapp_number'] = ui === 'es' ? 'Solo dígitos (8–15), con prefijo de país, sin «+».' : 'Digits only (8–15), country code included, no "+".'
    const gtm = String(doc.main.gtm_id || '')
    if (gtm && !/^GTM-[A-Z0-9]{4,12}$/.test(gtm)) issues['main.gtm_id'] = 'GTM-XXXXXXX'
  }
  if (!doc || Object.keys(issues).length) return { message: t.errors, errors: issues }
  const shared = Object.fromEntries(Object.entries(doc.main).map(([k, v]) => [k, v === '' ? null : v])) as Partial<SettingsShared>
  await saveSettingsShared(shared)
  for (const l of ['es', 'en'] as const) await saveSettingsLocale(l, { available: true, ...(doc.i18n[l] as Partial<SettingsLocal>) })
  revalidateSite()
  redirect('/admin/settings?saved=1')
}

/** navigation (contracts §4): one tree per language; revalidates the whole site. */
export async function saveNavigationAction(_prev: FormState, data: FormData): Promise<FormState> {
  await requireAdmin('/admin/navigation')
  const t = DICTS[await adminLang()]
  const { doc, issues } = validateDoc(await parse(data), NAVIGATION_SPEC, t)
  if (!doc || Object.keys(issues).length) return { message: t.errors, errors: issues }
  for (const l of ['es', 'en'] as const) await saveNavigation(l, doc.i18n[l] as unknown as NavTree)
  revalidateSite()
  redirect('/admin/navigation?saved=1')
}

/** Alt texts of one image (both required, contracts §13). */
export async function saveImageAltAction(id: number, _prev: FormState, data: FormData): Promise<FormState> {
  await requireUser('/admin/images')
  const ui = await adminLang()
  const t = DICTS[ui]
  const es = String(data.get('alt_es') || '').trim()
  const en = String(data.get('alt_en') || '').trim()
  const errors: Record<string, string> = {}
  if (!es) errors.alt_es = t.required
  if (!en) errors.alt_en = t.required
  if (es.length > 500) errors.alt_es = '≤ 500'
  if (en.length > 500) errors.alt_en = '≤ 500'
  if (Object.keys(errors).length) return { message: t.errors, errors }
  await updateImageAlt(id, es, en)
  revalidateSite()
  return { ok: true, message: t.saved }
}

/** Register files present in public/images/ that are not in the library yet. */
export async function scanImagesAction(): Promise<void> {
  await requireUser('/admin/images')
  const known = new Set((await listImages()).map((i) => i.path))
  let added = 0
  for (const f of await scanPublicImages()) {
    if (known.has(f.path)) continue
    await upsertImage({ ...f, hola_sample: false })
    added++
  }
  if (added) revalidateSite()
  redirect(`/admin/images?scanned=${added}`)
}

export async function deleteImageAction(id: number): Promise<void> {
  await requireUser('/admin/images')
  await deleteImage(id)
  revalidateSite()
  redirect('/admin/images?deleted=1')
}
