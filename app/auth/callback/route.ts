import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { getAuthIntentFromCookie, AUTH_INTENT_COOKIE } from '@/lib/utils/auth-intent'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const redirectParam = searchParams.get('next') ?? '/'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
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
