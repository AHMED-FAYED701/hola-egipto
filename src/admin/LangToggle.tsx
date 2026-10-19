'use client'

import { usePathname, useSearchParams } from 'next/navigation'

/** ES/EN switch for the admin UI; comes back to the same admin page. */
export function LangToggle({ action, other }: { action: (d: FormData) => Promise<void>; other: 'es' | 'en' }) {
  const path = usePathname()
  const q = useSearchParams().toString()
  return (
    <form action={action}>
      <input type="hidden" name="lang" value={other} />
      <input type="hidden" name="back" value={path + (q ? `?${q}` : '')} />
      <button type="submit" className="adm-btn adm-btn--small" lang={other}>
        {other === 'en' ? 'English' : 'Español'}
      </button>
    </form>
  )
}
