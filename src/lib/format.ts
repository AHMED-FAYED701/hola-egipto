import type { Locale } from '@/i18n/routing'

/** Prices: EUR on Spanish pages ("1.290 €"), USD on English pages ("$1,390") — contracts §6. */
export function formatPrice(locale: Locale, eur?: number | null, usd?: number | null): string | null {
  const amount = locale === 'es' ? eur : usd
  if (amount === null || amount === undefined) return null
  return new Intl.NumberFormat(locale === 'es' ? 'es-ES' : 'en-US', {
    style: 'currency',
    currency: locale === 'es' ? 'EUR' : 'USD',
    maximumFractionDigits: 0,
    useGrouping: 'always',
  } as unknown as Intl.NumberFormatOptions).format(amount)
}

export const currencyFor = (locale: Locale) => (locale === 'es' ? 'EUR' : 'USD')

export function formatDate(locale: Locale, iso?: string | null, opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' }) {
  if (!iso) return null
  return new Intl.DateTimeFormat(locale === 'es' ? 'es-ES' : 'en-GB', { timeZone: 'Africa/Cairo', ...opts }).format(new Date(iso))
}

/** "oct 2026" / "Oct 2026" for the "Actualizado" chip. */
export const formatMonthYear = (locale: Locale, iso?: string | null) => formatDate(locale, iso, { month: 'short', year: 'numeric' })

export function readingMinutes(text: string): number {
  const words = text.trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / 220))
}

export const MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'] as const
