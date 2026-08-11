'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import {
  MessageSquare,
  RefreshCw,
} from 'lucide-react'
import {
  WorkspaceLoading,
  WorkspaceShell,
  WorkspaceSignInState,
} from '@/components/workspace/WorkspaceShell'
import {
  engagementTitle,
} from '@/components/workspace/workspace-format'
import { useCurrentUserRole, useWorkspace } from '@/features/workspace'
import { useWorkspaceQueryParam } from '@/features/workspace/use-workspace-query-param'
import {
  ConversationHeader,
  ConversationThreadCard,
  MessageBubble,
  MessageComposer,
  MessagesLayout,
} from '@/features/workspace/messages-ui'
import type { WorkspaceConversation, WorkspaceEngagement, WorkspaceMessage } from '@/features/workspace/types'
import type { NormalizedError } from '@/lib/service-apis/error-utils'

export default function WorkspaceConversationsPage() {
  const state = useCurrentUserRole()
  const workspace = useWorkspace()
  const requestedConversationId = useWorkspaceQueryParam('conversation')
  const [conversations, setConversations] = useState<WorkspaceConversation[]>([])
  const [engagements, setEngagements] = useState<WorkspaceEngagement[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [messages, setMessages] = useState<WorkspaceMessage[]>([])
  const [draft, setDraft] = useState('')
  const [error, setError] = useState<NormalizedError | null>(null)
  const [loadingConversations, setLoadingConversations] = useState(false)
  const [loadingMessages, setLoadingMessages] = useState(false)
  const [sending, setSending] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (state.isPending || !state.user) return
    let cancelled = false

    async function loadConversations() {
      setLoadingConversations(true)
      setError(null)
      const [result, engagementResult] = await Promise.all([
        workspace.listConversations(),
        workspace.listEngagements(),
      ])
      if (cancelled) return
      if (result.ok) {
        setConversations(result.data.conversations)
        setSelectedId((current) => current ?? requestedConversationId ?? result.data.conversations[0]?.id ?? null)
      } else {
        setError(result)
      }
      if (engagementResult.ok) {
        setEngagements(engagementResult.data.engagements)
      } else {
        setError((current) => current ?? engagementResult)
      }
      setLoadingConversations(false)
    }

    void loadConversations()
    return () => {
      cancelled = true
    }
  }, [requestedConversationId, state.isPending, state.user, workspace])

  useEffect(() => {
    if (
      !requestedConversationId
      || !conversations.some((conversation) => conversation.id === requestedConversationId)
    ) return
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSelectedId(requestedConversationId)
  }, [conversations, requestedConversationId])

  useEffect(() => {
    if (!selectedId) {
      return
    }
    const conversationId = selectedId
    let cancelled = false

    async function loadMessages() {
      setLoadingMessages(true)
      setError(null)
      const result = await workspace.listMessages(conversationId)
      if (cancelled) return
      if (result.ok) {
        setMessages(result.data.messages)
        void workspace.markConversationRead(conversationId)
      } else {
        setError(result)
      }
      setLoadingMessages(false)
    }

    void loadMessages()
    return () => {
      cancelled = true
    }
  }, [selectedId, workspace])

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ block: 'end' })
  }, [messages])

  const selected = useMemo(
    () => conversations.find((conversation) => conversation.id === selectedId) ?? conversations[0] ?? null,
    [conversations, selectedId],
  )
  const selectedEngagement = selected
    ? engagements.find((engagement) => engagement.id === selected.engagementId)
    : null
  const selectedEngagementLabel = selectedEngagement
    ? engagementTitle(selectedEngagement, state.role)
    : 'Engagement'

  async function sendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!selected || !draft.trim()) return
    const body = draft.trim()
    setSending(true)
    const nonce = typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(16).slice(2)}`
    const result = await workspace.postMessage(selected.id, body, nonce)
    if (result.ok) {
      setMessages((current) => [...current, result.data])
      setDraft('')
      setError(null)
    } else {
      setError(result)
    }
    setSending(false)
  }

  if (state.isPending) return <WorkspaceLoading role={state.role} />
  if (!state.user) return <WorkspaceSignInState redirect="/workspace/messages" />
  return (
    <WorkspaceShell role={state.role}>
      <main className="flex min-h-[calc(100dvh-65px)] min-w-0 flex-1 flex-col overflow-hidden bg-[#f8f9ff] lg:h-dvh lg:min-h-0">
        <header className="relative z-20 flex flex-wrap items-center justify-between gap-[16px] border-b border-[#e5e7f2] bg-white/95 px-[20px] py-[16px] backdrop-blur-xl sm:px-[24px]">
          <div className="flex items-center gap-[11px]">
            <span className="flex size-[38px] items-center justify-center rounded-[12px] bg-gradient-to-br from-[#eaf1ff] to-[#f0eaff] text-[#155eef]">
              <MessageSquare size={20} />
            </span>
            <h1 className="text-[23px] font-semibold leading-[30px] text-[#181d27]">
              Messages
            </h1>
          </div>
          {loadingConversations && <RefreshCw size={18} className="animate-spin text-[#155eef]" />}
        </header>

        {error && (
          <div className="border-b border-[#fedf89] bg-[#fffaeb] px-[24px] py-[10px] text-[13px] leading-[18px] text-[#b54708]">
            {error.error.message || 'Unable to update messages.'}
          </div>
        )}

        <MessagesLayout
          threadRail={(
            <>
              <div className="border-b border-[#e5e7f2] bg-white/45 px-[16px] py-[13px] backdrop-blur-sm">
                <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#667085]">
                  Threads
                </p>
              </div>
              <div className="flex min-h-0 flex-1 flex-col gap-[6px] overflow-y-auto p-[10px]">
                {conversations.length === 0 && (
                  <p className="px-[12px] py-[24px] text-center text-[14px] leading-[20px] text-[#717680]">
                    No messages yet.
                  </p>
                )}
                {conversations.map((conversation) => {
                  const engagement = engagements.find(
                    (item) => item.id === conversation.engagementId,
                  )
                  const title = conversation.subject
                    || (engagement
                      ? engagementTitle(engagement, state.role)
                      : 'Engagement')
                  return (
                    <ConversationThreadCard
                      key={conversation.id}
                      active={conversation.id === selected?.id}
                      title={title}
                      lastMessageAt={conversation.lastMessageAt}
                      onSelect={() => setSelectedId(conversation.id)}
                    />
                  )
                })}
              </div>
            </>
          )}
          conversationHeader={selected ? (
            <ConversationHeader
              title={selected.subject || selectedEngagementLabel}
              engagementLabel={selectedEngagementLabel}
            />
          ) : undefined}
          conversationBody={selected ? (
            <div className="flex min-h-full flex-col px-[16px] py-[22px] sm:px-[24px]">
              {loadingMessages ? (
                <div className="flex flex-1 items-center justify-center">
                  <span className="flex size-[52px] items-center justify-center rounded-[16px] bg-white/75 shadow-sm backdrop-blur-sm">
                    <RefreshCw size={22} className="animate-spin text-[#155eef]" />
                  </span>
                </div>
              ) : messages.length === 0 ? (
                <div className="flex flex-1 items-center justify-center">
                  <div className="max-w-[360px] text-center">
                    <span className="mx-auto flex size-[54px] items-center justify-center rounded-[18px] bg-gradient-to-br from-[#e8f0ff] to-[#efe7ff] text-[#155eef] shadow-sm">
                      <MessageSquare size={24} />
                    </span>
                    <h3 className="mt-[14px] text-[18px] font-semibold text-[#181d27]">
                      No messages yet
                    </h3>
                    <p className="mt-[4px] text-[14px] leading-[20px] text-[#535862]">
                      Start a shared project message thread below.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="mx-auto flex w-full max-w-[860px] flex-col gap-[13px]">
                  {messages.map((message) => (
                    <MessageBubble
                      key={message.id}
                      message={message}
                      own={message.senderUserId === state.user?.id}
                    />
                  ))}
                  <div ref={scrollRef} />
                </div>
              )}
            </div>
          ) : (
            <div className="flex min-h-full items-center justify-center px-[24px] py-[48px]">
              <div className="max-w-[360px] text-center">
                <span className="mx-auto flex size-[54px] items-center justify-center rounded-[18px] bg-gradient-to-br from-[#e8f0ff] to-[#efe7ff] text-[#155eef] shadow-sm">
                  <MessageSquare size={24} />
                </span>
                <h2 className="mt-[14px] text-[18px] font-semibold text-[#181d27]">
                  No message thread selected
                </h2>
                <p className="mt-[4px] text-[14px] leading-[20px] text-[#535862]">
                  Accept a request to start messaging.
                </p>
              </div>
            </div>
          )}
          composer={selected ? (
            <MessageComposer
              draft={draft}
              sending={sending}
              onDraftChange={setDraft}
              onSubmit={sendMessage}
            />
          ) : undefined}
        />
      </main>
    </WorkspaceShell>
  )
}
