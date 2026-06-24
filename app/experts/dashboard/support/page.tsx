'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import {
  BookOpen,
  Calendar,
  CheckCircle2,
  ChevronDown,
  ExternalLink,
  Mail,
  MessageSquare,
  Paperclip,
  Search,
  Send,
  Users,
  X,
} from 'lucide-react'
import {
  BUTTON_SKEUO,
  CARD_SHADOW,
  DashboardShell,
} from '@/components/experts/dashboard/ExpertDashboardFrame'
import { FileDropzone } from '@/components/experts/dashboard/FileDropzone'

/* ============================== Types ============================== */

type FaqCategory =
  | 'Getting started'
  | 'Clients & projects'
  | 'Payments & payouts'
  | 'Leads & sales'
  | 'Account & settings'

type Faq = { id: string; category: FaqCategory; q: string; a: string }

type TicketStatus = 'Open' | 'In progress' | 'Resolved'
type TicketPriority = 'Low' | 'Medium' | 'High'

type Ticket = {
  id: string
  subject: string
  category: FaqCategory
  priority: TicketPriority
  status: TicketStatus
  updated: string // ISO YYYY-MM-DD
  attachment?: string // chosen filename, if any
}

const TICKETS_STORAGE_KEY = 'proploy.support.tickets.v1'

/* ============================== Seed data ============================== */

const FAQ_CATEGORIES: FaqCategory[] = [
  'Getting started',
  'Clients & projects',
  'Payments & payouts',
  'Leads & sales',
  'Account & settings',
]

const FAQS: Faq[] = [
  {
    id: 'f1',
    category: 'Getting started',
    q: 'How do I get my expert profile approved?',
    a: 'Complete every required section of your profile — headline, expertise, portfolio projects and availability — then submit for review. Approval typically lands within 2 business days. You will be notified by email and your status badge updates on the dashboard.',
  },
  {
    id: 'f2',
    category: 'Getting started',
    q: 'What does my status badge mean?',
    a: 'Pending means your profile is in review. Approved means you are live and discoverable by businesses. If your status shows an action needed, open Settings to resolve the flagged items.',
  },
  {
    id: 'f3',
    category: 'Clients & projects',
    q: 'How do I track time on a project?',
    a: 'Open a client, then a project, and use the Time tab. Start the live timer or add manual entries. Mark each entry billable or non-billable — billable time flows straight into the project invoice.',
  },
  {
    id: 'f4',
    category: 'Clients & projects',
    q: 'How does the Kanban board work?',
    a: 'Each project has a board with four columns — To do, In progress, Review, Done. Drag tasks between columns to update status. Progress shown on the project overview is derived from these columns.',
  },
  {
    id: 'f5',
    category: 'Payments & payouts',
    q: 'When do I get paid?',
    a: 'Once a client pays an invoice, funds are held in escrow and released to your payout method after the agreed milestone clears. Track each transaction through the Earnings page: Awaiting client payment → Held in escrow → Paid out.',
  },
  {
    id: 'f6',
    category: 'Payments & payouts',
    q: 'What is the platform fee?',
    a: 'Proploy takes a 10% platform fee on each invoice. The fee is shown as a line item on every invoice so totals are transparent for both you and your client.',
  },
  {
    id: 'f7',
    category: 'Leads & sales',
    q: 'How are leads scored?',
    a: 'Leads carry a score and trend based on engagement and fit. Use the Leads pipeline to set follow-up dates, track deal size and move a lead through the pipeline from New to Won.',
  },
  {
    id: 'f8',
    category: 'Account & settings',
    q: 'How do I update my payout or scheduling details?',
    a: 'Open Settings from the sidebar. There you can manage your profile, connect a scheduling link, and update payout and notification preferences.',
  },
]

const TICKETS_SEED: Ticket[] = [
  { id: 'PRO-1042', subject: 'Invoice export missing line items', category: 'Payments & payouts', priority: 'High', status: 'In progress', updated: '2026-06-02' },
  { id: 'PRO-1031', subject: 'Cannot reorder Kanban tasks on Safari', category: 'Clients & projects', priority: 'Medium', status: 'Open', updated: '2026-05-29' },
  { id: 'PRO-1008', subject: 'Profile approval still pending after 4 days', category: 'Getting started', priority: 'Medium', status: 'Resolved', updated: '2026-05-21' },
]

const TICKET_STATUS_COLOR: Record<TicketStatus, string> = {
  Open: '#155eef',
  'In progress': '#f79009',
  Resolved: '#17b26a',
}
const PRIORITY_COLOR: Record<TicketPriority, string> = {
  Low: '#717680',
  Medium: '#f79009',
  High: '#d92d20',
}

type Resource =
  | { label: string; desc: string; icon: typeof BookOpen; kind: 'link'; href: string }
  | { label: string; desc: string; icon: typeof BookOpen; kind: 'soon' }

const RESOURCES: Resource[] = [
  { label: 'Documentation', desc: 'Guides and how-tos', icon: BookOpen, kind: 'link', href: '/help' },
  { label: 'Community', desc: 'Ask other experts', icon: Users, kind: 'link', href: '/guides' },
  { label: 'System status', desc: 'Live uptime & incidents', icon: ExternalLink, kind: 'soon' },
]

/* ============================== Page ============================== */

export default function SupportPage() {
  const [query, setQuery] = useState('')
  const [openFaq, setOpenFaq] = useState<string | null>(FAQS[0]?.id ?? null)

  // Tickets persist to localStorage. Start from the seed for a stable SSR
  // render, then hydrate the stored list after mount to avoid a hydration
  // mismatch. Writes are skipped until hydration completes so we never clobber
  // saved tickets with the seed.
  const [tickets, setTickets] = useState<Ticket[]>(TICKETS_SEED)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(TICKETS_STORAGE_KEY)
      if (raw) {
        const parsed: unknown = JSON.parse(raw)
        if (Array.isArray(parsed)) setTickets(parsed as Ticket[])
      }
    } catch {
      // ignore malformed storage — fall back to the seed
    }
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    try {
      window.localStorage.setItem(TICKETS_STORAGE_KEY, JSON.stringify(tickets))
    } catch {
      // storage may be unavailable (private mode / quota) — non-fatal
    }
  }, [tickets, hydrated])

  const [form, setForm] = useState<{ subject: string; category: FaqCategory; priority: TicketPriority; description: string }>({
    subject: '',
    category: 'Getting started',
    priority: 'Medium',
    description: '',
  })
  const [attachment, setAttachment] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [showSchedule, setShowSchedule] = useState(false)
  const [soonResource, setSoonResource] = useState<string | null>(null)
  const soonTimer = useRef<number | null>(null)

  const noteComingSoon = useCallback((label: string) => {
    setSoonResource(label)
    if (soonTimer.current !== null) window.clearTimeout(soonTimer.current)
    soonTimer.current = window.setTimeout(() => setSoonResource(null), 3000)
  }, [])

  useEffect(() => {
    return () => {
      if (soonTimer.current !== null) window.clearTimeout(soonTimer.current)
    }
  }, [])

  const filteredFaqs = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return FAQS
    return FAQS.filter((f) => f.q.toLowerCase().includes(q) || f.a.toLowerCase().includes(q) || f.category.toLowerCase().includes(q))
  }, [query])

  const grouped = useMemo(() => {
    return FAQ_CATEGORIES.map((cat) => ({ cat, items: filteredFaqs.filter((f) => f.category === cat) })).filter((g) => g.items.length > 0)
  }, [filteredFaqs])

  function submitTicket(e: React.FormEvent) {
    e.preventDefault()
    if (!form.subject.trim()) return
    const highest = tickets.reduce((max, t) => {
      const n = Number(t.id.replace(/\D/g, ''))
      return Number.isFinite(n) && n > max ? n : max
    }, 1042)
    const ticket: Ticket = {
      id: `PRO-${highest + 1}`,
      subject: form.subject.trim(),
      category: form.category,
      priority: form.priority,
      status: 'Open',
      updated: new Date().toISOString().slice(0, 10),
      ...(attachment ? { attachment } : {}),
    }
    setTickets((t) => [ticket, ...t])
    setForm({ subject: '', category: 'Getting started', priority: 'Medium', description: '' })
    setAttachment(null)
    setSubmitted(true)
    window.setTimeout(() => setSubmitted(false), 3500)
  }

  return (
    <DashboardShell>
      <div className="flex-1 min-w-0">
        <div className="max-w-[1280px] mx-auto px-[32px] py-[32px] flex flex-col gap-[24px]">
          {/* Header + help search */}
          <section className={`bg-white border border-[#e9eaeb] rounded-[12px] px-[24px] pt-[20px] pb-[20px] ${CARD_SHADOW}`}>
            <div className="flex flex-wrap items-start justify-between gap-[16px]">
              <div className="flex flex-col gap-[4px]">
                <div className="flex items-center gap-[8px]">
                  <h1 className="font-semibold text-[18px] leading-[28px] text-[#181d27]">Support</h1>
                  <span className="rounded-full bg-[#ecfdf3] px-[8px] py-[2px] text-[12px] font-medium text-[#067647]">
                    Avg reply &lt; 4h
                  </span>
                </div>
                <p className="font-normal text-[14px] leading-[20px] text-[#535862]">
                  Get help, browse FAQs, or contact the Proploy team.
                </p>
              </div>
              <div className="relative">
                <Search size={16} className="absolute left-[12px] top-1/2 -translate-y-1/2 text-[#717680]" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search help articles"
                  className={`w-[280px] bg-white border border-[#d5d7da] rounded-[8px] pl-[36px] pr-[12px] py-[9px] text-[14px] placeholder:text-[#717680] focus:outline-none focus:ring-2 focus:ring-[#155eef]/30 ${BUTTON_SKEUO}`}
                />
              </div>
            </div>
          </section>

          {/* Quick contact */}
          <section className="grid grid-cols-1 sm:grid-cols-3 gap-[16px]">
            <ContactCard
              icon={Mail}
              title="Email support"
              desc="support@proploy.com"
              action="Send email"
              href="mailto:support@proploy.com"
            />
            <ContactCard
              icon={MessageSquare}
              title="Live chat"
              desc="Chat with our team"
              action="Open chat"
              href="/experts/chat"
            />
            <ContactCard
              icon={Calendar}
              title="Book a call"
              desc="Talk to a specialist"
              action="Schedule"
              onClick={() => setShowSchedule(true)}
            />
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-[24px] items-start">
            {/* FAQ */}
            <section className={`bg-white border border-[#e9eaeb] rounded-[12px] overflow-hidden ${CARD_SHADOW}`}>
              <div className="px-[24px] pt-[20px] pb-[12px] border-b border-[#e9eaeb]">
                <h2 className="font-semibold text-[16px] leading-[24px] text-[#181d27]">Frequently asked questions</h2>
                <p className="font-normal text-[13px] leading-[20px] text-[#535862]">Answers to the most common expert questions.</p>
              </div>
              <div>
                {grouped.length === 0 && (
                  <div className="px-[24px] py-[40px] text-center text-[14px] text-[#717680]">No articles match “{query}”.</div>
                )}
                {grouped.map((g) => (
                  <div key={g.cat}>
                    <div className="px-[24px] pt-[16px] pb-[8px] text-[12px] font-semibold uppercase tracking-wide text-[#717680]">{g.cat}</div>
                    {g.items.map((f) => {
                      const open = openFaq === f.id
                      return (
                        <div key={f.id} className="border-t border-[#f0f1f3] first:border-t-0">
                          <button
                            type="button"
                            onClick={() => setOpenFaq(open ? null : f.id)}
                            className="flex w-full items-center justify-between gap-[12px] px-[24px] py-[14px] text-left hover:bg-[#fafafa]"
                          >
                            <span className="font-medium text-[14px] text-[#252b37]">{f.q}</span>
                            <ChevronDown size={18} className={`shrink-0 text-[#a4a7ae] transition-transform ${open ? 'rotate-180' : ''}`} />
                          </button>
                          {open && (
                            <p className="px-[24px] pb-[16px] -mt-[2px] text-[14px] leading-[22px] text-[#535862]">{f.a}</p>
                          )}
                        </div>
                      )
                    })}
                  </div>
                ))}
              </div>
            </section>

            {/* Submit a ticket */}
            <section className={`bg-white border border-[#e9eaeb] rounded-[12px] px-[24px] py-[20px] ${CARD_SHADOW}`}>
              <h2 className="font-semibold text-[16px] leading-[24px] text-[#181d27]">Submit a ticket</h2>
              <p className="font-normal text-[13px] leading-[20px] text-[#535862] mb-[16px]">Can’t find an answer? Send us the details.</p>
              <form onSubmit={submitTicket} className="flex flex-col gap-[14px]">
                <Field label="Subject">
                  <input
                    value={form.subject}
                    onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
                    placeholder="Brief summary of the issue"
                    className={inputCls}
                  />
                </Field>
                <div className="grid grid-cols-2 gap-[12px]">
                  <Field label="Category">
                    <select
                      value={form.category}
                      onChange={(e) => setForm((f) => ({ ...f, category: e.target.value as FaqCategory }))}
                      className={inputCls}
                    >
                      {FAQ_CATEGORIES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Priority">
                    <select
                      value={form.priority}
                      onChange={(e) => setForm((f) => ({ ...f, priority: e.target.value as TicketPriority }))}
                      className={inputCls}
                    >
                      {(['Low', 'Medium', 'High'] as TicketPriority[]).map((p) => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </Field>
                </div>
                <Field label="Description">
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                    placeholder="Describe what happened, and what you expected."
                    rows={4}
                    className={`${inputCls} resize-y`}
                  />
                </Field>
                <div className="flex flex-col gap-[6px]">
                  <span className="flex items-center gap-[6px] text-[13px] font-medium text-[#414651]">
                    <Paperclip size={16} className="text-[#717680]" /> Attachment
                    <span className="font-normal text-[#717680]">(optional)</span>
                  </span>
                  <FileDropzone
                    hint="Screenshots or logs — PNG, JPG, PDF up to 10MB"
                    fileName={attachment}
                    onFiles={(files) => setAttachment(files[0]?.name ?? null)}
                    onClear={() => setAttachment(null)}
                  />
                </div>
                <div className="flex items-center justify-between gap-[12px] pt-[4px]">
                  {submitted ? (
                    <span className="text-[13px] font-medium text-[#067647]">Ticket submitted — we’ll be in touch.</span>
                  ) : (
                    <span className="text-[13px] text-[#717680]">We typically reply within 4 hours.</span>
                  )}
                  <button
                    type="submit"
                    className={`flex items-center gap-[6px] bg-[#155eef] border-2 border-white/[0.12] rounded-[8px] px-[14px] py-[10px] font-semibold text-[14px] text-white ${BUTTON_SKEUO}`}
                  >
                    <Send size={16} /> Submit
                  </button>
                </div>
              </form>
            </section>
          </div>

          {/* My tickets */}
          <section className={`bg-white border border-[#e9eaeb] rounded-[12px] overflow-hidden ${CARD_SHADOW}`}>
            <div className="px-[24px] pt-[20px] pb-[16px]">
              <h2 className="font-semibold text-[16px] leading-[24px] text-[#181d27]">My tickets</h2>
              <p className="font-normal text-[13px] leading-[20px] text-[#535862]">Track the status of your support requests.</p>
            </div>
            <div className="overflow-x-auto border-t border-[#e9eaeb]">
              <table className="w-full min-w-[720px] border-collapse">
                <thead>
                  <tr className="bg-[#fafafa] border-b border-[#e9eaeb] text-left">
                    <Th className="pl-[24px]">Ticket</Th>
                    <Th>Subject</Th>
                    <Th>Category</Th>
                    <Th>Priority</Th>
                    <Th>Status</Th>
                    <Th className="pr-[24px]">Updated</Th>
                  </tr>
                </thead>
                <tbody>
                  {tickets.map((t) => (
                    <tr key={t.id} className="border-b border-[#e9eaeb] last:border-b-0 hover:bg-[#fafafa]">
                      <Td className="pl-[24px]"><span className="font-semibold text-[13px] text-[#155eef]">{t.id}</span></Td>
                      <Td>
                        <span className="flex flex-wrap items-center gap-[8px]">
                          <span className="text-[13px] text-[#252b37]">{t.subject}</span>
                          {t.attachment && (
                            <span className="inline-flex max-w-[180px] items-center gap-[4px] rounded-full border border-[#e9eaeb] bg-[#fafafa] px-[8px] py-[1px] text-[12px] font-medium text-[#414651]">
                              <Paperclip size={11} className="shrink-0 text-[#717680]" />
                              <span className="truncate">{t.attachment}</span>
                            </span>
                          )}
                        </span>
                      </Td>
                      <Td><span className="text-[13px] text-[#414651]">{t.category}</span></Td>
                      <Td>
                        <span className="inline-flex items-center gap-[6px] text-[13px] font-medium text-[#414651]">
                          <span className="size-[7px] rounded-full" style={{ background: PRIORITY_COLOR[t.priority] }} />
                          {t.priority}
                        </span>
                      </Td>
                      <Td>
                        <span className="inline-flex items-center gap-[6px] rounded-full border border-[#e9eaeb] bg-white pl-[8px] pr-[10px] py-[2px] text-[13px] font-medium text-[#414651]">
                          <span className="size-[7px] rounded-full" style={{ background: TICKET_STATUS_COLOR[t.status] }} />
                          {t.status}
                        </span>
                      </Td>
                      <Td className="pr-[24px]"><span className="text-[13px] text-[#414651] tabular-nums">{t.updated}</span></Td>
                    </tr>
                  ))}
                  {tickets.length === 0 && (
                    <tr><td colSpan={6} className="px-[24px] py-[40px] text-center text-[14px] text-[#717680]">No tickets yet.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* Resources */}
          <section className="flex flex-col gap-[8px]">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-[16px]">
              {RESOURCES.map((r) => {
                const inner = (
                  <>
                    <span className="flex size-[40px] items-center justify-center rounded-[10px] bg-[#eff4ff] text-[#155eef]">
                      <r.icon size={20} />
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-[14px] text-[#181d27]">{r.label}</p>
                      <p className="text-[13px] text-[#535862] truncate">{r.desc}</p>
                    </div>
                    <ExternalLink size={16} className="text-[#a4a7ae] group-hover:text-[#155eef]" />
                  </>
                )
                const cls = `group flex items-center gap-[14px] bg-white border border-[#e9eaeb] rounded-[12px] px-[20px] py-[16px] text-left hover:border-[#155eef]/40 ${CARD_SHADOW}`
                return r.kind === 'link' ? (
                  <Link key={r.label} href={r.href} className={cls}>
                    {inner}
                  </Link>
                ) : (
                  <button key={r.label} type="button" onClick={() => noteComingSoon(r.label)} className={cls}>
                    {inner}
                  </button>
                )
              })}
            </div>
            {soonResource && (
              <p className="text-[13px] font-medium text-[#155eef]" role="status">
                {soonResource} is coming soon — we’ll let you know when it’s live.
              </p>
            )}
          </section>
        </div>
      </div>

      {showSchedule && <ScheduleModal onClose={() => setShowSchedule(false)} />}
    </DashboardShell>
  )
}

/* ============================== Bits ============================== */

const inputCls =
  'w-full bg-white border border-[#d5d7da] rounded-[8px] px-[12px] py-[9px] text-[14px] text-[#252b37] placeholder:text-[#717680] focus:outline-none focus:ring-2 focus:ring-[#155eef]/30 shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)]'

type ContactCardProps = {
  icon: typeof Mail
  title: string
  desc: string
  action: string
} & ({ href: string; onClick?: never } | { onClick: () => void; href?: never })

function ContactCard({ icon: Icon, title, desc, action, ...rest }: ContactCardProps) {
  const cls = `group flex flex-col gap-[12px] bg-white border border-[#e9eaeb] rounded-[12px] px-[20px] py-[18px] text-left hover:border-[#155eef]/40 ${CARD_SHADOW}`
  const inner = (
    <>
      <span className="flex size-[40px] items-center justify-center rounded-[10px] bg-[#eff4ff] text-[#155eef]">
        <Icon size={20} />
      </span>
      <div>
        <p className="font-semibold text-[14px] text-[#181d27]">{title}</p>
        <p className="text-[13px] text-[#535862]">{desc}</p>
      </div>
      <span className="text-[13px] font-semibold text-[#155eef] group-hover:underline">{action} →</span>
    </>
  )
  if ('href' in rest && rest.href) {
    return (
      <Link href={rest.href} className={cls}>
        {inner}
      </Link>
    )
  }
  return (
    <button type="button" onClick={rest.onClick} className={cls}>
      {inner}
    </button>
  )
}

function ScheduleModal({ onClose }: { onClose: () => void }) {
  const [requested, setRequested] = useState(false)
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#0a0d12]/40 p-[24px] backdrop-blur-[2px]"
      onClick={onClose}
    >
      <div
        className={`w-full max-w-[440px] rounded-[16px] border border-[#e9eaeb] bg-white ${CARD_SHADOW}`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Book a call"
      >
        <div className="flex items-center justify-between border-b border-[#e9eaeb] px-[24px] py-[18px]">
          <h2 className="flex items-center gap-[8px] text-[18px] font-semibold leading-[28px] text-[#181d27]">
            <Calendar size={18} className="text-[#155eef]" /> Book a call
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="flex size-[32px] items-center justify-center rounded-[6px] text-[#717680] transition-colors hover:bg-[#fafafa] hover:text-[#181d27]"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>
        <div className="px-[24px] py-[20px]">
          {requested ? (
            <div className="flex flex-col items-center gap-[10px] py-[12px] text-center">
              <span className="flex size-[44px] items-center justify-center rounded-full bg-[#ecfdf3] text-[#067647]">
                <CheckCircle2 size={24} />
              </span>
              <p className="text-[15px] font-semibold text-[#181d27]">Call requested</p>
              <p className="text-[14px] leading-[20px] text-[#535862]">
                A Proploy specialist will email you at the address on your account to confirm a time.
              </p>
            </div>
          ) : (
            <p className="text-[14px] leading-[20px] text-[#535862]">
              Request a 30-minute call with a Proploy specialist. We’ll reach out to confirm a time that
              works for you — no calendar required.
            </p>
          )}
        </div>
        <div className="flex items-center justify-end gap-[10px] border-t border-[#e9eaeb] px-[24px] py-[16px]">
          {requested ? (
            <button
              type="button"
              onClick={onClose}
              className={`rounded-[8px] bg-[#155eef] px-[16px] py-[10px] text-[14px] font-semibold leading-[20px] text-white transition-colors hover:bg-[#004eeb] ${BUTTON_SKEUO}`}
            >
              Done
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={onClose}
                className={`rounded-[8px] border border-[#d5d7da] bg-white px-[14px] py-[10px] text-[14px] font-semibold leading-[20px] text-[#414651] ${BUTTON_SKEUO}`}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => setRequested(true)}
                className={`rounded-[8px] bg-[#155eef] px-[16px] py-[10px] text-[14px] font-semibold leading-[20px] text-white transition-colors hover:bg-[#004eeb] ${BUTTON_SKEUO}`}
              >
                Request a call
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-[6px]">
      <span className="text-[13px] font-medium text-[#414651]">{label}</span>
      {children}
    </label>
  )
}

function Th({ children, className = '' }: { children?: React.ReactNode; className?: string }) {
  return <th className={`font-medium text-[12px] text-[#717680] px-[16px] py-[12px] ${className}`}>{children}</th>
}
function Td({ children, className = '' }: { children?: React.ReactNode; className?: string }) {
  return <td className={`px-[16px] py-[14px] align-middle ${className}`}>{children}</td>
}
