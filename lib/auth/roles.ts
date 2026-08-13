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
