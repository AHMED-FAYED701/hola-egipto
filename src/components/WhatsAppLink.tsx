import type { ReactNode } from 'react'

import { whatsappUrl, type WhatsAppLocation } from '@/lib/whatsapp'

import { WhatsAppGlyph } from './Icon'

/**
 * Every WhatsApp link (contracts §8). Renders nothing when no number is configured.
 * Carries data-he-event/location/trip for the whatsapp_click event.
 */
export function WhatsAppLink({
  number,
  message,
  location,
  tripId,
  className = 'btn btn--whatsapp',
  children,
  label,
  iconOnly = false,
}: {
  number: string | null | undefined
  message: string
  location: WhatsAppLocation
  tripId?: string | number | null
  className?: string
  children?: ReactNode
  label: string
  iconOnly?: boolean
}) {
  const href = whatsappUrl({ number, message })
  if (!href) return null
  return (
    <a
      href={href}
      className={className}
      target="_blank"
      rel="noopener"
      data-he-event="whatsapp_click"
      data-he-location={location}
      {...(tripId ? { 'data-he-trip': String(tripId) } : {})}
      aria-label={iconOnly ? label : undefined}
    >
      <WhatsAppGlyph />
      {iconOnly ? null : (children ?? label)}
    </a>
  )
}
