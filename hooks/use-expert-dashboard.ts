/**
 * Expert dashboard hook.
 * Calls service-apis directly from the browser — no Next.js proxy routes.
 *
 * Uses ServiceApisBrowserClient with requireAuth: true.
 */
import { useMemo } from 'react'
import { ServiceApisBrowserClient } from '@/lib/service-apis/browser'
import { createClient } from '@/lib/supabase/client'
import type { NormalizedError } from '@/lib/service-apis/error-utils'
import type {
  ExpertDashboardResponse,
  ExpertMe,
  ExpertProfilePictureUploadUrlResponse,
  ExpertProfileUpdateRequest,
  ExpertProjectDownloadUrlResponse,
} from '@/hooks/types/expert-contracts'

const client = new ServiceApisBrowserClient()
const PROFILE_PICTURE_BUCKET = 'expert-pictures'
let inFlightDashboardRequest: Promise<GetDashboardResult> | null = null

export type GetDashboardResult = { ok: true; data: ExpertDashboardResponse } | NormalizedError
export type GetDownloadUrlResult = { ok: true; data: ExpertProjectDownloadUrlResponse } | NormalizedError
export type GetProfilePictureUploadUrlResult = { ok: true; data: ExpertProfilePictureUploadUrlResponse } | NormalizedError
export type SaveProfilePictureResult = { ok: true; data: ExpertMe } | NormalizedError

/**
 * GET /api/v1/experts/me/dashboard
 */
async function getDashboard(): Promise<GetDashboardResult> {
  if (inFlightDashboardRequest) return inFlightDashboardRequest

  inFlightDashboardRequest = (async () => {
    const result = await client.get<ExpertDashboardResponse>('/api/v1/experts/me/dashboard', {
      requireAuth: true,
    })
    if (!result.ok) return result
    return { ok: true, data: result.data }
  })()

  try {
    return await inFlightDashboardRequest
  } finally {
    inFlightDashboardRequest = null
  }
}

/**
 * POST /api/v1/experts/me/projects/{projectId}/file-download-url
 */
async function getProjectFileDownloadUrl(projectId: string): Promise<GetDownloadUrlResult> {
  const result = await client.post<ExpertProjectDownloadUrlResponse>(
    `/api/v1/experts/me/projects/${encodeURIComponent(projectId)}/file-download-url`,
    undefined,
    { requireAuth: true },
  )
  if (!result.ok) return result
  return { ok: true, data: result.data }
}

/**
 * POST /api/v1/experts/me/profile-picture-url
 */
async function getProfilePictureUploadUrl(
  filename: string,
  contentType: string,
): Promise<GetProfilePictureUploadUrlResult> {
  const result = await client.post<ExpertProfilePictureUploadUrlResponse>(
    '/api/v1/experts/me/profile-picture-url',
    { filename, content_type: contentType },
    { requireAuth: true },
  )
  if (!result.ok) return result
  return { ok: true, data: result.data }
}

async function uploadProfilePictureToSignedUrl(uploadUrl: string, file: File): Promise<void> {
  const response = await fetch(uploadUrl, {
    method: 'PUT',
    body: file,
    headers: { 'content-type': file.type || 'application/octet-stream' },
  })
  if (!response.ok) {
    throw new Error(`Upload failed: ${response.status} ${response.statusText}`)
  }
}

function getProfilePicturePublicUrl(storageKey: string) {
  const supabase = createClient()
  return supabase.storage.from(PROFILE_PICTURE_BUCKET).getPublicUrl(storageKey).data.publicUrl
}

/**
 * PATCH /api/v1/experts/me/profile-picture
 */
async function saveProfilePicture(
  payload: Pick<ExpertProfileUpdateRequest, 'profilePictureUrl' | 'profilePictureKey'>,
): Promise<SaveProfilePictureResult> {
  const result = await client.patch<ExpertMe>('/api/v1/experts/me/profile-picture', payload, {
    requireAuth: true,
  })
  if (!result.ok) return result
  return { ok: true, data: result.data }
}

export const useExpertDashboard = () => useMemo(() => ({
  getDashboard,
  getProjectFileDownloadUrl,
  getProfilePictureUploadUrl,
  getProfilePicturePublicUrl,
  saveProfilePicture,
  uploadProfilePictureToSignedUrl,
}), [])
