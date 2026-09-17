'use client'

import { useMemo, useState } from 'react'
import { Archive, Paperclip, Phone, Search } from 'lucide-react'
import { BusinessPage, BusinessPageHeader } from '@/components/business/dashboard/BusinessDashboardFrame'
import { ChatAvatar } from '@/components/messaging/chat-avatar'
import {
  ChatBubble,
  ConversationRow,
  DayDivider,
  type ChatMessage,
  type ChatThread,
} from '@/components/messaging/chat'
import { MOCK_BUSINESS_DASHBOARD } from '@/lib/service-apis/business-dashboard-mock'
import { useDemo, addMessage, notify, DEMO_EXPERT } from '@/lib/demo/demo-store'

/**
 * The business inbox. Shares the expert inbox's chat primitives
 * (`components/messaging/chat`) rather than reimplementing a thinner version of
 * them — the two were drifting apart, with this side missing read receipts,
 * per-message avatars, day dividers and presence.
 */

const SEED: Record<string, ChatMessage[]> = {
  m1: [
    { id: 'm1-1', from: 'them', kind: 'text', day: 'today', time: '18m', text: 'UAT environment is ready for your team to test.' },
    { id: 'm1-2', from: 'you', kind: 'text', day: 'today', time: '12m', read: true, text: 'Great — I’ll get Priya’s team to run through the test scripts today.' },
    { id: 'm1-3', from: 'them', kind: 'text', day: 'today', time: '9m', text: 'Perfect. I’ll be on standby for any blockers.' },
  ],
  m2: [
    { id: 'm2-1', from: 'them', kind: 'text', day: 'today', time: '2h', text: 'Need a call to unblock the data mapping decisions.' },
    { id: 'm2-2', from: 'you', kind: 'text', day: 'today', time: '1h', read: true, text: 'Can do 3pm AEST — sending an invite now.' },
  ],
  m3: [
    { id: 'm3-1', from: 'them', kind: 'text', day: 'before', time: 'Yesterday', text: 'Dashboards shipped — sharing the walkthrough recording.' },
    { id: 'm3-2', from: 'them', kind: 'file', day: 'before', time: 'Yesterday', file: { name: 'analytics-walkthrough.pdf', size: '4.2 MB' } },
  ],
}

export default function BusinessMessagesPage() {
  const d = MOCK_BUSINESS_DASHBOARD
  const { messages: storeMsgs } = useDemo()
  const [activeId, setActiveId] = useState(d.messages[0].id)
  const [draft, setDraft] = useState('')

  const active = d.messages.find((m) => m.id === activeId) ?? d.messages[0]
  const synced = active.from === DEMO_EXPERT

  const threads: ChatThread[] = useMemo(
    () =>
      d.messages.map((m) => ({
        id: m.id,
        name: m.from,
        handle: m.project,
        time: m.when,
        preview: m.preview,
        unread: m.unread,
        online: m.from === DEMO_EXPERT,
      })),
    [d.messages],
  )
  const activeThread = threads.find((t) => t.id === activeId) ?? threads[0]

  const messages: ChatMessage[] = [
    ...(SEED[activeId] ?? []),
    ...(synced
      ? storeMsgs.map(
          (m, i): ChatMessage => ({
            id: `live-${i}`,
            from: m.from === 'business' ? 'you' : 'them',
            kind: 'text',
            day: 'today',
            time: 'now',
            read: false,
            text: m.text,
          }),
        )
      : []),
  ]

  const send = () => {
    const text = draft.trim()
    if (!text || !synced) return
    addMessage('business', text)
    notify({
      role: 'expert',
      kind: 'message',
      title: `New message from Northwind Capital`,
      body: text.length > 60 ? `${text.slice(0, 60)}…` : text,
      href: '/experts/chat',
    })
    setDraft('')
  }

  return (
    <BusinessPage>
      <BusinessPageHeader title="Messages" subtitle="Talk to every expert on your engagements in one inbox." />

      <div className="pf-card mt-[24px] flex min-h-[600px] overflow-hidden">
        {/* Thread rail */}
        <div className="flex w-[320px] shrink-0 flex-col border-r border-line">
          <div className="shrink-0 px-[16px] py-[16px]">
            <div className="relative">
              <Search size={16} className="absolute left-[12px] top-1/2 -translate-y-1/2 text-ink-muted" />
              <input
                type="text"
                placeholder="Search"
                aria-label="Search conversations"
                className="pf-input h-[34px] pl-[34px] text-[13px]"
              />
            </div>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto">
            {threads.map((t) => (
              <ConversationRow
                key={t.id}
                conversation={t}
                active={t.id === activeId}
                onSelect={() => setActiveId(t.id)}
              />
            ))}
          </div>
        </div>

        {/* Conversation */}
        <section className="flex min-w-0 flex-1 flex-col">
          <header className="flex h-[81px] shrink-0 items-center justify-between gap-[16px] border-b border-line px-[24px]">
            <div className="flex min-w-0 items-center gap-[12px]">
              <ChatAvatar name={activeThread.name} size="md" online={activeThread.online} />
              <div className="min-w-0">
                <div className="flex items-center gap-[8px]">
                  <span className="pf-h2 truncate">{activeThread.name}</span>
                  {activeThread.online && (
                    <span className="pf-pill pf-pill--ok pf-pill--dot">Online</span>
                  )}
                </div>
                <p className="pf-row-sub truncate">{activeThread.handle}</p>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-[8px]">
              <button type="button" className="pf-btn pf-btn--secondary pf-btn--sm">
                <Phone size={15} />
                Call
              </button>
              <button type="button" className="pf-btn pf-btn--secondary pf-btn--sm">
                <Archive size={15} />
                Archive
              </button>
            </div>
          </header>

          <div className="min-h-0 flex-1 overflow-y-auto px-[24px] py-[24px]">
            <div className="mx-auto flex max-w-[856px] flex-col gap-[16px]">
              {messages.map((m, i) => {
                const prev = messages[i - 1]
                const showDivider = !prev || (prev.day !== m.day && m.day === 'today')
                return (
                  <div key={m.id} className="flex flex-col gap-[16px]">
                    {showDivider && m.day === 'today' && <DayDivider label="Today" />}
                    <ChatBubble message={m} sender={activeThread} />
                  </div>
                )
              })}
            </div>
          </div>

          <div className="shrink-0 px-[24px] py-[20px]">
            <div className="mx-auto max-w-[856px] rounded-[10px] border border-line bg-white px-[14px] py-[12px] shadow-[var(--shadow-xs)] focus-within:border-cobalt">
              <textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    send()
                  }
                }}
                rows={2}
                aria-label="Message"
                placeholder={synced ? `Message ${activeThread.name} (live)` : `Message ${activeThread.name}`}
                className="min-h-[48px] w-full resize-none bg-transparent text-[15px] leading-[23px] text-ink placeholder:text-ink-muted focus:outline-none"
              />
              <div className="flex items-center justify-between pt-[8px]">
                <button
                  type="button"
                  aria-label="Attach file"
                  className="flex size-[28px] items-center justify-center rounded-[6px] text-ink-faint transition-colors hover:bg-surface-hover hover:text-ink-soft"
                >
                  <Paperclip size={18} />
                </button>
                <button
                  type="button"
                  onClick={send}
                  disabled={!draft.trim() || !synced}
                  className="text-[14px] font-semibold leading-[20px] text-cobalt-deep hover:underline disabled:cursor-not-allowed disabled:text-ink-faint disabled:no-underline"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </BusinessPage>
  )
}
