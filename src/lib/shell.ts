import 'server-only'

import { cache } from 'react'

import type { Locale } from '@/i18n/routing'

import { getNavigation, getSettings, listAvailable } from './content/read'

/** Everything the header/footer need, memoized per request. */
export const getShell = cache(async (locale: Locale) => {
  const [settings, navigation, latest] = await Promise.all([
    getSettings(locale),
    getNavigation(locale),
    listAvailable('guides', locale, { limit: 2, sort: '-last_updated', depth: 1 }),
  ])
  return { settings, navigation, latestGuides: latest.docs }
})
