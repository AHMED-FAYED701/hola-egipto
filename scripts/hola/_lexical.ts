/** Minimal builders for Lexical serialized state (Payload richText). */
import { randomBytes } from 'node:crypto'

type Node = Record<string, unknown>

const text = (t: string): Node => ({ type: 'text', text: t, format: 0, style: '', mode: 'normal', detail: 0, version: 1 })
const base = { format: '', indent: 0, version: 1, direction: 'ltr' as const }

export const p = (t: string): Node => ({ ...base, type: 'paragraph', textFormat: 0, textStyle: '', children: [text(t)] })
export const h = (tag: 'h2' | 'h3', t: string): Node => ({ ...base, type: 'heading', tag, children: [text(t)] })
export const ul = (items: string[]): Node => ({
  ...base,
  type: 'list',
  listType: 'bullet',
  start: 1,
  tag: 'ul',
  children: items.map((it, i) => ({ ...base, type: 'listitem', value: i + 1, children: [text(it)] })),
})
export const block = (blockType: string, fields: Record<string, unknown>): Node => ({
  type: 'block',
  version: 2,
  format: '',
  fields: { id: randomBytes(12).toString('hex'), blockName: '', blockType, ...fields },
})

export const doc = (children: Node[]) => ({
  root: { ...base, type: 'root', children },
})

export const paragraphs = (ps: string[]) => doc(ps.map(p))
