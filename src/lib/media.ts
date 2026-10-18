import type { Media } from '@/payload-types'

export type SizeName = 'card' | 'tile' | 'hero' | 'hero-mobile' | 'gallery'

export interface Img {
  src: string
  width: number
  height: number
  alt: string
}

/** A populated upload, or null when the relation is only an id / empty. */
export function asMedia(v: unknown): Media | null {
  return v && typeof v === 'object' && 'url' in (v as object) ? (v as Media) : null
}

/** Pick an image size (falls back to the original). */
/** Payload builds absolute URLs (serverURL) with a trailing slash; next/image needs a local path. */
export function localUrl(url: string): string {
  return url.replace(/^https?:\/\/[^/]+/, '').replace(/\/$/, '')
}

export function img(v: unknown, size: SizeName = 'card'): Img | null {
  const m = asMedia(v)
  if (!m) return null
  const s = m.sizes?.[size as keyof NonNullable<Media['sizes']>] as { url?: string | null; width?: number | null; height?: number | null } | undefined
  if (s?.url && s.width && s.height) return { src: localUrl(s.url), width: s.width, height: s.height, alt: m.alt || '' }
  if (!m.url || !m.width || !m.height) return null
  return { src: localUrl(m.url), width: m.width, height: m.height, alt: m.alt || '' }
}
