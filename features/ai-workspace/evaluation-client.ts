'use client'

import {
  normalizeServiceApiError,
  serviceApisBrowserFetch,
  ServiceApisBrowserClient,
} from '@/lib/service-apis/browser'
import type {
  EvaluationApiResult,
  EvaluationDetail,
  EvaluationEvidence,
  EvaluationStreamEvent,
  EvaluationSummary,
  RequirementsDraft,
  ShortlistMutationResponse,
} from './evaluation-types'

const ROOT = '/api/v1/ai_workspace/evaluations'
const client = new ServiceApisBrowserClient()

function pathFor(evaluationId: string, suffix = ''): string {
  return `${ROOT}/${encodeURIComponent(evaluationId)}${suffix}`
}

function withoutUserId<T>(body: T): T {
  if (!body || typeof body !== 'object' || Array.isArray(body)) return body
  const next = { ...(body as Record<string, unknown>) }
  delete next.user_id
  return next as T
}

export function listEvaluations(): Promise<
  EvaluationApiResult<{ evaluations: EvaluationSummary[] }>
> {
  return client.get(ROOT, { requireAuth: true })
}

export function createEvaluation(
  body: { title: string },
): Promise<EvaluationApiResult<EvaluationDetail>> {
  return client.post(ROOT, withoutUserId(body), { requireAuth: true })
}

export function getEvaluation(
  evaluationId: string,
): Promise<EvaluationApiResult<EvaluationDetail>> {
  return client.get(pathFor(evaluationId), { requireAuth: true })
}

export function renameEvaluation(
  evaluationId: string,
  title: string,
): Promise<EvaluationApiResult<EvaluationDetail>> {
  return client.patch(
    pathFor(evaluationId),
    { title },
    { requireAuth: true },
  )
}

export function duplicateEvaluation(
  evaluationId: string,
): Promise<EvaluationApiResult<EvaluationDetail>> {
  return client.post(
    pathFor(evaluationId, '/duplicate'),
    {},
    { requireAuth: true },
  )
}

export function archiveEvaluation(
  evaluationId: string,
): Promise<EvaluationApiResult<Record<string, never>>> {
  return client.post(
    pathFor(evaluationId, '/archive'),
    {},
    { requireAuth: true },
  )
}

export function deleteEvaluation(
  evaluationId: string,
): Promise<EvaluationApiResult<Record<string, never>>> {
  return client.delete(pathFor(evaluationId), { requireAuth: true })
}

export function saveRequirementsDraft(
  evaluationId: string,
  requirements: RequirementsDraft,
): Promise<EvaluationApiResult<Record<string, unknown>>> {
  return client.put(
    pathFor(evaluationId, '/requirements/draft'),
    withoutUserId(requirements),
    { requireAuth: true },
  )
}

export function confirmRequirements(
  evaluationId: string,
): Promise<EvaluationApiResult<Record<string, unknown>>> {
  return client.post(
    pathFor(evaluationId, '/requirements/confirm'),
    {},
    { requireAuth: true },
  )
}

export function addShortlistProduct(
  evaluationId: string,
  productId: string,
): Promise<EvaluationApiResult<ShortlistMutationResponse>> {
  return client.post(
    pathFor(evaluationId, '/shortlist'),
    { product_id: productId },
    { requireAuth: true },
  )
}

export function removeShortlistProduct(
  evaluationId: string,
  productId: string,
): Promise<EvaluationApiResult<ShortlistMutationResponse>> {
  return client.delete(
    pathFor(
      evaluationId,
      `/shortlist/${encodeURIComponent(productId)}`,
    ),
    { requireAuth: true },
  )
}

export function reorderShortlist(
  evaluationId: string,
  productIds: string[],
): Promise<EvaluationApiResult<ShortlistMutationResponse>> {
  return client.put(
    pathFor(evaluationId, '/shortlist/order'),
    { product_ids: productIds },
    { requireAuth: true },
  )
}

export function setComparisonSelection(
  evaluationId: string,
  productIds: string[],
): Promise<EvaluationApiResult<EvaluationDetail>> {
  return client.put(
    pathFor(evaluationId, '/comparison-selection'),
    { product_ids: productIds },
    { requireAuth: true },
  )
}

export function getEvidence(
  evaluationId: string,
  productId: string,
): Promise<EvaluationApiResult<EvaluationEvidence>> {
  return client.get(
    pathFor(
      evaluationId,
      `/matches/${encodeURIComponent(productId)}/evidence`,
    ),
    { requireAuth: true },
  )
}

export function generateRecommendation(
  evaluationId: string,
): Promise<EvaluationApiResult<Record<string, unknown>>> {
  return client.post(
    pathFor(evaluationId, '/recommendation'),
    {},
    { requireAuth: true },
  )
}

export function retryRegeneration(
  evaluationId: string,
): Promise<EvaluationApiResult<Record<string, unknown>>> {
  return client.post(
    pathFor(evaluationId, '/regeneration/retry'),
    {},
    { requireAuth: true },
  )
}

export function saveEvaluationToProfile(
  sessionId: string,
  profileName: string,
): Promise<EvaluationApiResult<Record<string, unknown>>> {
  return client.post(
    '/api/v1/ai_workspace/session/save',
    {
      session_id: sessionId,
      profile_name: profileName,
    },
    { requireAuth: true },
  )
}

export function saveEvaluation(
  evaluationId: string,
): Promise<EvaluationApiResult<EvaluationDetail>> {
  return client.post(
    pathFor(evaluationId, '/save'),
    {},
    { requireAuth: true },
  )
}

const PUBLIC_EVENTS = new Set<EvaluationStreamEvent['type']>([
  'message_delta',
  'evaluation_state',
  'requirements_updated',
  'match_run_published',
  'product_match_published',
  'shortlist_updated',
  'recommendation_published',
  'regeneration_status',
  'error',
  'done',
])

function parseFrame(frame: string): EvaluationStreamEvent | null {
  let type = ''
  const dataLines: string[] = []
  frame.split(/\r?\n/).forEach((line) => {
    if (line.startsWith('event:')) type = line.slice(6).trim()
    if (line.startsWith('data:')) dataLines.push(line.slice(5).trim())
  })
  if (!PUBLIC_EVENTS.has(type as EvaluationStreamEvent['type'])) return null
  try {
    return {
      type,
      data: JSON.parse(dataLines.join('\n') || '{}'),
    } as EvaluationStreamEvent
  } catch {
    return null
  }
}

export function shouldReloadEvaluationAfterStream(result: {
  completed: boolean
  errored: boolean
}): boolean {
  return result.completed || result.errored
}

export async function streamEvaluationResearch(
  evaluationId: string,
  message: string,
  onEvent: (event: EvaluationStreamEvent) => void,
  signal?: AbortSignal,
): Promise<{ completed: boolean; errored: boolean }> {
  const response = await serviceApisBrowserFetch(
    pathFor(evaluationId, '/research/stream'),
    {
      method: 'POST',
      requireAuth: true,
      signal,
      headers: {
        accept: 'text/event-stream',
        'content-type': 'application/json',
      },
      body: JSON.stringify({ message }),
    },
  )
  if (!response.ok) {
    const error = await normalizeServiceApiError(response)
    onEvent({
      type: 'error',
      data: {
        code: error.error.code,
        message: error.error.message,
        retryable: error.error.retryable ?? response.status >= 500,
      },
    })
    return { completed: false, errored: true }
  }
  const reader = response.body?.getReader()
  if (!reader) {
    onEvent({
      type: 'error',
      data: {
        code: 'EMPTY_STREAM',
        message: 'SAM returned an empty response',
        retryable: true,
      },
    })
    return { completed: false, errored: true }
  }
  const decoder = new TextDecoder()
  let buffer = ''
  let completed = false
  let errored = false
  const emit = (event: EvaluationStreamEvent) => {
    if (event.type === 'done') completed = true
    if (event.type === 'error') errored = true
    onEvent(event)
  }
  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      buffer += decoder.decode(value, { stream: true })
      const frames = buffer.split(/\r?\n\r?\n/)
      buffer = frames.pop() ?? ''
      frames.forEach((frame) => {
        const event = parseFrame(frame)
        if (event) emit(event)
      })
    }
  } finally {
    reader.releaseLock()
  }
  const finalEvent = parseFrame(buffer)
  if (finalEvent) emit(finalEvent)
  if (!completed && !errored) {
    emit({
      type: 'error',
      data: {
        code: 'STREAM_INTERRUPTED',
        message: 'SAM’s response ended before it was saved',
        retryable: true,
      },
    })
  }
  return { completed, errored }
}
