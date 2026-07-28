import type {
  EvaluationDetail,
  EvaluationProduct,
  EvaluationStreamEvent,
  EvaluationSummary,
  EvaluationWorkspaceState,
} from './evaluation-types'

export type EvaluationWorkspaceAction =
  | { type: 'loading'; value: boolean }
  | { type: 'error'; message: string | null }
  | { type: 'summaries_loaded'; summaries: EvaluationSummary[] }
  | { type: 'detail_loaded'; detail: EvaluationDetail }
  | { type: 'evaluation_selected'; evaluationId: string }
  | { type: 'evaluation_removed'; evaluationId: string }
  | {
      type: 'shortlist_replaced'
      evaluationId: string
      items: EvaluationProduct[]
    }
  | { type: 'sending'; evaluationId: string; value: boolean }
  | {
      type: 'stream_event'
      evaluationId: string
      event: EvaluationStreamEvent
    }

export function createInitialEvaluationState(): EvaluationWorkspaceState {
  return {
    summaries: [],
    detailsById: {},
    activeEvaluationId: null,
    loading: true,
    sendingById: {},
    error: null,
  }
}

export function shouldPollRegeneration(status: string): boolean {
  return status === 'pending' || status === 'running'
}

function summaryFromDetail(detail: EvaluationDetail): EvaluationSummary {
  return {
    evaluation_id: detail.evaluation_id,
    title: detail.title,
    status: detail.status,
    stage: detail.stage,
    attention_group: detail.attention_group,
    next_action: detail.next_action,
    shortlist_count: detail.shortlist_count,
    match_count: detail.match_count,
    recommendation_state: detail.recommendation_state,
    regeneration_status: detail.regeneration_status,
    milestones: detail.milestones,
    progress_percent: detail.progress_percent,
  }
}

function updateSummary(
  summaries: EvaluationSummary[],
  detail: EvaluationDetail,
): EvaluationSummary[] {
  const summary = summaryFromDetail(detail)
  const found = summaries.some(
    (item) => item.evaluation_id === detail.evaluation_id,
  )
  return found
    ? summaries.map((item) =>
        item.evaluation_id === detail.evaluation_id ? summary : item,
      )
    : [summary, ...summaries]
}

function preserveUnsettledLocalMessages(
  existing: EvaluationDetail | undefined,
  incoming: EvaluationDetail,
  isSending: boolean,
): EvaluationDetail {
  if (!existing) return incoming
  const lastLocalMessage = existing.messages.at(-1)
  const hasUnsettledAssistant =
    lastLocalMessage?.role === 'assistant' &&
    (lastLocalMessage.status === 'streaming' ||
      lastLocalMessage.status === 'failed')
  if (!isSending && !hasUnsettledAssistant) return incoming

  const incomingEndsComplete =
    !isSending &&
    incoming.messages.length >= existing.messages.length &&
    incoming.messages.at(-1)?.role === 'assistant' &&
    incoming.messages.at(-1)?.status === 'complete'
  if (incomingEndsComplete) return incoming

  return {
    ...incoming,
    messages: [
      ...incoming.messages,
      ...existing.messages.slice(incoming.messages.length),
    ],
  }
}

function applyStreamEvent(
  detail: EvaluationDetail,
  event: EvaluationStreamEvent,
): EvaluationDetail {
  switch (event.type) {
    case 'message_delta': {
      const messages = [...detail.messages]
      const last = messages.at(-1)
      if (last?.role === 'assistant' && last.status === 'streaming') {
        messages[messages.length - 1] = {
          ...last,
          markdown: `${last.markdown}${event.data.delta}`,
        }
      } else {
        messages.push({
          id: crypto.randomUUID(),
          role: 'assistant',
          markdown: event.data.delta,
          artifact_refs: [],
          status: 'streaming',
        })
      }
      return { ...detail, messages }
    }
    case 'evaluation_state':
      return { ...detail, ...event.data }
    case 'shortlist_updated':
      return {
        ...detail,
        shortlist: event.data.items,
        shortlist_count: event.data.items.length,
      }
    case 'product_match_published':
      return {
        ...detail,
        matches: [...detail.matches, event.data],
      }
    case 'recommendation_published':
      return {
        ...detail,
        recommendation: {
          ...event.data.recommendation,
          publication_state: 'current',
        },
        recommendation_state: 'current',
        regeneration_status: 'idle',
      }
    case 'regeneration_status':
      return {
        ...detail,
        regeneration_status: event.data.status,
        recommendation:
          detail.recommendation &&
          event.data.scope.includes('recommendation')
            ? {
                ...detail.recommendation,
                publication_state:
                  event.data.status === 'failed'
                    ? 'failed'
                    : event.data.status === 'idle'
                      ? 'current'
                      : 'updating',
              }
            : detail.recommendation,
      }
    case 'done': {
      const messages = detail.messages.map((message, index) =>
        index === detail.messages.length - 1 &&
        message.role === 'assistant'
          ? { ...message, status: 'complete' as const }
          : message,
      )
      return { ...detail, messages }
    }
    case 'error': {
      let markedFailed = false
      const messages = detail.messages.map((message, index) => {
        const shouldFail =
          index === detail.messages.length - 1 &&
          message.role === 'assistant' &&
          message.status === 'streaming'
        if (shouldFail) markedFailed = true
        return shouldFail
          ? { ...message, status: 'failed' as const }
          : message
      })
      if (!markedFailed && messages.at(-1)?.role === 'user') {
        messages.push({
          id: crypto.randomUUID(),
          role: 'assistant',
          markdown: 'I could not finish that response.',
          artifact_refs: [],
          status: 'failed',
        })
      }
      return { ...detail, messages }
    }
    case 'requirements_updated':
    case 'match_run_published':
      return detail
    default:
      return detail
  }
}

export function evaluationWorkspaceReducer(
  state: EvaluationWorkspaceState,
  action: EvaluationWorkspaceAction,
): EvaluationWorkspaceState {
  switch (action.type) {
    case 'loading':
      return { ...state, loading: action.value }
    case 'error':
      return { ...state, error: action.message }
    case 'summaries_loaded':
      return {
        ...state,
        summaries: action.summaries,
        activeEvaluationId:
          state.activeEvaluationId ??
          action.summaries[0]?.evaluation_id ??
          null,
      }
    case 'detail_loaded':
      {
        const detail = preserveUnsettledLocalMessages(
          state.detailsById[action.detail.evaluation_id],
          action.detail,
          Boolean(
            state.sendingById[action.detail.evaluation_id],
          ),
        )
        return {
          ...state,
          summaries: updateSummary(state.summaries, detail),
          detailsById: {
            ...state.detailsById,
            [detail.evaluation_id]: detail,
          },
          activeEvaluationId:
            state.activeEvaluationId ?? detail.evaluation_id,
        }
      }
    case 'evaluation_selected':
      return { ...state, activeEvaluationId: action.evaluationId }
    case 'evaluation_removed': {
      const summaries = state.summaries.filter(
        (item) => item.evaluation_id !== action.evaluationId,
      )
      const detailsById = { ...state.detailsById }
      delete detailsById[action.evaluationId]
      return {
        ...state,
        summaries,
        detailsById,
        activeEvaluationId:
          state.activeEvaluationId === action.evaluationId
            ? summaries[0]?.evaluation_id ?? null
            : state.activeEvaluationId,
      }
    }
    case 'shortlist_replaced': {
      const detail = state.detailsById[action.evaluationId]
      if (!detail) return state
      const knownProducts = new Map(
        [...detail.matches, ...detail.shortlist].map((product) => [
          product.product_id,
          product,
        ]),
      )
      const shortlist = action.items.map((item) => ({
        ...knownProducts.get(item.product_id),
        ...item,
        product_name:
          item.product_name ??
          knownProducts.get(item.product_id)?.product_name ??
          null,
        profile_href:
          item.profile_href ??
          knownProducts.get(item.product_id)?.profile_href ??
          null,
      }))
      const next = {
        ...detail,
        shortlist,
        shortlist_count: shortlist.length,
      }
      return {
        ...state,
        summaries: updateSummary(state.summaries, next),
        detailsById: {
          ...state.detailsById,
          [action.evaluationId]: next,
        },
      }
    }
    case 'sending':
      return {
        ...state,
        sendingById: {
          ...state.sendingById,
          [action.evaluationId]: action.value,
        },
      }
    case 'stream_event': {
      const detail = state.detailsById[action.evaluationId]
      if (!detail) return state
      const next = applyStreamEvent(detail, action.event)
      return {
        ...state,
        summaries: updateSummary(state.summaries, next),
        detailsById: {
          ...state.detailsById,
          [action.evaluationId]: next,
        },
      }
    }
  }
}
