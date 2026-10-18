/** WhatsApp click-to-chat URLs (contracts §8). */

export type WhatsAppLocation = 'header' | 'sticky' | 'sidebar' | 'page' | 'footer' | 'coming_soon'

export interface WhatsAppContext {
  number: string | null | undefined
  message: string
}

/** Digits only, country code included, no "+". Returns '' when unusable. */
export function normalizeNumber(n: string | null | undefined): string {
  return (n || '').replace(/\D/g, '')
}

/** `https://wa.me/<number>?text=<message>`, or null when no number is configured. */
export function whatsappUrl(ctx: WhatsAppContext): string | null {
  const number = normalizeNumber(ctx.number)
  if (!number) return null
  return `https://wa.me/${number}?text=${encodeURIComponent(ctx.message)}`
}

export function tripMessage(locale: 'es' | 'en', title: string, absoluteUrl: string): string {
  return locale === 'es'
    ? `Hola, me interesa «${title}» — ${absoluteUrl}`
    : `Hi, I'm interested in “${title}” — ${absoluteUrl}`
}

export const defaultMessages = {
  es: 'Hola, quiero planificar un viaje a Egipto',
  en: "Hi, I'd like to plan a trip to Egypt",
} as const
