import createIntlMiddleware from 'next-intl/middleware'
import { NextResponse, type NextRequest } from 'next/server'

import { routing } from './i18n/routing'
import { existsIn, matchPath, type RouteIndex } from './lib/route-match'

import { flag, previewCookieValue, safeEqual } from './lib/secrets'
import { SESSION_COOKIE, verifySession } from './lib/session'
import { siteUrl } from './lib/site'

const PASS_FILES = new Set([
  '/favicon.ico',
  '/icon.svg',
  '/apple-icon.png',
  '/manifest.webmanifest',
  '/robots.txt',
  '/sitemap.xml',
])

const intl = createIntlMiddleware(routing)

const PREVIEW_COOKIE = 'hola_preview'
const PREVIEW_PARAM = 'hola_preview'

function isBackendPath(pathname: string): boolean {
  return (
    pathname === '/admin' ||
    pathname.startsWith('/admin/') ||
    pathname.startsWith('/api/') ||
    pathname === '/api' ||
    pathname.startsWith('/_next/')
  )
}

/** A path whose last segment contains a dot is a file (public/, metadata routes). */
function isFilePath(pathname: string): boolean {
  const last = pathname.split('/').pop() || ''
  return last.includes('.')
}

/** Signature and expiry only (contracts §3); admin pages re-check the user and session_version. */
async function hasAdminSession(req: NextRequest): Promise<boolean> {
  return Boolean(await verifySession(req.cookies.get(SESSION_COOKIE)?.value))
}

function hasPreviewCookie(req: NextRequest): boolean {
  const v = req.cookies.get(PREVIEW_COOKIE)?.value
  return Boolean(v) && safeEqual(v as string, previewCookieValue())
}

// Index of existing slugs (from /api/hola/routes), refreshed every few seconds.
const INDEX_TTL_MS = 5000
let indexCache: { at: number; index: RouteIndex | null } = { at: 0, index: null }

async function routeIndex(req: NextRequest): Promise<RouteIndex | null> {
  const now = Date.now()
  const forced = (globalThis as { __holaRoutesStamp?: number }).__holaRoutesStamp || 0
  if (indexCache.index && now - indexCache.at < INDEX_TTL_MS && forced < indexCache.at) return indexCache.index
  try {
    const res = await fetch(new URL('/api/hola/routes', req.nextUrl.origin), { cache: 'no-store', signal: AbortSignal.timeout(5000) })
    if (!res.ok) return indexCache.index
    indexCache = { at: now, index: (await res.json()) as RouteIndex }
  } catch {
    // keep the previous index; pages still call notFound() as a backstop
  }
  return indexCache.index
}

/**
 * Next.js 16 renders a page-level notFound() as an empty error shell, so unknown front-end URLs are
 * answered here instead: a rewrite to the localized 404 page with status 404 (full layout, lang, noindex).
 */
async function notFoundResponse(req: NextRequest): Promise<NextResponse | null> {
  const { pathname } = req.nextUrl
  const m = matchPath(pathname)
  const locale = m?.locale ?? (pathname.startsWith('/en/') ? 'en' : 'es')
  if (m) {
    if (m.kind === 'home' || m.kind === 'archive' || m.kind === 'search') return null
    const index = await routeIndex(req)
    if (!index || existsIn(index, m)) return null
  }
  const url = req.nextUrl.clone()
  url.pathname = `/${locale}/hola-404/`
  url.search = ''
  return NextResponse.rewrite(url, { status: 404 })
}

/**
 * Redirect to a path on SITE_URL: behind Hostinger's proxy the request host is not the public one (§19),
 * and the interceptor must answer with an absolute Location.
 */
function redirectTo(path: string, status: 307 | 308) {
  return NextResponse.redirect(siteUrl() + path, status)
}

const ADMIN_PUBLIC = /^\/admin\/(login|setup)\/?$/

/** /admin… needs a valid `hola_session` (signature + expiry); pages re-check the user (contracts §18). */
async function adminGate(req: NextRequest): Promise<NextResponse> {
  const { pathname, search } = req.nextUrl
  if (ADMIN_PUBLIC.test(pathname) || (await hasAdminSession(req))) return NextResponse.next()
  return redirectTo(`/admin/login?next=${encodeURIComponent(pathname + search)}`, 307)
}

function comingSoon(req: NextRequest) {
  const url = req.nextUrl.clone()
  url.pathname = '/api/hola/coming-soon'
  url.search = ''
  return NextResponse.rewrite(url)
}

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (pathname === '/admin' || pathname.startsWith('/admin/')) return adminGate(req)

  if (isBackendPath(pathname) || PASS_FILES.has(pathname) || isFilePath(pathname)) {
    return NextResponse.next()
  }

  const soon = flag('HOLA_COMING_SOON')

  // Preview link: ?hola_preview=<key> → 307 without the parameter + cookie.
  const previewParam = req.nextUrl.searchParams.get(PREVIEW_PARAM)
  if (previewParam !== null) {
    const key = process.env.HOLA_PREVIEW_KEY || ''
    if (key && safeEqual(previewParam, key)) {
      const params = new URLSearchParams(req.nextUrl.search)
      params.delete(PREVIEW_PARAM)
      const q = params.toString()
      const res = redirectTo(pathname + (q ? `?${q}` : ''), 307)
      res.cookies.set(PREVIEW_COOKIE, previewCookieValue(), {
        path: '/',
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 2592000,
        secure: siteUrl().startsWith('https'),
      })
      return res
    }
    if (soon && !(await hasAdminSession(req))) return comingSoon(req)
  }

  if (soon && !hasPreviewCookie(req) && !(await hasAdminSession(req))) {
    return comingSoon(req)
  }

  // Every public URL ends with "/" (contracts §5).
  if (!pathname.endsWith('/')) {
    return redirectTo(pathname + '/' + req.nextUrl.search, 308)
  }

  // "/es/…" is redirected to the unprefixed URL by next-intl before it is checked.
  if (!(pathname === '/es/' || pathname.startsWith('/es/'))) {
    const missing = await notFoundResponse(req)
    if (missing) return missing
  }

  // Localized routing (next-intl) runs after the coming-soon gate.
  return intl(req)
}

export const config = {
  matcher: ['/((?!_next/static|_next/image).*)'],
}
