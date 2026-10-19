import 'server-only'

import { revalidatePath } from 'next/cache'

/**
 * Revalidate the whole front end (contracts §16) and tell the interceptor to refresh its slug index.
 * Pages cross-link heavily (cards, menus, related trips), so every content save revalidates the layout.
 */
export function revalidateSite(): void {
  revalidatePath('/', 'layout')
  ;(globalThis as { __holaRoutesStamp?: number }).__holaRoutesStamp = Date.now()
}
