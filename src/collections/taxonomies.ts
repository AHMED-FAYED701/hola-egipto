import type { CollectionConfig, Field } from 'payload'

import { isLoggedIn, publicRead } from '../access'
import { faqField, l, slugField } from '../fields/common'
import { revalidateHooks } from '../hooks/revalidate'

const taxonomyFields = (): Field[] => [
  { name: 'name', type: 'text', required: true, localized: true, label: l('Nombre', 'Name') },
  slugField('name'),
  { name: 'hero', type: 'upload', relationTo: 'media', label: l('Imagen de cabecera', 'Hero image') },
  { name: 'h1', type: 'text', localized: true, label: l('H1 (opcional)', 'H1 override') },
  { name: 'intro', type: 'textarea', localized: true, label: l('Introducción', 'Intro') },
  { name: 'seo_text', type: 'textarea', localized: true, label: l('Texto SEO inferior', 'Bottom SEO text') },
  faqField(),
  { name: 'sort', type: 'number', defaultValue: 0, label: l('Orden', 'Sort order'), admin: { position: 'sidebar' } },
]

const taxonomy = (
  slug: string,
  labels: { singular: { es: string; en: string }; plural: { es: string; en: string } },
  extra: Field[] = [],
): CollectionConfig => ({
  slug,
  labels,
  admin: { group: l('Taxonomías', 'Taxonomies'), useAsTitle: 'name', defaultColumns: ['name', 'slug', 'sort'] },
  access: { read: publicRead, create: isLoggedIn, update: isLoggedIn, delete: isLoggedIn },
  defaultSort: 'sort',
  hooks: revalidateHooks,
  fields: [...taxonomyFields(), ...extra],
})

export const Durations = taxonomy('durations', {
  singular: l('Duración', 'Duration'),
  plural: l('Duraciones', 'Durations'),
}, [
  { name: 'min_days', type: 'number', label: l('Días mínimos', 'Min days'), admin: { position: 'sidebar' } },
  { name: 'max_days', type: 'number', label: l('Días máximos', 'Max days'), admin: { position: 'sidebar' } },
])

export const TripStyles = taxonomy('trip-styles', { singular: l('Estilo de viaje', 'Trip style'), plural: l('Estilos de viaje', 'Trip styles') })
export const CruiseTypes = taxonomy('cruise-types', { singular: l('Tipo de crucero', 'Cruise type'), plural: l('Tipos de crucero', 'Cruise types') })
export const Departures = taxonomy('departures', { singular: l('Ciudad de salida', 'Departure city'), plural: l('Ciudades de salida', 'Departure cities') }, [
  { name: 'destination', type: 'relationship', relationTo: 'destinations', label: l('Destino', 'Destination') },
])
export const Regions = taxonomy('regions', { singular: l('Región', 'Region'), plural: l('Regiones', 'Regions') })
export const GuideTopics = taxonomy('guide-topics', { singular: l('Tema de guía', 'Guide topic'), plural: l('Temas de guía', 'Guide topics') })
