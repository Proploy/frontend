import { ServiceApisBrowserClient } from '@/lib/service-apis/browser'
import type { NormalizedError } from '@/lib/service-apis/error-utils'
import type {
  ApplicationDocumentType,
  ApplicationDocumentUploadResponse,
  ExpertDraftRequest,
  ExpertMe,
  ExpertProjectFileUploadResponse,
  ExpertProjectDownloadUrlResponse,
} from '@/features/experts/types'

const client = new ServiceApisBrowserClient()
let inFlightApplicationRequest: Promise<GetApplicationResult> | null = null


export const MAX_PROJECT_FILE_SIZE_BYTES = 5 * 1024 * 1024
export const MAX_PORTFOLIO_FILE_SIZE_BYTES = 25 * 1024 * 1024
export const MAX_CERTIFICATION_FILE_SIZE_BYTES = 25 * 1024 * 1024
export const MAX_INTRO_VIDEO_SIZE_BYTES = 200 * 1024 * 1024

export type GetApplicationResult = { ok: true; data: ExpertMe | null } | NormalizedError
export type SaveApplicationDraftResult = { ok: true; data: ExpertMe } | NormalizedError
export type SubmitApplicationResult = { ok: true; data: ExpertMe } | NormalizedError
export type UploadProjectFileResult = { ok: true; data: ExpertProjectFileUploadResponse } | NormalizedError
export type UploadApplicationDocumentResult = { ok: true; data: ApplicationDocumentUploadResponse } | NormalizedError
export type GetDownloadUrlResult = { ok: true; data: ExpertProjectDownloadUrlResponse } | NormalizedError


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

async function saveApplicationDraft(
  payload: ExpertDraftRequest,
): Promise<SaveApplicationDraftResult> {
  const result = await client.patch<ExpertMe>(
    '/api/v1/experts/me/application',
    payload,
    { requireAuth: true },
  )

  if (!result.ok) return result
  return { ok: true, data: result.data }
}


async function submitApplication(
  payload: ExpertDraftRequest,
): Promise<SubmitApplicationResult> {
  const saveResult = await client.post<ExpertMe>(
    '/api/v1/experts/apply',
    payload,
    { requireAuth: true },
  )

  if (!saveResult.ok) return saveResult

  // Then, actually submit the application for review
  const submitResult = await client.post<ExpertMe>(
    '/api/v1/experts/me/application/submit',
    undefined,
    { requireAuth: true },
  )

  if (!submitResult.ok) return submitResult
  return { ok: true, data: submitResult.data }
}

function fileTooLarge(message: string): NormalizedError {
  return {
    ok: false,
    status: 413,
    error: {
      code: 'FILE_TOO_LARGE',
      message,
    },
  }
}

async function uploadProjectFile(
  clientProjectId: string,
  file: File,
): Promise<UploadProjectFileResult> {
  if (file.size > MAX_PROJECT_FILE_SIZE_BYTES) {
    return fileTooLarge('Project evidence files must be 5 MB or smaller')
  }

  const path = `/api/v1/experts/me/application/project-file?clientProjectId=${encodeURIComponent(clientProjectId)}&filename=${encodeURIComponent(file.name)}`
  const result = await client.postBinary<ExpertProjectFileUploadResponse>(
    path,
    file,
    { requireAuth: true },
  )
  if (!result.ok) return result
  return { ok: true, data: result.data }
}


async function uploadApplicationDocument(
  documentType: ApplicationDocumentType,
  file: File,
): Promise<UploadApplicationDocumentResult> {
  const maxSize = documentType === 'intro_video'
    ? MAX_INTRO_VIDEO_SIZE_BYTES
    : documentType === 'portfolio'
      ? MAX_PORTFOLIO_FILE_SIZE_BYTES
      : MAX_CERTIFICATION_FILE_SIZE_BYTES
  const maxLabel = documentType === 'intro_video' ? '200 MB' : '25 MB'
  if (file.size > maxSize) return fileTooLarge(`${documentType.replace('_', ' ')} files must be ${maxLabel} or smaller`)

  const path = `/api/v1/experts/me/application/document-upload?documentType=${encodeURIComponent(documentType)}&filename=${encodeURIComponent(file.name)}`
  const result = await client.postBinary<ApplicationDocumentUploadResponse>(
    path,
    file,
    { requireAuth: true },
  )
  if (!result.ok) return result
  return { ok: true, data: result.data }
}

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
  saveApplicationDraft,
  submitApplication,
  uploadProjectFile,
  uploadApplicationDocument,
  getProjectFileDownloadUrl,
})
