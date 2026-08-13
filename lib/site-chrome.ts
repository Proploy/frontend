// Internal portal route prefixes that own their own chrome (sidebar/shell) and
// therefore suppress the global marketing Navbar and Footer. Single source of
// truth shared by components/Navbar.tsx and components/SiteFooter.tsx so the two
// never disagree about where marketing chrome should appear.
export const PORTAL_PREFIXES = [
  '/workspace',
  '/AI_workspace',
  '/ai_workspace',
  '/experts/dashboard',
  '/experts/account',
  '/experts/chat',
  '/expert/dashboard',
  '/business/dashboard',
] as const

export function isPortalRoute(pathname: string | null | undefined): boolean {
  if (!pathname) return false
  return PORTAL_PREFIXES.some((p) => pathname.startsWith(p))
}

// Routes redesigned onto the v2 design system ship their own chrome
// (components/site/Nav + Footer inside a .pp-scope wrapper), so the global
// marketing Navbar/Footer must be suppressed there. /experts/[id] intentionally
// keeps the legacy chrome until that page is redesigned, hence exact matches
// for /experts rather than a prefix.
export const V2_CHROME_EXACT = ['/experts', '/for-businesses', '/for-experts'] as const
export const V2_CHROME_PREFIXES = ['/products', '/product/'] as const

export function isV2ChromeRoute(pathname: string | null | undefined): boolean {
  if (!pathname) return false
  return (
    (V2_CHROME_EXACT as readonly string[]).includes(pathname) ||
    V2_CHROME_PREFIXES.some((p) => pathname.startsWith(p))
  )
}

// The homepage ("/") uses the established global marketing Navbar/Footer.
// Portal routes suppress the global chrome because they own their own
// sidebar/shell; v2-redesigned routes suppress it because they ship the v2
// Nav/Footer themselves. Keep this the single source of truth for both
// components.
export function hidesGlobalChrome(pathname: string | null | undefined): boolean {
  return isPortalRoute(pathname) || isV2ChromeRoute(pathname)
}
