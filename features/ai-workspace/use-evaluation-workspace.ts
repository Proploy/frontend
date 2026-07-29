'use client'

import {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'react'
import {
  addShortlistProduct,
  archiveEvaluation,
  confirmRequirements,
  createEvaluation,
  deleteEvaluation,
  duplicateEvaluation,
  generateRecommendation,
  getEvaluation,
  getEvidence,
  listEvaluations,
  removeShortlistProduct,
  renameEvaluation,
  reorderShortlist,
  retryRegeneration,
  saveEvaluation,
  setComparisonSelection,
  shouldReloadEvaluationAfterStream,
  streamEvaluationResearch,
} from './evaluation-client'
import {
  createInitialEvaluationState,
  evaluationWorkspaceReducer,
  shouldPollRegeneration,
} from './evaluation-state'
import type {
  EvaluationDetail,
  EvaluationEvidence,
  EvaluationMessage,
} from './evaluation-types'

function errorMessage(result: { ok: boolean; error?: { message?: string } }) {
  return result.error?.message || 'The workspace could not be updated'
}

export function useEvaluationWorkspace() {
  const [state, dispatch] = useReducer(
    evaluationWorkspaceReducer,
    undefined,
    createInitialEvaluationState,
  )
  const abortRef = useRef<AbortController | null>(null)
  const refreshSequenceRef = useRef(0)
  const startingEvaluationRef = useRef(false)
  const [isStartingEvaluation, setIsStartingEvaluation] =
    useState(false)

  const loadDetail = useCallback(async (evaluationId: string) => {
    const result = await getEvaluation(evaluationId)
    if (result.ok) {
      dispatch({ type: 'detail_loaded', detail: result.data })
      dispatch({ type: 'error', message: null })
      return result.data
    }
    dispatch({ type: 'error', message: errorMessage(result) })
    return null
  }, [])

  const refresh = useCallback(async () => {
    const requestId = ++refreshSequenceRef.current
    dispatch({ type: 'loading', value: true })
    dispatch({ type: 'error', message: null })
    const result = await listEvaluations()
    if (requestId !== refreshSequenceRef.current) return
    if (!result.ok) {
      dispatch({ type: 'error', message: errorMessage(result) })
      dispatch({ type: 'loading', value: false })
      return
    }
    dispatch({
      type: 'summaries_loaded',
      summaries: result.data.evaluations,
    })
    const requestedEvaluationId =
      typeof window === 'undefined'
        ? null
        : new URL(window.location.href).searchParams.get('evaluation')
    const requestedEvaluation = result.data.evaluations.find(
      (evaluation) =>
        evaluation.evaluation_id === requestedEvaluationId,
    )
    const initialEvaluation =
      requestedEvaluation ?? result.data.evaluations[0]
    if (initialEvaluation) {
      dispatch({
        type: 'evaluation_selected',
        evaluationId: initialEvaluation.evaluation_id,
      })
      const detail = await getEvaluation(
        initialEvaluation.evaluation_id,
      )
      if (requestId !== refreshSequenceRef.current) return
      if (detail.ok) {
        dispatch({ type: 'detail_loaded', detail: detail.data })
      } else {
        dispatch({ type: 'error', message: errorMessage(detail) })
        dispatch({ type: 'loading', value: false })
        return
      }
    }
    if (requestId !== refreshSequenceRef.current) return
    dispatch({ type: 'error', message: null })
    dispatch({ type: 'loading', value: false })
  }, [])

  useEffect(() => {
    void refresh()
    return () => abortRef.current?.abort()
  }, [refresh])

  const selectEvaluation = useCallback(
    async (evaluationId: string) => {
      dispatch({ type: 'evaluation_selected', evaluationId })
      if (!state.detailsById[evaluationId]) {
        await loadDetail(evaluationId)
      }
    },
    [loadDetail, state.detailsById],
  )

  const newEvaluation = useCallback(async () => {
    const result = await createEvaluation({ title: 'New evaluation' })
    if (!result.ok) {
      dispatch({ type: 'error', message: errorMessage(result) })
      return null
    }
    dispatch({ type: 'detail_loaded', detail: result.data })
    dispatch({
      type: 'evaluation_selected',
      evaluationId: result.data.evaluation_id,
    })
    return result.data
  }, [])

  const updateTitle = useCallback(
    async (evaluationId: string, title: string) => {
      const result = await renameEvaluation(evaluationId, title)
      if (result.ok) dispatch({ type: 'detail_loaded', detail: result.data })
      else dispatch({ type: 'error', message: errorMessage(result) })
    },
    [],
  )

  const duplicate = useCallback(async (evaluationId: string) => {
    const result = await duplicateEvaluation(evaluationId)
    if (result.ok) {
      dispatch({ type: 'detail_loaded', detail: result.data })
      dispatch({
        type: 'evaluation_selected',
        evaluationId: result.data.evaluation_id,
      })
    } else dispatch({ type: 'error', message: errorMessage(result) })
  }, [])

  const removeEvaluation = useCallback(
    async (evaluationId: string, archive: boolean) => {
      const result = archive
        ? await archiveEvaluation(evaluationId)
        : await deleteEvaluation(evaluationId)
      if (result.ok) {
        dispatch({ type: 'evaluation_removed', evaluationId })
      } else dispatch({ type: 'error', message: errorMessage(result) })
    },
    [],
  )

  const sendEvaluationMessage = useCallback(
    async (detail: EvaluationDetail, message: string) => {
      const evaluationId = detail.evaluation_id
      const markdown = message.trim()
      if (!markdown) return
      abortRef.current?.abort()
      const controller = new AbortController()
      abortRef.current = controller
      const userMessage: EvaluationMessage = {
        id: crypto.randomUUID(),
        role: 'user',
        markdown,
        artifact_refs: [],
        status: 'complete',
      }
      dispatch({
        type: 'detail_loaded',
        detail: {
          ...detail,
          messages: [...detail.messages, userMessage],
        },
      })
      dispatch({ type: 'sending', evaluationId, value: true })
      try {
        const result = await streamEvaluationResearch(
          evaluationId,
          markdown,
          (event) => {
            dispatch({
              type: 'stream_event',
              evaluationId,
              event,
            })
          },
          controller.signal,
        )
        if (shouldReloadEvaluationAfterStream(result)) {
          await loadDetail(evaluationId)
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          dispatch({
            type: 'stream_event',
            evaluationId,
            event: {
              type: 'error',
              data: {
                code: 'STREAM_INTERRUPTED',
                message:
                  error instanceof Error
                    ? error.message
                    : 'SAM’s response was interrupted',
                retryable: true,
              },
            },
          })
          dispatch({
            type: 'error',
            message:
              'SAM’s response was interrupted. Your latest message and any received response have been kept.',
          })
        }
      } finally {
        dispatch({ type: 'sending', evaluationId, value: false })
        if (abortRef.current === controller) abortRef.current = null
      }
    },
    [loadDetail],
  )

  const sendMessage = useCallback(
    async (message: string) => {
      const evaluationId = state.activeEvaluationId
      const detail = evaluationId
        ? state.detailsById[evaluationId]
        : null
      if (!detail) return
      await sendEvaluationMessage(detail, message)
    },
    [
      sendEvaluationMessage,
      state.activeEvaluationId,
      state.detailsById,
    ],
  )

  const startEvaluation = useCallback(
    async (message: string) => {
      if (startingEvaluationRef.current) return
      startingEvaluationRef.current = true
      setIsStartingEvaluation(true)
      try {
        const detail = await newEvaluation()
        if (!detail) return
        await sendEvaluationMessage(detail, message)
      } finally {
        startingEvaluationRef.current = false
        setIsStartingEvaluation(false)
      }
    },
    [newEvaluation, sendEvaluationMessage],
  )

  const mutateAndReload = useCallback(
    async (
      evaluationId: string,
      mutation: () => Promise<{
        ok: boolean
        error?: { message?: string }
      }>,
    ) => {
      const result = await mutation()
      if (!result.ok) {
        dispatch({ type: 'error', message: errorMessage(result) })
        return false
      }
      await loadDetail(evaluationId)
      return true
    },
    [loadDetail],
  )

  const mutateShortlist = useCallback(
    async (
      evaluationId: string,
      mutation: () => ReturnType<typeof addShortlistProduct>,
    ) => {
      const result = await mutation()
      if (!result.ok) {
        dispatch({ type: 'error', message: errorMessage(result) })
        return false
      }
      dispatch({
        type: 'shortlist_replaced',
        evaluationId,
        items: result.data.items,
      })
      dispatch({ type: 'error', message: null })
      await loadDetail(evaluationId)
      return true
    },
    [loadDetail],
  )

  const activeEvaluation: EvaluationDetail | null =
    state.activeEvaluationId
      ? state.detailsById[state.activeEvaluationId] ?? null
      : null
  const pollingEvaluationId = activeEvaluation?.evaluation_id
  const pollingRegenerationStatus =
    activeEvaluation?.regeneration_status
  const pollingIsSending = pollingEvaluationId
    ? Boolean(state.sendingById[pollingEvaluationId])
    : false

  useEffect(() => {
    if (
      !pollingEvaluationId ||
      !pollingRegenerationStatus ||
      pollingIsSending ||
      !shouldPollRegeneration(pollingRegenerationStatus)
    ) {
      return
    }
    const interval = window.setInterval(() => {
      void loadDetail(pollingEvaluationId)
    }, 1200)
    return () => window.clearInterval(interval)
  }, [
    loadDetail,
    pollingEvaluationId,
    pollingIsSending,
    pollingRegenerationStatus,
  ])

  return useMemo(
    () => ({
      state,
      activeEvaluation,
      isSending: state.activeEvaluationId
        ? Boolean(state.sendingById[state.activeEvaluationId])
        : false,
      isStartingEvaluation,
      refresh,
      selectEvaluation,
      newEvaluation,
      startEvaluation,
      updateTitle,
      duplicate,
      archive: (evaluationId: string) =>
        removeEvaluation(evaluationId, true),
      deleteEvaluation: (evaluationId: string) =>
        removeEvaluation(evaluationId, false),
      sendMessage,
      confirmRequirements: () =>
        activeEvaluation
          ? mutateAndReload(activeEvaluation.evaluation_id, () =>
              confirmRequirements(activeEvaluation.evaluation_id),
            )
          : Promise.resolve(false),
      addToShortlist: (productId: string) =>
        activeEvaluation
          ? mutateShortlist(activeEvaluation.evaluation_id, () =>
              addShortlistProduct(
                activeEvaluation.evaluation_id,
                productId,
              ),
            )
          : Promise.resolve(false),
      removeFromShortlist: (productId: string) =>
        activeEvaluation
          ? mutateShortlist(activeEvaluation.evaluation_id, () =>
              removeShortlistProduct(
                activeEvaluation.evaluation_id,
                productId,
              ),
            )
          : Promise.resolve(false),
      reorderShortlist: (productIds: string[]) =>
        activeEvaluation
          ? mutateShortlist(activeEvaluation.evaluation_id, () =>
              reorderShortlist(
                activeEvaluation.evaluation_id,
                productIds,
              ),
            )
          : Promise.resolve(false),
      selectComparison: (productIds: string[]) =>
        activeEvaluation
          ? mutateAndReload(activeEvaluation.evaluation_id, () =>
              setComparisonSelection(
                activeEvaluation.evaluation_id,
                productIds,
              ),
            )
          : Promise.resolve(false),
      generateRecommendation: () =>
        activeEvaluation
          ? mutateAndReload(activeEvaluation.evaluation_id, () =>
              generateRecommendation(activeEvaluation.evaluation_id),
            )
          : Promise.resolve(false),
      retryRegeneration: () =>
        activeEvaluation
          ? mutateAndReload(activeEvaluation.evaluation_id, () =>
              retryRegeneration(activeEvaluation.evaluation_id),
            )
          : Promise.resolve(false),
      saveEvaluation: async () => {
        if (!activeEvaluation) return false
        const result = await saveEvaluation(
          activeEvaluation.evaluation_id,
        )
        if (!result.ok) {
          dispatch({ type: 'error', message: errorMessage(result) })
          return false
        }
        dispatch({ type: 'detail_loaded', detail: result.data })
        dispatch({ type: 'error', message: null })
        return true
      },
      getEvidence: (productId: string): Promise<EvaluationEvidence | null> =>
        activeEvaluation
          ? getEvidence(activeEvaluation.evaluation_id, productId).then(
              (result) => (result.ok ? result.data : null),
            )
          : Promise.resolve(null),
    }),
    [
      activeEvaluation,
      duplicate,
      isStartingEvaluation,
      mutateAndReload,
      mutateShortlist,
      newEvaluation,
      refresh,
      removeEvaluation,
      selectEvaluation,
      sendMessage,
      startEvaluation,
      state,
      updateTitle,
    ],
  )
}
