/**
 * Approved experts hook.
 * Calls service-apis directly from the browser — no Next.js proxy routes.
 *
 * Uses ServiceApisBrowserClient with requireAuth: false (public endpoint).
 */
import { ServiceApisBrowserClient } from '@/lib/service-apis/browser'
import type { NormalizedError } from '@/lib/service-apis/error-utils'
import type { ExpertListItem, ExpertListResponse } from '@/hooks/types/expert-contracts'

const client = new ServiceApisBrowserClient()

export type GetApprovedExpertsResult = { ok: true; data: ExpertListResponse } | NormalizedError

/**
 * GET /api/v1/experts
 */
async function getApprovedExperts(): Promise<GetApprovedExpertsResult> {
  const result = await client.get<ExpertListResponse>('/api/v1/experts', {
    requireAuth: false,
  })
  if (!result.ok) return result
  return { ok: true, data: result.data }
}

export const useApprovedExperts = () => ({
  getApprovedExperts,
})
