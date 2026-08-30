// Shared active-route matching for the v2 site chrome (components/site/Nav and
// components/site/Footer). Both surfaces highlight the link for the page the
// visitor is currently on, so the matching rules live in one place rather than
// drifting apart between the header and the footer.

function normalize(path: string): string {
  const withoutQuery = path.split(/[?#]/)[0] ?? ''
  const lower = withoutQuery.toLowerCase()
  // Route casing is inconsistent across the app (/AI_workspace vs
  // /ai_workspace), so matching is case-insensitive; trailing slashes are
  // stripped so "/blog" and "/blog/" are the same destination.
  return lower.length > 1 && lower.endsWith('/') ? lower.slice(0, -1) : lower
}

function isInternal(href: string): boolean {
  return href.startsWith('/')
}

/**
 * True when `href` is the current page, or an ancestor section of it
 * (/experts matches /experts/engineering). External and anchor hrefs never
 * match. "/" only ever matches "/" — otherwise it would match everything.
 */
export function matchesPath(pathname: string | null | undefined, href: string): boolean {
  if (!pathname || !isInternal(href)) return false
  const current = normalize(pathname)
  const target = normalize(href)
  if (target === '/') return current === '/'
  return current === target || current.startsWith(`${target}/`)
}

/**
 * Longest match wins within a set of links. The footer lists both
 * "Explore all experts" (/experts) and "Engineering" (/experts/engineering),
 * and on the latter page only the more specific link should light up.
 * Returns the winning href, or null when nothing in the set matches.
 */
export function activeHref(
  pathname: string | null | undefined,
  hrefs: readonly string[],
): string | null {
  let best: string | null = null
  for (const href of hrefs) {
    if (!matchesPath(pathname, href)) continue
    if (best === null || normalize(href).length > normalize(best).length) best = href
  }
  return best
}
