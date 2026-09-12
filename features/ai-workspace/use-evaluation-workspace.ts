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
  exportAiWorkspaceDocumentPdf,
  getAiWorkspaceEvaluation,
  listAiWorkspaceEvaluations,
  updateAiWorkspaceEvaluation,
  updateAiWorkspaceShortlist,
} from '@/features/ai-workspace/client'
import { streamAiWorkspaceResearch } from '@/features/ai-workspace/stream'
import { applyEvaluationStreamEvent, parseAssistantMarkdown, mergeMatches } from './evaluation-reducer'
import { buildComparisonRequest, buildImplementationRequest } from './journey'
import { placeSummary } from './evaluation-list'
import {
  applyResolvedProductNames,
  productIdsMissingNames,
  type ResolvedProductNames,
} from './product-names'
import { clientCatalogApi } from '@/features/catalog/shared/client-api'

import type {
  EvaluationDetail,
  EvaluationMessage,
  EvaluationProduct,
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

/** Placeholder until the gateway names the evaluation from Sam's captured goal. */
const DEFAULT_EVALUATION_TITLE = 'New evaluation'

function numberOrNull(value: unknown): number | null {
  return typeof value === 'number' && Number.isFinite(value) ? value : null
}

/**
 * Shape a gateway product into an EvaluationProduct without inventing data.
 * The gateway scores products from the agent's own 0-10 score; when it sends
 * no score at all, the card simply shows none rather than a made-up number.
 */
function normalizeStreamRecommendation(item: Record<string, unknown>): EvaluationProduct {
  const productId = String(item.product_id || item.id || item.name || 'unknown')
  const name = typeof item.product_name === 'string'
    ? item.product_name
    : (typeof item.name === 'string' ? item.name : null)
  const agentScore = numberOrNull(item.agent_score)
  const matchScore = numberOrNull(item.match_score)
    ?? (agentScore !== null ? Math.round(agentScore * 10) : null)
  const reasons = Array.isArray(item.reasons)
    ? item.reasons.map(String)
    : (typeof item.agent_reason === 'string' ? [item.agent_reason] : [])
  return {
    product_id: productId,
    product_name: name,
    profile_href: typeof item.profile_href === 'string' ? item.profile_href : `/products/${productId}`,
    available: item.available !== false,
    rank: numberOrNull(item.rank) ?? undefined,
    match_score: matchScore,
    match_strength: typeof item.match_strength === 'string' ? item.match_strength : undefined,
    best_for: typeof item.best_for === 'string'
      ? item.best_for
      : (typeof item.short_description === 'string' ? item.short_description : undefined),
    reasons,
    considerations: Array.isArray(item.considerations) ? item.considerations.map(String) : [],
    is_agent_selected: item.is_agent_selected === true,
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
    case 'profile':
      return event.data.profile
        ? { type: 'evaluation_state', data: { profile: event.data.profile } }
        : null
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
      const summaries = placeSummary(current.summaries, summaryFromDetail(detail))
      const existingDetail = current.detailsById[detail.evaluation_id]
      // Incoming server matches are the agent's own selection and win outright;
      // only keep what we already had when the server sent nothing.
      const mergedMatches = mergeMatches(existingDetail?.matches ?? [], detail.matches)

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
                // Persisted agent selections win; the markdown extraction only
                // covers sessions saved before the gateway persisted matches.
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

  // Resolve product names Sam's picks arrived without, once per product.
  const resolvedNamesRef = useRef<ResolvedProductNames>({})
  const pendingNamesRef = useRef<Set<string>>(new Set())
  const activeMatches = activeEvaluation?.matches
  const activeId = activeEvaluation?.evaluation_id
  useEffect(() => {
    if (!activeMatches || !activeId) return
    const missing = productIdsMissingNames(activeMatches)
    if (missing.length === 0) return

    const known = missing.filter((id) => resolvedNamesRef.current[id])
    if (known.length > 0) {
      setState((current) => {
        const detail = current.detailsById[activeId]
        if (!detail) return current
        const matches = applyResolvedProductNames(detail.matches, resolvedNamesRef.current)
        if (matches === detail.matches) return current
        return { ...current, detailsById: { ...current.detailsById, [activeId]: { ...detail, matches } } }
      })
    }

    const toFetch = missing.filter(
      (id) => !resolvedNamesRef.current[id] && !pendingNamesRef.current.has(id),
    )
    if (toFetch.length === 0) return
    toFetch.forEach((id) => pendingNamesRef.current.add(id))
    void Promise.all(
      toFetch.map(async (id) => {
        try {
          const result = await clientCatalogApi.products.getDetail(id)
          if (result.ok && result.data?.product_name) {
            resolvedNamesRef.current[id] = {
              product_name: result.data.product_name,
              best_for: result.data.best_for ?? result.data.short_description ?? null,
            }
          }
        } catch {
          // Leave the ID in place; the card falls back to the catalog lookup.
        } finally {
          pendingNamesRef.current.delete(id)
        }
      }),
    ).then(() => {
      setState((current) => {
        const detail = current.detailsById[activeId]
        if (!detail) return current
        const matches = applyResolvedProductNames(detail.matches, resolvedNamesRef.current)
        if (matches === detail.matches) return current
        return { ...current, detailsById: { ...current.detailsById, [activeId]: { ...detail, matches } } }
      })
    })
  }, [activeMatches, activeId])

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
        summaries: placeSummary(current.summaries, summaryFromDetail(next)),
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
    const title = customTitle || DEFAULT_EVALUATION_TITLE
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
      const detail = await newEvaluation()
      if (detail.evaluation_id) {
        await sendEvaluationMessage(detail, message)
      }
    },
    [newEvaluation, sendEvaluationMessage],
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

  /**
   * The buyer's own shortlist, kept beside Sam's suggestions.
   *
   * The lane flips under their finger and the gateway is told after, because
   * a shortlist tap is a preference, not a turn. Only the shortlist fields
   * move locally — a reply may be streaming into the same evaluation — and a
   * failed write puts the previous shortlist back rather than leaving the
   * board out of step with what was saved.
   */
  const toggleShortlist = useCallback(
    async (product: EvaluationProduct) => {
      const evaluationId = activeEvaluation?.evaluation_id
      if (!evaluationId) return
      const previous = activeEvaluation.shortlist ?? []
      const items = previous.some((item) => item.product_id === product.product_id)
        ? previous.filter((item) => item.product_id !== product.product_id)
        : [...previous, product]

      const applyShortlist = (next: EvaluationProduct[]) =>
        updateActive((detail) =>
          detail.evaluation_id === evaluationId
            ? {
                ...detail,
                shortlist: next,
                shortlist_count: next.length,
                comparison_product_ids: next.map((item) => item.product_id),
                milestones: { ...detail.milestones, shortlist_ready: next.length > 0 },
              }
            : detail,
        )

      applyShortlist(items)
      const result = await updateAiWorkspaceShortlist(evaluationId, { items })
      if (!result.ok) {
        applyShortlist(previous)
        setState((current) => ({ ...current, error: result.error.message }))
        return
      }
      applyShortlist(result.data.shortlist ?? items)
    },
    [activeEvaluation, updateActive],
  )

  // Journey actions: plain chat turns Sam acts on with its document tools.
  const requestComparisonBrief = useCallback(
    async (products: EvaluationProduct[]) => {
      if (products.length < 2) return
      await sendMessage(buildComparisonRequest(products))
    },
    [sendMessage],
  )

  const requestImplementationBrief = useCallback(
    async (product: EvaluationProduct) => {
      await sendMessage(buildImplementationRequest(product))
    },
    [sendMessage],
  )

  const exportDocumentPdf = useCallback(async (docId: string) => {
    const result = await exportAiWorkspaceDocumentPdf(docId)
    if (!result.ok) {
      setState((current) => ({ ...current, error: result.error.message }))
      return false
    }
    const url = URL.createObjectURL(result.data.blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = result.data.filename
    anchor.rel = 'noopener'
    document.body.appendChild(anchor)
    anchor.click()
    anchor.remove()
    window.setTimeout(() => URL.revokeObjectURL(url), 10_000)
    return true
  }, [])

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
      toggleShortlist,
      requestComparisonBrief,
      requestImplementationBrief,
      exportDocumentPdf,
      saveEvaluation: async () => true,
      _internal: {
        mapEvent: mapAiEventToEvaluation,
        emptyDetail: emptyEvaluationDetail,
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
      toggleShortlist,
      requestComparisonBrief,
      requestImplementationBrief,
      exportDocumentPdf,
    ],
  )
}

export { mapAiEventToEvaluation as mapAiStreamEvent }
