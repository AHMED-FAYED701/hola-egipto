import { getLocale } from 'next-intl/server'

import { NotFoundView } from '@/components/NotFoundView'
import { isLocale } from '@/i18n/routing'

/** Backstop only: unknown URLs are answered by the proxy with the hola-404 page (see src/proxy.ts). */
export default async function NotFound() {
  const locale = await getLocale()
  return <NotFoundView locale={isLocale(locale) ? locale : 'es'} />
}
