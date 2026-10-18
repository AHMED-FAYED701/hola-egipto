import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, GlobalAfterChangeHook } from 'payload'

/**
 * Revalidate the front end after content changes (contracts §16).
 * The site is small and pages cross-link heavily (cards, menus, related trips), so any change
 * revalidates the whole front-end layout. Never throws: outside the Next.js server (CLI scripts)
 * `revalidatePath` is unavailable and the scripts call POST /api/hola/revalidate instead.
 */
export async function revalidateAll(): Promise<void> {
  try {
    const { revalidatePath } = await import('next/cache')
    revalidatePath('/', 'layout')
  } catch {
    // outside a Next.js request context
  }
}

export const revalidateAfterChange: CollectionAfterChangeHook = async ({ doc, context }) => {
  if (!context?.disableRevalidate) await revalidateAll()
  return doc
}

export const revalidateAfterDelete: CollectionAfterDeleteHook = async ({ doc, context }) => {
  if (!context?.disableRevalidate) await revalidateAll()
  return doc
}

export const revalidateGlobal: GlobalAfterChangeHook = async ({ doc, context }) => {
  if (!context?.disableRevalidate) await revalidateAll()
  return doc
}

export const revalidateHooks = {
  afterChange: [revalidateAfterChange],
  afterDelete: [revalidateAfterDelete],
}
