// Routes that require a signed-in user. `proxy.ts` redirects anonymous
// visitors away from them, and UI meant only for public pages (the feedback
// tab) hides on them, so the two cannot disagree about what "public" means.

const PROTECTED_PREFIXES = [
  '/become-expert',
  '/expert-dashboard',
  '/dashboard',
  '/workspace',
  '/onboarding',
  '/favorites',
  '/profile',
  '/AI_workspace',
]

// Public expert-directory category pages (footer links) — static marketing
// routes that live alongside the auth-gated /experts/[id] profiles.
const PUBLIC_EXPERT_CATEGORY_ROUTES = [
  '/experts/top',
  '/experts/engineering',
  '/experts/data-ai',
  '/experts/product',
  '/experts/marketing',
  '/experts/finance-ops',
  '/experts/consulting',
]

function isProtectedExpertRoute(pathname: string) {
  if (pathname.startsWith('/experts/dashboard') || pathname.startsWith('/experts/account') || pathname.startsWith('/experts/chat')) {
    return true
  }

  if (PUBLIC_EXPERT_CATEGORY_ROUTES.includes(pathname)) {
    return false
  }

  return pathname.startsWith('/experts/')
}

export function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_PREFIXES.some(prefix => pathname.startsWith(prefix)) || isProtectedExpertRoute(pathname)
}
