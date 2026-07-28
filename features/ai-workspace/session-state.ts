import type {
  AiWorkspaceMessage,
  AiWorkspacePageContextPayload,
  AiWorkspaceResearchRequest,
  AiWorkspaceRunDetail,
  AiWorkspaceSession,
  AiWorkspaceToolCall,
} from '@/features/ai-workspace/types'

function formatToolLabel(value: string): string {
  return value
    .replace(/[_-]+/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
}

export function appendRunDetail(
  messages: AiWorkspaceMessage[],
  assistantMessageId: string,
  detail: AiWorkspaceRunDetail,
): AiWorkspaceMessage[] {
  return messages.map((message) => {
    if (message.id !== assistantMessageId) return message
    const current = message.runDetails ?? []
    const detailIndex = current.findIndex((item) => item.id === detail.id)
    const runDetails = detailIndex === -1
      ? [...current, detail]
      : current.map((item, index) => (index === detailIndex ? detail : item))
    return { ...message, runDetails }
  })
}

export function mergeToolRunDetail(
  messages: AiWorkspaceMessage[],
  assistantMessageId: string,
  tool: AiWorkspaceToolCall,
): AiWorkspaceMessage[] {
  const name = tool.name?.trim() || 'tool'
  const id = tool.id?.trim() || name
  const status = tool.status === 'failed'
    ? 'failed'
    : tool.status === 'completed'
      ? 'completed'
      : 'running'
  const summaryValue = tool.output?.summary
  const summary = typeof summaryValue === 'string' && summaryValue.trim()
    ? summaryValue.trim()
    : undefined

  return appendRunDetail(messages, assistantMessageId, {
    id,
    kind: 'tool',
    label: formatToolLabel(name),
    status,
    summary,
  })
}

export function buildAiWorkspaceResearchRequest({
  message,
  sessionId,
  pageContext,
  pageContextHistory,
  includePageContextHistory,
}: {
  message: string
  sessionId: string
  pageContext: AiWorkspacePageContextPayload
  pageContextHistory: AiWorkspacePageContextPayload[]
  includePageContextHistory: boolean
}): AiWorkspaceResearchRequest {
  return {
    message,
    ...(sessionId ? { session_id: sessionId } : {}),
    page_context: pageContext,
    ...(includePageContextHistory && pageContextHistory.length > 0
      ? { page_context_history: pageContextHistory }
      : {}),
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

function recordArray(value: unknown): Record<string, unknown>[] {
  return Array.isArray(value) ? value.filter(isRecord) : []
}

function textValue(value: unknown): string {
  return typeof value === 'string' ? value : ''
}

export function restoreAiWorkspaceMessages(
  session: AiWorkspaceSession,
): AiWorkspaceMessage[] {
  const sessionId = textValue(session.session_id) || textValue(session.id) || 'session'
  const turns = recordArray(session.turns)
  const restored: AiWorkspaceMessage[] = []

  turns.forEach((turn, turnIndex) => {
    const turnId = textValue(turn.turn_id) || `${sessionId}-${turnIndex}`
    const createdAt = textValue(turn.timestamp) || new Date().toISOString()
    const userContent = textValue(turn.user_message)
    const assistantContent = textValue(turn.assistant_message)

    if (userContent) {
      restored.push({
        id: `${turnId}-user`,
        role: 'user',
        content: userContent,
        createdAt,
        status: 'complete',
      })
    }

    if (assistantContent) {
      const toolResults = recordArray(turn.tool_results)
      const toolNames = Array.isArray(turn.tools_called)
        ? turn.tools_called.filter((value): value is string => typeof value === 'string')
        : []
      const detailSources: Record<string, unknown>[] = toolResults.length > 0
        ? toolResults
        : toolNames.map((toolName) => ({ tool_name: toolName, success: true }))
      const runDetails: AiWorkspaceRunDetail[] = detailSources.map((result, index) => {
        const toolName = textValue(result.tool_name) || toolNames[index] || 'tool'
        const summary = textValue(result.summary).trim()
        return {
          id: `${turnId}-${toolName}-${index}`,
          kind: 'tool',
          label: formatToolLabel(toolName),
          status: result.success === false ? 'failed' : 'completed',
          ...(summary ? { summary } : {}),
        }
      })

      restored.push({
        id: `${turnId}-assistant`,
        role: 'assistant',
        content: assistantContent,
        createdAt,
        status: 'complete',
        runDetails,
      })
    }
  })

  return restored
}
