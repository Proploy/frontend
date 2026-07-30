// Internal portal route prefixes that own their own chrome (sidebar/shell) and
// therefore suppress the global marketing Navbar and Footer. Single source of
// truth shared by components/Navbar.tsx and components/SiteFooter.tsx so the two
// never disagree about where marketing chrome should appear.
export const PORTAL_PREFIXES = [
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

// The homepage ("/") ships its own marketing Nav + Footer as part of the new
// design system, so the global marketing Navbar and SiteFooter must not render
// there (they would double up). Portal routes suppress the global chrome for the
// same reason. Keep this the single source of truth for both components.
export function hidesGlobalChrome(pathname: string | null | undefined): boolean {
  return pathname === '/' || isPortalRoute(pathname)
}
