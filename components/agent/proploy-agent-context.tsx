'use client'

import type { ReactNode } from 'react'
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { usePathname } from 'next/navigation'
import {
  inferAiWorkspacePageType,
  useAiWorkspace,
  type AiWorkspaceMessage,
  type AiWorkspacePageContextInput,
  type AiWorkspacePageContextPayload,
  type AiWorkspaceProfile,
  type AiWorkspaceRecommendation,
  type AiWorkspaceToolCall,
} from '@/features/ai-workspace'

export type AgentPageContext = AiWorkspacePageContextPayload
export type AgentMessage = AiWorkspaceMessage

type AgentContextValue = {
  isOpen: boolean
  setIsOpen: (value: boolean) => void
  sessionId: string
  pageContext: AgentPageContext
  setPageContext: (value: AiWorkspacePageContextInput) => void
  messages: AgentMessage[]
  sendMessage: (message: string) => Promise<void>
  stopStreaming: () => void
  isSending: boolean
  lastError: string | null
  lastAnswer: string
  recommendations: AiWorkspaceRecommendation[]
  profile: AiWorkspaceProfile | null
  thinking: { content: string; status: string } | null
  toolCalls: AiWorkspaceToolCall[]
}

const AgentContext = createContext<AgentContextValue | null>(null)

const defaultPageContext = (route = '/'): AiWorkspacePageContextInput => ({
  route,
  page_type: inferAiWorkspacePageType(route),
})

export function ProployAgentProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const initialPageContext = useMemo(
    () => defaultPageContext(pathname || '/'),
    [pathname],
  )
  const aiWorkspace = useAiWorkspace({
    initialPageContext,
  })
  const {
    setPageContext: setAiWorkspacePageContext,
    sessionId,
    pageContext,
    messages,
    sendMessage,
    stopStreaming,
    isSending,
    lastError,
    lastAnswer,
    recommendations,
    profile,
    thinking,
    toolCalls,
  } = aiWorkspace

  useEffect(() => {
    if (!pathname) return
    setAiWorkspacePageContext(defaultPageContext(pathname))
  }, [pathname, setAiWorkspacePageContext])

  const setPageContext = useCallback((value: AiWorkspacePageContextInput) => {
    setAiWorkspacePageContext(value)
  }, [setAiWorkspacePageContext])

  const value = useMemo<AgentContextValue>(() => ({
    isOpen,
    setIsOpen,
    sessionId,
    pageContext,
    setPageContext,
    messages,
    sendMessage,
    stopStreaming,
    isSending,
    lastError,
    lastAnswer,
    recommendations,
    profile,
    thinking,
    toolCalls,
  }), [
    isOpen,
    sessionId,
    pageContext,
    setPageContext,
    messages,
    sendMessage,
    stopStreaming,
    isSending,
    lastError,
    lastAnswer,
    recommendations,
    profile,
    thinking,
    toolCalls,
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
