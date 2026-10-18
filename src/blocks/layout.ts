import type { Block, Field } from 'payload'

import { l } from '../fields/common'

const eyebrow: Field = { name: 'eyebrow', type: 'text', label: l('Antetítulo', 'Eyebrow') }
const title: Field = { name: 'title', type: 'text', label: l('Título', 'Title') }
const intro: Field = { name: 'intro', type: 'textarea', label: l('Introducción', 'Intro') }
const draft: Field = {
  name: 'draft',
  type: 'checkbox',
  defaultValue: false,
  label: l('Texto provisional (revisar)', 'Draft copy (to review)'),
}
const limit = (n: number): Field => ({ name: 'limit', type: 'number', defaultValue: n, min: 1, max: 12, label: l('Número de elementos', 'Number of items') })

/** Home and About sections (pages.layout). Labels are bilingual; content is localized with the page. */
export const HeroBlock: Block = {
  slug: 'hero',
  labels: { singular: l('Portada', 'Hero'), plural: l('Portadas', 'Heroes') },
  fields: [
    { name: 'heading', type: 'text', required: true, label: l('H1', 'H1') },
    { name: 'lead', type: 'textarea', label: l('Entradilla', 'Lead') },
    { name: 'image', type: 'upload', relationTo: 'media', label: l('Imagen', 'Image') },
    { name: 'show_stats', type: 'checkbox', defaultValue: true, label: l('Mostrar cifras de Ajustes', 'Show stats from settings') },
    draft,
  ],
}

export const BookingBandBlock: Block = {
  slug: 'booking-band',
  labels: { singular: l('Banda de reservas', 'Booking band'), plural: l('Bandas de reservas', 'Booking bands') },
  fields: [{ name: 'note', type: 'text', label: l('Nota (el contenido viene de Ajustes)', 'Note (content comes from Settings)'), admin: { readOnly: true } }],
}

export const TrustBarBlock: Block = {
  slug: 'trust-bar',
  labels: { singular: l('Barra de confianza', 'Trust bar'), plural: l('Barras de confianza', 'Trust bars') },
  fields: [{ name: 'note', type: 'text', label: l('Nota (el contenido viene de Ajustes)', 'Note (content comes from Settings)'), admin: { readOnly: true } }],
}

export const DestinationsGridBlock: Block = {
  slug: 'destinations-grid',
  labels: { singular: l('Destinos', 'Destinations'), plural: l('Destinos', 'Destinations') },
  fields: [eyebrow, title, intro, limit(6)],
}

export const TripsGridBlock: Block = {
  slug: 'trips-grid',
  labels: { singular: l('Viajes destacados', 'Featured trips'), plural: l('Viajes destacados', 'Featured trips') },
  fields: [eyebrow, title, intro, limit(6)],
}

export const CruisesSplitBlock: Block = {
  slug: 'cruises-split',
  labels: { singular: l('Cruceros', 'Cruises'), plural: l('Cruceros', 'Cruises') },
  fields: [eyebrow, title, intro, { name: 'image', type: 'upload', relationTo: 'media', label: l('Imagen', 'Image') }],
}

export const ExcursionsByCityBlock: Block = {
  slug: 'excursions-by-city',
  labels: { singular: l('Excursiones por ciudad', 'Excursions by city'), plural: l('Excursiones por ciudad', 'Excursions by city') },
  fields: [
    eyebrow,
    title,
    intro,
    { name: 'cities', type: 'relationship', relationTo: 'departures', hasMany: true, label: l('Ciudades (en orden)', 'Cities (in order)') },
  ],
}

export const WhyBlock: Block = {
  slug: 'why',
  labels: { singular: l('Por qué Hola Egipto', 'Why Hola Egipto'), plural: l('Por qué Hola Egipto', 'Why Hola Egipto') },
  fields: [
    eyebrow,
    title,
    {
      name: 'columns',
      type: 'array',
      maxRows: 3,
      label: l('Columnas', 'Columns'),
      fields: [
        {
          name: 'icon',
          type: 'select',
          defaultValue: 'map-pin',
          options: ['map-pin', 'languages', 'compass', 'message-circle', 'calendar-check', 'sun'].map((v) => ({ label: v, value: v })),
        },
        { name: 'title', type: 'text', required: true },
        { name: 'text', type: 'textarea', required: true },
      ],
    },
    draft,
  ],
}

export const GuidesGridBlock: Block = {
  slug: 'guides-grid',
  labels: { singular: l('Guía de viaje', 'Travel guide'), plural: l('Guía de viaje', 'Travel guide') },
  fields: [eyebrow, title, intro, limit(3)],
}

export const CtaBandBlock: Block = {
  slug: 'cta-band',
  labels: { singular: l('Banda de llamada', 'CTA band'), plural: l('Bandas de llamada', 'CTA bands') },
  fields: [title, { name: 'text', type: 'textarea' }],
}

export const TextBlock: Block = {
  slug: 'text',
  labels: { singular: l('Texto', 'Text'), plural: l('Textos', 'Texts') },
  fields: [eyebrow, title, { name: 'body', type: 'richText' }, draft],
}

export const TeamBlock: Block = {
  slug: 'team',
  labels: { singular: l('Equipo', 'Team'), plural: l('Equipos', 'Teams') },
  fields: [
    eyebrow,
    title,
    {
      name: 'members',
      type: 'array',
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'role', type: 'text' },
        { name: 'languages', type: 'text' },
        { name: 'photo', type: 'upload', relationTo: 'media' },
      ],
    },
  ],
}

export const StepsBlock: Block = {
  slug: 'steps',
  labels: { singular: l('Pasos', 'Steps'), plural: l('Pasos', 'Steps') },
  fields: [
    eyebrow,
    title,
    { name: 'items', type: 'array', fields: [{ name: 'title', type: 'text', required: true }, { name: 'text', type: 'textarea' }] },
    draft,
  ],
}

export const LicenceBlock: Block = {
  slug: 'licence',
  labels: { singular: l('Licencia', 'Licence'), plural: l('Licencias', 'Licences') },
  fields: [title, { name: 'text', type: 'textarea' }],
}

export const layoutBlocks: Block[] = [
  HeroBlock,
  BookingBandBlock,
  TrustBarBlock,
  DestinationsGridBlock,
  TripsGridBlock,
  CruisesSplitBlock,
  ExcursionsByCityBlock,
  WhyBlock,
  GuidesGridBlock,
  CtaBandBlock,
  TextBlock,
  TeamBlock,
  StepsBlock,
  LicenceBlock,
]
