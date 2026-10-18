'use client'

import { type KeyboardEvent, type ReactNode, useId, useState } from 'react'

/**
 * Accessible tabs (roving tabindex, ←/→). Panels are server-rendered; every panel stays in the DOM
 * and the inactive ones are hidden.
 */
export function Tabs({ labels, panels, className, label }: { labels: string[]; panels: ReactNode[]; className?: string; label: string }) {
  const [active, setActive] = useState(0)
  const id = useId()
  const onKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return
    e.preventDefault()
    const n = (active + (e.key === 'ArrowRight' ? 1 : -1) + labels.length) % labels.length
    setActive(n)
    document.getElementById(`${id}-tab-${n}`)?.focus()
  }
  return (
    <div>
      <div role="tablist" aria-label={label} className={className}>
        {labels.map((l, i) => (
          <button
            key={l}
            id={`${id}-tab-${i}`}
            role="tab"
            type="button"
            aria-selected={active === i}
            aria-controls={`${id}-panel-${i}`}
            tabIndex={active === i ? 0 : -1}
            onClick={() => setActive(i)}
            onKeyDown={onKey}
          >
            {l}
          </button>
        ))}
      </div>
      {panels.map((p, i) => (
        <div key={i} id={`${id}-panel-${i}`} role="tabpanel" aria-labelledby={`${id}-tab-${i}`} hidden={active !== i} tabIndex={0}>
          {p}
        </div>
      ))}
    </div>
  )
}
