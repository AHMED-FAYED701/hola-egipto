import type { Media } from '@/lib/content/types'

/** Kept for call-site compatibility: images are single static files now (contracts §13); next/image resizes. */
export type SizeName = 'card' | 'tile' | 'hero' | 'hero-mobile' | 'gallery'

export interface Img {
  src: string
  width: number
  height: number
  alt: string
}

/** A populated image-library row, or null when the relation is only an id / empty. */
export function asMedia(v: unknown): Media | null {
  return v && typeof v === 'object' && 'path' in (v as object) ? (v as Media) : null
}

export function img(v: unknown, _size: SizeName = 'card'): Img | null {
  const m = asMedia(v)
  if (!m || !m.path || !m.width || !m.height) return null
  return { src: m.path, width: m.width, height: m.height, alt: m.alt || '' }
}
