/**
 * Where the auth pages send people once they are signed in, and how that
 * destination is read off the URL.
 */

type SearchParamsRecord = Record<string, string | string[] | undefined>

/**
 * Accept only a same-origin path.
 *
 * The value arrives from a query string that anyone can craft, and it is
 * handed to `router.push` / `window.location`, so an absolute
 * (`https://evil.example`) or protocol-relative (`//evil.example`) value would
 * be an open redirect — a working phishing hop off a real Proploy login URL.
 * This mirrors the `SAFE_PATH` rule that `app/api/auth/intent/route.ts`
 * already applies to the intent cookie.
 */
export function sanitizeRedirectPath(value: string | null | undefined): string | null {
  if (typeof value !== 'string' || value.length === 0 || value.length > 512) return null
  // `\` is normalised to `/` by some browsers, so `/\evil.example` would
  // escape the origin just as `//` does.
  if (!value.startsWith('/') || value.startsWith('//') || value.includes('\\')) return null
  return value
}

function firstValue(value: string | string[] | undefined): string | null {
  if (Array.isArray(value)) return value[0] ?? null
  return value ?? null
}

/**
 * Read the post-auth destination off a page's search params.
 *
 * Two spellings are in the wild: `proxy.ts` and `AuthRequiredLink` write
 * `redirectTo`, while the nav's "Join as Expert" CTA, the expert profile page
 * and the workspace empty state write `redirect`. Only `redirectTo` was ever
 * read, so every `redirect` caller silently landed on `/` after a password
 * sign-in. Both are accepted here; `redirectTo` wins if both are present.
 */
export function readRedirectParam(searchParams: SearchParamsRecord): string | null {
  const raw = firstValue(searchParams.redirectTo) ?? firstValue(searchParams.redirect)
  return sanitizeRedirectPath(raw)
}

/**
 * Carry the destination onto another auth route, so switching between log in,
 * sign up and the email screens does not lose where the user was heading —
 * nor which brand panel they were shown.
 */
export function withRedirect(
  href: string,
  redirectTo: string | null,
  extraParams?: Record<string, string>,
): string {
  const params = new URLSearchParams(extraParams)
  if (redirectTo) params.set('redirectTo', redirectTo)
  const query = params.toString()
  return query ? `${href}?${query}` : href
}
