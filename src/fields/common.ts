import type { Field, Validate } from 'payload'

type L = { es: string; en: string }
export const l = (es: string, en: string): L => ({ es, en })

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

/** Lowercase, hyphens, no accents ("ñ" → "n"). */
export function slugify(input: string): string {
  return input
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

const validateSlug: Validate = (value, { siblingData }) => {
  const sib = siblingData as { available?: boolean }
  if (!value) return sib?.available ? 'Slug required when the item is available in this language' : true
  return SLUG_RE.test(String(value)) || 'Lowercase letters, digits and hyphens only (no accents)'
}

/** Localized slug, unique per collection and locale. Filled from title/name when empty. */
export const slugField = (from = 'title'): Field => ({
  name: 'slug',
  type: 'text',
  localized: true,
  index: true,
  unique: true,
  label: l('Slug', 'Slug'),
  validate: validateSlug,
  admin: { position: 'sidebar', description: l('minúsculas-con-guiones, sin acentos', 'lowercase-with-hyphens, no accents') },
  hooks: {
    beforeValidate: [
      ({ value, siblingData }) => {
        if (value) return slugify(String(value))
        const src = (siblingData as Record<string, unknown>)?.[from]
        return typeof src === 'string' && src ? slugify(src) : value
      },
    ],
  },
})

export const availableField: Field = {
  name: 'available',
  type: 'checkbox',
  localized: true,
  defaultValue: false,
  label: l('Publicado en este idioma', 'Published in this language'),
  admin: { position: 'sidebar' },
}

export const holaSampleField: Field = {
  name: 'holaSample',
  type: 'checkbox',
  defaultValue: false,
  label: l('Contenido de muestra', 'Sample content'),
  admin: { position: 'sidebar', description: l('Lo borra `pnpm hola:samples delete`', 'Removed by `pnpm hola:samples delete`') },
}

export const excerptField: Field = {
  name: 'excerpt',
  type: 'textarea',
  localized: true,
  maxLength: 155,
  label: l('Extracto', 'Excerpt'),
}

export const featuredImageField: Field = {
  name: 'featured_image',
  type: 'upload',
  relationTo: 'media',
  label: l('Imagen destacada', 'Featured image'),
}

export const seoField: Field = {
  name: 'seo',
  type: 'group',
  label: l('SEO', 'SEO'),
  localized: true,
  fields: [
    { name: 'meta_title', type: 'text', label: l('Meta título', 'Meta title') },
    { name: 'meta_description', type: 'textarea', maxLength: 160, label: l('Meta descripción', 'Meta description') },
    { name: 'og_image', type: 'upload', relationTo: 'media', label: l('Imagen OG', 'OG image') },
  ],
}

export const faqField = (name = 'faq', label = l('Preguntas frecuentes', 'FAQ')): Field => ({
  name,
  type: 'array',
  localized: true,
  label,
  fields: [
    { name: 'q', type: 'text', required: true, label: l('Pregunta', 'Question') },
    { name: 'a', type: 'textarea', required: true, label: l('Respuesta', 'Answer') },
  ],
})

export const textList = (name: string, label: L, extra: Partial<Field> = {}): Field =>
  ({
    name,
    type: 'array',
    localized: true,
    label,
    fields: [{ name: 'text', type: 'text', required: true, label: l('Texto', 'Text') }],
    ...extra,
  }) as Field

/** title, slug, available, excerpt, featured_image, seo, holaSample (+ content unless trips). */
export const commonFields = (opts: { content?: Field | null } = {}): Field[] => {
  const fields: Field[] = [
    { name: 'title', type: 'text', required: true, localized: true, label: l('Título', 'Title') },
    slugField(),
    availableField,
    excerptField,
  ]
  if (opts.content) fields.push(opts.content)
  fields.push(featuredImageField, seoField, holaSampleField)
  return fields
}
