import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { getAuthIntentFromCookie, AUTH_INTENT_COOKIE } from '@/lib/utils/auth-intent'
import { serviceApisFetch } from '@/lib/service-apis/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const redirectParam = searchParams.get('next') ?? searchParams.get('redirectTo') ?? '/'

  if (code) {
    const supabase = await createClient()
    const { data: sessionData, error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error && sessionData?.session?.access_token) {
      const accessToken = sessionData.session.access_token

      // Sync user to service-apis DB — MUST complete before redirect
      // so getCurrentUser() in subsequent requests finds the user
      const syncResponse = await serviceApisFetch('/api/v1/auth/sync', {
        method: 'POST',
        requireAuth: true,
        accessToken,
      })
      if (!syncResponse.ok) {
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
