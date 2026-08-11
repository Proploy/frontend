'use client'

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

import {
  createAiWorkspaceEvaluation,
  getAiWorkspaceEvaluation,
  listAiWorkspaceEvaluations,
  updateAiWorkspaceEvaluation,
  updateAiWorkspaceShortlist,
} from '@/features/ai-workspace/client'
import { streamAiWorkspaceResearch } from '@/features/ai-workspace/stream'
import { applyEvaluationStreamEvent, parseAssistantMarkdown, mergeMatches } from './evaluation-reducer'

import type {
  EvaluationDetail,
  EvaluationEvidence,
  EvaluationMessage,
  EvaluationProduct,
  EvaluationRecommendation,
  EvaluationStreamEvent,
  EvaluationSummary,
  EvaluationWorkspaceState,
} from './evaluation-types'
import type { AiWorkspaceStreamEvent } from './types'

const ACTIVE_EVALUATION_STORAGE_KEY = 'proploy-ai-workspace-active-evaluation'

function emptyEvaluationDetail(
  evaluationId: string,
  title: string,
  agentSessionId = evaluationId,
): EvaluationDetail {
  return {
    evaluation_id: evaluationId,
    title,
    status: 'active',
    stage: 'defining_requirements',
    attention_group: 'needs_attention',
    next_action: 'describe_requirements',
    shortlist_count: 0,
    match_count: 0,
    recommendation_state: 'unavailable',
    regeneration_status: 'idle',
    milestones: {
      requirements_confirmed: false,
      products_discovered: false,
      shortlist_ready: false,
      recommendation_generated: false,
    },
    progress_percent: 0,
    agent_session_id: agentSessionId,
    comparison_product_ids: [],
    requirements: null,
    missing_critical_signals: [],
    matches: [],
    shortlist: [],
    recommendation: null,
    documents: [],
    messages: [],
  }
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

function readStoredEvaluationId(): string | null {
  if (typeof window === 'undefined') return null
  return window.localStorage.getItem(ACTIVE_EVALUATION_STORAGE_KEY)
}

function rememberEvaluationId(evaluationId: string) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(ACTIVE_EVALUATION_STORAGE_KEY, evaluationId)
}

function clearStoredEvaluationId() {
  if (typeof window === 'undefined') return
  window.localStorage.removeItem(ACTIVE_EVALUATION_STORAGE_KEY)
}

function createLocalMessage(
  role: EvaluationMessage['role'],
  markdown: string,
  status: EvaluationMessage['status'] = 'complete',
): EvaluationMessage {
  return {
    id: crypto.randomUUID(),
    role,
    markdown,
    artifact_refs: [],
    status,
  }
}

function generateTitleFromMessage(message: string, count = 1): string {
  if (!message) return `Software Evaluation #${count}`
  const firstLine = message.split('\n')[0].trim()
  if (firstLine.length > 36) {
    return firstLine.slice(0, 32).trim() + '...'
  }
  return firstLine || `Software Evaluation #${count}`
}

function normalizeStreamRecommendation(item: Record<string, unknown>, index = 0): EvaluationProduct {
  const productId = String(item.product_id || item.id || item.name || 'unknown')
  const name = String(item.product_name || item.name || productId)
  const baseScore = typeof item.fit_score === 'number'
    ? item.fit_score
    : (typeof item.match_score === 'number'
        ? item.match_score
        : (typeof item.similarity === 'number' ? Math.round(item.similarity * 100) : 94 - index * 4))
  const fitScore = Math.max(65, Math.min(99, baseScore))
  return {
    product_id: productId,
    product_name: name,
    profile_href: typeof item.profile_href === 'string' ? item.profile_href : `/products/${productId}`,
    available: true,
    match_score: fitScore,
    match_strength: typeof item.match_strength === 'string' ? item.match_strength : (fitScore >= 85 ? 'Strong match' : 'Good match'),
    best_for: typeof item.best_for === 'string' ? item.best_for : (typeof item.short_description === 'string' ? item.short_description : (typeof item.agent_summary === 'string' ? item.agent_summary : undefined)),
    reasons: Array.isArray(item.core_features)
      ? item.core_features.map(String)
      : (Array.isArray(item.reasons) ? item.reasons.map(String) : (typeof item.agent_summary === 'string' ? [item.agent_summary] : [])),
    considerations: Array.isArray(item.considerations) ? item.considerations.map(String) : [],
  }
}

function mapAiEventToEvaluation(
  event: AiWorkspaceStreamEvent,
): EvaluationStreamEvent | null {
  switch (event.type) {
    case 'message_delta':
      return {
        type: 'message_delta',
        data: { delta: String(event.data.delta ?? '') },
      }
    case 'message_final':
      return {
        type: 'message_final',
        data: { content: String(event.data.content ?? '') },
      }
    case 'status':
      return {
        type: 'status',
        data: {
          content: event.data.content,
          status: event.data.status,
        },
      }
    case 'thinking':
      return {
        type: 'status',
        data: {
          content: event.data.content || 'Analyzing request',
          status: event.data.status || 'running',
        },
      }
    case 'tool_call':
      return {
        type: 'status',
        data: {
          content: `Using tool: ${event.data.name || 'catalog'}`,
          status: event.data.status === 'completed' ? 'done' : 'running',
        },
      }
    case 'recommendations': {
      const items = Array.isArray(event.data.items) ? event.data.items : []
      const matches = items.map((item) => normalizeStreamRecommendation(item as Record<string, unknown>))
      return {
        type: 'evaluation_state',
        data: { matches, match_count: matches.length },
      }
    }
    case 'evaluation_state':
      return event.data.evaluation
        ? { type: 'evaluation_state', data: event.data.evaluation }
        : null
    case 'shortlist_updated':
      return {
        type: 'shortlist_updated',
        data: { items: event.data.items ?? [] },
      }
    case 'recommendation_published':
      return event.data.recommendation
        ? {
            type: 'recommendation_published',
            data: { recommendation: event.data.recommendation },
          }
        : null
    case 'document_ready':
      return event.data.document
        ? { type: 'document_ready', data: { document: event.data.document } }
        : null
    case 'done':
      return {
        type: 'done',
        data: {
          evaluation: event.data.evaluation as EvaluationDetail | undefined,
          evaluation_id: typeof event.data.evaluation_id === 'string'
            ? event.data.evaluation_id
            : undefined,
          session_id: typeof event.data.session_id === 'string'
            ? event.data.session_id
            : undefined,
        },
      }
    case 'error':
      return {
        type: 'error',
        data: {
          code: String(event.data.code ?? 'AGENT_ERROR'),
          message: String(event.data.message ?? 'Agent error'),
          retryable: event.data.retryable !== false,
        },
      }
    default:
      return null
  }
}

export function useEvaluationWorkspace() {
  const [state, setState] = useState<EvaluationWorkspaceState>({
    summaries: [],
    detailsById: {},
    activeEvaluationId: null,
    loading: true,
    sendingById: {},
    error: null,
  })
  const [isSending, setIsSending] = useState(false)
  const abortRef = useRef<AbortController | null>(null)
  const isSendingRef = useRef(false)

  const upsertDetail = useCallback((detail: EvaluationDetail) => {
    rememberEvaluationId(detail.evaluation_id)
    setState((current) => {
      const summary = summaryFromDetail(detail)
      const summaries = [
        summary,
        ...current.summaries.filter(
          (item) => item.evaluation_id !== detail.evaluation_id,
        ),
      ]
      const existingDetail = current.detailsById[detail.evaluation_id]
      const mergedMatches = detail.matches.length > 0 
        ? detail.matches.map(m => {
            const existing = existingDetail?.matches.find(e => e.product_id === m.product_id)
            if (existing) {
              return { 
                ...m, 
                match_score: existing.match_score ?? m.match_score, 
                reasons: existing.reasons ?? m.reasons 
              }
            }
            return m
          })
        : (existingDetail?.matches ?? [])

      return {
        ...current,
        summaries,
        detailsById: {
          ...current.detailsById,
          [detail.evaluation_id]: {
            ...detail,
            matches: mergedMatches,
          },
        },
        activeEvaluationId: detail.evaluation_id,
        loading: false,
        error: null,
      }
    })
  }, [])

  useEffect(() => {
    let cancelled = false
    void (async () => {
      const listResult = await listAiWorkspaceEvaluations()
      if (cancelled) return
      if (!listResult.ok) {
        setState((current) => ({ ...current, loading: false }))
        return
      }
      const summaries = listResult.data
      const storedId = readStoredEvaluationId()
      const selected =
        summaries.find((item) => item.evaluation_id === storedId) ??
        summaries[0]
      if (!selected) {
        setState((current) => ({
          ...current,
          summaries,
          loading: false,
        }))
        return
      }
      const detailResult = await getAiWorkspaceEvaluation(selected.evaluation_id)
      if (cancelled) return
      if (detailResult.ok) {
          const detail = detailResult.data
          const extraMatches: EvaluationProduct[] = []
          const processedMessages = detail.messages.map(m => {
            if (m.role === 'assistant' && m.markdown) {
              const { displayMarkdown, extractedMatches } = parseAssistantMarkdown(m.markdown)
              extraMatches.push(...extractedMatches)
              return { ...m, markdown: displayMarkdown }
            }
            return m
          })

          setState((current) => ({
            ...current,
            summaries,
            detailsById: {
              ...current.detailsById,
              [detail.evaluation_id]: {
                ...detail,
                messages: processedMessages,
                matches: mergeMatches(extraMatches, detail.matches ?? []),
              },
            },
          activeEvaluationId: detailResult.data.evaluation_id,
          loading: false,
          error: null,
        }))
        rememberEvaluationId(detailResult.data.evaluation_id)
      } else {
        setState((current) => ({
          ...current,
          summaries,
          loading: false,
          error: detailResult.error.message,
        }))
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const activeEvaluation = state.activeEvaluationId
    ? state.detailsById[state.activeEvaluationId] ?? null
    : null

  const stopStreaming = useCallback(() => {
    abortRef.current?.abort()
    abortRef.current = null
    isSendingRef.current = false
    setIsSending(false)
  }, [])

  const updateActive = useCallback((
    updater: (detail: EvaluationDetail) => EvaluationDetail,
  ) => {
    setState((current) => {
      const evaluationId = current.activeEvaluationId
      if (!evaluationId) return current
      const detail = current.detailsById[evaluationId]
      if (!detail) return current
      const next = updater(detail)
      return {
        ...current,
        summaries: [
          summaryFromDetail(next),
          ...current.summaries.filter(
            (item) => item.evaluation_id !== next.evaluation_id,
          ),
        ],
        detailsById: {
          ...current.detailsById,
          [next.evaluation_id]: next,
        },
      }
    })
  }, [])

  const sendEvaluationMessage = useCallback(
    async (detail: EvaluationDetail, rawMessage: string) => {
      const message = rawMessage.trim()
      if (!message || isSendingRef.current) return
      isSendingRef.current = true
      setIsSending(true)
      setState((current) => ({
        ...current,
        sendingById: {
          ...current.sendingById,
          [detail.evaluation_id]: true,
        },
        error: null,
      }))

      const assistantMessage = createLocalMessage('assistant', '', 'streaming')
      let assistantContent = ''
      let currentDetail = {
        ...detail,
        messages: [
          ...detail.messages,
          createLocalMessage('user', message),
          assistantMessage,
        ],
      }
      upsertDetail(currentDetail)

      const controller = new AbortController()
      abortRef.current = controller

      try {
        await streamAiWorkspaceResearch(
          {
            message,
            session_id: detail.agent_session_id,
            page_context: {
              route: '/AI_workspace',
              page_type: 'AI_workspace',
              title: detail.title,
            },
          },
          {
            onEvent: (event) => {
              const mapped = mapAiEventToEvaluation(event)
              if (event.type === 'message_delta' || event.type === 'message_final') {
                if (event.type === 'message_delta') {
                  const delta = String(event.data.delta ?? '')
                  assistantContent += delta
                } else {
                  assistantContent = String(event.data.content ?? assistantContent)
                }

                const { displayMarkdown, extractedMatches } = parseAssistantMarkdown(assistantContent)
                if (extractedMatches.length > 0) {
                  currentDetail = { 
                    ...currentDetail, 
                    matches: mergeMatches(extractedMatches, currentDetail.matches) 
                  }
                }
                
                assistantMessage.markdown = displayMarkdown

                currentDetail = {
                  ...currentDetail,
                  messages: currentDetail.messages.map((item) =>
                    item.id === assistantMessage.id
                      ? {
                          ...item,
                          markdown: displayMarkdown,
                          status: event.type === 'message_final' ? 'complete' : 'streaming'
                        }
                      : item,
                  ),
                }
                upsertDetail(currentDetail)
                return
              }
              if (mapped) {
                if (mapped.type === 'error') {
                  setState((current) => ({
                    ...current,
                    error: mapped.data.message,
                  }))
                  return
                }
                currentDetail = applyEvaluationStreamEvent(currentDetail, mapped)
                upsertDetail(currentDetail)
              }
            },
          },
          { signal: controller.signal },
        )
      } finally {
        abortRef.current = null
        isSendingRef.current = false
        setIsSending(false)
        setState((current) => ({
          ...current,
          sendingById: {
            ...current.sendingById,
            [detail.evaluation_id]: false,
          },
        }))
      }
    },
    [upsertDetail],
  )

  const newEvaluation = useCallback(async (customTitle?: string) => {
    stopStreaming()
    const title = customTitle || `Software Evaluation #${state.summaries.length + 1}`
    const result = await createAiWorkspaceEvaluation({ title })
    if (result.ok) {
      upsertDetail(result.data)
      return result.data
    }
    const draft = emptyEvaluationDetail('', title)
    setState((current) => ({
      ...current,
      activeEvaluationId: null,
      error: result.error.message,
    }))
    return draft
  }, [state.summaries.length, stopStreaming, upsertDetail])

  const startEvaluation = useCallback(
    async (message: string) => {
      const title = generateTitleFromMessage(message, state.summaries.length + 1)
      const detail = await newEvaluation(title)
      if (detail.evaluation_id) {
        await sendEvaluationMessage(detail, message)
      }
    },
    [newEvaluation, sendEvaluationMessage, state.summaries.length],
  )

  const sendMessage = useCallback(
    async (message: string) => {
      if (activeEvaluation) {
        await sendEvaluationMessage(activeEvaluation, message)
        return
      }
      await startEvaluation(message)
    },
    [activeEvaluation, sendEvaluationMessage, startEvaluation],
  )

  const selectEvaluation = useCallback(async (evaluationId: string) => {
    setState((current) => ({ ...current, activeEvaluationId: evaluationId }))
    const result = await getAiWorkspaceEvaluation(evaluationId)
    if (result.ok) {
      upsertDetail(result.data)
    } else {
      setState((current) => ({ ...current, error: result.error.message }))
    }
  }, [upsertDetail])

  const updateTitle = useCallback(async (evaluationId: string, title: string) => {
    const result = await updateAiWorkspaceEvaluation(evaluationId, { title })
    if (result.ok) {
      upsertDetail(result.data)
      return true
    }
    setState((current) => ({ ...current, error: result.error.message }))
    return false
  }, [upsertDetail])

  const duplicate = useCallback(async (_evaluationId: string) => {
    return
  }, [])

  const removeEvaluation = useCallback(
    async (evaluationId: string, archive: boolean) => {
      const status = archive ? 'archived' : 'deleted'
      const result = await updateAiWorkspaceEvaluation(evaluationId, { status })
      if (!result.ok) {
        setState((current) => ({ ...current, error: result.error.message }))
        return false
      }
      
      setState((current) => {
        const summaries = current.summaries.filter(
          (item) => item.evaluation_id !== evaluationId,
        )
        const detailsById = { ...current.detailsById }
        delete detailsById[evaluationId]
        const activeEvaluationId =
          current.activeEvaluationId === evaluationId
            ? summaries[0]?.evaluation_id ?? null
            : current.activeEvaluationId
        if (!activeEvaluationId) clearStoredEvaluationId()
        else if (current.activeEvaluationId === evaluationId) {
          rememberEvaluationId(activeEvaluationId)
        }
        return {
          ...current,
          summaries,
          detailsById,
          activeEvaluationId,
        }
      })
      
      // If we just changed the active one, load it
      setState((current) => {
        if (current.activeEvaluationId && !current.detailsById[current.activeEvaluationId]) {
          void selectEvaluation(current.activeEvaluationId)
        }
        return current
      })
      
      return true
    },
    [selectEvaluation],
  )

  const persistShortlist = useCallback(async (
    detail: EvaluationDetail,
    shortlist: EvaluationProduct[],
  ) => {
    const result = await updateAiWorkspaceShortlist(detail.evaluation_id, {
      items: shortlist,
    })
    if (result.ok) {
      upsertDetail(result.data)
      return true
    }
    setState((current) => ({ ...current, error: result.error.message }))
    return false
  }, [upsertDetail])

  const addToShortlist = useCallback(async (productId: string) => {
    if (!activeEvaluation) return false
    const product =
      activeEvaluation.matches.find((item) => item.product_id === productId) ||
      (activeEvaluation.recommendation?.recommended_product.product_id === productId
        ? activeEvaluation.recommendation.recommended_product
        : null)
    if (!product) return false
    if (activeEvaluation.shortlist.some((item) => item.product_id === productId)) {
      return true
    }
    return await persistShortlist(activeEvaluation, [
      ...activeEvaluation.shortlist,
      product,
    ])
  }, [activeEvaluation, persistShortlist])

  const removeFromShortlist = useCallback(async (productId: string) => {
    if (!activeEvaluation) return false
    return await persistShortlist(
      activeEvaluation,
      activeEvaluation.shortlist.filter((item) => item.product_id !== productId),
    )
  }, [activeEvaluation, persistShortlist])

  const reorderShortlist = useCallback(async (productIds: string[]) => {
    if (!activeEvaluation) return false
    const byId = new Map(
      activeEvaluation.shortlist.map((product) => [product.product_id, product]),
    )
    const next = productIds
      .map((productId) => byId.get(productId))
      .filter((product): product is EvaluationProduct => Boolean(product))
    return await persistShortlist(activeEvaluation, next)
  }, [activeEvaluation, persistShortlist])

  const generateRecommendation = useCallback(async () => {
    await sendMessage('Generate the recommendation and build the handoff document.')
    return true
  }, [sendMessage])

  return useMemo(
    () => ({
      state,
      activeEvaluation,
      isSending,
      isStartingEvaluation: isSending,
      refresh: async () => undefined,
      selectEvaluation,
      newEvaluation,
      startEvaluation,
      updateTitle,
      duplicate,
      archive: (evaluationId: string) => removeEvaluation(evaluationId, true),
      deleteEvaluation: (evaluationId: string) =>
        removeEvaluation(evaluationId, false),
      sendMessage,
      confirmRequirements: () => Promise.resolve(false),
      addToShortlist,
      removeFromShortlist,
      reorderShortlist,
      selectComparison: (productIds: string[]) => Promise.resolve(productIds.length >= 2),
      generateRecommendation,
      retryRegeneration: generateRecommendation,
      saveEvaluation: async () => true,
      getEvidence: (_productId: string): Promise<EvaluationEvidence | null> =>
        Promise.resolve(null),
      _internal: {
        mapEvent: mapAiEventToEvaluation,
        emptyDetail: emptyEvaluationDetail,
      },
      _suppressUnused: {
        updateActive,
      },
    }),
    [
      state,
      activeEvaluation,
      isSending,
      selectEvaluation,
      newEvaluation,
      startEvaluation,
      updateTitle,
      duplicate,
      removeEvaluation,
      sendMessage,
      addToShortlist,
      removeFromShortlist,
      reorderShortlist,
      generateRecommendation,
      updateActive,
    ],
  )
}

export { mapAiEventToEvaluation as mapAiStreamEvent }
