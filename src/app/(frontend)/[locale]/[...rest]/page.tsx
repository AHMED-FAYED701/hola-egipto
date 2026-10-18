import { notFound } from 'next/navigation'

/** Any unknown path → localized 404 (contracts §5). */
export default function CatchAll() {
  notFound()
}
