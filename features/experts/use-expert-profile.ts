/**
 * Public expert profile hook.
 * Calls service-apis directly from the browser — no Next.js proxy routes.
 */
import { ServiceApisBrowserClient } from '@/lib/service-apis/browser'
import type { NormalizedError } from '@/lib/service-apis/error-utils'
import type { ExpertProjectDownloadUrlResponse, ExpertPublic, ExpertSummaryResponse } from '@/features/experts/types'

const client = new ServiceApisBrowserClient()

export type GetExpertProfileResult = { ok: true; data: ExpertPublic } | NormalizedError
export type GetPublicProjectFileDownloadUrlResult = { ok: true; data: ExpertProjectDownloadUrlResponse } | NormalizedError
export type GetExpertsSummaryResult = { ok: true; data: ExpertSummaryResponse } | NormalizedError

async function getExpertProfile(expertId: string): Promise<GetExpertProfileResult> {
  const result = await client.get<ExpertPublic>(
    `/api/v1/experts/${encodeURIComponent(expertId)}`,
    { requireAuth: false, readCache: { ttlMs: 5 * 60_000, staleMs: 5 * 60_000, persist: true } },
  )

  if (!result.ok) return result
  return { ok: true, data: result.data }
}

/** Batch name+picture lookup for card lists (e.g. recently-viewed experts). Max 50 ids. */
async function getExpertsSummary(expertIds: string[]): Promise<GetExpertsSummaryResult> {
  if (expertIds.length === 0) return { ok: true, data: { results: [] } }
  const query = expertIds.map((id) => `ids=${encodeURIComponent(id)}`).join('&')
  const result = await client.get<ExpertSummaryResponse>(
    `/api/v1/experts/summary?${query}`,
    { requireAuth: false, readCache: { ttlMs: 5 * 60_000, staleMs: 5 * 60_000, persist: true } },
  )

  if (!result.ok) return result
  return { ok: true, data: result.data }
}

async function getProjectFileDownloadUrl(
  expertId: string,
  projectId: string,
): Promise<GetPublicProjectFileDownloadUrlResult> {
  const result = await client.post<ExpertProjectDownloadUrlResponse>(
    `/api/v1/experts/${encodeURIComponent(expertId)}/projects/${encodeURIComponent(projectId)}/file-download-url`,
    undefined,
    { requireAuth: false },
  )

  if (!result.ok) return result
  return { ok: true, data: result.data }
}

export const useExpertProfile = () => ({
  getExpertProfile,
  getProjectFileDownloadUrl,
  getExpertsSummary,
})
