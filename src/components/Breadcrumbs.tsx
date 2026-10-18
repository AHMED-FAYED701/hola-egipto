import { ChevronRight } from 'lucide-react'

import { absolute } from '@/lib/urls'

import { JsonLd } from './JsonLd'

export interface Crumb {
  label: string
  href: string
}

/** Breadcrumbs + BreadcrumbList (every page except home). The last crumb is the current page. */
export function Breadcrumbs({ items, label }: { items: Crumb[]; label: string }) {
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.label, item: absolute(c.href) })),
  }
  return (
    <nav aria-label={label} className="breadcrumbs container">
      <ol>
        {items.map((c, i) => (
          <li key={c.href}>
            {i < items.length - 1 ? (
              <>
                <a href={c.href}>{c.label}</a>
                <ChevronRight aria-hidden="true" size={16} strokeWidth={1.75} />
              </>
            ) : (
              <span aria-current="page">{c.label}</span>
            )}
          </li>
        ))}
      </ol>
      <JsonLd data={ld} />
    </nav>
  )
}
