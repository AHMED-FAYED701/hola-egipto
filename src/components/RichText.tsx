import { Fragment, type ReactNode } from 'react'

import { renderMarkdown, segments, type TripShortcodeType } from '@/lib/markdown'

export { headings, plainText } from '@/lib/markdown'

export interface RichBlocks {
  'tip-box'?: (fields: { title: string; text: string }) => ReactNode | Promise<ReactNode>
  'trip-card'?: (fields: { tripType: TripShortcodeType; id: number }) => ReactNode | Promise<ReactNode>
}

/**
 * Markdown body (contracts §4), rendered and sanitized on the server. Plain runs become HTML (headings get
 * ids for the table of contents); `[[trip-card:…]]` and `:::tip` shortcodes are rendered by `blocks`.
 */
export async function RichText({ data, className = 'prose', blocks = {} }: { data: string | null | undefined; className?: string; blocks?: RichBlocks }) {
  const segs = segments(data)
  if (!segs.length) return null
  const parts = await Promise.all(
    segs.map(async (seg, i) => {
      if (seg.kind === 'md') return <div key={i} className="md" dangerouslySetInnerHTML={{ __html: renderMarkdown(seg.text) }} />
      if (seg.kind === 'tip') return <Fragment key={i}>{blocks['tip-box'] ? await blocks['tip-box']({ title: seg.title, text: seg.text }) : null}</Fragment>
      return <Fragment key={i}>{blocks['trip-card'] ? await blocks['trip-card']({ tripType: seg.tripType, id: seg.id }) : null}</Fragment>
    }),
  )
  return <div className={className}>{parts}</div>
}
