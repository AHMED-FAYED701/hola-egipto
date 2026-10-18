import { JsonLd } from './JsonLd'
import { WithPending } from './Pending'

export interface QA {
  q: string
  a: string
}

/** FAQ accordion (native <details>) with FAQPage JSON-LD. */
export function FaqSection({ title, items, id = 'faq', withSchema = true }: { title: string; items: QA[]; id?: string; withSchema?: boolean }) {
  if (!items.length) return null
  return (
    <section className="section--tight" aria-labelledby={`${id}-title`}>
      <h2 id={`${id}-title`}>{title}</h2>
      <FaqList items={items} />
      {withSchema ? <JsonLd data={faqSchema(items)} /> : null}
    </section>
  )
}

export function FaqList({ items }: { items: QA[] }) {
  return (
    <div className="accordion">
      {items.map((f, i) => (
        <details key={i}>
          <summary>{f.q}</summary>
          <div className="accordion-body">
            <p>
              <WithPending text={f.a} />
            </p>
          </div>
        </details>
      ))}
    </div>
  )
}

export const faqSchema = (items: QA[]) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: items.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
})
