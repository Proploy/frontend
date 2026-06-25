/**
 * Workspace dashboard hook.
 *
 * Mirrors features/experts/use-expert-dashboard.ts: a useMemo-wrapped object
 * of async functions, calling service-apis directly from the browser.
 *
 * The hook is the *only* data source the workspace UI imports. Pages do not
 * call service-apis directly.
 */

import { useMemo } from 'react'
import { ServiceApisBrowserClient } from '@/lib/service-apis/browser'
import type { NormalizedError } from '@/lib/service-apis/error-utils'
import type { WorkspaceDashboardResponse } from '@/features/workspace/types'

const client = new ServiceApisBrowserClient()
const WORKSPACE_DASHBOARD_PATH = '/api/v1/workspace/me/dashboard'
let inFlightDashboardRequest: Promise<GetDashboardResult> | null = null

export type GetDashboardResult =
  | { ok: true; data: WorkspaceDashboardResponse }
  | NormalizedError

/**
 * GET /api/v1/workspace/me/dashboard
 */
async function getDashboard(): Promise<GetDashboardResult> {
  if (inFlightDashboardRequest) return inFlightDashboardRequest

  inFlightDashboardRequest = (async () => {
    const result = await client.get<WorkspaceDashboardResponse>(WORKSPACE_DASHBOARD_PATH, {
      requireAuth: true,
    })
    if (!result.ok) {
      if (process.env.NODE_ENV === 'development') {
        const baseUrl = process.env.NEXT_PUBLIC_SERVICE_APIS_URL?.replace(/\/$/, '')
        console.error('[workspace] dashboard request failed', {
          url: baseUrl ? `${baseUrl}${WORKSPACE_DASHBOARD_PATH}` : WORKSPACE_DASHBOARD_PATH,
          error: result,
        })
      }
      return result
    }
    return { ok: true, data: result.data }
  })()

  try {
    return await inFlightDashboardRequest
  } finally {
    inFlightDashboardRequest = null
  }
}

export const useDashboard = () =>
  useMemo(
    () => ({
      getDashboard,
    }),
    [],
  )
