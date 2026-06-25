/**
 * Derives the current user's workspace role from a single dashboard fetch.
 *
 * Mirrors the pattern in components/experts/dashboard/ExpertDashboardFrame.tsx
 * useExpertDashboardData: a useEffect that fires the fetch once auth is ready,
 * exposes { user, dashboard, dashboardError, isPending } so pages can render
 * loading/error/empty states without re-implementing the fetch lifecycle.
 *
 * Role source: the `scope` field on the dashboard response. The backend
 * derives role server-side (e.g. from the engagements the user participates
 * in). The frontend never infers role from auth metadata.
 */

'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/components/providers/auth-provider'
import { useDashboard } from '@/features/workspace/use-dashboard'
import type { NormalizedError } from '@/lib/service-apis/error-utils'
import type {
  WorkspaceDashboardResponse,
  WorkspaceRole,
} from '@/features/workspace/types'

export type WorkspaceRoleState = {
  user: ReturnType<typeof useAuth>['user']
  dashboard: WorkspaceDashboardResponse | null
  role: WorkspaceRole | null
  dashboardError: NormalizedError | null
  isPending: boolean
}

export function useCurrentUserRole(): WorkspaceRoleState {
  const { user, isLoading: isAuthLoading } = useAuth()
  const { getDashboard } = useDashboard()
  const [dashboard, setDashboard] = useState<WorkspaceDashboardResponse | null>(null)
  const [dashboardError, setDashboardError] = useState<NormalizedError | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (isAuthLoading) return
    if (!user) return

    let cancelled = false

    async function fetchDashboard() {
      setIsLoading(true)
      setDashboardError(null)
      const result = await getDashboard()

      if (cancelled) return

      if (result.ok) {
        setDashboard(result.data)
      } else {
        setDashboard(null)
        setDashboardError(result)
      }
      setIsLoading(false)
    }

    void fetchDashboard()

    return () => {
      cancelled = true
    }
  }, [getDashboard, isAuthLoading, user])

  return {
    user,
    dashboard,
    role: dashboard?.scope ?? null,
    dashboardError,
    isPending:
      isAuthLoading ||
      isLoading ||
      Boolean(user && !dashboard && !dashboardError),
  }
}
