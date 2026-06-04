'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import {
  BookOpen,
  Calendar,
  ChevronDown,
  ExternalLink,
  Mail,
  MessageSquare,
  Paperclip,
  Search,
  Send,
  Users,
} from 'lucide-react'
import {
  BUTTON_SKEUO,
  CARD_SHADOW,
  DashboardShell,
} from '@/components/experts/dashboard/ExpertDashboardFrame'

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
}

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

const RESOURCES = [
  { label: 'Documentation', desc: 'Guides and how-tos', icon: BookOpen, href: '#' },
  { label: 'Community', desc: 'Ask other experts', icon: Users, href: '#' },
  { label: 'System status', desc: 'Live uptime & incidents', icon: ExternalLink, href: '#' },
]

/* ============================== Page ============================== */

export default function SupportPage() {
  const [query, setQuery] = useState('')
  const [openFaq, setOpenFaq] = useState<string | null>(FAQS[0]?.id ?? null)
  const [tickets, setTickets] = useState<Ticket[]>(TICKETS_SEED)

  const [form, setForm] = useState<{ subject: string; category: FaqCategory; priority: TicketPriority; description: string }>({
    subject: '',
    category: 'Getting started',
    priority: 'Medium',
    description: '',
  })
  const [submitted, setSubmitted] = useState(false)

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
    const seq = 1043 + (tickets.length - TICKETS_SEED.length)
    const ticket: Ticket = {
      id: `PRO-${seq}`,
      subject: form.subject.trim(),
      category: form.category,
      priority: form.priority,
      status: 'Open',
      updated: '2026-06-04',
    }
    setTickets((t) => [ticket, ...t])
    setForm({ subject: '', category: 'Getting started', priority: 'Medium', description: '' })
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
              href="#"
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
                <button
                  type="button"
                  className="flex items-center gap-[8px] text-[13px] font-medium text-[#414651] hover:text-[#155eef]"
                >
                  <Paperclip size={16} className="text-[#717680]" /> Attach file
                </button>
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
                      <Td><span className="text-[13px] text-[#252b37]">{t.subject}</span></Td>
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
          <section className="grid grid-cols-1 sm:grid-cols-3 gap-[16px]">
            {RESOURCES.map((r) => (
              <Link
                key={r.label}
                href={r.href}
                className={`group flex items-center gap-[14px] bg-white border border-[#e9eaeb] rounded-[12px] px-[20px] py-[16px] hover:border-[#155eef]/40 ${CARD_SHADOW}`}
              >
                <span className="flex size-[40px] items-center justify-center rounded-[10px] bg-[#eff4ff] text-[#155eef]">
                  <r.icon size={20} />
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[14px] text-[#181d27]">{r.label}</p>
                  <p className="text-[13px] text-[#535862] truncate">{r.desc}</p>
                </div>
                <ExternalLink size={16} className="text-[#a4a7ae] group-hover:text-[#155eef]" />
              </Link>
            ))}
          </section>
        </div>
      </div>
    </DashboardShell>
  )
}

/* ============================== Bits ============================== */

const inputCls =
  'w-full bg-white border border-[#d5d7da] rounded-[8px] px-[12px] py-[9px] text-[14px] text-[#252b37] placeholder:text-[#717680] focus:outline-none focus:ring-2 focus:ring-[#155eef]/30 shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)]'

function ContactCard({
  icon: Icon,
  title,
  desc,
  action,
  href,
}: {
  icon: typeof Mail
  title: string
  desc: string
  action: string
  href: string
}) {
  return (
    <Link
      href={href}
      className={`group flex flex-col gap-[12px] bg-white border border-[#e9eaeb] rounded-[12px] px-[20px] py-[18px] hover:border-[#155eef]/40 ${CARD_SHADOW}`}
    >
      <span className="flex size-[40px] items-center justify-center rounded-[10px] bg-[#eff4ff] text-[#155eef]">
        <Icon size={20} />
      </span>
      <div>
        <p className="font-semibold text-[14px] text-[#181d27]">{title}</p>
        <p className="text-[13px] text-[#535862]">{desc}</p>
      </div>
      <span className="text-[13px] font-semibold text-[#155eef] group-hover:underline">{action} →</span>
    </Link>
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
