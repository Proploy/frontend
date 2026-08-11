import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { getAuthIntentFromCookie, AUTH_INTENT_COOKIE } from '@/lib/utils/auth-intent'
import { serviceApisFetch } from '@/lib/service-apis/server'
import { supabaseAuthCookieOptions } from '@/lib/supabase/cookie-options'

import { type EmailOtpType } from '@supabase/supabase-js'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const tokenHash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  const redirectParam = searchParams.get('next') ?? searchParams.get('redirectTo') ?? '/'

  const supabase = await createClient()
  let sessionData = null
  let authError = null

  if (code) {
    const res = await supabase.auth.exchangeCodeForSession(code)
    sessionData = res.data
    authError = res.error
  } else if (tokenHash && type) {
    const res = await supabase.auth.verifyOtp({ token_hash: tokenHash, type })
    sessionData = res.data
    authError = res.error
  }

  if (!authError && sessionData?.session?.access_token) {
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
    response.cookies.set(AUTH_INTENT_COOKIE, '', {
      ...supabaseAuthCookieOptions,
      maxAge: 0,
    })
    return response
  }

  return NextResponse.redirect(`${origin}/sign-in?error=auth_error`)
}
