import type { Field, Validate } from 'payload'

import { faqField, l, textList } from './common'

/** Prices are required while the trip is available (validated on the locale being saved). */
const requiredWhenAvailable: Validate = (value, { siblingData }) => {
  const sib = siblingData as { available?: boolean }
  if (sib?.available && (value === null || value === undefined || value === '')) {
    return 'Required while the trip is published'
  }
  return true
}

const highlightsCount: Validate = (value, { siblingData }) => {
  const rows = Array.isArray(value) ? value.length : 0
  const sib = siblingData as { available?: boolean }
  if (!sib?.available && rows === 0) return true
  if (rows < 3 || rows > 8) return 'Between 3 and 8 highlights'
  return true
}

export const TRIP_COLLECTIONS = ['tours', 'cruises', 'excursions'] as const

export const tripFieldsTop = (): Field[] => [
  {
    name: 'subtitle',
    type: 'text',
    localized: true,
    maxLength: 90,
    label: l('Subtítulo', 'Subtitle'),
  },
  {
    name: 'overview',
    type: 'richText',
    localized: true,
    label: l('Resumen', 'Overview'),
  },
  {
    name: 'gallery',
    type: 'upload',
    relationTo: 'media',
    hasMany: true,
    maxRows: 15,
    label: l('Galería (5–15 imágenes)', 'Gallery (5–15 images)'),
  },
]

export const tripPriceFields = (): Field[] => [
  {
    type: 'row',
    fields: [
      { name: 'price_from_eur', type: 'number', min: 0, validate: requiredWhenAvailable, label: l('Precio desde (EUR)', 'Price from (EUR)') },
      { name: 'price_from_usd', type: 'number', min: 0, validate: requiredWhenAvailable, label: l('Precio desde (USD)', 'Price from (USD)') },
    ],
  },
  {
    name: 'price_basis',
    type: 'select',
    defaultValue: 'per_person_double',
    label: l('Base del precio', 'Price basis'),
    options: [
      { label: l('Por persona en habitación doble', 'Per person in a double room'), value: 'per_person_double' },
      { label: l('Por persona', 'Per person'), value: 'per_person' },
      { label: l('Por grupo', 'Per group'), value: 'per_group' },
    ],
  },
  { name: 'price_note', type: 'text', localized: true, label: l('Nota de precio', 'Price note') },
]

export const tripGroupFields = (): Field[] => [
  {
    name: 'group_type',
    type: 'select',
    defaultValue: 'small',
    label: l('Tipo de grupo', 'Group type'),
    options: [
      { label: l('Privado', 'Private'), value: 'private' },
      { label: l('Grupo reducido', 'Small group'), value: 'small' },
      { label: l('Compartido', 'Shared'), value: 'shared' },
    ],
  },
  {
    type: 'row',
    fields: [
      { name: 'group_min', type: 'number', min: 1, label: l('Mínimo de personas', 'Group min') },
      { name: 'group_max', type: 'number', min: 1, label: l('Máximo de personas', 'Group max') },
    ],
  },
  {
    name: 'guide_languages',
    type: 'select',
    hasMany: true,
    defaultValue: ['es', 'en'],
    label: l('Idiomas del guía', 'Guide languages'),
    options: [
      { label: l('Español', 'Spanish'), value: 'es' },
      { label: l('Inglés', 'English'), value: 'en' },
    ],
  },
]

export const tripContentFields = (): Field[] => [
  textList('highlights', l('Lo más destacado (3–8)', 'Highlights (3–8)'), { validate: highlightsCount } as Partial<Field>),
  {
    name: 'itinerary',
    type: 'array',
    localized: true,
    label: l('Itinerario', 'Itinerary'),
    fields: [
      {
        type: 'row',
        fields: [
          { name: 'label', type: 'text', required: true, label: l('Etiqueta (Día 1 / 08:00)', 'Label (Day 1 / 08:00)') },
          { name: 'title', type: 'text', required: true, label: l('Título', 'Title') },
        ],
      },
      { name: 'description', type: 'textarea', label: l('Descripción', 'Description') },
      { name: 'places', type: 'relationship', relationTo: 'destinations', hasMany: true, label: l('Lugares', 'Places') },
      {
        name: 'meals',
        type: 'select',
        hasMany: true,
        label: l('Comidas', 'Meals'),
        options: [
          { label: l('Desayuno', 'Breakfast'), value: 'B' },
          { label: l('Almuerzo', 'Lunch'), value: 'L' },
          { label: l('Cena', 'Dinner'), value: 'D' },
        ],
      },
      { name: 'overnight', type: 'text', label: l('Noche en', 'Overnight') },
    ],
  },
  textList('includes', l('Incluye', 'Includes')),
  textList('excludes', l('No incluye', 'Excludes')),
  textList('what_to_bring', l('Qué llevar', 'What to bring')),
  {
    name: 'availability_days',
    type: 'select',
    hasMany: true,
    label: l('Días disponibles', 'Availability days'),
    options: [
      { label: l('Lunes', 'Monday'), value: 'mon' },
      { label: l('Martes', 'Tuesday'), value: 'tue' },
      { label: l('Miércoles', 'Wednesday'), value: 'wed' },
      { label: l('Jueves', 'Thursday'), value: 'thu' },
      { label: l('Viernes', 'Friday'), value: 'fri' },
      { label: l('Sábado', 'Saturday'), value: 'sat' },
      { label: l('Domingo', 'Sunday'), value: 'sun' },
    ],
  },
  { name: 'season_note', type: 'text', localized: true, label: l('Nota de temporada', 'Season note') },
  {
    name: 'cancellation_policy',
    type: 'text',
    label: l('Política de cancelación (clave)', 'Cancellation policy (key)'),
    admin: { description: l('Clave de una política de Ajustes › Políticas de cancelación', 'Key of a policy in Settings › Cancellation policies') },
  },
  {
    name: 'cancellation_override',
    type: 'textarea',
    localized: true,
    label: l('Texto de cancelación propio (opcional)', 'Cancellation text override (optional)'),
  },
  faqField(),
]

export const tripRelationFields = (opts: { destinationsLabel?: ReturnType<typeof l> } = {}): Field[] => [
  {
    name: 'destinations',
    type: 'relationship',
    relationTo: 'destinations',
    hasMany: true,
    label: opts.destinationsLabel || l('Destinos (en orden de ruta)', 'Destinations (route order)'),
  },
  {
    name: 'related_trips',
    type: 'relationship',
    relationTo: ['tours', 'cruises', 'excursions'],
    hasMany: true,
    maxRows: 3,
    label: l('Viajes relacionados (máx. 3)', 'Related trips (max 3)'),
  },
]

export const tripSidebarFields = (): Field[] => [
  {
    name: 'booking_mode',
    type: 'select',
    defaultValue: 'inquiry',
    label: l('Modo de reserva', 'Booking mode'),
    admin: { position: 'sidebar' },
    options: [
      { label: l('Solicitud', 'Inquiry'), value: 'inquiry' },
      { label: l('Enlace externo', 'External link'), value: 'external' },
      { label: l('Reservable (fase 2)', 'Bookable (phase 2)'), value: 'bookable' },
    ],
  },
  {
    name: 'booking_url',
    type: 'text',
    label: l('URL de reserva', 'Booking URL'),
    admin: { position: 'sidebar', condition: (_, sib) => sib?.booking_mode === 'external' },
    validate: (v: unknown) => !v || /^https?:\/\//.test(String(v)) || 'Must be an http(s) URL',
  },
  {
    name: 'last_reviewed',
    type: 'date',
    localized: true,
    label: l('Última revisión', 'Last reviewed'),
    admin: { position: 'sidebar', date: { pickerAppearance: 'dayOnly' } },
  },
  {
    name: 'featured',
    type: 'checkbox',
    defaultValue: false,
    label: l('Destacado', 'Featured'),
    admin: { position: 'sidebar' },
  },
]
