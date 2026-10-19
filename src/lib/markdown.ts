/**
 * The one Markdown renderer (contracts §4): `marked` + `sanitize-html` allow-list, run on the server.
 * Guide shortcodes are split out before rendering:
 *   [[trip-card:<tour|cruise|excursion>:<id>]]   on its own line → trip card
 *   :::tip [optional title]                       → Tip box, closed by a line with `:::`
 */
import { Marked, type Tokens } from 'marked'
import sanitizeHtml from 'sanitize-html'

import { slugify } from './slug'

export type TripShortcodeType = 'tour' | 'cruise' | 'excursion'

export type Segment =
  | { kind: 'md'; text: string }
  | { kind: 'trip'; tripType: TripShortcodeType; id: number }
  | { kind: 'tip'; title: string; text: string }

const TRIP_RE = /^\s*\[\[trip-card:(tour|cruise|excursion):(\d+)\]\]\s*$/
const TIP_OPEN = /^\s*:::tip(?:\s+(.*?))?\s*$/
const TIP_CLOSE = /^\s*:::\s*$/

/** Split Markdown into plain Markdown runs and shortcode blocks, in document order. */
export function segments(md: string | null | undefined): Segment[] {
  const out: Segment[] = []
  if (!md) return out
  let buf: string[] = []
  const flush = () => {
    const text = buf.join('\n').trim()
    if (text) out.push({ kind: 'md', text })
    buf = []
  }
  const lines = md.replace(/\r\n?/g, '\n').split('\n')
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const trip = TRIP_RE.exec(line)
    if (trip) {
      flush()
      out.push({ kind: 'trip', tripType: trip[1] as TripShortcodeType, id: Number(trip[2]) })
      continue
    }
    const tip = TIP_OPEN.exec(line)
    if (tip) {
      flush()
      const body: string[] = []
      i++
      while (i < lines.length && !TIP_CLOSE.test(lines[i])) body.push(lines[i++])
      out.push({ kind: 'tip', title: (tip[1] || '').trim(), text: body.join('\n').trim() })
      continue
    }
    buf.push(line)
  }
  flush()
  return out
}

/** Inline text of a heading token (no markup), used for anchors and the table of contents. */
const tokenText = (t: { text?: string; tokens?: unknown[] }): string =>
  t.tokens && t.tokens.length ? (t.tokens as { text?: string; tokens?: unknown[] }[]).map(tokenText).join('') : (t.text ?? '')

const marked = new Marked({
  gfm: true,
  breaks: false,
  renderer: {
    heading(token: Tokens.Heading) {
      const inner = this.parser.parseInline(token.tokens)
      const id = token.depth === 2 || token.depth === 3 ? ` id="${slugify(tokenText(token))}"` : ''
      return `<h${token.depth}${id}>${inner}</h${token.depth}>\n`
    },
  },
})

const PENDING_RE = /\[[^\]<>]*(?:pendiente|pending)[^\]<>]*\]/gi

/** Markdown → sanitized HTML; "[pendiente]" / "[pending]" tokens get the dashed marker (content rules §3). */
export function renderMarkdown(md: string | null | undefined): string {
  if (!md) return ''
  const raw = marked.parse(md, { async: false }) as string
  const clean = sanitizeHtml(raw, {
    allowedTags: ['h2', 'h3', 'h4', 'p', 'br', 'hr', 'ul', 'ol', 'li', 'strong', 'em', 'b', 'i', 'a', 'blockquote', 'code', 'pre', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'span'],
    allowedAttributes: { a: ['href', 'title'], h2: ['id'], h3: ['id'], h4: ['id'], span: ['class'], th: ['align'], td: ['align'] },
    allowedClasses: { span: ['pending'] },
    allowedSchemes: ['http', 'https', 'mailto', 'tel'],
    allowProtocolRelative: false,
  })
  return clean.replace(PENDING_RE, (m) => `<span class="pending">${m}</span>`)
}

/** H2 headings (for the table of contents). */
export function headings(md: string | null | undefined): { id: string; text: string }[] {
  const text = segments(md)
    .filter((s): s is Extract<Segment, { kind: 'md' }> => s.kind === 'md')
    .map((s) => s.text)
    .join('\n\n')
  return marked
    .lexer(text)
    .filter((t): t is Tokens.Heading => t.type === 'heading' && (t as Tokens.Heading).depth === 2)
    .map((t) => ({ id: slugify(tokenText(t)), text: tokenText(t) }))
}

/** Visible words only (reading time, search snippets). */
export function plainText(md: string | null | undefined): string {
  return segments(md)
    .map((s) => (s.kind === 'md' ? s.text : s.kind === 'tip' ? `${s.title} ${s.text}` : ''))
    .join('\n')
    .replace(/[#>*_`~\-|[\]()]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}
