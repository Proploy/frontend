import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { supabaseAuthCookieOptions } from '@/lib/supabase/cookie-options'
import crypto from 'node:crypto'

const publicRoutes = ['/', '/sign-in', '/sign-up', '/auth/callback', '/become-expert']

// Public expert-directory category pages (footer links) — static marketing
// routes that live alongside the auth-gated /experts/[id] profiles.
const PUBLIC_EXPERT_CATEGORY_ROUTES = [
  '/experts/top',
  '/experts/engineering',
  '/experts/data-ai',
  '/experts/product',
  '/experts/marketing',
  '/experts/finance-ops',
  '/experts/consulting',
]

function isProtectedExpertRoute(pathname: string) {
  if (pathname.startsWith('/experts/dashboard') || pathname.startsWith('/experts/account') || pathname.startsWith('/experts/chat')) {
    return true
  }

  if (PUBLIC_EXPERT_CATEGORY_ROUTES.includes(pathname)) {
    return false
  }

  return pathname.startsWith('/experts/')
}

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  const nonce = Buffer.from(crypto.randomBytes(16)).toString('base64')
  const isDev = process.env.NODE_ENV === 'development'
  
  // CSP Construction
  // All routes use a strict nonce-based policy. 
  // We only add 'unsafe-eval' in development for Next.js hot-reloading.
  const scriptSrc = `'self' 'nonce-${nonce}' 'strict-dynamic'${isDev ? " 'unsafe-eval'" : ""}`

  const localDevSrc = isDev ? " http://localhost:* http://127.0.0.1:*" : ""

  const cspHeader = `
    default-src 'self';
    script-src ${scriptSrc};
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    font-src 'self' data: https://fonts.gstatic.com;
    img-src 'self' data: blob:${localDevSrc} https://eczlamdmamicyugklabj.supabase.co https://cdn.sanity.io https://lh3.googleusercontent.com https://avatars.githubusercontent.com https://service-apis-731353524841.australia-southeast1.run.app;
    media-src 'self' data: blob:${localDevSrc} https://eczlamdmamicyugklabj.supabase.co https://service-apis-731353524841.australia-southeast1.run.app;
    connect-src 'self'${localDevSrc} https://eczlamdmamicyugklabj.supabase.co wss://eczlamdmamicyugklabj.supabase.co https://*.sanity.io https://service-apis-731353524841.australia-southeast1.run.app;
    frame-src 'self' blob: data:${localDevSrc} https://accounts.google.com https://github.com https://login.microsoftonline.com https://eczlamdmamicyugklabj.supabase.co https://service-apis-731353524841.australia-southeast1.run.app https://www.youtube-nocookie.com https://www.youtube.com https://youtube.com https://player.vimeo.com https://vimeo.com https://www.loom.com https://loom.com https://drive.google.com https://docs.google.com;
    frame-ancestors 'none';
    form-action 'self';
    base-uri 'self';
    object-src 'self' blob: data: https://service-apis-731353524841.australia-southeast1.run.app;
    upgrade-insecure-requests;
  `.replace(/\s{2,}/g, ' ').trim()

  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-nonce', nonce)
  requestHeaders.set('Content-Security-Policy', cspHeader)

  // Sanity Studio and the draft-mode handlers bypass the Supabase auth gate.
  // Studio authenticates against Sanity, not Supabase, and it is a SPA — every
  // in-Studio navigation would otherwise pay for a getUser() round-trip. The
  // draft-mode routes must set their cookie before any session lookup runs.
  if (pathname.startsWith('/studio') || pathname.startsWith('/api/draft-mode')) {
    // We intentionally do NOT apply the strict nonce-based CSP here.
    // Sanity Studio relies on a large amount of inline scripts/eval that do not
    // pass through the Next.js nonce injection pipeline.
    const response = NextResponse.next({ request: { headers: requestHeaders } })
    return response
  }

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
  response.headers.set('Content-Security-Policy', cspHeader)

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookieOptions: supabaseAuthCookieOptions,
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value)
            response.cookies.set(name, value, options as CookieOptions)
          })
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  const isProtectedRoute = pathname.startsWith('/become-expert') ||
                          pathname.startsWith('/expert-dashboard') ||
                          isProtectedExpertRoute(pathname) ||
                          pathname.startsWith('/dashboard') ||
                          pathname.startsWith('/workspace') ||
                          pathname.startsWith('/favorites') ||
                          pathname.startsWith('/profile') ||
                          pathname.startsWith('/AI_workspace')
  
  const isAuthRoute = publicRoutes.some(route => pathname === route || pathname.startsWith(route + '/'))

  if (isProtectedRoute && !user) {
    const loginUrl = new URL('/sign-in', request.url)
    loginUrl.searchParams.set('redirectTo', `${pathname}${request.nextUrl.search}`)
    return NextResponse.redirect(loginUrl)
  }

  if (isAuthRoute && user && (pathname === '/sign-in' || pathname === '/sign-up')) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return response
}

export default proxy

export const config = {
  matcher: [
    '/((?!_next|api/draft-mode|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}
