'use client'

import { useCallback, useEffect, useState } from 'react'
import { useAuth } from '@/components/providers/auth-provider'
import { useExpertApplication } from './use-expert-application'
import { invalidateQueries } from '@/lib/service-apis/query-cache'
import type {
  ExpertApplicationStatus,
  ExpertChangeRequest,
  ExpertMe,
  ExpertProgressSection,
} from './types'

export type ExpertApplicationStage = 'none' | ExpertApplicationStatus

export interface ExpertApplicationStageView {
  status: ExpertApplicationStatus | null
  stage: ExpertApplicationStage
  label: string
  /** null when the CTA is disabled (application pending). */
  href: string | null
  percentComplete: number
  blockers: string[]
  missingSections: ExpertProgressSection[]
  changeRequest: ExpertChangeRequest | null
}

export interface ExpertApplicationStageState extends ExpertApplicationStageView {
  loading: boolean
  expert: ExpertMe | null
  refresh: () => void
}

/** Fired by the wizard after a save or submit so navs and cards refetch. */
export const EXPERT_APPLICATION_CHANGED_EVENT = 'proploy:expert-application-changed'

export function notifyExpertApplicationChanged() {
  if (typeof window === 'undefined') return
  invalidateQueries('auth:/api/v1/experts/me')
  window.dispatchEvent(new Event(EXPERT_APPLICATION_CHANGED_EVENT))
}

const KNOWN_STATUSES: readonly ExpertApplicationStatus[] = [
  'draft',
  'submitted',
  'changes_requested',
  'approved',
  'rejected',
]

function asStatus(value: string | null | undefined): ExpertApplicationStatus | null {
  return (KNOWN_STATUSES as readonly string[]).includes(value ?? '')
    ? (value as ExpertApplicationStatus)
    : null
}

/**
 * The one place the application stage → CTA mapping lives. Both navs and the
 * profile/dashboard nudge card render from this.
 */
export function resolveExpertApplicationStage(expert: ExpertMe | null | undefined): ExpertApplicationStageView {
  const status = asStatus(expert?.status)
  const progress = expert?.progress ?? null
  const percentComplete = Math.max(0, Math.min(100, Math.round(progress?.percentComplete ?? 0)))
  const blockers = progress?.submitBlockers ?? []
  const missingSections = (progress?.sections ?? []).filter((section) => !section.complete)
  const changeRequest = progress?.changeRequests?.[0] ?? null

  const base = { status, percentComplete, blockers, missingSections, changeRequest }

  switch (status) {
    case 'draft':
      return { ...base, stage: 'draft', label: `Complete Your Application (${percentComplete}%)`, href: '/become-expert' }
    case 'changes_requested':
      return { ...base, stage: 'changes_requested', label: 'Changes requested', href: '/become-expert' }
    case 'submitted':
      return { ...base, stage: 'submitted', label: 'Application pending', href: null }
    case 'approved':
      return { ...base, stage: 'approved', label: 'Workspace', href: '/workspace' }
    case 'rejected':
      return { ...base, stage: 'rejected', label: 'Application closed', href: '/become-expert' }
    default:
      return { ...base, stage: 'none', label: 'Join as Expert', href: '/become-expert' }
  }
}

const EMPTY_STAGE = resolveExpertApplicationStage(null)

export interface UseExpertApplicationStageOptions {
  /** Skip the fetch (e.g. chrome that is hidden on the current route). */
  enabled?: boolean
}

export function useExpertApplicationStage(
  options: UseExpertApplicationStageOptions = {},
): ExpertApplicationStageState {
  const enabled = options.enabled ?? true
  const { user, isLoading: authLoading } = useAuth()
  const { getApplication } = useExpertApplication()
  const userId = enabled ? user?.id : undefined
  const [state, setState] = useState<{ userId: string; expert: ExpertMe | null } | null>(null)
  const [version, setVersion] = useState(0)

  const refresh = useCallback(() => setVersion((v) => v + 1), [])

  useEffect(() => {
    if (!userId) return
    const currentUserId = userId
    let cancelled = false

    async function load() {
      const result = await getApplication()
      if (cancelled) return
      setState({ userId: currentUserId, expert: result.ok ? result.data : null })
    }

    void load()
    window.addEventListener(EXPERT_APPLICATION_CHANGED_EVENT, refresh)
    return () => {
      cancelled = true
      window.removeEventListener(EXPERT_APPLICATION_CHANGED_EVENT, refresh)
    }
  }, [getApplication, refresh, userId, version])

  const expert = userId && state?.userId === userId ? state.expert : null
  const view = userId ? resolveExpertApplicationStage(expert) : EMPTY_STAGE
  const loading = authLoading || Boolean(userId && (!state || state.userId !== userId))

  return { ...view, loading, expert, refresh }
}
