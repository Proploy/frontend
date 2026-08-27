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
export const V2_CHROME_EXACT = [
  '/experts',
  '/for-businesses',
  '/for-experts',
  // Expert category directories (static siblings of /experts/[id])
  '/experts/top',
  '/experts/engineering',
  '/experts/data-ai',
  '/experts/product',
  '/experts/marketing',
  '/experts/finance-ops',
  '/experts/consulting',
] as const
export const V2_CHROME_PREFIXES = [
  '/products',
  // Expert application flow — ships the v2 Nav inside its own .pp-scope.
  '/become-expert',
  '/vendor-onboarding',
  '/product/',
  // Footer-linked v2 pages (app/(site)/(v2)/**)
  '/find-work',
  '/get-discovered',
  '/manage-projects',
  '/sign-contracts',
  '/send-invoices',
  '/payments',
  '/global-payments',
  '/commission',
  '/discover-experts',
  '/post-a-job',
  '/hiring-workspace',
  '/manage-team-projects',
  '/approve-invoices',
  '/proploy-agent',
  '/hiring-calculator',
  '/customers',
  '/guides',
  '/events',
  '/partnerships',
  '/blog',
  '/faqs',
  '/refer',
  '/mission',
  '/careers',
  '/contact',
  '/help',
  '/for-agencies',
  '/for-partners',
  '/for-investors',
  '/legal',
] as const

// Auth-flow routes render a standalone v2 shell (split brand panel + form)
// with no marketing Navbar/Footer around them.
export const AUTH_ROUTES = [
  '/sign-in',
  '/sign-up',
  '/check-email',
  '/email-verified',
  '/forgot-password',
  '/password-reset-confirmation',
  '/reset-password-email',
  '/set-new-password',
  '/verify-email',
] as const

export function isAuthRoute(pathname: string | null | undefined): boolean {
  if (!pathname) return false
  return AUTH_ROUTES.some((p) => pathname === p || pathname.startsWith(`${p}/`))
}

export function isV2ChromeRoute(pathname: string | null | undefined): boolean {
  if (!pathname) return false
  return (
    pathname === '/' ||
    (V2_CHROME_EXACT as readonly string[]).includes(pathname) ||
    V2_CHROME_PREFIXES.some((p) => pathname.startsWith(p))
  )
}

// Portal routes suppress the global chrome because they own their own
// sidebar/shell; the homepage and v2-redesigned routes suppress it because
// they ship the v2 Nav/Footer themselves. Keep this the single source of
// truth for both components.
export function hidesGlobalChrome(pathname: string | null | undefined): boolean {
  return isPortalRoute(pathname) || isV2ChromeRoute(pathname) || isAuthRoute(pathname)
}
