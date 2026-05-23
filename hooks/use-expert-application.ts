/**
 * Expert onboarding application hook.
 * Calls service-apis directly from the browser — no Next.js proxy routes.
 *
 * Uses ServiceApisBrowserClient with requireAuth: true for all calls.
 * Discriminated union result style: { ok: true, data: T } | NormalizedError
 */

import { ServiceApisBrowserClient } from '@/lib/service-apis/browser'
import type { NormalizedError } from '@/lib/service-apis/error-utils'
import type {
  ExpertApplyRequest,
  ExpertSubmitRequest,
  ExpertMe,
  ExpertProjectUploadUrlResponse,
  ExpertProjectDownloadUrlResponse,
} from '@/hooks/types/expert-contracts'

const client = new ServiceApisBrowserClient()
let inFlightApplicationRequest: Promise<GetApplicationResult> | null = null

export type GetApplicationResult = { ok: true; data: ExpertMe | null } | NormalizedError
export type CreateApplicationResult = { ok: true; data: ExpertMe } | NormalizedError
export type SubmitApplicationResult = { ok: true; data: ExpertMe } | NormalizedError
export type GetUploadUrlResult = { ok: true; data: ExpertProjectUploadUrlResponse } | NormalizedError
export type GetDownloadUrlResult = { ok: true; data: ExpertProjectDownloadUrlResponse } | NormalizedError

/**
 * GET /api/v1/experts/me/application
 * 404 → no draft exists yet → return null data (not a fatal error).
 */
async function getApplication(): Promise<GetApplicationResult> {
  if (inFlightApplicationRequest) return inFlightApplicationRequest

  inFlightApplicationRequest = (async () => {
    const result = await client.get<ExpertMe>('/api/v1/experts/me/application', {
      requireAuth: true,
    })

    if (!result.ok) {
      if (result.status === 404) {
        // No draft exists yet
        return { ok: true, data: null }
      }
      return result
    }

    return { ok: true, data: result.data }
  })()

  try {
    return await inFlightApplicationRequest
  } finally {
    inFlightApplicationRequest = null
  }
}

/**
 * POST /api/v1/experts/apply
 * Create the first draft application for the current user.
 */
async function createApplication(payload: ExpertApplyRequest): Promise<CreateApplicationResult> {
  const result = await client.post<ExpertMe>('/api/v1/experts/apply', payload, {
    requireAuth: true,
  })

  if (!result.ok) return result
  return { ok: true, data: result.data }
}

/**
 * POST /api/v1/experts/me/application/submit
 * Submit the application. On validation error, result.error.fields contains
 * field-level error messages keyed by field name.
 */
async function submitApplication(
  payload: ExpertSubmitRequest,
): Promise<SubmitApplicationResult> {
  const result = await client.post<ExpertMe>(
    '/api/v1/experts/me/application/submit',
    payload,
    { requireAuth: true },
  )

  if (!result.ok) return result
  return { ok: true, data: result.data }
}

/**
 * POST /api/v1/experts/me/application/project-file-upload-url
 * Get a signed URL to upload a project document file directly to S3.
 */
async function getProjectFileUploadUrl(
  clientProjectId: string,
  filename: string,
  contentType: string,
  fileSizeBytes: number,
): Promise<GetUploadUrlResult> {
  const result = await client.post<ExpertProjectUploadUrlResponse>(
    '/api/v1/experts/me/application/project-file-upload-url',
    { clientProjectId, filename, contentType, fileSizeBytes },
    { requireAuth: true },
  )

  if (!result.ok) return result
  return { ok: true, data: result.data }
}

/**
 * Upload a file directly to a pre-signed S3 URL.
 * No auth headers needed — URL contains embedded credentials.
 */
async function uploadProjectFileToSignedUrl(
  uploadUrl: string,
  file: File,
): Promise<void> {
  const res = await fetch(uploadUrl, {
    method: 'PUT',
    body: file,
    headers: { 'content-type': file.type },
  })
  if (!res.ok) {
    throw new Error(`Upload failed: ${res.status} ${res.statusText}`)
  }
}

/**
 * POST /api/v1/experts/me/projects/{projectId}/file-download-url
 * Get a signed URL to download a project document file.
 */
async function getProjectFileDownloadUrl(
  projectId: string,
): Promise<GetDownloadUrlResult> {
  const result = await client.post<ExpertProjectDownloadUrlResponse>(
    `/api/v1/experts/me/projects/${encodeURIComponent(projectId)}/file-download-url`,
    undefined,
    { requireAuth: true },
  )

  if (!result.ok) return result
  return { ok: true, data: result.data }
}

export const useExpertApplication = () => ({
  getApplication,
  createApplication,
  submitApplication,
  getProjectFileUploadUrl,
  uploadProjectFileToSignedUrl,
  getProjectFileDownloadUrl,
})
