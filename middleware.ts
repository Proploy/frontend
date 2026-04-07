import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

async function handleRequest(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // Skip Supabase initialization if env variables are not set (development without DB)
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) => {
              request.cookies.set(name, value)
            })
            response = NextResponse.next({
              request: {
                headers: request.headers,
              },
            })
            cookiesToSet.forEach(({ name, value, options }) => {
              response.cookies.set(name, value, options)
            })
          },
        },
      }
    )

    await supabase.auth.getUser()
  }

  return response
}

let middleware: (request: NextRequest) => Promise<NextResponse>

if (process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
  const { clerkMiddleware, createRouteMatcher } = require('@clerk/nextjs/server')
  const isProtectedRoute = createRouteMatcher(['/dashboard(.*)'])

  middleware = clerkMiddleware(async (auth: any, request: NextRequest) => {
    if (isProtectedRoute(request)) {
      await auth.protect()
    }
    return handleRequest(request)
  })
} else {
  middleware = handleRequest
}

export default middleware

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',

    '/(api|trpc)(.*)',
  ],
}
