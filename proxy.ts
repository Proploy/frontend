import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const publicRoutes = ['/', '/sign-in', '/sign-up', '/auth/callback', '/become-expert']

function isProtectedExpertRoute(pathname: string) {
  if (pathname.startsWith('/experts/dashboard') || pathname.startsWith('/experts/account') || pathname.startsWith('/experts/chat')) {
    return true
  }

  return pathname.startsWith('/experts/')
}

export async function proxy(request: NextRequest) {
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
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

  const pathname = request.nextUrl.pathname

  const isProtectedRoute = pathname.startsWith('/become-expert') || 
                          pathname.startsWith('/expert-dashboard') ||
                          isProtectedExpertRoute(pathname) ||
                          pathname.startsWith('/dashboard') ||
                          pathname.startsWith('/workspace') ||
                          pathname.startsWith('/favorites') ||
                          pathname.startsWith('/profile')
  
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
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}
