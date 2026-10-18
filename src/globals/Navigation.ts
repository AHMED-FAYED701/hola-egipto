import type { Field, GlobalConfig } from 'payload'

import { isLoggedIn, publicRead } from '../access'
import { l } from '../fields/common'
import { revalidateGlobal } from '../hooks/revalidate'

const link = (): Field[] => [
  { name: 'label', type: 'text', required: true, label: l('Texto', 'Label') },
  { name: 'href', type: 'text', required: true, label: l('Enlace', 'Link'), admin: { description: l('Ruta con barra final, p. ej. /destinos/luxor/', 'Path with trailing slash, e.g. /en/destinations/luxor/') } },
]

/** Header mega menu and footer columns, one set per language (localized arrays). */
export const Navigation: GlobalConfig = {
  slug: 'navigation',
  label: l('Navegación', 'Navigation'),
  admin: { group: l('Ajustes', 'Settings') },
  access: { read: publicRead, update: isLoggedIn },
  hooks: { afterChange: [revalidateGlobal] },
  fields: [
    {
      name: 'header',
      type: 'array',
      localized: true,
      label: l('Menú principal', 'Header menu'),
      fields: [
        ...link(),
        {
          name: 'columns',
          type: 'array',
          maxRows: 2,
          label: l('Columnas del panel', 'Panel columns'),
          fields: [
            { name: 'heading', type: 'text', label: l('Encabezado', 'Heading') },
            { name: 'links', type: 'array', fields: link() },
          ],
        },
        {
          name: 'panel_extra',
          type: 'select',
          defaultValue: 'featured',
          label: l('Tercera columna', 'Third column'),
          options: [
            { label: l('Viaje destacado', 'Featured trip'), value: 'featured' },
            { label: l('Mapa de regiones', 'Region map'), value: 'map' },
            { label: l('Últimos artículos', 'Latest articles'), value: 'latest_guides' },
            { label: l('Nada', 'None'), value: 'none' },
          ],
        },
        {
          name: 'featured',
          type: 'relationship',
          relationTo: ['tours', 'cruises', 'excursions'],
          label: l('Viaje destacado', 'Featured trip'),
          admin: { condition: (_, sib) => sib?.panel_extra === 'featured' },
        },
      ],
    },
    {
      name: 'footer_columns',
      type: 'array',
      localized: true,
      maxRows: 3,
      label: l('Columnas del pie (2–4)', 'Footer columns (2–4)'),
      fields: [
        { name: 'heading', type: 'text', required: true, label: l('Encabezado', 'Heading') },
        { name: 'links', type: 'array', fields: link() },
      ],
    },
    {
      name: 'footer_description',
      type: 'textarea',
      localized: true,
      label: l('Descripción del pie (columna 1)', 'Footer description (column 1)'),
    },
    {
      name: 'legal_links',
      type: 'array',
      localized: true,
      label: l('Enlaces legales', 'Legal links'),
      fields: link(),
    },
  ],
}
