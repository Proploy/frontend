'use client'

import { useEffect, useState } from 'react'
import { createContext, createElement, useContext } from 'react'
import type { ReactNode } from 'react'
import { useAuth } from '@/components/providers/auth-provider'
import { useExpertApplication } from '@/features/experts'
import type { ExpertMe } from '@/features/experts/types'
import type { NormalizedError } from '@/lib/service-apis/error-utils'
import type { WorkspaceRole } from '@/features/workspace/types'

export type WorkspaceRoleState = {
  user: ReturnType<typeof useAuth>['user']
  role: WorkspaceRole | null
  expert: ExpertMe | null
  expertError: NormalizedError | null
  isPending: boolean
}

const WorkspaceRoleContext = createContext<WorkspaceRoleState | null>(null)

function toWorkspaceRole(role?: string | null): WorkspaceRole | null {
  if (role === 'expert' || role === 'admin') return role
  if (role === 'user' || role === 'business') return 'buyer'
  return null
}

function useResolvedWorkspaceRole(): WorkspaceRoleState {
  const { user, isLoading: isAuthLoading } = useAuth()
  const { getApplication } = useExpertApplication()
  const currentUserId = user?.id ?? null
  const [expert, setExpert] = useState<ExpertMe | null>(null)
  const [expertUserId, setExpertUserId] = useState<string | null>(null)
  const [expertError, setExpertError] = useState<NormalizedError | null>(null)
  const [isExpertLoading, setIsExpertLoading] = useState(false)

  useEffect(() => {
    if (isAuthLoading) return
    if (!currentUserId) return

    let cancelled = false

    async function loadExpert() {
      setIsExpertLoading(true)
      setExpertError(null)
      const result = await getApplication()
      if (cancelled) return

      if (result.ok) {
        setExpert(result.data?.status === 'approved' ? result.data : null)
        setExpertUserId(currentUserId)
      } else {
        setExpert(null)
        setExpertUserId(currentUserId)
        setExpertError(result)
      }
      setIsExpertLoading(false)
    }

    void loadExpert()

    return () => {
      cancelled = true
    }
  }, [currentUserId, getApplication, isAuthLoading])

  const expertForUser = currentUserId && expertUserId === currentUserId ? expert : null
  const expertErrorForUser = currentUserId && expertUserId === currentUserId ? expertError : null
  const hasResolvedExpertLookup = !currentUserId || expertUserId === currentUserId
  const fallbackRole = toWorkspaceRole(user?.role)
  // The authenticated user's server-supplied role is authoritative. An
  // approved expert profile is useful profile data, but it must not promote a
  // buyer into the expert workspace while the account role is stale or
  // malformed; the API enforces the same distinction server-side.
  const role: WorkspaceRole | null = fallbackRole

  return {
    user,
    role,
    expert: expertForUser,
    expertError: expertErrorForUser,
    isPending: isAuthLoading || Boolean(user && (!hasResolvedExpertLookup || isExpertLoading)),
  }
}

/**
 * Keep role resolution alive for the entire workspace route tree. Without
 * this provider, every sidebar navigation remounts the expert lookup and the
 * loading shell briefly renders the buyer-safe navigation.
 */
export function WorkspaceRoleProvider({ children }: { children: ReactNode }) {
  const state = useResolvedWorkspaceRole()
  return createElement(
    WorkspaceRoleContext.Provider,
    { value: state },
    children,
  )
}

/** Role state shared by pages below WorkspaceRoleProvider. */
export function useCurrentUserRole(): WorkspaceRoleState {
  const state = useContext(WorkspaceRoleContext)
  if (!state) {
    throw new Error('useCurrentUserRole must be used inside WorkspaceRoleProvider')
  }
  return state
}

/** Role state for public/non-workspace surfaces that do not use the provider. */
export function useStandaloneCurrentUserRole(): WorkspaceRoleState {
  return useResolvedWorkspaceRole()
}
