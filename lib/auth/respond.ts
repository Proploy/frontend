import { NextResponse } from 'next/server'
import { randomUUID } from 'node:crypto'

/**
 * Public-facing auth error helper. Logs the real error server-side with a
 * request id, then returns a sanitized JSON response so we never leak
 * implementation details (Supabase project URL, internal stack traces,
 * distinguishing "user does not exist" from "wrong password", etc.).
 *
 * Pass a curated set of `safeMessages` for error codes that are already
 * safe to surface (e.g. "Invalid login credentials" — no URL, no existence
 * leak). Anything else gets replaced with `fallback`.
 */
const URL_PATTERN = /https?:\/\/[^\s)]+/gi

function sanitize(message: string): string {
  return message.replace(URL_PATTERN, '[redacted]').trim()
}

export function publicAuthError(
  error: unknown,
  fallback: string,
  options: { safeMessages?: ReadonlySet<string>; status?: number } = {},
): NextResponse {
  const { safeMessages, status = 400 } = options
  const requestId = randomUUID()
  const raw = error instanceof Error ? error.message : String(error)
  const cleaned = sanitize(raw)

  console.error(`[auth][${requestId}]`, error)

  const message =
    safeMessages && safeMessages.has(cleaned) ? cleaned : fallback

  return NextResponse.json({ error: message, requestId }, { status })
}

/**
 * A 200 response that LOOKS like success but is intentionally neutral.
 * Used for sign-up to defeat account enumeration: an attacker cannot tell
 * "email was already registered" from "account was just created" because
 * both return the same body and the client navigates to /check-email either
 * way.
 */
export function neutralAuthAck(): NextResponse {
  return NextResponse.json(
    { user: null, ok: true },
    { headers: { 'cache-control': 'no-store' } },
  )
}
