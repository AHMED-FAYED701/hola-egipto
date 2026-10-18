import type { CollectionConfig } from 'payload'

import { isAdmin, isLoggedIn } from '../access'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: { singular: { es: 'Usuario', en: 'User' }, plural: { es: 'Usuarios', en: 'Users' } },
  admin: {
    useAsTitle: 'email',
    group: { es: 'Ajustes', en: 'Settings' },
  },
  auth: true,
  access: {
    read: isLoggedIn,
    create: isAdmin,
    update: isLoggedIn,
    delete: isAdmin,
  },
  hooks: {
    beforeChange: [
      // The first account (created by the owner at /admin/create-first-user) is always an admin.
      async ({ data, operation, req }) => {
        if (operation !== 'create') return data
        const existing = await req.payload.count({ collection: 'users', overrideAccess: true, req })
        if (existing.totalDocs === 0) return { ...data, role: 'admin' }
        return data
      },
    ],
  },
  fields: [
    {
      name: 'role',
      type: 'select',
      label: { es: 'Rol', en: 'Role' },
      required: true,
      defaultValue: 'editor',
      saveToJWT: true,
      options: [
        { label: { es: 'Administrador', en: 'Admin' }, value: 'admin' },
        { label: { es: 'Editor', en: 'Editor' }, value: 'editor' },
      ],
    },
  ],
}
