import type { CollectionConfig } from 'payload'

import { isLoggedIn, publicRead } from '../access'
import { layoutBlocks } from '../blocks/layout'
import { commonFields, l } from '../fields/common'
import { revalidateHooks } from '../hooks/revalidate'

export const PAGE_TEMPLATES = ['home', 'default', 'about', 'contact', 'faq', 'plan-my-trip', 'thank-you', 'legal'] as const
export type PageTemplate = (typeof PAGE_TEMPLATES)[number]

export const Pages: CollectionConfig = {
  slug: 'pages',
  labels: { singular: l('Página', 'Page'), plural: l('Páginas', 'Pages') },
  admin: { group: l('Contenido', 'Content'), useAsTitle: 'title', defaultColumns: ['title', 'template', 'slug', 'available'] },
  access: { read: publicRead, create: isLoggedIn, update: isLoggedIn, delete: isLoggedIn },
  hooks: revalidateHooks,
  fields: [
    ...commonFields({ content: { name: 'content', type: 'richText', localized: true, label: l('Contenido', 'Content') } }),
    {
      name: 'template',
      type: 'select',
      required: true,
      defaultValue: 'default',
      label: l('Plantilla', 'Template'),
      admin: { position: 'sidebar' },
      options: PAGE_TEMPLATES.map((t) => ({ label: t, value: t })),
    },
    {
      name: 'layout',
      type: 'blocks',
      localized: true,
      label: l('Secciones (Inicio y Sobre nosotros)', 'Sections (Home and About)'),
      blocks: layoutBlocks,
      admin: { condition: (data) => data?.template === 'home' || data?.template === 'about' },
    },
    {
      name: 'faq_groups',
      type: 'array',
      localized: true,
      label: l('Grupos de preguntas', 'FAQ groups'),
      admin: { condition: (data) => data?.template === 'faq' },
      fields: [
        { name: 'title', type: 'text', required: true, label: l('Título', 'Title') },
        {
          name: 'items',
          type: 'array',
          fields: [
            { name: 'q', type: 'text', required: true, label: l('Pregunta', 'Question') },
            { name: 'a', type: 'textarea', required: true, label: l('Respuesta', 'Answer') },
          ],
        },
      ],
    },
    {
      name: 'last_updated',
      type: 'date',
      localized: true,
      label: l('Actualizado', 'Last updated'),
      admin: { position: 'sidebar', date: { pickerAppearance: 'dayOnly' } },
    },
  ],
}
