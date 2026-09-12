import { sanitizeRedirectPath } from './auth-redirect'

/**
 * Which brand panel the auth pages show on the left.
 *
 * Users arrive at `/sign-in` from three gated entry points, and the panel is
 * meant to reflect the one they came from rather than pitch the marketplace
 * generically. The destination they were reaching for is already on the URL
 * in every case (`proxy.ts` sets it when it gates a route, and the CTAs that
 * gate themselves set it too), so the variant is derived from that instead of
 * threading a new `?intent=` parameter through every call site.
 */
export type AuthPanelVariant =
  | 'default'
  | 'ask-sam'
  | 'become-expert'
  | 'browse-experts'

/**
 * Expert-side routes that live under `/experts` but belong to people who are
 * already approved experts. Someone bounced off their own dashboard is not
 * shopping for a specialist, so they get the default panel, not the directory
 * pitch. Checked before `VARIANT_ROUTES` because `/experts` would match them.
 */
const EXPERT_ACCOUNT_ROUTES = ['/experts/dashboard', '/experts/account', '/experts/chat']

/** First matching entry wins, so order is significant. */
const VARIANT_ROUTES: ReadonlyArray<readonly [AuthPanelVariant, readonly string[]]> = [
  ['ask-sam', ['/ai_workspace', '/workspace']],
  ['become-expert', ['/become-expert']],
  ['browse-experts', ['/experts', '/explore-experts']],
]

/** Path portion only, lowercased and without a trailing slash, for matching. */
function toMatchablePath(value: string): string {
  const path = value.split(/[?#]/)[0]
  return path.toLowerCase().replace(/\/+$/, '') || '/'
}

function isUnder(path: string, prefix: string): boolean {
  return path === prefix || path.startsWith(`${prefix}/`)
}

export function resolveAuthPanelVariant(
  redirectTo: string | null | undefined,
): AuthPanelVariant {
  const safe = sanitizeRedirectPath(redirectTo)
  if (!safe) return 'default'

  // `/AI_workspace` is mixed-case on disk but reachable in other casings, so
  // matching is case-insensitive. See `lib/nav-active.ts` for the same note.
  const path = toMatchablePath(safe)

  if (EXPERT_ACCOUNT_ROUTES.some((route) => isUnder(path, route))) return 'default'

  for (const [variant, prefixes] of VARIANT_ROUTES) {
    if (prefixes.some((prefix) => isUnder(path, prefix))) return variant
  }

  return 'default'
}
