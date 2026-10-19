import type { Ent } from '@/lib/content/tables'

export type Rec = Record<string, unknown>

/** The document a form edits: shared row, one row per language, join lists (src/lib/content/write.ts). */
export interface FormDoc {
  main: Rec
  i18n: { es: Rec; en: Rec }
  joins: Rec
}

export interface ImageOpt {
  id: number
  path: string
  alt: string
  width: number
  height: number
}
export interface RefOpt {
  id: number
  label: string
}
export interface TripOpt {
  type: 'tour' | 'cruise' | 'excursion'
  id: number
  label: string
}

export interface FormOptions {
  images: ImageOpt[]
  refs: Partial<Record<Ent, RefOpt[]>>
  trips: TripOpt[]
  readonly?: Record<string, string>
}

export interface FormState {
  ok?: boolean
  message?: string
  errors?: Record<string, string>
}
