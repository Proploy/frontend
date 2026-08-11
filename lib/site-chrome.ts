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

// The homepage ("/") now uses the established global marketing Navbar/Footer
// (single navbar across the site) instead of its own. Portal routes suppress
// the global chrome because they own their own sidebar/shell. Keep this the
// single source of truth for both components.
export function hidesGlobalChrome(pathname: string | null | undefined): boolean {
  return isPortalRoute(pathname)
}
