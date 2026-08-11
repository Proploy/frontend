import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { supabaseAuthCookieOptions } from '@/lib/supabase/cookie-options'

const publicRoutes = ['/', '/sign-in', '/sign-up', '/auth/callback', '/become-expert']

function isProtectedExpertRoute(pathname: string) {
  if (pathname.startsWith('/experts/dashboard') || pathname.startsWith('/experts/account') || pathname.startsWith('/experts/chat')) {
    return true
  }

  return pathname.startsWith('/experts/')
}

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Sanity Studio and the draft-mode handlers bypass the Supabase auth gate.
  // Studio authenticates against Sanity, not Supabase, and it is a SPA — every
  // in-Studio navigation would otherwise pay for a getUser() round-trip. The
  // draft-mode routes must set their cookie before any session lookup runs.
  if (pathname.startsWith('/studio') || pathname.startsWith('/api/draft-mode')) {
    return NextResponse.next({ request: { headers: request.headers } })
  }

  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

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
    '/((?!_next|studio|api/draft-mode|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}
