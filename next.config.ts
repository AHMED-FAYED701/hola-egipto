import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(__filename)

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

const nextConfig: NextConfig = {
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
    localPatterns: [{ pathname: '/images/**' }, { pathname: '/brand/**' }],
    formats: ['image/webp'],
  },
  turbopack: {
    root: path.resolve(dirname),
  },
}

export default withNextIntl(nextConfig)
