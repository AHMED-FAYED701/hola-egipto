import path from 'node:path'
import { fileURLToPath } from 'node:url'

import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const dirname = path.dirname(fileURLToPath(import.meta.url))

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

// Report-only first (spec "Security"); GTM/GA hosts allowed for when gtm_id is set.
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://challenges.cloudflare.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://www.googletagmanager.com https://www.google-analytics.com",
  "font-src 'self'",
  "connect-src 'self' https://www.google-analytics.com https://*.google-analytics.com https://www.googletagmanager.com",
  "frame-src https://challenges.cloudflare.com https://www.googletagmanager.com",
  "frame-ancestors 'self'",
  "form-action 'self'",
  "base-uri 'self'",
  "object-src 'none'",
].join('; ')

const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'Content-Security-Policy-Report-Only', value: csp },
]

/**
 * A plain object (contracts §19): Hostinger builds with `output: 'standalone'`; the SQL migrations are
 * traced into that output so the startup migration (src/instrumentation.ts) can find drizzle/.
 */
const nextConfig: NextConfig = {
  output: 'standalone',
  outputFileTracingIncludes: { '/**/*': ['./drizzle/**/*'] },
  experimental: {
    // bodySizeLimit: admin image uploads (src/lib/uploads.ts, max 10 MB per file).
    serverActions: { allowedOrigins: ['hola-egipto.com', 'www.hola-egipto.com'], bodySizeLimit: '12mb' },
  },
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }]
  },
  poweredByHeader: false,
  // Every public URL ends with "/"; the 308 for front-end paths is done in src/proxy.ts (contracts §5).
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  // Metadata must block rendering so notFound() yields a real 404 status.
  htmlLimitedBots: /.*/,
  // Do not write AGENTS.md into the repository during `next dev`.
  agentRules: false,
  images: {
    localPatterns: [{ pathname: '/images/**' }, { pathname: '/brand/**' }, { pathname: '/uploads/**' }],
    formats: ['image/webp'],
  },
  turbopack: {
    root: path.resolve(dirname),
  },
}

export default withNextIntl(nextConfig)
