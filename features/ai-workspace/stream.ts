'use client'

import {
  normalizeServiceApiError,
  serviceApisBrowserFetch,
} from '@/lib/service-apis/browser'
import type {
  AiWorkspaceResearchRequest,
  AiWorkspaceStreamEvent,
  AiWorkspaceStreamEventName,
  AiWorkspaceStreamPayloadByEvent,
} from '@/features/ai-workspace/types'

const AI_WORKSPACE_STREAM_PATH = '/api/v1/ai_workspace/research/stream'

const KNOWN_EVENTS = new Set<AiWorkspaceStreamEventName>([
  'session',
  'message_delta',
  'message_final',
  'thinking',
  'tool_call',
  'recommendations',
  'profile',
  'error',
  'done',
])

export type StreamAiWorkspaceResearchHandlers = {
  onEvent: (event: AiWorkspaceStreamEvent) => void
}

export type StreamAiWorkspaceResearchOptions = {
  signal?: AbortSignal
}

function stripUserId(request: AiWorkspaceResearchRequest): AiWorkspaceResearchRequest {
  const safeRequest = { ...(request as AiWorkspaceResearchRequest & { user_id?: unknown }) }
  delete safeRequest.user_id
  return safeRequest
}

function parseSseData(data: string): unknown {
  if (!data || data === '[DONE]') return {}
  try {
    return JSON.parse(data) as unknown
  } catch {
    return { content: data }
  }
}

function eventFromPayload(payload: unknown): string | null {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) return null
  const type = (payload as Record<string, unknown>).type
  const event = (payload as Record<string, unknown>).event
  return typeof type === 'string' ? type : typeof event === 'string' ? event : null
}

function toStreamEvent(eventName: string, data: string): AiWorkspaceStreamEvent {
  const parsed = parseSseData(data)
  const inferredName = eventName === 'message' ? eventFromPayload(parsed) ?? eventName : eventName

  if (KNOWN_EVENTS.has(inferredName as AiWorkspaceStreamEventName)) {
    const type = inferredName as AiWorkspaceStreamEventName
    return {
      type,
      data: parsed as AiWorkspaceStreamPayloadByEvent[typeof type],
    } as AiWorkspaceStreamEvent
  }

  return {
    type: 'unknown',
    event: inferredName,
    data: parsed,
  }
}

export function parseAiWorkspaceSseFrame(frame: string): AiWorkspaceStreamEvent | null {
  let eventName = 'message'
  const dataLines: string[] = []

  frame.split(/\r?\n/).forEach((line) => {
    if (!line || line.startsWith(':')) return

    const separatorIndex = line.indexOf(':')
    const field = separatorIndex === -1 ? line : line.slice(0, separatorIndex)
    let value = separatorIndex === -1 ? '' : line.slice(separatorIndex + 1)
    if (value.startsWith(' ')) value = value.slice(1)

    if (field === 'event') eventName = value
    if (field === 'data') dataLines.push(value)
  })

  if (dataLines.length === 0) return null
  return toStreamEvent(eventName, dataLines.join('\n'))
}

function emitError(
  onEvent: (event: AiWorkspaceStreamEvent) => void,
  code: string,
  message: string,
  retryable: boolean,
) {
  onEvent({
    type: 'error',
    data: {
      code,
      message,
      retryable,
    },
  })
}

export async function streamAiWorkspaceResearch(
  request: AiWorkspaceResearchRequest,
  handlers: StreamAiWorkspaceResearchHandlers,
  options: StreamAiWorkspaceResearchOptions = {},
): Promise<void> {
  let response: Response
  try {
    response = await serviceApisBrowserFetch(AI_WORKSPACE_STREAM_PATH, {
      method: 'POST',
      headers: {
        accept: 'text/event-stream',
        'content-type': 'application/json',
      },
      body: JSON.stringify(stripUserId(request)),
      signal: options.signal,
      requireAuth: true,
    })
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') return
    emitError(handlers.onEvent, 'NETWORK_ERROR', 'Unable to reach service APIs', true)
    return
  }

  if (!response.ok) {
    const normalized = await normalizeServiceApiError(response)
    emitError(
      handlers.onEvent,
      normalized.error.code,
      normalized.error.message,
      normalized.error.retryable ?? (normalized.status === 429 || normalized.status >= 500),
    )
    return
  }

  if (!response.body) {
    emitError(handlers.onEvent, 'EMPTY_STREAM', 'Agent stream did not return a response body', true)
    return
  }

  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''

  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const frames = buffer.split(/\r?\n\r?\n/)
      buffer = frames.pop() ?? ''

      frames.forEach((frame) => {
        const event = parseAiWorkspaceSseFrame(frame)
        if (event) handlers.onEvent(event)
      })
    }

    buffer += decoder.decode()
    if (buffer.trim()) {
      const event = parseAiWorkspaceSseFrame(buffer)
      if (event) handlers.onEvent(event)
    }
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') return
    emitError(handlers.onEvent, 'STREAM_READ_FAILED', 'Agent stream ended unexpectedly', true)
  } finally {
    reader.releaseLock()
  }
}
