'use client'

import { getAiWorkspaceSession } from '@/features/ai-workspace/client'
import type { AiWorkspaceMessage } from '@/features/ai-workspace/types'

type TurnRecord = {
  turn_id?: unknown
  user_message?: unknown
  assistant_message?: unknown
  timestamp?: unknown
  [key: string]: unknown
}

function toMessage(
  id: string,
  role: AiWorkspaceMessage['role'],
  content: string,
  createdAt: string,
): AiWorkspaceMessage {
  return {
    id,
    role,
    content,
    createdAt,
    status: 'complete',
    runDetails: [],
  }
}

function fallbackTimestamp(): string {
  // Stable, deterministic, parsable. Avoids `new Date().toISOString()` which
  // would shift between SSR/CSR and trigger React hydration warnings.
  return new Date(0).toISOString()
}

function pickCreatedAt(turn: TurnRecord): string {
  const raw = turn.timestamp
  if (typeof raw === 'string' && raw.length > 0) return raw
  if (typeof raw === 'number' && Number.isFinite(raw)) {
    return new Date(raw).toISOString()
  }
  return fallbackTimestamp()
}

function pickTurnId(turn: TurnRecord, index: number): string {
  if (typeof turn.turn_id === 'string' && turn.turn_id.length > 0) {
    return turn.turn_id
  }
  return `turn-${index}`
}

/**
 * Map agent-harness `turns[]` into the chat-panel's `AiWorkspaceMessage[]`.
 *
 * Each turn becomes at most two messages (user + assistant). Fields we drop
 * (`tools_called`, `tool_results`, `profile_delta`, `token_usage`) are
 * provenance for context reconstruction, not display data — PATH A's stream
 * already live-renders the tool trace on the new turn, so replaying it here
 * would be redundant noise.
 */
export function mapTurnsToMessages(
  turns: unknown,
): AiWorkspaceMessage[] {
  if (!Array.isArray(turns)) return []
  const messages: AiWorkspaceMessage[] = []
  turns.forEach((raw, index) => {
    if (!raw || typeof raw !== 'object') return
    const turn = raw as TurnRecord
    const turnId = pickTurnId(turn, index)
    const createdAt = pickCreatedAt(turn)
    const userContent = typeof turn.user_message === 'string' ? turn.user_message : ''
    messages.push(toMessage(`${turnId}:user`, 'user', userContent, createdAt))
    if (typeof turn.assistant_message === 'string' && turn.assistant_message.length > 0) {
      messages.push(
        toMessage(`${turnId}:assistant`, 'assistant', turn.assistant_message, createdAt),
      )
    }
  })
  return messages
}

/**
 * Load the persisted chat history for a session via service-apis.
 *
 * Returns an empty array when the session is missing (404) — the panel will
 * show a fresh empty state instead of an error. Re-throws on transport
 * failures so the caller can surface them.
 */
export async function loadAiWorkspaceSessionHistory(
  sessionId: string,
): Promise<AiWorkspaceMessage[]> {
  if (!sessionId) return []
  const result = await getAiWorkspaceSession(sessionId)
  if (!result.ok) {
    if (result.error.code === 'NOT_FOUND' || result.status === 404) {
      return []
    }
    throw new Error(result.error.message ?? 'Failed to load session')
  }
  return mapTurnsToMessages(result.data.turns)
}