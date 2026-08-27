/**
 * Onboarding completion is *inferred*.
 *
 * service-apis has no `onboarding_completed` flag today, so we derive it from
 * signals that only exist once someone has been down one of the two tracks:
 *
 *   expert track → an account role of expert/admin, or an application record
 *                  (any status — a saved draft still means they picked a lane)
 *   buyer  track → interests captured on /api/v1/users/me/interests
 *
 * When a signal cannot be read we deliberately report "onboarded": an
 * unreachable or forbidden API must never trap someone in the onboarding flow
 * instead of their workspace.
 */

export type OnboardingInterests = {
  industries?: string[] | null
  platforms?: string[] | null
  project_types?: string[] | null
  company_sizes?: string[] | null
} | null | undefined

export type OnboardingSignals = {
  role?: string | null
  hasExpertApplication: boolean
  interests: OnboardingInterests
  /** A signal request failed — fail open rather than gate. */
  signalsUnavailable?: boolean
}

export function hasCapturedInterests(interests: OnboardingInterests): boolean {
  if (!interests) return false
  return [
    interests.industries,
    interests.platforms,
    interests.project_types,
    interests.company_sizes,
  ].some((list) => Array.isArray(list) && list.length > 0)
}

export function isOnboarded(signals: OnboardingSignals): boolean {
  if (signals.signalsUnavailable) return true
  if (signals.role === 'expert' || signals.role === 'admin') return true
  if (signals.hasExpertApplication) return true
  return hasCapturedInterests(signals.interests)
}
