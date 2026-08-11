import { NextRequest, NextResponse } from 'next/server'
import { AUTH_INTENT_COOKIE } from '@/lib/utils/auth-intent'
import { supabaseAuthCookieOptions } from '@/lib/supabase/cookie-options'

/**
 * Server-side replacement for the old `setAuthIntent` client helper.
 *
 * Reason: the previous client implementation set `auth_intent` via
 * `document.cookie`, which means JS (XSS payloads) could read or overwrite
 * the post-sign-in redirect destination. Worse, it set no HttpOnly / Secure
 * / SameSite flags. This route writes the cookie server-side with the
 * hardened options from `supabaseAuthCookieOptions`.
 *
 * The cookie value is just a relative path the user wanted to land on
 * after sign-in (e.g. `/become-expert`). It is not sensitive, but it
 * must not be writable by client JS.
 */
const MAX_AGE_SECONDS = 60 * 60 // 1 hour
const SAFE_PATH = /^\/[a-zA-Z0-9/_\-?&=.%#]*$/

export async function POST(request: NextRequest) {
  let intent: unknown
  try {
    const body = (await request.json()) as { intent?: unknown }
    intent = body.intent
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  if (typeof intent !== 'string' || intent.length === 0 || intent.length > 512) {
    return NextResponse.json({ error: 'Invalid intent' }, { status: 400 })
  }
  if (!SAFE_PATH.test(intent)) {
    return NextResponse.json({ error: 'Invalid intent path' }, { status: 400 })
  }

  const response = NextResponse.json({ ok: true })
  response.cookies.set(AUTH_INTENT_COOKIE, intent, {
    ...supabaseAuthCookieOptions,
    maxAge: MAX_AGE_SECONDS,
  })
  return response
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true })
  response.cookies.set(AUTH_INTENT_COOKIE, '', {
    ...supabaseAuthCookieOptions,
    maxAge: 0,
  })
  return response
}
