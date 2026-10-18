import type { CollectionBeforeChangeHook, CollectionConfig, Field } from 'payload'

import { isLoggedIn, publicRead } from '../access'
import { commonFields, l, textList } from '../fields/common'
import {
  tripContentFields,
  tripFieldsTop,
  tripGroupFields,
  tripPriceFields,
  tripRelationFields,
  tripSidebarFields,
} from '../fields/trip'
import { revalidateHooks } from '../hooks/revalidate'

const viajes = l('Viajes', 'Trips')

const tripCollection = (
  slug: string,
  labels: CollectionConfig['labels'],
  typeFields: Field[],
  hooks: CollectionConfig['hooks'] = {},
): CollectionConfig => ({
  slug,
  labels,
  admin: {
    group: viajes,
    useAsTitle: 'title',
    defaultColumns: ['title', 'available', 'price_from_eur', 'featured', 'holaSample'],
  },
  access: { read: publicRead, create: isLoggedIn, update: isLoggedIn, delete: isLoggedIn },
  hooks: {
    ...hooks,
    afterChange: [...(hooks.afterChange || []), ...revalidateHooks.afterChange],
    afterDelete: [...(hooks.afterDelete || []), ...revalidateHooks.afterDelete],
  },
  fields: [
    ...commonFields(),
    {
      type: 'tabs',
      tabs: [
        { label: l('Viaje', 'Trip'), fields: [...tripFieldsTop(), ...typeFields] },
        { label: l('Precio y grupo', 'Price and group'), fields: [...tripPriceFields(), ...tripGroupFields()] },
        { label: l('Contenido', 'Content'), fields: tripContentFields() },
        { label: l('Relaciones', 'Relations'), fields: tripRelationFields() },
      ],
    },
    ...tripSidebarFields(),
  ],
})

/** Duration term slugs (contracts §4); the hook picks the term by days. */
export function durationSlugForDays(days: number): string {
  if (days <= 6) return 'hasta-6-dias'
  if (days <= 9) return '7-9-dias'
  if (days <= 12) return '10-12-dias'
  return '13-dias-o-mas'
}

const setDuration: CollectionBeforeChangeHook = async ({ data, req }) => {
  const days = Number(data?.duration_days)
  if (!days) return { ...data, duration: null }
  // Passing `locale` with the shared `req` would switch req.locale for the rest of this save.
  const locale = req.locale
  const fallbackLocale = req.fallbackLocale
  try {
    const res = await req.payload.find({
      collection: 'durations',
      where: { slug: { equals: durationSlugForDays(days) } },
      locale: 'es',
      limit: 1,
      depth: 0,
      req,
      overrideAccess: true,
    })
    return { ...data, duration: res.docs[0]?.id ?? null }
  } finally {
    req.locale = locale
    req.fallbackLocale = fallbackLocale
  }
}

export const Tours = tripCollection(
  'tours',
  { singular: l('Viaje', 'Egypt tour'), plural: l('Viajes', 'Egypt Tours') },
  [
    { name: 'duration_days', type: 'number', min: 1, required: true, label: l('Duración (días)', 'Duration (days)') },
    {
      name: 'duration',
      type: 'relationship',
      relationTo: 'durations',
      label: l('Duración (automática)', 'Duration (automatic)'),
      admin: { readOnly: true, description: l('Se asigna al guardar según los días', 'Set on save from the days') },
    },
    { name: 'trip_style', type: 'relationship', relationTo: 'trip-styles', hasMany: true, label: l('Estilo', 'Style') },
    { name: 'guides', type: 'relationship', relationTo: 'guides', hasMany: true, label: l('Guías relacionadas', 'Related guides') },
  ],
  { beforeChange: [setDuration] },
)

export const Cruises = tripCollection(
  'cruises',
  { singular: l('Crucero', 'Nile cruise'), plural: l('Cruceros', 'Nile Cruises') },
  [
    { name: 'nights', type: 'number', min: 1, required: true, label: l('Noches', 'Nights') },
    { name: 'cruise_type', type: 'relationship', relationTo: 'cruise-types', label: l('Tipo de crucero', 'Cruise type') },
    { name: 'trip_style', type: 'relationship', relationTo: 'trip-styles', hasMany: true, label: l('Estilo', 'Style') },
    { name: 'ship_name', type: 'text', localized: true, label: l('Barco', 'Ship name') },
    {
      name: 'ship_category',
      type: 'select',
      label: l('Categoría del barco', 'Ship category'),
      options: [
        { label: '4★', value: '4star' },
        { label: '5★', value: '5star' },
        { label: 'Deluxe', value: 'deluxe' },
        { label: l('Dahabiya', 'Dahabiya'), value: 'dahabiya' },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'embark', type: 'relationship', relationTo: 'destinations', label: l('Embarque', 'Embark') },
        { name: 'disembark', type: 'relationship', relationTo: 'destinations', label: l('Desembarque', 'Disembark') },
      ],
    },
    {
      name: 'start_dates',
      type: 'array',
      label: l('Fechas de salida', 'Start dates'),
      fields: [
        { name: 'date', type: 'date', required: true, label: l('Fecha', 'Date'), admin: { date: { pickerAppearance: 'dayOnly' } } },
        { name: 'note', type: 'text', localized: true, label: l('Nota', 'Note') },
      ],
    },
    {
      name: 'cabins',
      type: 'array',
      label: l('Camarotes', 'Cabins'),
      fields: [
        { name: 'type', type: 'text', localized: true, label: l('Tipo', 'Type') },
        { name: 'size_m2', type: 'number', label: 'm²' },
        { name: 'beds', type: 'text', localized: true, label: l('Camas', 'Beds') },
        { name: 'price_from_eur', type: 'number', label: l('Desde (EUR)', 'From (EUR)') },
        { name: 'price_from_usd', type: 'number', label: l('Desde (USD)', 'From (USD)') },
      ],
    },
    {
      name: 'ship_facilities',
      type: 'select',
      hasMany: true,
      label: l('Instalaciones', 'Ship facilities'),
      options: [
        { label: l('Piscina', 'Pool'), value: 'pool' },
        { label: l('Cubierta solárium', 'Sun deck'), value: 'sun_deck' },
        { label: l('Restaurante', 'Restaurant'), value: 'restaurant' },
        { label: l('Bar', 'Bar'), value: 'bar' },
        { label: l('Aire acondicionado', 'Air conditioning'), value: 'air_conditioning' },
        { label: l('Wifi', 'Wi-Fi'), value: 'wifi' },
        { label: l('Spa', 'Spa'), value: 'spa' },
        { label: l('Gimnasio', 'Gym'), value: 'gym' },
      ],
    },
    { name: 'deck_plan', type: 'upload', relationTo: 'media', label: l('Plano de cubiertas', 'Deck plan') },
  ],
)

export const Excursions = tripCollection(
  'excursions',
  { singular: l('Excursión', 'Excursion'), plural: l('Excursiones', 'Excursions') },
  [
    { name: 'duration_hours', type: 'number', min: 1, required: true, label: l('Duración (horas)', 'Duration (hours)') },
    { name: 'departure', type: 'relationship', relationTo: 'departures', hasMany: true, label: l('Salida desde', 'Departs from') },
    {
      name: 'start_times',
      type: 'array',
      label: l('Horarios de salida', 'Start times'),
      fields: [
        { name: 'time', type: 'text', required: true, label: l('Hora (HH:MM)', 'Time (HH:MM)') },
        { name: 'label', type: 'text', localized: true, label: l('Nota', 'Note') },
      ],
    },
    textList('pickup_areas', l('Zonas de recogida', 'Pickup areas')),
    {
      type: 'row',
      fields: [
        { name: 'child_price_eur', type: 'number', min: 0, label: l('Precio niño (EUR)', 'Child price (EUR)') },
        { name: 'child_price_usd', type: 'number', min: 0, label: l('Precio niño (USD)', 'Child price (USD)') },
        { name: 'min_age', type: 'number', min: 0, label: l('Edad mínima', 'Minimum age') },
      ],
    },
    {
      name: 'activity_level',
      type: 'select',
      label: l('Nivel de actividad', 'Activity level'),
      options: [
        { label: l('Fácil', 'Easy'), value: 'easy' },
        { label: l('Moderado', 'Moderate'), value: 'moderate' },
        { label: l('Exigente', 'Demanding'), value: 'demanding' },
      ],
    },
  ],
)
