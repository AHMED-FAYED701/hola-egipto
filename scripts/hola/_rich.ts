import { block, doc, h, p, ul } from './_lexical'
import type { GuideBlock } from './data/types'

/** Convert the simple block arrays of the data files into Lexical state. */
export function toLexical(blocks: GuideBlock[], resolveTrip?: (key: string) => { relationTo: string; value: number } | null) {
  const nodes = []
  for (const b of blocks) {
    if ('h2' in b) nodes.push(h('h2', b.h2))
    else if ('h3' in b) nodes.push(h('h3', b.h3))
    else if ('p' in b) nodes.push(p(b.p))
    else if ('ul' in b) nodes.push(ul(b.ul))
    else if ('tip' in b) nodes.push(block('tip-box', { title: b.tip.title ?? '', text: b.tip.text }))
    else if ('trip' in b) {
      const ref = resolveTrip?.(b.trip)
      if (ref) nodes.push(block('trip-card', { trip: ref }))
    }
  }
  return doc(nodes)
}

export const paragraphsToLexical = (ps: string[]) => toLexical(ps.map((t) => ({ p: t })))
