import { getTranslations } from 'next-intl/server'

import type { Locale } from '@/i18n/routing'

export async function NotFoundView({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: 'notFound' })
  return (
    <section>
      <h1>{t('title')}</h1>
      <p>{t('text')}</p>
    </section>
  )
}
