import path from 'path'
import type { CollectionConfig } from 'payload'
import { fileURLToPath } from 'url'

import { isLoggedIn, publicRead } from '../access'
import { holaSampleField, l } from '../fields/common'
import { revalidateHooks } from '../hooks/revalidate'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const webp = { format: 'webp' as const, options: { quality: 78 } }

export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: l('Imagen', 'Image'), plural: l('Medios', 'Media') },
  admin: { group: l('Contenido', 'Content'), useAsTitle: 'alt' },
  access: { read: publicRead, create: isLoggedIn, update: isLoggedIn, delete: isLoggedIn },
  hooks: revalidateHooks,
  fields: [
    { name: 'alt', type: 'text', required: true, localized: true, label: l('Texto alternativo', 'Alt text') },
    holaSampleField,
  ],
  upload: {
    staticDir: path.resolve(dirname, '../../media'),
    mimeTypes: ['image/*'],
    imageSizes: [
      { name: 'card', width: 640, height: 480, position: 'centre', formatOptions: webp },
      { name: 'tile', width: 600, height: 800, position: 'centre', formatOptions: webp },
      { name: 'hero', width: 1920, height: 1080, position: 'centre', formatOptions: webp },
      { name: 'hero-mobile', width: 900, height: 1125, position: 'centre', formatOptions: webp },
      { name: 'gallery', width: 1600, formatOptions: webp },
    ],
    adminThumbnail: 'card',
  },
}
