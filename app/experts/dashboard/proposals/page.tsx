'use client'

import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import {
  Building2,
  CalendarDays,
  CheckCircle2,
  Eye,
  Inbox,
  Send,
  ShieldCheck,
  Sparkles,
  Wallet,
  X,
  XCircle,
} from 'lucide-react'
import { BUTTON_SKEUO, CARD_SHADOW, DashboardShell } from '@/components/experts/dashboard/ExpertDashboardFrame'
import { REQUEST_STATUS_META, useProposals } from '@/lib/proposals/proposals-store'
import type { InboundRequest, RateModel } from '@/lib/proposals/proposals-store'

/* ------------------------------------------------------------------ format */

const money = (cents: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(cents / 100)

const budgetRange = (low: number, high: number) => `${money(low)} – ${money(high)}`

const longDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

const relativeReceived = (iso: string) => {
  const then = new Date(iso).getTime()
  const days = Math.round((Date.now() - then) / 86_400_000)
  if (days <= 0) return 'Today'
  if (days === 1) return 'Yesterday'
  if (days < 7) return `${days} days ago`
  return longDate(iso)
}

const RATE_MODEL_LABEL: Record<RateModel, string> = {
  fixed: 'Fixed price',
  hourly: 'Hourly rate',
  retainer: 'Monthly retainer',
}

const rateModelDisplay = (model: RateModel, cents: number) => {
  if (model === 'hourly') return `${money(cents)}/hr`
  if (model === 'retainer') return `${money(cents)}/mo`
  return money(cents)
}

const FILTERS: { id: 'all' | InboundRequest['status']; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'new', label: 'New' },
  { id: 'reviewing', label: 'Reviewing' },
  { id: 'proposed', label: 'Proposal sent' },
  { id: 'won', label: 'Won' },
  { id: 'declined', label: 'Declined' },
]

/* ------------------------------------------------------------------ page */

export default function ProposalsPage() {
  const { requests, getRequest, setStatus, sendProposal, declineRequest } = useProposals()
  const [selectedId, setSelectedId] = useState<string | null>(requests[0]?.id ?? null)
  const [filter, setFilter] = useState<'all' | InboundRequest['status']>('all')
  const [showSend, setShowSend] = useState(false)

  const newCount = useMemo(() => requests.filter((r) => r.status === 'new').length, [requests])

  const visible = useMemo(
    () => (filter === 'all' ? requests : requests.filter((r) => r.status === filter)),
    [requests, filter],
  )

  const selected = (selectedId && getRequest(selectedId)) || requests[0] || null

  return (
    <DashboardShell>
      <main className="flex min-w-0 flex-1 flex-col">
        <header className="flex flex-wrap items-center justify-between gap-[16px] border-b border-[#e9eaeb] bg-white px-[24px] py-[20px]">
          <div className="flex flex-col gap-[4px]">
            <h1 className="flex items-center gap-[10px] text-[24px] font-semibold leading-[32px] text-[#181d27]">
              <Inbox size={22} className="text-[#155eef]" />
              Proposals
            </h1>
            <p className="text-[14px] leading-[20px] text-[#535862]">
              Verified buyers send you scoped requests. Review the details and send a proposal in one click.
            </p>
          </div>
          <span className="inline-flex items-center gap-[8px] rounded-full bg-[#eff8ff] px-[12px] py-[6px] text-[13px] font-semibold leading-[18px] text-[#175cd3]">
            <span className="size-[8px] rounded-full bg-[#175cd3]" />
            {newCount} new {newCount === 1 ? 'request' : 'requests'}
          </span>
        </header>

        <div className="flex min-h-0 flex-1 flex-col xl:flex-row">
          {/* list */}
          <section className="flex flex-col border-b border-[#e9eaeb] bg-white xl:w-[400px] xl:shrink-0 xl:border-b-0 xl:border-r">
            <div className="border-b border-[#e9eaeb] p-[16px]">
              <div className="flex gap-[4px] overflow-x-auto">
                {FILTERS.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setFilter(f.id)}
                    className={`whitespace-nowrap rounded-[6px] px-[10px] py-[6px] text-[13px] font-semibold leading-[18px] transition-colors ${
                      filter === f.id ? 'bg-[#eff4ff] text-[#155eef]' : 'text-[#535862] hover:bg-[#fafafa]'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-1 flex-col gap-[4px] overflow-y-auto p-[8px]">
              {visible.length === 0 && (
                <p className="px-[12px] py-[24px] text-center text-[14px] leading-[20px] text-[#717680]">
                  No requests in this view.
                </p>
              )}
              {visible.map((r) => {
                const meta = REQUEST_STATUS_META[r.status]
                const active = r.id === selected?.id
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setSelectedId(r.id)}
                    className={`rounded-[10px] border p-[12px] text-left transition-colors ${
                      active ? 'border-[#155eef] bg-[#f5f8ff]' : 'border-transparent hover:bg-[#fafafa]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-[8px]">
                      <span className="min-w-0">
                        <span className="flex items-center gap-[6px]">
                          <span className="truncate text-[14px] font-semibold leading-[20px] text-[#181d27]">
                            {r.company}
                          </span>
                          {r.verified && (
                            <ShieldCheck size={14} className="shrink-0 text-[#155eef]" aria-label="Verified buyer" />
                          )}
                        </span>
                        <p className="mt-[2px] truncate text-[13px] leading-[18px] text-[#535862]">{r.role}</p>
                      </span>
                      <MatchPill score={r.matchScore} />
                    </div>

                    <p className="mt-[8px] text-[13px] font-semibold leading-[18px] text-[#181d27]">
                      {budgetRange(r.budgetLowCents, r.budgetHighCents)}
                    </p>

                    <div className="mt-[8px] flex items-center justify-between gap-[8px]">
                      <span
                        className="inline-flex items-center gap-[6px] rounded-full px-[8px] py-[2px] text-[12px] font-medium leading-[18px]"
                        style={{ color: meta.color, background: meta.bg }}
                      >
                        <span className="size-[6px] rounded-full" style={{ background: meta.color }} />
                        {meta.label}
                      </span>
                      <span className="text-[12px] leading-[18px] text-[#717680]">{relativeReceived(r.receivedAt)}</span>
                    </div>
                  </button>
                )
              })}
            </div>
          </section>

          {/* detail */}
          <section className="min-w-0 flex-1 overflow-y-auto bg-[#fafafa] p-[24px]">
            {selected ? (
              <RequestDetail
                request={selected}
                onSendClick={() => setShowSend(true)}
                onReview={() => setStatus(selected.id, 'reviewing')}
                onDecline={() => declineRequest(selected.id)}
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <div className="max-w-[360px] text-center">
                  <Inbox size={32} className="mx-auto text-[#d5d7da]" />
                  <h2 className="mt-[12px] text-[18px] font-semibold text-[#181d27]">No request selected</h2>
                  <p className="mt-[4px] text-[14px] leading-[20px] text-[#535862]">
                    Inbound requests from verified buyers will appear here.
                  </p>
                </div>
              </div>
            )}
          </section>
        </div>
      </main>

      {showSend && selected && (
        <SendProposalModal
          request={selected}
          onClose={() => setShowSend(false)}
          onSubmit={(values) => {
            sendProposal(selected.id, values)
            setShowSend(false)
          }}
        />
      )}
    </DashboardShell>
  )
}

/* ------------------------------------------------------------------ match pill */

function MatchPill({ score }: { score: number }) {
  return (
    <span className="inline-flex shrink-0 items-center gap-[4px] rounded-full bg-[#eff4ff] px-[8px] py-[2px] text-[12px] font-semibold leading-[18px] text-[#155eef]">
      <Sparkles size={12} />
      {score}% match
    </span>
  )
}

/* ------------------------------------------------------------------ detail */

function RequestDetail({
  request,
  onSendClick,
  onReview,
  onDecline,
}: {
  request: InboundRequest
  onSendClick: () => void
  onReview: () => void
  onDecline: () => void
}) {
  const meta = REQUEST_STATUS_META[request.status]
  const closed = request.status === 'won' || request.status === 'declined'

  return (
    <div className="mx-auto flex max-w-[760px] flex-col gap-[16px]">
      <article className={`rounded-[16px] border border-[#e9eaeb] bg-white ${CARD_SHADOW}`}>
        <div className="border-b border-[#e9eaeb] px-[32px] pb-[24px] pt-[32px]">
          <div className="flex items-center justify-between gap-[12px]">
            <span
              className="inline-flex items-center gap-[6px] rounded-full px-[10px] py-[3px] text-[12px] font-medium leading-[18px]"
              style={{ color: meta.color, background: meta.bg }}
            >
              <span className="size-[6px] rounded-full" style={{ background: meta.color }} />
              {meta.label}
            </span>
            <MatchPill score={request.matchScore} />
          </div>

          <div className="mt-[16px] flex items-start gap-[12px]">
            <span className="flex size-[44px] shrink-0 items-center justify-center rounded-[12px] bg-[#155eef] text-[16px] font-semibold text-white">
              {request.company.charAt(0)}
            </span>
            <div className="min-w-0">
              <h2 className="flex items-center gap-[8px] text-[24px] font-semibold leading-[32px] tracking-[-0.4px] text-[#181d27]">
                <span className="truncate">{request.company}</span>
                {request.verified && (
                  <span className="inline-flex shrink-0 items-center gap-[4px] rounded-full bg-[#ecfdf3] px-[8px] py-[2px] text-[12px] font-semibold leading-[18px] text-[#067647]">
                    <ShieldCheck size={12} /> Verified
                  </span>
                )}
              </h2>
              <p className="mt-[2px] text-[14px] leading-[20px] text-[#535862]">{request.contact}</p>
              <p className="mt-[2px] text-[14px] font-medium leading-[20px] text-[#155eef]">{request.role}</p>
            </div>
          </div>

          <div className="mt-[16px] flex flex-wrap gap-[6px]">
            {request.software.map((tag) => (
              <span
                key={tag}
                className="rounded-full border px-[10px] py-[3px] text-[12px] font-medium leading-[18px]"
                style={{ background: '#eff8ff', borderColor: '#b2ddff', color: '#175cd3' }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-px border-b border-[#e9eaeb] bg-[#e9eaeb] sm:grid-cols-2">
          <FactCell icon={<Wallet size={16} className="text-[#717680]" />} label="Budget range">
            {budgetRange(request.budgetLowCents, request.budgetHighCents)}
          </FactCell>
          <FactCell icon={<CalendarDays size={16} className="text-[#717680]" />} label="Desired start">
            {longDate(request.startDate)}
          </FactCell>
        </div>

        <div className="px-[32px] py-[24px]">
          <p className="text-[12px] font-medium uppercase tracking-[0.04em] text-[#717680]">Project scope</p>
          <p className="mt-[10px] text-[15px] leading-[24px] text-[#252b37]">{request.scope}</p>
          <p className="mt-[16px] flex items-center gap-[6px] text-[13px] leading-[18px] text-[#717680]">
            <Building2 size={14} /> Received {relativeReceived(request.receivedAt)} · {longDate(request.receivedAt)}
          </p>
        </div>
      </article>

      {request.proposal ? (
        <SentProposalCard request={request} />
      ) : (
        <div className="flex flex-wrap items-center justify-between gap-[12px] rounded-[12px] border border-[#e9eaeb] bg-white p-[16px]">
          <span className="flex items-center gap-[8px] text-[13px] leading-[18px] text-[#535862]">
            <ShieldCheck size={16} className="text-[#17b26a]" />
            Sending a proposal notifies the buyer instantly and tracks the status here.
          </span>
          <div className="flex flex-wrap items-center gap-[8px]">
            <button
              type="button"
              onClick={onDecline}
              disabled={closed}
              className={`inline-flex items-center gap-[8px] rounded-[8px] border border-[#d5d7da] bg-white px-[14px] py-[10px] text-[14px] font-semibold leading-[20px] text-[#414651] transition-colors hover:bg-[#fef3f2] hover:text-[#d92d20] disabled:cursor-not-allowed disabled:opacity-50 ${BUTTON_SKEUO}`}
            >
              <XCircle size={18} /> Decline
            </button>
            {request.status !== 'reviewing' && (
              <button
                type="button"
                onClick={onReview}
                disabled={closed}
                className={`inline-flex items-center gap-[8px] rounded-[8px] border border-[#d5d7da] bg-white px-[14px] py-[10px] text-[14px] font-semibold leading-[20px] text-[#414651] transition-colors hover:bg-[#fafafa] disabled:cursor-not-allowed disabled:opacity-50 ${BUTTON_SKEUO}`}
              >
                <Eye size={18} /> Mark as reviewing
              </button>
            )}
            <button
              type="button"
              onClick={onSendClick}
              disabled={closed}
              className={`inline-flex items-center gap-[8px] rounded-[8px] bg-[#155eef] px-[16px] py-[10px] text-[14px] font-semibold leading-[20px] text-white transition-colors hover:bg-[#004eeb] disabled:cursor-not-allowed disabled:opacity-50 ${BUTTON_SKEUO}`}
            >
              <Send size={18} /> Send proposal
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function FactCell({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="bg-white px-[32px] py-[20px]">
      <p className="flex items-center gap-[6px] text-[12px] font-medium uppercase tracking-[0.04em] text-[#717680]">
        {icon} {label}
      </p>
      <p className="mt-[6px] text-[16px] font-semibold leading-[24px] text-[#181d27]">{children}</p>
    </div>
  )
}

/* ------------------------------------------------------------------ sent proposal */

function SentProposalCard({ request }: { request: InboundRequest }) {
  const proposal = request.proposal
  if (!proposal) return null
  const meta = REQUEST_STATUS_META[request.status]

  return (
    <article className={`rounded-[16px] border border-[#e9eaeb] bg-white ${CARD_SHADOW}`}>
      <div className="flex items-center justify-between gap-[12px] border-b border-[#e9eaeb] px-[24px] py-[18px]">
        <h3 className="flex items-center gap-[8px] text-[16px] font-semibold leading-[24px] text-[#181d27]">
          <CheckCircle2 size={18} className="text-[#067647]" /> Your proposal
        </h3>
        <span
          className="inline-flex items-center gap-[6px] rounded-full px-[10px] py-[3px] text-[12px] font-medium leading-[18px]"
          style={{ color: meta.color, background: meta.bg }}
        >
          <span className="size-[6px] rounded-full" style={{ background: meta.color }} />
          {meta.label}
        </span>
      </div>

      <div className="px-[24px] py-[20px]">
        <p className="text-[15px] leading-[24px] text-[#252b37]">{proposal.summary}</p>

        <div className="mt-[20px] grid grid-cols-1 gap-[12px] sm:grid-cols-3">
          <ProposalStat label="Rate model" value={RATE_MODEL_LABEL[proposal.rateModel]} />
          <ProposalStat label="Amount" value={rateModelDisplay(proposal.rateModel, proposal.amountCents)} />
          <ProposalStat label="Timeline" value={`${proposal.timelineWeeks} weeks`} />
        </div>

        <p className="mt-[16px] text-[13px] leading-[18px] text-[#717680]">
          Sent {longDate(proposal.sentAt)} at{' '}
          {new Date(proposal.sentAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
        </p>
      </div>
    </article>
  )
}

function ProposalStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[12px] border border-[#e9eaeb] bg-[#fafafa] p-[14px]">
      <p className="text-[12px] font-medium uppercase tracking-[0.04em] text-[#717680]">{label}</p>
      <p className="mt-[4px] text-[15px] font-semibold leading-[22px] text-[#181d27]">{value}</p>
    </div>
  )
}

/* ------------------------------------------------------------------ send modal */

type SendFormValues = {
  summary: string
  rateModel: RateModel
  amount: number
  timelineWeeks: number
}

function SendProposalModal({
  request,
  onClose,
  onSubmit,
}: {
  request: InboundRequest
  onClose: () => void
  onSubmit: (values: { summary: string; rateModel: RateModel; amountCents: number; timelineWeeks: number }) => void
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SendFormValues>({
    defaultValues: { summary: '', rateModel: 'fixed', amount: 0, timelineWeeks: 0 },
  })

  const submit = (v: SendFormValues) => {
    onSubmit({
      summary: v.summary.trim(),
      rateModel: v.rateModel,
      amountCents: Math.round(Number(v.amount) * 100),
      timelineWeeks: Math.round(Number(v.timelineWeeks)),
    })
  }

  const inputCls = `w-full rounded-[8px] border bg-white px-[14px] py-[10px] text-[14px] leading-[20px] text-[#181d27] placeholder:text-[#717680] focus:outline-none focus:ring-2 focus:ring-[#155eef]/30 ${BUTTON_SKEUO}`

  return (
    <Overlay onClose={onClose} title={`Send proposal — ${request.company}`}>
      <form onSubmit={handleSubmit(submit)} className="flex flex-col gap-[20px]">
        <p className="rounded-[10px] border border-[#b2ddff] bg-[#eff8ff] px-[14px] py-[10px] text-[13px] leading-[18px] text-[#175cd3]">
          Budget {budgetRange(request.budgetLowCents, request.budgetHighCents)} · Desired start{' '}
          {longDate(request.startDate)}
        </p>

        <Field label="Proposal summary" error={errors.summary?.message}>
          <textarea
            {...register('summary', { required: 'A short summary is required' })}
            rows={4}
            placeholder="Outline your approach, deliverables, and what's included…"
            className={`${inputCls} resize-y ${errors.summary ? 'border-[#fda29b]' : 'border-[#d5d7da]'}`}
          />
        </Field>

        <div className="grid grid-cols-1 gap-[12px] sm:grid-cols-3">
          <Field label="Rate model">
            <select {...register('rateModel')} className={`${inputCls} border-[#d5d7da]`}>
              <option value="fixed">Fixed price</option>
              <option value="hourly">Hourly rate</option>
              <option value="retainer">Monthly retainer</option>
            </select>
          </Field>

          <Field label="Amount (USD)" error={errors.amount?.message}>
            <input
              type="number"
              min={0}
              step="100"
              {...register('amount', {
                required: 'Required',
                valueAsNumber: true,
                min: { value: 1, message: 'Enter an amount' },
              })}
              placeholder="50000"
              className={`${inputCls} ${errors.amount ? 'border-[#fda29b]' : 'border-[#d5d7da]'}`}
            />
          </Field>

          <Field label="Timeline (weeks)" error={errors.timelineWeeks?.message}>
            <input
              type="number"
              min={1}
              step="1"
              {...register('timelineWeeks', {
                required: 'Required',
                valueAsNumber: true,
                min: { value: 1, message: 'Enter weeks' },
              })}
              placeholder="8"
              className={`${inputCls} ${errors.timelineWeeks ? 'border-[#fda29b]' : 'border-[#d5d7da]'}`}
            />
          </Field>
        </div>

        <div className="flex items-center justify-end gap-[10px] border-t border-[#e9eaeb] pt-[16px]">
          <button
            type="button"
            onClick={onClose}
            className={`rounded-[8px] border border-[#d5d7da] bg-white px-[14px] py-[10px] text-[14px] font-semibold leading-[20px] text-[#414651] ${BUTTON_SKEUO}`}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={`inline-flex items-center gap-[8px] rounded-[8px] bg-[#155eef] px-[16px] py-[10px] text-[14px] font-semibold leading-[20px] text-white transition-colors hover:bg-[#004eeb] ${BUTTON_SKEUO}`}
          >
            <Send size={18} /> Send proposal
          </button>
        </div>
      </form>
    </Overlay>
  )
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-[6px]">
      <label className="text-[14px] font-medium leading-[20px] text-[#414651]">{label}</label>
      {children}
      {error && <span className="text-[13px] leading-[18px] text-[#d92d20]">{error}</span>}
    </div>
  )
}

function Overlay({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-[#0a0d12]/40 p-[24px] backdrop-blur-[2px]"
      onClick={onClose}
    >
      <div
        className="my-[24px] w-full max-w-[640px] rounded-[16px] border border-[#e9eaeb] bg-white shadow-[0px_20px_24px_-4px_rgba(10,13,18,0.08)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[#e9eaeb] px-[24px] py-[18px]">
          <h2 className="truncate text-[18px] font-semibold leading-[28px] text-[#181d27]">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="flex size-[32px] shrink-0 items-center justify-center rounded-[6px] text-[#717680] transition-colors hover:bg-[#fafafa] hover:text-[#181d27]"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>
        <div className="p-[24px]">{children}</div>
      </div>
    </div>
  )
}
