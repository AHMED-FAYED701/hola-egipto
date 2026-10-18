import { notFound } from 'next/navigation'
import { setRequestLocale } from 'next-intl/server'

import { isLocale, type Locale } from '@/i18n/routing'

/** Validate the [locale] param (a junk first segment must never reach the database) and enable static rendering. */
export async function resolveLocale(params: Promise<{ locale: string }>): Promise<Locale> {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  setRequestLocale(locale)
  return locale
}
