'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import {
  MessageSquare,
  Paperclip,
  RefreshCw,
  Send,
} from 'lucide-react'
import {
  BUTTON_SKEUO,
  CARD_SHADOW,
  WorkspaceLoading,
  WorkspaceShell,
  WorkspaceSignInState,
} from '@/components/workspace/WorkspaceShell'
import {
  engagementTitle,
  initials,
  relativeDate,
  timeDate,
} from '@/components/workspace/workspace-format'
import { useCurrentUserRole, useWorkspace } from '@/features/workspace'
import type { WorkspaceConversation, WorkspaceEngagement, WorkspaceMessage } from '@/features/workspace/types'
import type { NormalizedError } from '@/lib/service-apis/error-utils'

export default function WorkspaceConversationsPage() {
  const state = useCurrentUserRole()
  const workspace = useWorkspace()
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
        const requested = typeof window !== 'undefined'
          ? new URLSearchParams(window.location.search).get('conversation')
          : null
        setConversations(result.data.conversations)
        setSelectedId((current) => current ?? requested ?? result.data.conversations[0]?.id ?? null)
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
  }, [state.isPending, state.user, workspace])

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
      <main className="flex min-w-0 flex-1 flex-col">
        <header className="flex flex-wrap items-center justify-between gap-[16px] border-b border-[#e9eaeb] bg-white px-[24px] py-[20px]">
          <div className="flex flex-col gap-[4px]">
            <h1 className="flex items-center gap-[10px] text-[24px] font-semibold leading-[32px] text-[#181d27]">
              <MessageSquare size={22} className="text-[#155eef]" />
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

        <div className="flex min-h-0 flex-1 flex-col xl:flex-row">
          <section className="flex flex-col border-b border-[#e9eaeb] bg-white xl:w-[380px] xl:shrink-0 xl:border-b-0 xl:border-r">
            <div className="border-b border-[#e9eaeb] px-[16px] py-[14px]">
              <p className="text-[12px] font-medium uppercase tracking-[0.04em] text-[#717680]">Threads</p>
            </div>
            <div className="flex flex-1 flex-col gap-[4px] overflow-y-auto p-[8px]">
              {conversations.length === 0 && (
                <p className="px-[12px] py-[24px] text-center text-[14px] leading-[20px] text-[#717680]">
                  No messages yet.
                </p>
              )}
              {conversations.map((conversation) => {
                const active = conversation.id === selected?.id
                const engagement = engagements.find((item) => item.id === conversation.engagementId)
                const title = conversation.subject || (engagement ? engagementTitle(engagement, state.role) : 'Engagement')
                return (
                  <button
                    key={conversation.id}
                    type="button"
                    onClick={() => setSelectedId(conversation.id)}
                    className={`rounded-[10px] border p-[12px] text-left transition-colors ${
                      active ? 'border-[#155eef] bg-[#f5f8ff]' : 'border-transparent hover:bg-[#fafafa]'
                    }`}
                  >
                    <div className="flex items-center gap-[10px]">
                      <span className="flex size-[34px] shrink-0 items-center justify-center rounded-full bg-[#155eef] text-[12px] font-semibold text-white">
                        {initials(title)}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[14px] font-semibold leading-[20px] text-[#181d27]">
                          {title}
                        </span>
                        <span className="block truncate text-[13px] leading-[18px] text-[#535862]">
                          Last message {relativeDate(conversation.lastMessageAt)}
                        </span>
                      </span>
                    </div>
                  </button>
                )
              })}
            </div>
          </section>

          <section className="flex min-h-[640px] min-w-0 flex-1 flex-col bg-white">
            {selected ? (
              <>
                <div className={`border-b border-[#e9eaeb] bg-white px-[24px] py-[16px] ${CARD_SHADOW}`}>
                  <h2 className="text-[18px] font-semibold leading-[28px] text-[#181d27]">
                    {selected.subject || selectedEngagementLabel}
                  </h2>
                  <p className="text-[13px] leading-[18px] text-[#535862]">
                    Engagement {selectedEngagementLabel}
                  </p>
                </div>

                <div className="flex-1 overflow-y-auto px-[24px] py-[24px]">
                  {loadingMessages ? (
                    <div className="flex h-full items-center justify-center">
                      <RefreshCw size={24} className="animate-spin text-[#155eef]" />
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="flex h-full items-center justify-center">
                      <div className="max-w-[360px] text-center">
                        <MessageSquare size={32} className="mx-auto text-[#d5d7da]" />
                        <h3 className="mt-[12px] text-[18px] font-semibold text-[#181d27]">No messages yet</h3>
                        <p className="mt-[4px] text-[14px] leading-[20px] text-[#535862]">
                          Start a shared project message thread below.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="mx-auto flex max-w-[860px] flex-col gap-[12px]">
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

                <form onSubmit={sendMessage} className="border-t border-[#e9eaeb] bg-white px-[24px] py-[16px]">
                  <div className="mx-auto flex max-w-[860px] items-end gap-[10px]">
                    <button
                      type="button"
                      disabled
                      aria-label="Attachments"
                      className="flex size-[42px] shrink-0 items-center justify-center rounded-[8px] border border-[#d5d7da] bg-white text-[#a4a7ae] disabled:cursor-not-allowed"
                    >
                      <Paperclip size={18} />
                    </button>
                    <textarea
                      value={draft}
                      onChange={(event) => setDraft(event.target.value)}
                      rows={1}
                      placeholder="Write a message"
                      className="max-h-[160px] min-h-[42px] flex-1 resize-y rounded-[8px] border border-[#d5d7da] bg-white px-[14px] py-[10px] text-[14px] leading-[20px] text-[#181d27] placeholder:text-[#717680] focus:outline-none focus:ring-2 focus:ring-[#155eef]/30"
                    />
                    <button
                      type="submit"
                      disabled={sending || !draft.trim()}
                      className={`inline-flex h-[42px] items-center gap-[8px] rounded-[8px] bg-[#155eef] px-[16px] text-[14px] font-semibold leading-[20px] text-white disabled:cursor-not-allowed disabled:opacity-50 ${BUTTON_SKEUO}`}
                    >
                      <Send size={18} />
                      Send
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="flex h-full items-center justify-center">
                <div className="max-w-[360px] text-center">
                  <MessageSquare size={32} className="mx-auto text-[#d5d7da]" />
                  <h2 className="mt-[12px] text-[18px] font-semibold text-[#181d27]">No message thread selected</h2>
                  <p className="mt-[4px] text-[14px] leading-[20px] text-[#535862]">
                    Accept a request to start messaging.
                  </p>
                </div>
              </div>
            )}
          </section>
        </div>
      </main>
    </WorkspaceShell>
  )
}

function MessageBubble({ message, own }: { message: WorkspaceMessage; own: boolean }) {
  return (
    <div className={`flex ${own ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[min(680px,85%)] rounded-[14px] px-[14px] py-[10px] ${
          own ? 'bg-[#155eef] text-white' : 'border border-[#e9eaeb] bg-white text-[#252b37]'
        }`}
      >
        <p className="whitespace-pre-wrap text-[14px] leading-[20px]">{message.content || message.body}</p>
        <p className={`mt-[6px] text-[11px] leading-[16px] ${own ? 'text-white/80' : 'text-[#717680]'}`}>
          {timeDate(message.createdAt)}
        </p>
      </div>
    </div>
  )
}
