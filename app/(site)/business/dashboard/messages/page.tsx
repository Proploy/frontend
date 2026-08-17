'use client'

import { useState } from 'react'
import { Send } from 'lucide-react'
import { BusinessPage, BusinessPageHeader, BUTTON_SKEUO } from '@/components/business/dashboard/BusinessDashboardFrame'
import { Avatar, SectionCard } from '@/components/business/dashboard/ui'
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
            <ul className="divide-y divide-[#f0f0f1] border-b border-[#f0f0f1] md:border-b-0 md:border-r">
              {d.messages.map((m) => {
                const isActive = m.id === activeId
                return (
                  <li key={m.id}>
                    <button
                      type="button"
                      onClick={() => setActiveId(m.id)}
                      className={`flex w-full items-start gap-[12px] px-[16px] py-[14px] text-left transition-colors ${
                        isActive ? 'bg-[#f5f8ff]' : 'hover:bg-[#fafafa]'
                      }`}
                    >
                      <Avatar initial={m.from.charAt(0)} color={m.brand} />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-[8px]">
                          <p className="truncate font-semibold text-[14px] leading-[20px] text-[#181d27]">{m.from}</p>
                          <span className="shrink-0 text-[12px] text-[#717680]">{m.when}</span>
                        </div>
                        <p className="truncate text-[12px] leading-[18px] text-[#717680]">{m.project}</p>
                        <p className="truncate text-[13px] leading-[18px] text-[#535862]">{m.preview}</p>
                      </div>
                      {m.unread && <span className="mt-[6px] size-[8px] shrink-0 rounded-full bg-[#155eef]" />}
                    </button>
                  </li>
                )
              })}
            </ul>

            {/* Active thread */}
            <div className="flex min-h-[420px] flex-col">
              <div className="flex items-center gap-[12px] border-b border-[#f0f0f1] px-[20px] py-[14px]">
                <Avatar initial={active.from.charAt(0)} color={active.brand} size={38} />
                <div>
                  <p className="font-semibold text-[14px] leading-[20px] text-[#181d27]">{active.from}</p>
                  <p className="text-[12px] leading-[18px] text-[#717680]">{active.project}</p>
                </div>
              </div>

              <div className="flex flex-1 flex-col gap-[12px] overflow-y-auto bg-[#fafafa] p-[20px]">
                {thread.map((b) => (
                  <div key={b.id} className={`flex ${b.from === 'me' ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-[78%] rounded-[12px] px-[14px] py-[10px] text-[14px] leading-[20px] ${
                        b.from === 'me'
                          ? 'bg-[#155eef] text-white'
                          : 'border border-[#e9eaeb] bg-white text-[#181d27]'
                      }`}
                    >
                      {b.text}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-[10px] border-t border-[#f0f0f1] p-[16px]">
                <input
                  type="text"
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && send()}
                  placeholder={synced ? `Message ${active.from.split(' ')[0]} (live)` : `Message ${active.from.split(' ')[0]}`}
                  className={`flex-1 rounded-[8px] border border-[#d5d7da] px-[12px] py-[10px] text-[14px] leading-[20px] text-[#181d27] placeholder:text-[#717680] focus:outline-none focus:ring-2 focus:ring-[#155eef]/30 ${BUTTON_SKEUO}`}
                />
                <button
                  type="button"
                  onClick={send}
                  className={`flex size-[40px] items-center justify-center rounded-[8px] bg-[#155eef] text-white ${BUTTON_SKEUO}`}
                  aria-label="Send message"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </div>
        </SectionCard>
      </div>
    </BusinessPage>
  )
}
