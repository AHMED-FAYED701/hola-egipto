import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import { type JSXConvertersFunction, RichText as PayloadRichText } from '@payloadcms/richtext-lexical/react'
import type { ReactNode } from 'react'

import { slugify } from '@/fields/common'

type Node = { type?: string; text?: string; children?: Node[] }

export const nodeText = (n: Node): string => (n.text ?? '') + (n.children || []).map(nodeText).join('')

/** H2 headings of a Lexical document (for the table of contents). */
export function headings(data: unknown): { id: string; text: string }[] {
  const root = (data as { root?: { children?: (Node & { tag?: string })[] } })?.root
  return (root?.children || [])
    .filter((n) => n.type === 'heading' && n.tag === 'h2')
    .map((n) => ({ id: slugify(nodeText(n)), text: nodeText(n) }))
}

export const plainText = (data: unknown): string => {
  const root = (data as { root?: Node })?.root
  return root ? nodeText(root) : ''
}

/** Lexical renderer: headings get ids (TOC anchors); custom blocks are rendered by `blocks`. */
export function RichText({
  data,
  className = 'prose',
  blocks = {},
}: {
  data: unknown
  className?: string
  blocks?: Record<string, (fields: Record<string, unknown>) => ReactNode>
}) {
  if (!data || typeof data !== 'object' || !('root' in (data as object))) return null
  const converters: JSXConvertersFunction = ({ defaultConverters }) => ({
    ...defaultConverters,
    heading: ({ node, nodesToJSX }) => {
      const Tag = (node as { tag: 'h2' | 'h3' | 'h4' }).tag
      const kids = nodesToJSX({ nodes: node.children })
      return <Tag id={Tag === 'h2' ? slugify(nodeText(node as Node)) : undefined}>{kids}</Tag>
    },
    blocks: Object.fromEntries(
      Object.entries(blocks).map(([slug, render]) => [slug, ({ node }: { node: { fields: Record<string, unknown> } }) => render(node.fields)]),
    ),
  })
  return <PayloadRichText data={data as SerializedEditorState} className={className} converters={converters} disableContainer={false} />
}
