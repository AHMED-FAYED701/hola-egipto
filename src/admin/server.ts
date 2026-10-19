import 'server-only'

import { cookies } from 'next/headers'

import { ADMIN_LANG_COOKIE, type AdminLang, DICTS, type Dict, isAdminLang } from './i18n'

/** Admin UI language from `hola_admin_lang` (default Spanish). */
export async function adminLang(): Promise<AdminLang> {
  const v = (await cookies()).get(ADMIN_LANG_COOKIE)?.value
  return isAdminLang(v) ? v : 'es'
}

export async function adminDict(): Promise<{ lang: AdminLang; t: Dict }> {
  const lang = await adminLang()
  return { lang, t: DICTS[lang] }
}
