import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const OAUTH_PROVIDERS = new Set(['google', 'github', 'azure', 'linkedin'])

export async function POST(request: NextRequest) {
  const body: unknown = await request.json().catch(() => null)
  const provider = body && typeof body === 'object' ? (body as { provider?: unknown }).provider : null
  const redirectTo = body && typeof body === 'object' ? (body as { redirectTo?: unknown }).redirectTo : null
  const rememberMe = body && typeof body === 'object' ? (body as { rememberMe?: unknown }).rememberMe : null

  if (typeof provider !== 'string' || !OAUTH_PROVIDERS.has(provider)) {
    return NextResponse.json({ error: 'Unsupported OAuth provider' }, { status: 400 })
  }

  const origin = request.headers.get('origin') ?? request.nextUrl.origin
  const callbackUrl = new URL('/auth/callback', origin)
  callbackUrl.searchParams.set('redirectTo', typeof redirectTo === 'string' && redirectTo ? redirectTo : '/')

  const supabase = await createClient()
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: provider as 'google' | 'github' | 'azure' | 'linkedin',
    options: {
      redirectTo: callbackUrl.toString(),
      queryParams: provider === 'google' && rememberMe ? { access_type: 'offline', prompt: 'consent' } : undefined,
      scopes: provider === 'azure' ? 'openid profile email' : undefined,
    },
  })

  if (error || !data.url) {
    return NextResponse.json({ error: error?.message ?? 'Unable to start OAuth sign-in' }, { status: 400 })
  }

  return NextResponse.json({ url: data.url }, { headers: { 'cache-control': 'no-store' } })
}
