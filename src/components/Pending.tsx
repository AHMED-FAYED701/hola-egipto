/** Visible placeholder for missing owner input (content rules §3). */
export function Pending({ locale }: { locale: 'es' | 'en' }) {
  return <span className="pending">{locale === 'en' ? '[pending]' : '[pendiente]'}</span>
}

/** Render text, wrapping any "[pendiente]" / "[pending]" token in the dashed marker. */
export function WithPending({ text }: { text: string }) {
  const parts = text.split(/(\[(?:pendiente|pending)\])/g)
  return (
    <>
      {parts.map((p, i) =>
        /^\[(?:pendiente|pending)\]$/.test(p) ? (
          <span key={i} className="pending">
            {p}
          </span>
        ) : (
          p
        ),
      )}
    </>
  )
}
