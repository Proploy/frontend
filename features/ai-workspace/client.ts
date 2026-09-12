'use client'

import { useMemo } from 'react'
import {
  ServiceApisBrowserClient,
  normalizeServiceApiError,
  serviceApisBrowserFetch,
  type NormalizedError,
} from '@/lib/service-apis/browser'
import type {
  AiWorkspaceApiResult,
  AiWorkspaceCandidate,
  AiWorkspaceCandidateAddPayload,
  AiWorkspaceCandidateRemovePayload,
  AiWorkspaceRecord,
  AiWorkspaceResearchRequest,
  AiWorkspaceResearchResponse,
  AiWorkspaceSession,
  AiWorkspaceSessionLoadPayload,
  AiWorkspaceSessionSavePayload,
} from '@/features/ai-workspace/types'
import type {
  EvaluationCreateRequest,
  EvaluationDetail,
  EvaluationSummary,
  ShortlistUpdateRequest,
} from '@/features/ai-workspace/evaluation-types'

const client = new ServiceApisBrowserClient()
const AI_WORKSPACE_ROOT = '/api/v1/ai_workspace'

function encodeQuery(params: Record<string, string | undefined>): string {
  const query = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value) query.set(key, value)
  })
  const encoded = query.toString()
  return encoded ? `?${encoded}` : ''
}

function stripUserId<T>(body: T): T {
  if (!body || typeof body !== 'object' || Array.isArray(body)) return body
  const safeBody = { ...(body as Record<string, unknown>) }
  delete safeBody.user_id
  return safeBody as T
}

async function authedGet<T>(path: string): Promise<AiWorkspaceApiResult<T>> {
  return client.get<T>(`${AI_WORKSPACE_ROOT}${path}`, { requireAuth: true })
}

async function authedPost<T>(path: string, body?: unknown): Promise<AiWorkspaceApiResult<T>> {
  return client.post<T>(`${AI_WORKSPACE_ROOT}${path}`, stripUserId(body), { requireAuth: true })
}

async function authedPatch<T>(path: string, body?: unknown): Promise<AiWorkspaceApiResult<T>> {
  return client.patch<T>(`${AI_WORKSPACE_ROOT}${path}`, stripUserId(body), { requireAuth: true })
}

async function authedDelete<T>(path: string): Promise<AiWorkspaceApiResult<T>> {
  return client.delete<T>(`${AI_WORKSPACE_ROOT}${path}`, { requireAuth: true })
}

export async function sendAiWorkspaceResearch(
  request: AiWorkspaceResearchRequest,
): Promise<AiWorkspaceApiResult<AiWorkspaceResearchResponse>> {
  return authedPost<AiWorkspaceResearchResponse>('/research', request)
}

export async function postAiWorkspacePageContext(
  payload: AiWorkspaceRecord,
): Promise<AiWorkspaceApiResult<AiWorkspaceRecord>> {
  return authedPost<AiWorkspaceRecord>('/page-context', payload)
}

export async function listAiWorkspaceSessions(): Promise<AiWorkspaceApiResult<AiWorkspaceSession[]>> {
  return authedGet<AiWorkspaceSession[]>('/sessions')
}

export async function getAiWorkspaceSession(
  sessionId: string,
): Promise<AiWorkspaceApiResult<AiWorkspaceSession>> {
  return authedGet<AiWorkspaceSession>(`/sessions/${encodeURIComponent(sessionId)}`)
}

export async function renameAiWorkspaceSession(
  sessionId: string,
  payload: AiWorkspaceRecord,
): Promise<AiWorkspaceApiResult<AiWorkspaceSession>> {
  return authedPatch<AiWorkspaceSession>(`/sessions/${encodeURIComponent(sessionId)}`, payload)
}

export async function deleteAiWorkspaceSession(
  sessionId: string,
): Promise<AiWorkspaceApiResult<AiWorkspaceRecord>> {
  return authedDelete<AiWorkspaceRecord>(`/sessions/${encodeURIComponent(sessionId)}`)
}

export async function listAiWorkspaceCandidates(
  sessionId: string,
): Promise<AiWorkspaceApiResult<AiWorkspaceCandidate[]>> {
  return authedGet<AiWorkspaceCandidate[]>(`/candidates${encodeQuery({ session_id: sessionId })}`)
}

export async function addAiWorkspaceCandidate(
  payload: AiWorkspaceCandidateAddPayload,
): Promise<AiWorkspaceApiResult<AiWorkspaceCandidate>> {
  return authedPost<AiWorkspaceCandidate>('/candidates/add', payload)
}

export async function removeAiWorkspaceCandidate(
  payload: AiWorkspaceCandidateRemovePayload,
): Promise<AiWorkspaceApiResult<AiWorkspaceRecord>> {
  return authedPost<AiWorkspaceRecord>('/candidates/remove', payload)
}

export async function saveAiWorkspaceSession(
  payload: AiWorkspaceSessionSavePayload,
): Promise<AiWorkspaceApiResult<AiWorkspaceRecord>> {
  return authedPost<AiWorkspaceRecord>('/session/save', payload)
}

export async function loadAiWorkspaceSession(
  payload: AiWorkspaceSessionLoadPayload,
): Promise<AiWorkspaceApiResult<AiWorkspaceRecord>> {
  return authedPost<AiWorkspaceRecord>('/session/load', payload)
}

export async function listAiWorkspaceEvaluations(): Promise<AiWorkspaceApiResult<EvaluationSummary[]>> {
  return authedGet<EvaluationSummary[]>('/evaluations')
}

export async function createAiWorkspaceEvaluation(
  payload: EvaluationCreateRequest = {},
): Promise<AiWorkspaceApiResult<EvaluationDetail>> {
  return authedPost<EvaluationDetail>('/evaluations', payload)
}

export async function getAiWorkspaceEvaluation(
  evaluationId: string,
): Promise<AiWorkspaceApiResult<EvaluationDetail>> {
  return authedGet<EvaluationDetail>(`/evaluations/${encodeURIComponent(evaluationId)}`)
}

export async function updateAiWorkspaceShortlist(
  evaluationId: string,
  payload: ShortlistUpdateRequest,
): Promise<AiWorkspaceApiResult<EvaluationDetail>> {
  return authedPatch<EvaluationDetail>(
    `/evaluations/${encodeURIComponent(evaluationId)}/shortlist`,
    payload,
  )
}

export async function updateAiWorkspaceEvaluation(
  evaluationId: string,
  payload: { title?: string; status?: string },
): Promise<AiWorkspaceApiResult<EvaluationDetail>> {
  return authedPatch<EvaluationDetail>(
    `/evaluations/${encodeURIComponent(evaluationId)}`,
    payload,
  )
}

export type DocumentPdfResult =
  | { ok: true; data: { blob: Blob; filename: string } }
  | NormalizedError

function filenameFromDisposition(header: string | null, fallback: string): string {
  if (!header) return fallback
  const utf8 = /filename\*=UTF-8''([^;]+)/i.exec(header)
  if (utf8?.[1]) {
    try {
      return decodeURIComponent(utf8[1])
    } catch {
      return utf8[1]
    }
  }
  const plain = /filename="?([^";]+)"?/i.exec(header)
  return plain?.[1] ?? fallback
}

/**
 * Download a brief Sam generated as PDF. The harness path on the document
 * (`pdf_url`) is not reachable from the browser; the gateway proxies it and
 * enforces that the document belongs to the signed-in user.
 */
export async function exportAiWorkspaceDocumentPdf(docId: string): Promise<DocumentPdfResult> {
  let response: Response
  try {
    response = await serviceApisBrowserFetch(
      `${AI_WORKSPACE_ROOT}/documents/${encodeURIComponent(docId)}/export/pdf`,
      { requireAuth: true, headers: { accept: 'application/pdf' } },
    )
  } catch {
    return {
      ok: false,
      status: 0,
      error: { code: 'NETWORK_ERROR', message: 'Unable to reach service APIs', retryable: true },
    }
  }
  if (!response.ok) return normalizeServiceApiError(response)
  const blob = await response.blob()
  return {
    ok: true,
    data: {
      blob,
      filename: filenameFromDisposition(response.headers.get('content-disposition'), `${docId}.pdf`),
    },
  }
}

export const useAiWorkspaceClient = () =>
  useMemo(
    () => ({
      sendResearch: sendAiWorkspaceResearch,
      postPageContext: postAiWorkspacePageContext,
      listSessions: listAiWorkspaceSessions,
      getSession: getAiWorkspaceSession,
      renameSession: renameAiWorkspaceSession,
      deleteSession: deleteAiWorkspaceSession,
      listCandidates: listAiWorkspaceCandidates,
      addCandidate: addAiWorkspaceCandidate,
      removeCandidate: removeAiWorkspaceCandidate,
      saveSession: saveAiWorkspaceSession,
      loadSession: loadAiWorkspaceSession,
      listEvaluations: listAiWorkspaceEvaluations,
      createEvaluation: createAiWorkspaceEvaluation,
      getEvaluation: getAiWorkspaceEvaluation,
      updateEvaluation: updateAiWorkspaceEvaluation,
      updateShortlist: updateAiWorkspaceShortlist,
      exportDocumentPdf: exportAiWorkspaceDocumentPdf,
    }),
    [],
  )
