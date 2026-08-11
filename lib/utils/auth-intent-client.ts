'use client'

/**
 * Client-side helper for the `auth_intent` cookie. The cookie itself is
 * set by `/api/auth/intent` so it is HttpOnly + Secure + SameSite=Lax; this
 * helper just issues the network request.
 *
 * Replaces the previous `document.cookie`-based helper, which was XSS-
 * writable and lacked all three flags. See SECURITY-FIX 2026-08-05.
 */

export const AUTH_INTENT_COOKIE = 'auth_intent'

export async function setServerAuthIntent(intent: string): Promise<void> {
  try {
    await fetch('/api/auth/intent', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ intent }),
      credentials: 'same-origin',
    })
  } catch {
    // Intent persistence is best-effort. The sign-in flow has a
    // ?redirect= fallback, so a failure here should not block navigation.
  }
}
