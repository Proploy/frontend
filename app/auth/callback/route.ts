import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { getAuthIntentFromCookie, AUTH_INTENT_COOKIE } from '@/lib/utils/auth-intent'

const SERVICE_APIS_URL = process.env.NEXT_PUBLIC_SERVICE_APIS_URL || 'http://localhost:8020'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const redirectParam = searchParams.get('next') ?? '/'

  if (code) {
    const supabase = await createClient()
    const { data: sessionData, error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error && sessionData?.session?.access_token) {
      const accessToken = sessionData.session.access_token

      // Sync user to service-apis DB — MUST complete before redirect
      // so getCurrentUser() in subsequent requests finds the user
      try {
        const syncRes = await fetch(`${SERVICE_APIS_URL}/api/v1/auth/sync`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        })
        if (!syncRes.ok) {
          const errorText = await syncRes.text()
          console.error('[auth/callback] sync failed:', syncRes.status, errorText)
          return NextResponse.redirect(`${origin}/sign-in?error=sync_failed`)
        }
      } catch (syncErr) {
        console.error('[auth/callback] sync network error:', syncErr)
        return NextResponse.redirect(`${origin}/sign-in?error=sync_failed`)
      }

      const cookieHeader = request.headers.get('cookie')
      const authIntent = getAuthIntentFromCookie(cookieHeader)
      const finalRedirect = authIntent || redirectParam
      const response = NextResponse.redirect(`${origin}${finalRedirect}`)
      response.cookies.set(AUTH_INTENT_COOKIE, '', { path: '/', maxAge: 0, sameSite: 'lax' })
      return response
    }
  }

  return NextResponse.redirect(`${origin}/sign-in?error=auth_error`)
}
