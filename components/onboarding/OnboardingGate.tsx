'use client'

import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import type { ReactNode } from 'react'
import { WorkspaceLoading } from '@/components/workspace/WorkspaceShell'
import { useOnboardingStatus } from '@/features/onboarding'

/**
 * Sends signed-in users who have not been through an onboarding track to
 * /onboarding before they reach the workspace, then back to where they were
 * headed. Signed-out visitors fall through — the workspace pages render their
 * own sign-in state.
 */
export function OnboardingGate({ children }: { children: ReactNode }) {
  const { isPending, isSignedIn, isOnboarded } = useOnboardingStatus()
  const router = useRouter()
  const pathname = usePathname()
  const shouldRedirect = !isPending && isSignedIn && !isOnboarded

  useEffect(() => {
    if (!shouldRedirect) return
    const next = pathname || '/workspace'
    router.replace(`/onboarding?next=${encodeURIComponent(next)}`)
  }, [pathname, router, shouldRedirect])

  // Hold the shell while the redirect lands so the workspace never flashes.
  if (shouldRedirect) return <WorkspaceLoading />

  return <>{children}</>
}
