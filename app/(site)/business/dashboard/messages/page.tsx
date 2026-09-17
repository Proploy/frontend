'use client'

import { useState } from 'react'
import { Send } from 'lucide-react'
import { BusinessPage, BusinessPageHeader } from '@/components/business/dashboard/BusinessDashboardFrame'
import { SectionCard } from '@/components/business/dashboard/ui'
import {
  ConversationHeader,
  MessageBubble,
  MessageComposer,
} from '@/components/messaging'
import { Avatar } from '@/components/ui/Avatar'
import { MOCK_BUSINESS_DASHBOARD } from '@/lib/service-apis/business-dashboard-mock'
import { useDemo, addMessage, notify, DEMO_EXPERT } from '@/lib/demo/demo-store'

type Bubble = { id: string; from: 'them' | 'me'; text: string; when: string }

const THREADS: Record<string, Bubble[]> = {
  m1: [
    { id: 'm1-1', from: 'them', text: 'UAT environment is ready for your team to test.', when: '18m' },
    { id: 'm1-2', from: 'me', text: 'Great — I’ll get Priya’s team to run through the test scripts today.', when: '12m' },
    { id: 'm1-3', from: 'them', text: 'Perfect. I’ll be on standby for any blockers.', when: '9m' },
  ],
  m2: [
    { id: 'm2-1', from: 'them', text: 'Need a call to unblock the data mapping decisions.', when: '2h' },
    { id: 'm2-2', from: 'me', text: 'Can do 3pm AEST — sending an invite now.', when: '1h' },
  ],
  m3: [
    { id: 'm3-1', from: 'them', text: 'Dashboards shipped — sharing the walkthrough recording.', when: 'Yesterday' },
  ],
}

export default function BusinessMessagesPage() {
  const d = MOCK_BUSINESS_DASHBOARD
  const { messages: storeMsgs } = useDemo()
  const [activeId, setActiveId] = useState(d.messages[0].id)
  const [draft, setDraft] = useState('')
  const active = d.messages.find((m) => m.id === activeId) ?? d.messages[0]
  const synced = active.from === DEMO_EXPERT
  const thread: Bubble[] = [
    ...(THREADS[activeId] ?? []),
    ...(synced
      ? storeMsgs.map((m) => ({ from: m.from === 'business' ? 'me' : 'them', text: m.text, when: 'now' }) as Bubble)
      : []),
  ]

  const send = () => {
    const text = draft.trim()
    if (!text || !synced) return
    addMessage('business', text)
    notify({
      role: 'expert',
      kind: 'message',
      title: `New message from ${active.from === DEMO_EXPERT ? 'Northwind Capital' : active.from}`,
      body: text.length > 60 ? `${text.slice(0, 60)}…` : text,
      href: '/experts/chat',
    })
    setDraft('')
  }

  return (
    <BusinessPage>
      <BusinessPageHeader title="Messages" subtitle="Talk to every expert on your engagements in one inbox." />

      <div className="mt-[24px]">
        <SectionCard className="overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-[300px_1fr]">
            {/* Conversation list */}
            <ul className="divide-y divide-line-soft border-b border-line-soft md:border-b-0 md:border-r">
              {d.messages.map((m) => {
                const isActive = m.id === activeId
                return (
                  <li key={m.id}>
                    <button
                      type="button"
                      onClick={() => setActiveId(m.id)}
                      className={`flex w-full items-start gap-[12px] px-[16px] py-[14px] text-left transition-colors ${
                        isActive ? 'bg-cobalt-soft' : 'hover:bg-surface-hover'
                      }`}
                    >
                      <Avatar name={m.from} size="md" />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-[8px]">
                          <p className="pf-row-title truncate">{m.from}</p>
                          <span className="pf-row-meta shrink-0">{m.when}</span>
                        </div>
                        <p className="pf-micro truncate">{m.project}</p>
                        <p className="pf-row-sub truncate">{m.preview}</p>
                      </div>
                      {m.unread && <span className="mt-[6px] size-[8px] shrink-0 rounded-full bg-cobalt" />}
                    </button>
                  </li>
                )
              })}
            </ul>

            {/* Active thread — same primitives the expert workspace uses */}
            <div className="flex min-h-[460px] flex-col bg-paper">
              <ConversationHeader title={active.from} engagementLabel={active.project} />

              <div className="flex flex-1 flex-col gap-[12px] overflow-y-auto p-[20px]">
                {thread.map((b) => (
                  <MessageBubble
                    key={b.id}
                    own={b.from === 'me'}
                    message={{ content: b.text }}
                    atLabel={b.when}
                  />
                ))}
              </div>

              <MessageComposer
                draft={draft}
                sending={false}
                onDraftChange={setDraft}
                onSubmit={(event) => {
                  event.preventDefault()
                  send()
                }}
              />
            </div>
          </div>
        </SectionCard>
      </div>
    </BusinessPage>
  )
}
