import type { Access, FieldAccess } from 'payload'

/** Any authenticated user (admin or editor). */
export const isLoggedIn: Access = ({ req }) => Boolean(req.user)

/** Admins only. The first user created at /admin/create-first-user is an admin (see Users hook). */
export const isAdmin: Access = ({ req }) => {
  if (!req.user) return false
  return (req.user as { role?: string }).role === 'admin'
}

export const isLoggedInField: FieldAccess = ({ req }) => Boolean(req.user)

export const publicRead: Access = () => true
