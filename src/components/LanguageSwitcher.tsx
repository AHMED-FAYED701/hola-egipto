import type { Locale } from '@/i18n/routing'

export type Alternates = { es: string | null; en: string | null }

/**
 * ES | EN switcher (contracts §6): links to the same item in the other language; the other
 * language is hidden when the item is not available there. Clicks push language_switch.
 */
export function LanguageSwitcher({
  locale,
  alternates,
  className,
  currentClassName,
  label,
}: {
  locale: Locale
  alternates: Alternates
  className?: string
  currentClassName?: string
  label: string
}) {
  const other: Locale = locale === 'es' ? 'en' : 'es'
  const href = alternates[other]
  return (
    <div className={className} role="group" aria-label={label}>
      <span aria-current="true" className={currentClassName} lang={locale}>
        {locale.toUpperCase()}
      </span>
      {href ? (
        <a href={href} hrefLang={other} lang={other} data-he-event="language_switch" data-he-from={locale} data-he-to={other}>
          {other.toUpperCase()}
        </a>
      ) : null}
    </div>
  )
}
