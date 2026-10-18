import type { Locale } from '@/i18n/routing'
import type { SP } from '@/lib/archive'
import type { Page } from '@/payload-types'

import type { FixedPageExtras } from './FixedPage'

/** Template-specific parts (forms, thank-you tracking); filled in S9. */
export async function renderTemplateExtras(_page: Page, _locale: Locale, _sp: SP): Promise<FixedPageExtras> {
  return {}
}
