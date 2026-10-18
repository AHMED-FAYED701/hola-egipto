/**
 * Simplified map of Egypt (inline SVG, no map API) with links to the region landing pages.
 * Coordinates are lon/lat projected linearly: x = (lon − 24.7) × 40, y = (31.8 − lat) × 40.
 */
const P = (lon: number, lat: number) => `${((lon - 24.7) * 40).toFixed(1)},${((31.8 - lat) * 40).toFixed(1)}`

const OUTLINE = [
  [25.0, 31.6], [27.0, 31.4], [29.0, 30.9], [30.2, 31.4], [31.0, 31.6], [32.3, 31.3], [34.2, 31.3],
  [34.9, 29.5], [34.6, 28.6], [34.25, 27.73], [33.7, 28.4], [32.9, 29.4], [32.55, 29.97],
  [32.65, 29.1], [33.08, 28.36], [33.8, 27.25], [33.94, 26.75], [34.28, 26.1], [34.89, 25.07],
  [35.47, 23.95], [35.7, 23.2], [36.9, 22.0], [25.0, 22.0],
].map(([a, b]) => P(a, b)).join(' ')

const NILE = [
  [31.6, 22.3], [32.0, 23.0], [32.9, 24.1], [32.85, 24.9], [32.64, 25.69], [32.7, 26.15], [31.9, 26.6],
  [31.18, 27.18], [30.75, 28.1], [31.0, 29.3], [31.24, 30.04],
].map(([a, b]) => P(a, b)).join(' ')
const DELTA_W = [[31.24, 30.04], [30.7, 30.7], [29.9, 31.2]].map(([a, b]) => P(a, b)).join(' ')
const DELTA_E = [[31.24, 30.04], [31.5, 30.8], [31.8, 31.4]].map(([a, b]) => P(a, b)).join(' ')

export interface MapRegion {
  key: 'north' | 'upper' | 'red-sea' | 'sinai' | 'western'
  label: string
  href: string | null
}

const POS: Record<MapRegion['key'], [number, number]> = {
  north: [31.2, 30.05],
  upper: [32.75, 25.0],
  'red-sea': [34.25, 26.6],
  sinai: [33.8, 29.1],
  western: [27.6, 26.8],
}

/** Spanish region slugs → map position key. */
export const REGION_KEYS: Record<string, MapRegion['key']> = {
  'el-cairo-y-el-norte': 'north',
  'alto-egipto': 'upper',
  'mar-rojo': 'red-sea',
  sinai: 'sinai',
  'desierto-occidental': 'western',
}

export interface MapPoint {
  label: string
  lat: number
  lng: number
}

export function EgyptMap({ regions = [], route = [], title, className }: { regions?: MapRegion[]; route?: MapPoint[]; title: string; className?: string }) {
  const routePts = route.map((p) => P(p.lng, p.lat))
  return (
    <svg className={className} viewBox="-10 -10 508 424" role="img" aria-label={title} width="508" height="424">
      <rect x="-10" y="-10" width="508" height="424" fill="var(--he-teal-50)" rx="18" />
      <polygon points={OUTLINE} fill="var(--he-sand-100)" stroke="var(--he-sand-ink)" strokeWidth="2" strokeLinejoin="round" />
      <polyline points={NILE} fill="none" stroke="var(--he-nile-teal)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points={DELTA_W} fill="none" stroke="var(--he-nile-teal)" strokeWidth="3" strokeLinecap="round" />
      <polyline points={DELTA_E} fill="none" stroke="var(--he-nile-teal)" strokeWidth="3" strokeLinecap="round" />
      {routePts.length > 1 ? <polyline points={routePts.join(' ')} fill="none" stroke="var(--he-terracotta)" strokeWidth="3" strokeDasharray="8 6" strokeLinecap="round" /> : null}
      {route.map((p, i) => {
        const [x, y] = routePts[i].split(',').map(Number)
        return (
          <g key={p.label + i}>
            <circle cx={x} cy={y} r="8" fill="var(--he-terracotta)" stroke="var(--he-linen)" strokeWidth="2.5" />
            <text x={x + 13} y={y + 5} fill="var(--he-deep-oasis)" fontFamily="var(--he-font-sans)" fontWeight="700" fontSize="15" paintOrder="stroke" stroke="var(--he-sand-100)" strokeWidth="4">
              {i + 1}. {p.label}
            </text>
          </g>
        )
      })}
      {regions.map((r) => {
        const [x, y] = P(...POS[r.key]).split(',').map(Number)
        const w = Math.max(60, r.label.length * 8.4 + 24)
        const body = (
          <g>
            <circle cx={x} cy={y} r="7" fill="var(--he-terracotta)" stroke="var(--he-linen)" strokeWidth="2" />
            <rect x={x - w / 2} y={y + 12} width={w} height="28" rx="14" fill="var(--he-deep-oasis)" />
            <text x={x} y={y + 31} textAnchor="middle" fill="var(--he-papyrus)" fontFamily="var(--he-font-sans)" fontWeight="600" fontSize="14">
              {r.label}
            </text>
          </g>
        )
        return r.href ? (
          <a key={r.key} href={r.href} aria-label={r.label}>
            {body}
          </a>
        ) : (
          <g key={r.key}>{body}</g>
        )
      })}
    </svg>
  )
}
