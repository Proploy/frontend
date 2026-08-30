/**
 * Expert dashboard hook.
 * Calls service-apis directly from the browser — no Next.js proxy routes.
 *
 * Uses ServiceApisBrowserClient with requireAuth: true.
 */
import { useMemo } from 'react'
import { ServiceApisBrowserClient } from '@/lib/service-apis/browser'
import type { NormalizedError } from '@/lib/service-apis/error-utils'
import type {
  ExpertDashboardResponse,
  ExpertMe,
  ExpertProfilePictureUploadUrlResponse,
  ExpertProfileUpdateRequest,
  ExpertProjectDownloadUrlResponse,
  ExpertLinkInput,
  ExpertProjectInput,
  ApplicationDocumentUploadResponse,
  ExpertProjectFileUploadResponse,
} from '@/features/experts/types'

const client = new ServiceApisBrowserClient()
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

export type UpdateProfileResult = { ok: true; data: ExpertMe } | NormalizedError
export type AddLinkResult = { ok: true; data: Record<string, unknown> } | NormalizedError
export type DeleteLinkResult = { ok: true; data: Record<string, unknown> } | NormalizedError
export type AddProjectResult = { ok: true; data: Record<string, unknown> } | NormalizedError
export type UpdateProjectResult = { ok: true; data: Record<string, unknown> } | NormalizedError
export type DeleteProjectResult = { ok: true; data: Record<string, unknown> } | NormalizedError
export type UploadApplicationDocumentResult = { ok: true; data: ApplicationDocumentUploadResponse } | NormalizedError
export type UploadProjectFileResult = { ok: true; data: ExpertProjectFileUploadResponse } | NormalizedError

/**
 * PATCH /api/v1/experts/me/profile
 */
async function updateProfile(payload: ExpertProfileUpdateRequest): Promise<UpdateProfileResult> {
  const result = await client.patch<ExpertMe>('/api/v1/experts/me/profile', payload, {
    requireAuth: true,
  })
  if (!result.ok) return result
  return { ok: true, data: result.data }
}

/**
 * POST /api/v1/experts/me/links
 */
async function addLink(payload: ExpertLinkInput): Promise<AddLinkResult> {
  const result = await client.post<Record<string, unknown>>('/api/v1/experts/me/links', payload, {
    requireAuth: true,
  })
  if (!result.ok) return result
  return { ok: true, data: result.data }
}

/**
 * DELETE /api/v1/experts/me/links/{linkId}
 */
async function deleteLink(linkId: string): Promise<DeleteLinkResult> {
  const result = await client.delete<Record<string, unknown>>(`/api/v1/experts/me/links/${encodeURIComponent(linkId)}`, {
    requireAuth: true,
  })
  if (!result.ok) return result
  return { ok: true, data: result.data }
}

/**
 * POST /api/v1/experts/me/projects
 */
async function addProject(payload: ExpertProjectInput): Promise<AddProjectResult> {
  const result = await client.post<Record<string, unknown>>('/api/v1/experts/me/projects', payload, {
    requireAuth: true,
  })
  if (!result.ok) return result
  return { ok: true, data: result.data }
}

/**
 * PATCH /api/v1/experts/me/projects/{projectId}
 */
async function updateProject(projectId: string, payload: ExpertProjectInput): Promise<UpdateProjectResult> {
  const result = await client.patch<Record<string, unknown>>(`/api/v1/experts/me/projects/${encodeURIComponent(projectId)}`, payload, {
    requireAuth: true,
  })
  if (!result.ok) return result
  return { ok: true, data: result.data }
}

/**
 * DELETE /api/v1/experts/me/projects/{projectId}
 */
async function deleteProject(projectId: string): Promise<DeleteProjectResult> {
  const result = await client.delete<Record<string, unknown>>(`/api/v1/experts/me/projects/${encodeURIComponent(projectId)}`, {
    requireAuth: true,
  })
  if (!result.ok) return result
  return { ok: true, data: result.data }
}

/**
 * POST /api/v1/experts/me/application/document-upload
 */
async function uploadApplicationDocument(documentType: string, file: File): Promise<UploadApplicationDocumentResult> {
  const result = await client.postBinary<ApplicationDocumentUploadResponse>(
    `/api/v1/experts/me/application/document-upload?documentType=${encodeURIComponent(documentType)}&filename=${encodeURIComponent(file.name)}`,
    file,
    { requireAuth: true }
  )
  if (!result.ok) return result
  return { ok: true, data: result.data }
}

/**
 * POST /api/v1/experts/me/projects/{projectId}/file
 */
async function uploadProjectFile(projectId: string, file: File): Promise<UploadProjectFileResult> {
  const result = await client.postBinary<ExpertProjectFileUploadResponse>(
    `/api/v1/experts/me/projects/${encodeURIComponent(projectId)}/file?filename=${encodeURIComponent(file.name)}`,
    file,
    { requireAuth: true }
  )
  if (!result.ok) return result
  return { ok: true, data: result.data }
}

export const useExpertDashboard = () => useMemo(() => ({
  getDashboard,
  getProjectFileDownloadUrl,
  getProfilePictureUploadUrl,
  saveProfilePicture,
  updateProfile,
  addLink,
  deleteLink,
  addProject,
  updateProject,
  deleteProject,
  uploadApplicationDocument,
  uploadProjectFile,
}), [])
