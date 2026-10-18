import type { CollectionConfig } from 'payload'

import { isLoggedIn, publicRead } from '../access'
import { commonFields, l } from '../fields/common'
import { revalidateHooks } from '../hooks/revalidate'

export const MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'] as const

export const Destinations: CollectionConfig = {
  slug: 'destinations',
  labels: { singular: l('Destino', 'Destination'), plural: l('Destinos', 'Destinations') },
  admin: { group: l('Contenido', 'Content'), useAsTitle: 'title', defaultColumns: ['title', 'region', 'available', 'holaSample'] },
  access: { read: publicRead, create: isLoggedIn, update: isLoggedIn, delete: isLoggedIn },
  hooks: revalidateHooks,
  fields: [
    ...commonFields({ content: { name: 'content', type: 'richText', localized: true, label: l('Contenido', 'Content') } }),
    { name: 'region', type: 'relationship', relationTo: 'regions', label: l('Región', 'Region') },
    { name: 'tagline', type: 'text', localized: true, label: l('Lema', 'Tagline') },
    {
      name: 'best_months',
      type: 'select',
      hasMany: true,
      label: l('Mejores meses', 'Best months'),
      options: MONTHS.map((m, i) => ({
        value: m,
        label: l(
          ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'][i],
          ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][i],
        ),
      })),
    },
    { name: 'days_recommended', type: 'number', min: 1, label: l('Días recomendados', 'Days recommended') },
    { name: 'how_to_get_there', type: 'textarea', localized: true, label: l('Cómo llegar', 'How to get there') },
    { name: 'nearest_airport', type: 'text', localized: true, label: l('Aeropuerto más cercano', 'Nearest airport') },
    {
      name: 'top_sights',
      type: 'array',
      localized: true,
      label: l('Imprescindibles', 'Top sights'),
      fields: [
        { name: 'name', type: 'text', required: true, label: l('Nombre', 'Name') },
        { name: 'image', type: 'upload', relationTo: 'media', label: l('Imagen', 'Image') },
        { name: 'text', type: 'textarea', label: l('Texto', 'Text') },
        { name: 'map_link', type: 'text', label: l('Enlace al mapa', 'Map link') },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'lat', type: 'number', min: -90, max: 90, label: 'Lat' },
        { name: 'lng', type: 'number', min: -180, max: 180, label: 'Lng' },
      ],
    },
    { name: 'nearby', type: 'relationship', relationTo: 'destinations', hasMany: true, label: l('Destinos cercanos', 'Nearby destinations') },
  ],
}
