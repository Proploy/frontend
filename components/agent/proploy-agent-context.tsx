'use client'

import type { ReactNode } from 'react'
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/components/providers/auth-provider'

export type AgentPageContext = {
  route: string
  pageType: string
  title?: string
  productId?: string
  productName?: string
  productCategory?: string
  searchQuery?: string
  comparisonProductIds?: string[]
  filters?: Record<string, unknown>
  notes?: string[]
  summary?: string
}

export type AgentMessage = {
  id: string
  role: 'user' | 'assistant'
  content: string
  createdAt: string
}

type AgentContextValue = {
  isOpen: boolean
  setIsOpen: (value: boolean) => void
  sessionId: string
  userId: string
  pageContext: AgentPageContext
  setPageContext: (value: Partial<AgentPageContext>) => void
  messages: AgentMessage[]
  sendMessage: (message: string) => Promise<void>
  isSending: boolean
  lastError: string | null
  lastAnswer: string
  recommendations: Array<Record<string, unknown>>
}

const STORAGE_KEY = 'proploy-agent-session-id'

const AgentContext = createContext<AgentContextValue | null>(null)

const defaultPageContext = (route = '/'): AgentPageContext => ({
  route,
  pageType: inferPageType(route),
})

function inferPageType(route: string): string {
  if (route === '/') return 'homepage'
  if (route.startsWith('/products/') || route.startsWith('/product/')) return 'product'
  if (route.startsWith('/products')) return 'catalog'
  if (route.startsWith('/experts')) return 'experts'
  if (route.startsWith('/for-businesses')) return 'businesses'
  if (route.startsWith('/for-experts')) return 'experts_landing'
  return 'unknown'
}

function safeReadMessages(sessionId: string): AgentMessage[] {
  if (typeof window === 'undefined' || !sessionId) {
    return []
  }

  try {
    const raw = window.sessionStorage.getItem(`proploy-agent-messages:${sessionId}`)
    if (!raw) return []
    const parsed = JSON.parse(raw) as AgentMessage[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function persistMessages(sessionId: string, messages: AgentMessage[]) {
  if (typeof window === 'undefined' || !sessionId) return
  window.sessionStorage.setItem(`proploy-agent-messages:${sessionId}`, JSON.stringify(messages))
}

export function ProployAgentProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const { user } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [sessionId, setSessionId] = useState('')
  const [pageContext, setPageContextState] = useState<AgentPageContext>(defaultPageContext(pathname || '/'))
  const [messages, setMessages] = useState<AgentMessage[]>([])
  const [isSending, setIsSending] = useState(false)
  const [lastError, setLastError] = useState<string | null>(null)
  const [lastAnswer, setLastAnswer] = useState('')
  const [recommendations, setRecommendations] = useState<Array<Record<string, unknown>>>([])

  useEffect(() => {
    if (typeof window === 'undefined') return

    const existing = window.localStorage.getItem(STORAGE_KEY)
    const nextSessionId = existing || crypto.randomUUID()
    window.localStorage.setItem(STORAGE_KEY, nextSessionId)
    setSessionId(nextSessionId)
    setMessages(safeReadMessages(nextSessionId))
  }, [])

  useEffect(() => {
    if (!pathname) return
    setPageContextState((current) => ({
      ...current,
      ...defaultPageContext(pathname),
      route: pathname,
      pageType: inferPageType(pathname),
    }))
  }, [pathname])

  useEffect(() => {
    if (!sessionId) return
    persistMessages(sessionId, messages)
  }, [sessionId, messages])

  const userId = useMemo(() => {
    if (user?.id) {
      return user.id
    }
    if (sessionId) {
      return `anon:${sessionId.slice(0, 12)}`
    }
    return 'anon'
  }, [user?.id, sessionId])

  const setPageContext = useCallback((value: Partial<AgentPageContext>) => {
    setPageContextState((current) => ({
      ...current,
      ...value,
      route: value.route || current.route,
      pageType: value.pageType || current.pageType,
    }))
  }, [])

  const sendMessage = useCallback(
    async (message: string) => {
      if (!message.trim() || !sessionId) return

      setIsSending(true)
      setLastError(null)

      const userMessage: AgentMessage = {
        id: crypto.randomUUID(),
        role: 'user',
        content: message.trim(),
        createdAt: new Date().toISOString(),
      }

      setMessages((current) => [...current, userMessage])

      try {
        const response = await fetch('/api/agent/research', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            session_id: sessionId,
            user_id: userId,
            message: message.trim(),
            page_context: pageContext,
          }),
        })

        const payload = await response.json()

        if (!response.ok) {
          throw new Error(payload?.detail || payload?.message || 'Agent request failed')
        }

        const assistantText = typeof payload?.assistant_message === 'string'
          ? payload.assistant_message
          : 'I could not generate a response yet.'

        const assistantMessage: AgentMessage = {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: assistantText,
          createdAt: new Date().toISOString(),
        }

        setMessages((current) => [...current, assistantMessage])
        setLastAnswer(assistantText)
        setRecommendations(Array.isArray(payload?.recommendations) ? payload.recommendations : [])
      } catch (error) {
        const messageText = error instanceof Error ? error.message : 'Something went wrong'
        setLastError(messageText)

        const assistantMessage: AgentMessage = {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: `I hit a problem reaching the agent runtime: ${messageText}`,
          createdAt: new Date().toISOString(),
        }

        setMessages((current) => [...current, assistantMessage])
        setLastAnswer(assistantMessage.content)
      } finally {
        setIsSending(false)
      }
    },
    [pageContext, sessionId, userId]
  )

  const value = useMemo<AgentContextValue>(() => {
    return {
      isOpen,
      setIsOpen,
      sessionId,
      userId,
      pageContext,
      setPageContext,
      messages,
      sendMessage,
      isSending,
      lastError,
      lastAnswer,
      recommendations,
    }
  }, [
    isOpen,
    sessionId,
    userId,
    pageContext,
    setPageContext,
    messages,
    sendMessage,
    isSending,
    lastError,
    lastAnswer,
    recommendations,
  ])

  return <AgentContext.Provider value={value}>{children}</AgentContext.Provider>
}

export function useProployAgent() {
  const context = useContext(AgentContext)

  if (!context) {
    throw new Error('useProployAgent must be used inside ProployAgentProvider')
  }

  return context
}
