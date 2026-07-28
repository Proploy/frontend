'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  AI_WORKSPACE_SESSION_STORAGE_KEY,
  normalizeAiWorkspacePageContext,
  readAiWorkspaceContextHistory,
  rememberAiWorkspacePageContext,
} from '@/features/ai-workspace/context'
import { streamAiWorkspaceResearch } from '@/features/ai-workspace/stream'
import {
  appendRunDetail,
  buildAiWorkspaceResearchRequest,
  mergeToolRunDetail,
} from '@/features/ai-workspace/session-state'
import type {
  AiWorkspaceMessage,
  AiWorkspacePageContextInput,
  AiWorkspacePageContextPayload,
  AiWorkspaceProfile,
  AiWorkspaceRecommendation,
  AiWorkspaceToolCall,
} from '@/features/ai-workspace/types'

type UseAiWorkspaceOptions = {
  initialPageContext?: AiWorkspacePageContextInput
  resumeStoredSession?: boolean
  includePageContextHistory?: boolean
}

function messageStorageKey(sessionId: string): string {
  return `proploy-ai-workspace-messages:${sessionId}`
}

function safeReadMessages(sessionId: string): AiWorkspaceMessage[] {
  if (typeof window === 'undefined' || !sessionId) return []

  try {
    const raw = window.sessionStorage.getItem(messageStorageKey(sessionId))
    if (!raw) return []
    const parsed = JSON.parse(raw) as unknown
    return Array.isArray(parsed) ? parsed as AiWorkspaceMessage[] : []
  } catch {
    return []
  }
}

function persistMessages(sessionId: string, messages: AiWorkspaceMessage[]) {
  if (typeof window === 'undefined' || !sessionId) return
  window.sessionStorage.setItem(messageStorageKey(sessionId), JSON.stringify(messages))
}

function createMessage(role: AiWorkspaceMessage['role'], content: string): AiWorkspaceMessage {
  return {
    id: crypto.randomUUID(),
    role,
    content,
    createdAt: new Date().toISOString(),
    status: role === 'assistant' ? 'streaming' : 'complete',
    runDetails: role === 'assistant' ? [] : undefined,
  }
}

function readStoredSessionId(): string {
  if (typeof window === 'undefined') return ''
  return window.localStorage.getItem(AI_WORKSPACE_SESSION_STORAGE_KEY) ?? ''
}

function persistSessionId(sessionId: string) {
  if (typeof window === 'undefined' || !sessionId) return
  window.localStorage.setItem(AI_WORKSPACE_SESSION_STORAGE_KEY, sessionId)
}

function clearStoredSessionId() {
  if (typeof window === 'undefined') return
  window.localStorage.removeItem(AI_WORKSPACE_SESSION_STORAGE_KEY)
}

export function useAiWorkspace(options: UseAiWorkspaceOptions = {}) {
  const resumeStoredSession = options.resumeStoredSession ?? true
  const includePageContextHistory = options.includePageContextHistory ?? true
  const initialContext = useMemo(
    () => normalizeAiWorkspacePageContext(options.initialPageContext),
    [options.initialPageContext],
  )
  const [sessionId, setSessionIdState] = useState('')
  const [pageContext, setPageContextState] = useState<AiWorkspacePageContextPayload>(initialContext)
  const [messages, setMessages] = useState<AiWorkspaceMessage[]>([])
  const [isSending, setIsSending] = useState(false)
  const [lastError, setLastError] = useState<string | null>(null)
  const [lastAnswer, setLastAnswer] = useState('')
  const [recommendations, setRecommendations] = useState<AiWorkspaceRecommendation[]>([])
  const [profile, setProfile] = useState<AiWorkspaceProfile | null>(null)
  const [thinking, setThinking] = useState<{ content: string; status: string } | null>(null)
  const [toolCalls, setToolCalls] = useState<AiWorkspaceToolCall[]>([])
  const abortRef = useRef<AbortController | null>(null)
  const isSendingRef = useRef(false)

  const setSessionId = useCallback((nextSessionId: string) => {
    if (!nextSessionId) return
    persistSessionId(nextSessionId)
    setSessionIdState(nextSessionId)
  }, [])

  useEffect(() => {
    if (resumeStoredSession) {
      const storedSessionId = readStoredSessionId()
      if (storedSessionId) {
        setSessionIdState(storedSessionId)
        setMessages(safeReadMessages(storedSessionId))
      }
    }
    rememberAiWorkspacePageContext(initialContext)
  }, [initialContext, resumeStoredSession])

  useEffect(() => {
    if (!sessionId) return
    persistMessages(sessionId, messages)
  }, [sessionId, messages])

  const setPageContext = useCallback((value: AiWorkspacePageContextInput) => {
    setPageContextState((current) => {
      const next = normalizeAiWorkspacePageContext({ ...current, ...value }, current.route)
      rememberAiWorkspacePageContext(next)
      return next
    })
  }, [])

  const stopStreaming = useCallback(() => {
    abortRef.current?.abort()
    abortRef.current = null
    isSendingRef.current = false
    setIsSending(false)
  }, [])

  const resetTransientState = useCallback(() => {
    setLastError(null)
    setLastAnswer('')
    setRecommendations([])
    setProfile(null)
    setThinking(null)
    setToolCalls([])
  }, [])

  const openSession = useCallback((nextSessionId: string, restoredMessages?: AiWorkspaceMessage[]) => {
    if (!nextSessionId) return
    stopStreaming()
    persistSessionId(nextSessionId)
    setSessionIdState(nextSessionId)
    setMessages(restoredMessages ?? safeReadMessages(nextSessionId))
    resetTransientState()
  }, [resetTransientState, stopStreaming])

  const startNewSession = useCallback(() => {
    stopStreaming()
    clearStoredSessionId()
    setSessionIdState('')
    setMessages([])
    resetTransientState()
  }, [resetTransientState, stopStreaming])

  const sendMessage = useCallback(async (rawMessage: string) => {
    const message = rawMessage.trim()
    if (!message || isSendingRef.current) return

    isSendingRef.current = true
    setIsSending(true)
    setLastError(null)
    setThinking(null)

    const userMessage = createMessage('user', message)
    const assistantMessage = createMessage('assistant', '')
    const assistantMessageId = assistantMessage.id
    let assistantContent = ''
    let streamFailed = false

    setMessages((current) => [...current, userMessage, assistantMessage])

    const controller = new AbortController()
    abortRef.current = controller

    const updateAssistantMessage = (content: string, status: AiWorkspaceMessage['status'] = 'streaming') => {
      setMessages((current) => current.map((item) => (
        item.id === assistantMessageId ? { ...item, content, status } : item
      )))
    }

    try {
      await streamAiWorkspaceResearch(
        buildAiWorkspaceResearchRequest({
          message,
          sessionId,
          pageContext: normalizeAiWorkspacePageContext(pageContext),
          pageContextHistory: includePageContextHistory
            ? readAiWorkspaceContextHistory()
            : [],
          includePageContextHistory,
        }),
        {
          onEvent: (event) => {
            switch (event.type) {
              case 'session': {
                if (typeof event.data.session_id === 'string') {
                  setSessionId(event.data.session_id)
                }
                break
              }
              case 'message_delta': {
                const delta = typeof event.data.delta === 'string' ? event.data.delta : ''
                assistantContent += delta
                updateAssistantMessage(assistantContent)
                break
              }
              case 'message_final': {
                const content = typeof event.data.content === 'string' ? event.data.content : assistantContent
                assistantContent = content
                setLastAnswer(content)
                updateAssistantMessage(content, 'complete')
                break
              }
              case 'thinking': {
                const content = typeof event.data.content === 'string'
                  ? event.data.content
                  : 'Analyzing the request'
                const status = typeof event.data.status === 'string'
                  ? event.data.status
                  : 'running'
                setThinking({ content, status })
                setMessages((current) => appendRunDetail(
                  current,
                  assistantMessageId,
                  {
                    id: 'status-analysis',
                    kind: 'status',
                    label: content || 'Analyzing the request',
                    status: status === 'done' ? 'completed' : 'running',
                  },
                ))
                break
              }
              case 'tool_call': {
                setToolCalls((current) => [...current, event.data])
                setMessages((current) => mergeToolRunDetail(
                  current,
                  assistantMessageId,
                  event.data,
                ))
                break
              }
              case 'recommendations': {
                setRecommendations(Array.isArray(event.data.items) ? event.data.items : [])
                break
              }
              case 'profile': {
                if (event.data.profile) setProfile(event.data.profile)
                break
              }
              case 'done': {
                if (typeof event.data.session_id === 'string') {
                  setSessionId(event.data.session_id)
                }
                if (event.data.profile) setProfile(event.data.profile)
                if (Array.isArray(event.data.recommendations)) {
                  setRecommendations(event.data.recommendations)
                }
                if (event.data.message && typeof event.data.message.content === 'string') {
                  assistantContent = event.data.message.content
                  setLastAnswer(assistantContent)
                  updateAssistantMessage(assistantContent, 'complete')
                } else if (assistantContent) {
                  updateAssistantMessage(assistantContent, 'complete')
                }
                setMessages((current) => {
                  let next = current.map((item) => {
                    if (item.id !== assistantMessageId) return item
                    return {
                      ...item,
                      runDetails: (item.runDetails ?? []).map((detail) => (
                        detail.status === 'running'
                          ? { ...detail, status: 'completed' as const }
                          : detail
                      )),
                    }
                  })
                  if (
                    typeof event.data.timing_ms === 'number'
                    && event.data.timing_ms > 0
                  ) {
                    next = appendRunDetail(next, assistantMessageId, {
                      id: 'duration',
                      kind: 'status',
                      label: `Completed in ${(event.data.timing_ms / 1000).toFixed(1)}s`,
                      status: 'completed',
                    })
                  }
                  return next
                })
                break
              }
              case 'error': {
                const messageText = typeof event.data.message === 'string'
                  ? event.data.message
                  : 'Agent request failed'
                streamFailed = true
                setLastError(messageText)
                updateAssistantMessage(
                  assistantContent || `I hit a problem reaching the agent runtime: ${messageText}`,
                  'failed',
                )
                break
              }
              case 'unknown':
                break
              default:
                break
            }
          },
        },
        { signal: controller.signal },
      )

      if (!assistantContent && !streamFailed && !controller.signal.aborted) {
        updateAssistantMessage('No assistant response was returned.', 'complete')
      }
    } finally {
      abortRef.current = null
      isSendingRef.current = false
      setIsSending(false)
    }
  }, [
    includePageContextHistory,
    pageContext,
    sessionId,
    setSessionId,
  ])

  return useMemo(
    () => ({
      sessionId,
      pageContext,
      setPageContext,
      messages,
      sendMessage,
      stopStreaming,
      openSession,
      startNewSession,
      isSending,
      lastError,
      lastAnswer,
      recommendations,
      profile,
      thinking,
      toolCalls,
    }),
    [
      sessionId,
      pageContext,
      setPageContext,
      messages,
      sendMessage,
      stopStreaming,
      openSession,
      startNewSession,
      isSending,
      lastError,
      lastAnswer,
      recommendations,
      profile,
      thinking,
      toolCalls,
    ],
  )
}
