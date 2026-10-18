import {
  ArrowRight,
  Bed,
  Calendar,
  CalendarCheck,
  Check,
  Clock,
  Compass,
  Globe,
  Languages,
  Lightbulb,
  type LucideIcon,
  Mail,
  MapPin,
  MessageCircle,
  Minus,
  Phone,
  ShieldCheck,
  Ship,
  Sun,
  Users,
  Utensils,
} from 'lucide-react'

const ICONS: Record<string, LucideIcon> = {
  'arrow-right': ArrowRight,
  bed: Bed,
  calendar: Calendar,
  'calendar-check': CalendarCheck,
  check: Check,
  clock: Clock,
  compass: Compass,
  globe: Globe,
  languages: Languages,
  lightbulb: Lightbulb,
  mail: Mail,
  'map-pin': MapPin,
  'message-circle': MessageCircle,
  minus: Minus,
  phone: Phone,
  'shield-check': ShieldCheck,
  ship: Ship,
  sun: Sun,
  users: Users,
  utensils: Utensils,
}

/** Lucide line icon at 24px / 1.75 stroke (brand guide "Iconography"). Decorative by default. */
export function Icon({ name, size = 24, className }: { name: string; size?: number; className?: string }) {
  const C = ICONS[name] ?? Compass
  return <C size={size} strokeWidth={1.75} aria-hidden="true" focusable="false" className={className} />
}

/** WhatsApp action glyph: speech bubble with handset, drawn inline (no brand icon set is used). */
export function WhatsAppGlyph({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3.5 20.5l1.3-4.1A8.5 8.5 0 1 1 8 19.6z" />
      <path d="M9 8.6c.2-.5.6-.6 1-.6l.6 1.4c.1.3 0 .6-.2.8l-.5.5c.6 1.2 1.6 2.2 2.8 2.8l.5-.5c.2-.2.5-.3.8-.2l1.4.6c0 .4-.1.8-.6 1-.8.4-1.8.3-2.9-.3a8.4 8.4 0 0 1-3.3-3.3c-.5-1-.6-2-.2-2.8z" fill="currentColor" stroke="none" />
    </svg>
  )
}
