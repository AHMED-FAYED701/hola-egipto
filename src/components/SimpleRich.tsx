import { slugify } from '@/fields/common'

import { WithPending } from './Pending'

type N = { type?: string; tag?: string; text?: string; listType?: string; children?: N[] }
const text = (n: N): string => (n.text ?? '') + (n.children || []).map(text).join('')

/** Renders headings, paragraphs and lists of a Lexical document, marking "[…pendiente…]" placeholders. */
export function SimpleRich({ data, className = 'prose' }: { data: unknown; className?: string }) {
  const root = (data as { root?: N })?.root
  if (!root?.children?.length) return null
  return (
    <div className={className}>
      {root.children.map((n, i) => {
        if (n.type === 'heading') {
          const Tag = (n.tag === 'h3' ? 'h3' : 'h2') as 'h2' | 'h3'
          return (
            <Tag key={i} id={slugify(text(n))}>
              {text(n)}
            </Tag>
          )
        }
        if (n.type === 'list') {
          const L = n.listType === 'number' ? 'ol' : 'ul'
          return (
            <L key={i}>
              {(n.children || []).map((li, j) => (
                <li key={j}>
                  <WithPending text={text(li)} />
                </li>
              ))}
            </L>
          )
        }
        return (
          <p key={i}>
            <WithPending text={text(n)} />
          </p>
        )
      })}
    </div>
  )
}
