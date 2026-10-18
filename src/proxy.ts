import { jwtVerify } from 'jose'
import { NextResponse, type NextRequest } from 'next/server'

import { flag, payloadJwtKey, previewCookieValue, safeEqual } from './lib/secrets'

const PASS_FILES = new Set([
  '/favicon.ico',
  '/icon.svg',
  '/apple-icon.png',
  '/manifest.webmanifest',
  '/robots.txt',
  '/sitemap.xml',
])

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

async function hasAdminSession(req: NextRequest): Promise<boolean> {
  const token = req.cookies.get('payload-token')?.value
  if (!token) return false
  try {
    await jwtVerify(token, payloadJwtKey(), { algorithms: ['HS256'] })
    return true
  } catch {
    return false
  }
}

function hasPreviewCookie(req: NextRequest): boolean {
  const v = req.cookies.get(PREVIEW_COOKIE)?.value
  return Boolean(v) && safeEqual(v as string, previewCookieValue())
}

function comingSoon(req: NextRequest) {
  const url = req.nextUrl.clone()
  url.pathname = '/api/hola/coming-soon'
  url.search = ''
  return NextResponse.rewrite(url)
}

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (isBackendPath(pathname) || PASS_FILES.has(pathname) || isFilePath(pathname)) {
    return NextResponse.next()
  }

  const soon = flag('HOLA_COMING_SOON')

  // Preview link: ?hola_preview=<key> → 307 without the parameter + cookie.
  const previewParam = req.nextUrl.searchParams.get(PREVIEW_PARAM)
  if (previewParam !== null) {
    const key = process.env.HOLA_PREVIEW_KEY || ''
    if (key && safeEqual(previewParam, key)) {
      const target = req.nextUrl.clone()
      target.searchParams.delete(PREVIEW_PARAM)
      const res = NextResponse.redirect(target, 307)
      res.cookies.set(PREVIEW_COOKIE, previewCookieValue(), {
        path: '/',
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 2592000,
        secure: req.nextUrl.protocol === 'https:',
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
    // Built by hand: NextURL drops the trailing slash when stringified.
    const target = new URL(pathname + '/' + req.nextUrl.search, req.url)
    return NextResponse.redirect(target, 308)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image).*)'],
}
