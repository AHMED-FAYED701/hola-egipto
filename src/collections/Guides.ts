import type { CollectionConfig } from 'payload'

import { isLoggedIn, publicRead } from '../access'
import { guideEditor } from '../blocks/lexical'
import { commonFields, l } from '../fields/common'
import { revalidateHooks } from '../hooks/revalidate'

export const Guides: CollectionConfig = {
  slug: 'guides',
  labels: { singular: l('Guía', 'Guide'), plural: l('Guía de viaje', 'Travel Guide') },
  admin: { group: l('Contenido', 'Content'), useAsTitle: 'title', defaultColumns: ['title', 'guide_topic', 'available', 'holaSample'] },
  access: { read: publicRead, create: isLoggedIn, update: isLoggedIn, delete: isLoggedIn },
  hooks: revalidateHooks,
  fields: [
    ...commonFields({
      content: { name: 'content', type: 'richText', localized: true, editor: guideEditor, label: l('Artículo', 'Article') },
    }),
    {
      name: 'guide_topic',
      type: 'relationship',
      relationTo: 'guide-topics',
      hasMany: true,
      maxRows: 2,
      label: l('Tema (máx. 2)', 'Topic (max 2)'),
    },
    {
      name: 'last_updated',
      type: 'date',
      localized: true,
      label: l('Actualizado', 'Last updated'),
      admin: { position: 'sidebar', date: { pickerAppearance: 'dayOnly' } },
    },
    { name: 'toc', type: 'checkbox', defaultValue: true, label: l('Índice de contenidos', 'Table of contents'), admin: { position: 'sidebar' } },
    { name: 'related_destinations', type: 'relationship', relationTo: 'destinations', hasMany: true, label: l('Destinos relacionados', 'Related destinations') },
    {
      name: 'related_trips',
      type: 'relationship',
      relationTo: ['tours', 'cruises', 'excursions'],
      hasMany: true,
      maxRows: 3,
      label: l('Viajes relacionados (máx. 3)', 'Related trips (max 3)'),
    },
    {
      name: 'author_name',
      type: 'text',
      localized: true,
      label: l('Autor', 'Author'),
      defaultValue: ({ locale }: { locale?: string }) => (locale === 'en' ? '[pending]' : '[pendiente]'),
    },
  ],
}
