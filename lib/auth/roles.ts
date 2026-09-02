/** Account roles are returned by service-apis during auth sync. */
export type AccountRole = 'user' | 'expert' | 'business' | 'admin' | string

export function isExpertRole(role?: string | null): boolean {
  return role === 'expert'
}

/**
 * The expert application CTA is for visitors and regular user accounts.
 * Approved experts and administrators should not be offered the CTA.
 */
export function canSeeExpertJoinLink(
  role: string | null | undefined,
  isAuthenticated: boolean,
): boolean {
  return !isAuthenticated || role === 'user'
}

/**
 * Sam (the `/AI_workspace` agent) is a buyer tool, so approved experts are
 * kept out of it. A pending, rejected or withdrawn application is still a
 * buyer, so only an `expert` account role — which service-apis sets on
 * approval — or an approved expert record counts as restricted.
 *
 * The public `/ask-sam` page that describes Sam stays visible to everyone;
 * this rule guards the workspace route and the CTAs that lead into it.
 */
export function isRestrictedFromSam(
  role: string | null | undefined,
  expertStatus?: string | null,
): boolean {
  return isExpertRole(role) || expertStatus === 'approved'
}
