/**
 * Public expert profile hook.
 * Calls service-apis directly from the browser — no Next.js proxy routes.
 */
import { ServiceApisBrowserClient } from '@/lib/service-apis/browser'
import type { NormalizedError } from '@/lib/service-apis/error-utils'
import type { ExpertProjectDownloadUrlResponse, ExpertPublic } from '@/hooks/types/expert-contracts'

const client = new ServiceApisBrowserClient()

export type GetExpertProfileResult = { ok: true; data: ExpertPublic } | NormalizedError
export type GetPublicProjectFileDownloadUrlResult = { ok: true; data: ExpertProjectDownloadUrlResponse } | NormalizedError

async function getExpertProfile(expertId: string): Promise<GetExpertProfileResult> {
  const result = await client.get<ExpertPublic>(
    `/api/v1/experts/${encodeURIComponent(expertId)}`,
    { requireAuth: false },
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
})
