/**
 * Server-side auth_intent cookie helpers.
 *
 * The `auth_intent` cookie holds a post-sign-in redirect path (e.g.
 * `/become-expert`). It is now set exclusively by `app/api/auth/intent/route.ts`
 * with hardened options (HttpOnly, Secure in prod, SameSite=Lax). The
 * client-side `document.cookie` helper that used to set this cookie has been
 * removed — see SECURITY-FIX 2026-08-05.
 */
export const AUTH_INTENT_COOKIE = 'auth_intent'

/**
 * Read the raw `Cookie` header, so the value must be decoded here: Next.js
 * URL-encodes cookie values on write, and `/become-expert` is stored as
 * `%2Fbecome-expert`. Returned undecoded, it was appended straight to the app
 * origin and `/auth/callback` 500'd on `https://proploy.io%2Fbecome-expert`.
 */
export function getAuthIntentFromCookie(cookieHeader: string | null): string | null {
  if (!cookieHeader) return null
  const cookies = cookieHeader.split(';').map(c => c.trim())
  const authIntent = cookies.find(c => c.startsWith(`${AUTH_INTENT_COOKIE}=`))
  if (!authIntent) return null
  const raw = authIntent.slice(AUTH_INTENT_COOKIE.length + 1)
  if (!raw) return null
  try {
    return decodeURIComponent(raw)
  } catch {
    return null
  }
}
