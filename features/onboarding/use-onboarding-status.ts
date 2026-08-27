'use client'

import { useCallback, useEffect, useState } from 'react'
import { useAuth } from '@/components/providers/auth-provider'
import { useExpertApplication } from '@/features/experts'
import { getInterests } from './client'
import { isOnboarded, type OnboardingInterests } from './status'

export type OnboardingStatusState = {
  /** Auth or the signal lookups are still resolving — decide nothing yet. */
  isPending: boolean
  isSignedIn: boolean
  /** Meaningless while `isPending`; defaults to true so nothing gates early. */
  isOnboarded: boolean
}

/**
 * Resolves whether the signed-in user has been through an onboarding track.
 * See features/onboarding/status.ts for how completion is inferred.
 */
export function useOnboardingStatus(): OnboardingStatusState {
  const { user, isLoading: isAuthLoading } = useAuth()
  const { getApplication } = useExpertApplication()
  const userId = user?.id ?? null
  const role = user?.role ?? null
  const [resolved, setResolved] = useState<{ userId: string; onboarded: boolean } | null>(null)

  const resolve = useCallback(async (currentUserId: string) => {
    const [application, interests] = await Promise.all([getApplication(), getInterests()])

    return {
      userId: currentUserId,
      onboarded: isOnboarded({
        role,
        hasExpertApplication: application.ok && application.data !== null,
        interests: (interests.ok ? interests.data : null) as OnboardingInterests,
        signalsUnavailable: !application.ok || !interests.ok,
      }),
    }
  }, [getApplication, role])

  useEffect(() => {
    if (isAuthLoading || !userId) return

    let cancelled = false
    void resolve(userId).then((next) => {
      if (!cancelled) setResolved(next)
    })

    return () => {
      cancelled = true
    }
  }, [isAuthLoading, resolve, userId])

  const resolvedForUser = resolved && resolved.userId === userId ? resolved : null

  return {
    isPending: isAuthLoading || Boolean(userId && !resolvedForUser),
    isSignedIn: Boolean(userId),
    isOnboarded: resolvedForUser ? resolvedForUser.onboarded : true,
  }
}
