import { BlocksFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import type { Block } from 'payload'

import { l } from '../fields/common'

export const TripCardBlock: Block = {
  slug: 'trip-card',
  interfaceName: 'TripCardBlock',
  labels: { singular: l('Tarjeta de viaje', 'Trip card'), plural: l('Tarjetas de viaje', 'Trip cards') },
  fields: [
    {
      name: 'trip',
      type: 'relationship',
      relationTo: ['tours', 'cruises', 'excursions'],
      required: true,
      label: l('Viaje', 'Trip'),
    },
  ],
}

export const TipBoxBlock: Block = {
  slug: 'tip-box',
  interfaceName: 'TipBoxBlock',
  labels: { singular: l('Consejo', 'Tip box'), plural: l('Consejos', 'Tip boxes') },
  fields: [
    { name: 'title', type: 'text', label: l('Título', 'Title') },
    { name: 'text', type: 'textarea', required: true, label: l('Texto', 'Text') },
  ],
}

/** Guide body editor: default Lexical features plus the Trip card and Tip box blocks. */
export const guideEditor = lexicalEditor({
  features: ({ defaultFeatures }) => [...defaultFeatures, BlocksFeature({ blocks: [TripCardBlock, TipBoxBlock] })],
})
