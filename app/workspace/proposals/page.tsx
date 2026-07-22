'use client'

import { useEffect, useMemo, useState } from 'react'
import type { FormEvent, ReactNode } from 'react'
import {
  CalendarDays,
  CheckCircle2,
  Eye,
  FileText,
  Handshake,
  RefreshCw,
  Send,
  Wallet,
  XCircle,
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
  longDate,
  money,
  proposalStatusClass,
  relativeDate,
  statusLabelForViewer,
} from '@/components/workspace/workspace-format'
import { useCurrentUserRole, useWorkspace } from '@/features/workspace'
import type {
  WorkspaceEngagement,
  WorkspaceRole,
} from '@/features/workspace/types'
import type {
  ProposalStatus,
  WorkspaceProposal,
  WorkspaceProposalCreateRequest,
} from '@/features/workspace/home-types'
import type { NormalizedError } from '@/lib/service-apis/error-utils'

type ProposalFilter = 'all' | ProposalStatus

const FILTERS: { id: ProposalFilter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'draft', label: 'Draft' },
  { id: 'sent', label: 'Sent' },
  { id: 'accepted', label: 'Accepted' },
  { id: 'declined', label: 'Declined' },
  { id: 'withdrawn', label: 'Withdrawn' },
]

const EMPTY_FORM = {
  engagementId: '',
  title: '',
  summary: '',
  scope: '',
  budget: '',
  validUntil: '',
}

export default function WorkspaceProposalsPage() {
  const state = useCurrentUserRole()
  const workspace = useWorkspace()
  const [proposals, setProposals] = useState<WorkspaceProposal[]>([])
  const [engagements, setEngagements] = useState<WorkspaceEngagement[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [filter, setFilter] = useState<ProposalFilter>('all')
  const [error, setError] = useState<NormalizedError | null>(null)
  const [loading, setLoading] = useState(false)
  const [busyId, setBusyId] = useState<string | null>(null)
  const [showTemplate, setShowTemplate] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [formError, setFormError] = useState<string | null>(null)
  const [activationMessage, setActivationMessage] = useState<string | null>(null)

  useEffect(() => {
    if (state.isPending || !state.user) return
    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)
      const [proposalResult, engagementResult] = await Promise.all([
        workspace.listProposals(),
        workspace.listEngagements(),
      ])
      if (cancelled) return

      let nextError: NormalizedError | null = null
      if (proposalResult.ok) {
        setProposals(proposalResult.data.proposals)
        const firstProposal = proposalResult.data.proposals[0]
        setSelectedId((current) => current ?? firstProposal?.id ?? null)
      } else {
        nextError = proposalResult
      }

      if (engagementResult.ok) {
        setEngagements(engagementResult.data.engagements)
        setForm((current) => ({
          ...current,
          engagementId: current.engagementId || engagementResult.data.engagements[0]?.id || '',
        }))
      } else {
        nextError = nextError ?? engagementResult
      }
      setError(nextError)
      setLoading(false)
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [state.isPending, state.user, workspace])

  const isExpertWorkspace = state.role === 'expert' || state.role === 'admin'
  const isBuyerWorkspace = state.role === 'buyer'
  const visible = useMemo(
    () => (filter === 'all' ? proposals : proposals.filter((proposal) => proposal.status === filter)),
    [filter, proposals],
  )
  const selected = proposals.find((proposal) => proposal.id === selectedId) ?? proposals[0] ?? null
  const engagementMap = useMemo(
    () => new Map(engagements.map((engagement) => [engagement.id, engagement])),
    [engagements],
  )
  const sentCount = proposals.filter((proposal) => proposal.status === 'sent').length
  const filters = isExpertWorkspace
    ? FILTERS
    : FILTERS.filter((item) => item.id === 'all' || item.id === 'sent' || item.id === 'accepted' || item.id === 'declined')

  function replaceProposal(proposal: WorkspaceProposal) {
    setProposals((current) => current.map((item) => (item.id === proposal.id ? proposal : item)))
    setSelectedId(proposal.id)
    setError(null)
  }

  async function sendProposal(proposalId: string) {
    setBusyId(proposalId)
    const result = await workspace.sendProposal(proposalId)
    if (result.ok) replaceProposal(result.data)
    else setError(result)
    setBusyId(null)
  }

  async function updateProposal(
    proposalId: string,
    payload: Partial<Pick<WorkspaceProposal, 'title' | 'summary' | 'scope' | 'budgetCents' | 'validUntil'>>,
  ) {
    setBusyId(proposalId)
    const result = await workspace.updateProposal(proposalId, payload)
    if (result.ok) replaceProposal(result.data)
    else setError(result)
    setBusyId(null)
  }

  async function decideProposal(proposalId: string, decision: 'accept' | 'decline') {
    setBusyId(proposalId)
    const result = await workspace.decideProposal(proposalId, decision)
    if (result.ok) {
      replaceProposal(result.data)
      setActivationMessage(
        decision === 'accept'
          ? 'Confirmed. Your shared messages and contract workspace are now available.'
          : 'Proposal declined. The expert has been notified.',
      )
    } else setError(result)
    setBusyId(null)
  }

  async function withdrawProposal(proposalId: string) {
    setBusyId(proposalId)
    const result = await workspace.withdrawProposal(proposalId)
    if (result.ok) replaceProposal(result.data)
    else setError(result)
    setBusyId(null)
  }

  async function createProposal(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFormError(null)
    if (!isExpertWorkspace) return

    const title = form.title.trim()
    const summary = form.summary.trim()
    const scope = form.scope.trim()
    if (!form.engagementId || !title || !summary || !scope) {
      setFormError('Choose an engagement and fill in title, summary, and scope.')
      return
    }

    const budgetNumber = form.budget ? Number(form.budget) : Number.NaN
    const payload: WorkspaceProposalCreateRequest = {
      engagementId: form.engagementId,
      title,
      summary,
      scope,
      budgetCents: Number.isFinite(budgetNumber) ? Math.round(budgetNumber * 100) : null,
      validUntil: form.validUntil ? `${form.validUntil}T23:59:59` : null,
    }

    setBusyId('new')
    const result = await workspace.createProposal(payload)
    if (result.ok) {
      setProposals((current) => [result.data, ...current])
      setSelectedId(result.data.id)
      setForm(EMPTY_FORM)
      setShowTemplate(false)
      setError(null)
    } else {
      setError(result)
    }
    setBusyId(null)
  }

  if (state.isPending) return <WorkspaceLoading role={state.role} />
  if (!state.user) return <WorkspaceSignInState redirect="/workspace/proposals" />
  return (
    <WorkspaceShell role={state.role}>
      <main className="flex min-w-0 flex-1 flex-col">
        <header className="flex flex-wrap items-center justify-between gap-[16px] border-b border-[#e9eaeb] bg-white px-[24px] py-[20px]">
          <div className="flex flex-col gap-[4px]">
            <h1 className="flex items-center gap-[10px] text-[24px] font-semibold leading-[32px] text-[#181d27]">
              <Handshake size={22} className="text-[#155eef]" />
              Proposals
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-[10px]">
            <span className="inline-flex items-center gap-[8px] rounded-full bg-[#eff8ff] px-[12px] py-[6px] text-[13px] font-semibold leading-[18px] text-[#175cd3]">
              <span className="size-[8px] rounded-full bg-[#175cd3]" />
              {sentCount} sent
            </span>
            {isExpertWorkspace && (
              <button
                type="button"
                onClick={() => setShowTemplate((open) => !open)}
                className={`inline-flex items-center gap-[8px] rounded-[8px] bg-[#155eef] px-[14px] py-[10px] text-[14px] font-semibold leading-[20px] text-white ${BUTTON_SKEUO}`}
              >
                <FileText size={16} />
                New proposal
              </button>
            )}
          </div>
        </header>

        {error && (
          <div className="border-b border-[#fedf89] bg-[#fffaeb] px-[24px] py-[10px] text-[13px] leading-[18px] text-[#b54708]">
            {error.error.message || 'Unable to update proposals.'}
          </div>
        )}
        {activationMessage && (
          <div className="border-b border-[#abefc6] bg-[#ecfdf3] px-[24px] py-[10px] text-[13px] leading-[18px] text-[#067647]">
            {activationMessage} <a href="/workspace/messages" className="font-semibold underline">Open messages</a>
          </div>
        )}

        {isExpertWorkspace && showTemplate && (
          <form onSubmit={createProposal} className="border-b border-[#e9eaeb] bg-white px-[24px] py-[20px]">
            <div className="mx-auto grid max-w-[1180px] grid-cols-1 gap-[12px] lg:grid-cols-[1fr_1fr_160px_160px]">
              <Field label="Engagement">
                <select
                  value={form.engagementId}
                  onChange={(event) => setForm((current) => ({ ...current, engagementId: event.target.value }))}
                  className="w-full rounded-[8px] border border-[#d5d7da] bg-white px-[12px] py-[10px] text-[14px] leading-[20px] text-[#181d27] focus:outline-none focus:ring-2 focus:ring-[#155eef]/30"
                >
                  <option value="">Select engagement</option>
                  {engagements.map((engagement) => (
                    <option key={engagement.id} value={engagement.id}>{engagementTitle(engagement, state.role)}</option>
                  ))}
                </select>
              </Field>
              <Field label="Title">
                <input
                  value={form.title}
                  onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
                  className="w-full rounded-[8px] border border-[#d5d7da] bg-white px-[12px] py-[10px] text-[14px] leading-[20px] text-[#181d27] placeholder:text-[#717680] focus:outline-none focus:ring-2 focus:ring-[#155eef]/30"
                  placeholder="Implementation proposal"
                />
              </Field>
              <Field label="Budget USD">
                <input
                  value={form.budget}
                  onChange={(event) => setForm((current) => ({ ...current, budget: event.target.value }))}
                  type="number"
                  min="0"
                  step="100"
                  className="w-full rounded-[8px] border border-[#d5d7da] bg-white px-[12px] py-[10px] text-[14px] leading-[20px] text-[#181d27] placeholder:text-[#717680] focus:outline-none focus:ring-2 focus:ring-[#155eef]/30"
                  placeholder="40000"
                />
              </Field>
              <Field label="Valid until">
                <input
                  value={form.validUntil}
                  onChange={(event) => setForm((current) => ({ ...current, validUntil: event.target.value }))}
                  type="date"
                  className="w-full rounded-[8px] border border-[#d5d7da] bg-white px-[12px] py-[10px] text-[14px] leading-[20px] text-[#181d27] placeholder:text-[#717680] focus:outline-none focus:ring-2 focus:ring-[#155eef]/30"
                />
              </Field>
            </div>
            <div className="mx-auto mt-[12px] grid max-w-[1180px] grid-cols-1 gap-[12px] lg:grid-cols-2">
              <Field label="Summary">
                <textarea
                  value={form.summary}
                  onChange={(event) => setForm((current) => ({ ...current, summary: event.target.value }))}
                  rows={3}
                  className="w-full resize-y rounded-[8px] border border-[#d5d7da] bg-white px-[12px] py-[10px] text-[14px] leading-[20px] text-[#181d27] placeholder:text-[#717680] focus:outline-none focus:ring-2 focus:ring-[#155eef]/30"
                  placeholder="Short outcome-oriented summary"
                />
              </Field>
              <Field label="Scope">
                <textarea
                  value={form.scope}
                  onChange={(event) => setForm((current) => ({ ...current, scope: event.target.value }))}
                  rows={3}
                  className="w-full resize-y rounded-[8px] border border-[#d5d7da] bg-white px-[12px] py-[10px] text-[14px] leading-[20px] text-[#181d27] placeholder:text-[#717680] focus:outline-none focus:ring-2 focus:ring-[#155eef]/30"
                  placeholder="Deliverables, timeline, assumptions, and acceptance criteria"
                />
              </Field>
            </div>
            <div className="mx-auto mt-[12px] flex max-w-[1180px] flex-wrap items-center justify-between gap-[10px]">
              <p className="text-[13px] leading-[18px] text-[#b42318]">{formError}</p>
              <button
                type="submit"
                disabled={busyId === 'new'}
                className={`inline-flex items-center gap-[8px] rounded-[8px] bg-[#155eef] px-[16px] py-[10px] text-[14px] font-semibold leading-[20px] text-white disabled:cursor-not-allowed disabled:opacity-50 ${BUTTON_SKEUO}`}
              >
                <FileText size={18} />
                Create draft
              </button>
            </div>
          </form>
        )}

        <div className="flex min-h-0 flex-1 flex-col xl:flex-row">
          <section className="flex flex-col border-b border-[#e9eaeb] bg-white xl:w-[420px] xl:shrink-0 xl:border-b-0 xl:border-r">
            <div className="flex items-center justify-between gap-[12px] border-b border-[#e9eaeb] p-[16px]">
              <div className="flex gap-[4px] overflow-x-auto">
                {filters.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setFilter(item.id)}
                    className={`whitespace-nowrap rounded-[6px] px-[10px] py-[6px] text-[13px] font-semibold leading-[18px] transition-colors ${
                      filter === item.id ? 'bg-[#eff4ff] text-[#155eef]' : 'text-[#535862] hover:bg-[#fafafa]'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
              {loading && <RefreshCw size={16} className="shrink-0 animate-spin text-[#155eef]" />}
            </div>

            <div className="flex flex-1 flex-col gap-[4px] overflow-y-auto p-[8px]">
              {visible.length === 0 && (
                <p className="px-[12px] py-[24px] text-center text-[14px] leading-[20px] text-[#717680]">
                  No proposals in this view.
                </p>
              )}
              {visible.map((proposal) => {
                const active = proposal.id === selected?.id
                const engagement = engagementMap.get(proposal.engagementId)
                return (
                  <button
                    key={proposal.id}
                    type="button"
                    onClick={() => setSelectedId(proposal.id)}
                    className={`rounded-[10px] border p-[12px] text-left transition-colors ${
                      active ? 'border-[#155eef] bg-[#f5f8ff]' : 'border-transparent hover:bg-[#fafafa]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-[8px]">
                      <span className="min-w-0">
                        <span className="block truncate text-[14px] font-semibold leading-[20px] text-[#181d27]">
                          {proposal.title}
                        </span>
                        <span className="mt-[2px] block truncate text-[13px] leading-[18px] text-[#535862]">
                          {engagement ? engagementTitle(engagement, state.role) : 'Workspace engagement'}
                        </span>
                      </span>
                      <span className="shrink-0 text-[13px] font-semibold leading-[18px] text-[#181d27]">
                        {money(proposal.budgetCents)}
                      </span>
                    </div>
                    <div className="mt-[10px] flex items-center justify-between gap-[8px]">
                      <ProposalStatusBadge status={proposal.status} viewerRole={state.role} />
                      <span className="text-[12px] leading-[18px] text-[#717680]">{relativeDate(proposal.updatedAt)}</span>
                    </div>
                  </button>
                )
              })}
            </div>
          </section>

          <section className="min-w-0 flex-1 overflow-y-auto bg-white p-[24px]">
            {selected ? (
              <ProposalDetail
                proposal={selected}
                engagement={engagementMap.get(selected.engagementId)}
                busy={busyId === selected.id}
                onUpdate={(payload) => void updateProposal(selected.id, payload)}
                onSubmit={() => void sendProposal(selected.id)}
                onAccept={() => void decideProposal(selected.id, 'accept')}
                onDecline={() => void decideProposal(selected.id, 'decline')}
                onWithdraw={() => void withdrawProposal(selected.id)}
                canManage={isExpertWorkspace}
                canDecide={isBuyerWorkspace}
                viewerRole={state.role}
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <div className="max-w-[360px] text-center">
                  <Handshake size={32} className="mx-auto text-[#d5d7da]" />
                  <h2 className="mt-[12px] text-[18px] font-semibold text-[#181d27]">No proposal selected</h2>
                  <p className="mt-[4px] text-[14px] leading-[20px] text-[#535862]">
                    Create a proposal draft from an accepted engagement.
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

function ProposalDetail({
  proposal,
  engagement,
  busy,
  onUpdate,
  onSubmit,
  onAccept,
  onDecline,
  onWithdraw,
  canManage,
  canDecide,
  viewerRole,
}: {
  proposal: WorkspaceProposal
  engagement?: WorkspaceEngagement
  busy: boolean
  onUpdate: (payload: Partial<Pick<WorkspaceProposal, 'title' | 'summary' | 'scope' | 'budgetCents' | 'validUntil'>>) => void
  onSubmit: () => void
  onAccept: () => void
  onDecline: () => void
  onWithdraw: () => void
  canManage: boolean
  canDecide: boolean
  viewerRole: WorkspaceRole | null
}) {
  const [editForm, setEditForm] = useState({
    title: proposal.title,
    summary: proposal.summary,
    scope: proposal.scope,
    budget: proposal.budgetCents == null ? '' : String(proposal.budgetCents / 100),
    validUntil: proposal.validUntil ? proposal.validUntil.slice(0, 10) : '',
  })

  return (
    <div className="mx-auto flex max-w-[820px] flex-col gap-[16px]">
      <article className={`rounded-[16px] border border-[#e9eaeb] bg-white ${CARD_SHADOW}`}>
        <div className="border-b border-[#e9eaeb] px-[32px] pb-[24px] pt-[32px]">
          <div className="flex items-center justify-between gap-[12px]">
            <ProposalStatusBadge status={proposal.status} viewerRole={viewerRole} />
            <span className="text-[12px] font-medium text-[#717680]">Updated {relativeDate(proposal.updatedAt)}</span>
          </div>
          <div className="mt-[16px] flex items-start gap-[12px]">
            <span className="flex size-[44px] shrink-0 items-center justify-center rounded-[12px] bg-[#155eef] text-[14px] font-semibold text-white">
              {initials(proposal.title)}
            </span>
            <div className="min-w-0">
              <h2 className="text-[24px] font-semibold leading-[32px] text-[#181d27]">{proposal.title}</h2>
              <p className="mt-[2px] text-[14px] leading-[20px] text-[#535862]">
                {engagement ? engagementTitle(engagement, viewerRole) : 'Workspace engagement'}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-px border-b border-[#e9eaeb] bg-[#e9eaeb] sm:grid-cols-2">
          <FactCell icon={<Wallet size={16} className="text-[#717680]" />} label="Budget">
            {money(proposal.budgetCents)}
          </FactCell>
          <FactCell icon={<CalendarDays size={16} className="text-[#717680]" />} label="Valid until">
            {longDate(proposal.validUntil)}
          </FactCell>
        </div>

        <div className="px-[32px] py-[24px]">
          <p className="text-[12px] font-medium uppercase tracking-[0.04em] text-[#717680]">Summary</p>
          <p className="mt-[10px] whitespace-pre-wrap text-[15px] leading-[24px] text-[#252b37]">{proposal.summary}</p>
          <p className="mt-[20px] text-[12px] font-medium uppercase tracking-[0.04em] text-[#717680]">Scope</p>
          <p className="mt-[10px] whitespace-pre-wrap text-[15px] leading-[24px] text-[#252b37]">{proposal.scope}</p>
          <p className="mt-[16px] text-[13px] leading-[18px] text-[#717680]">
            Created {longDate(proposal.createdAt)}
          </p>
        </div>

        {canManage && (proposal.status === 'draft' || proposal.status === 'declined') ? (
          <div className="border-t border-[#e9eaeb] bg-[#f8fbff] px-[32px] py-[20px]">
            <div className="flex flex-wrap items-start justify-between gap-[10px]">
              <div>
                <h3 className="text-[15px] font-semibold text-[#181d27]">
                  {proposal.status === 'declined' ? 'Revise and resubmit' : 'Edit proposal'}
                </h3>
                <p className="mt-[3px] text-[13px] leading-[19px] text-[#535862]">
                  Update the scope, then save and use the same send button below to resubmit it to the buyer.
                </p>
              </div>
              <span className="rounded-full bg-[#e0edff] px-[9px] py-[3px] text-[11px] font-semibold text-[#1d4ed8]">Expert editor</span>
            </div>
            <div className="mt-[14px] grid gap-[12px] md:grid-cols-2">
              <Field label="Title">
                <input value={editForm.title} onChange={(event) => setEditForm((current) => ({ ...current, title: event.target.value }))} className="w-full rounded-[8px] border border-[#d5d7da] bg-white px-[11px] py-[9px] text-[13px] leading-[20px] text-[#181d27]" />
              </Field>
              <Field label="Budget USD">
                <input type="number" min="0" step="100" value={editForm.budget} onChange={(event) => setEditForm((current) => ({ ...current, budget: event.target.value }))} className="w-full rounded-[8px] border border-[#d5d7da] bg-white px-[11px] py-[9px] text-[13px] leading-[20px] text-[#181d27]" />
              </Field>
              <Field label="Valid until">
                <input type="date" value={editForm.validUntil} onChange={(event) => setEditForm((current) => ({ ...current, validUntil: event.target.value }))} className="w-full rounded-[8px] border border-[#d5d7da] bg-white px-[11px] py-[9px] text-[13px] leading-[20px] text-[#181d27]" />
              </Field>
              <Field label="Summary">
                <textarea rows={3} value={editForm.summary} onChange={(event) => setEditForm((current) => ({ ...current, summary: event.target.value }))} className="w-full resize-y rounded-[8px] border border-[#d5d7da] bg-white px-[11px] py-[9px] text-[13px] leading-[20px] text-[#181d27]" />
              </Field>
              <div className="md:col-span-2">
                <Field label="Scope">
                  <textarea rows={4} value={editForm.scope} onChange={(event) => setEditForm((current) => ({ ...current, scope: event.target.value }))} className="w-full resize-y rounded-[8px] border border-[#d5d7da] bg-white px-[11px] py-[9px] text-[13px] leading-[20px] text-[#181d27]" />
                </Field>
              </div>
            </div>
            <div className="mt-[14px] flex justify-end">
              <button
                type="button"
                onClick={() => onUpdate({
                  title: editForm.title.trim(),
                  summary: editForm.summary.trim(),
                  scope: editForm.scope.trim(),
                  budgetCents: editForm.budget ? Math.round(Number(editForm.budget) * 100) : null,
                  validUntil: editForm.validUntil ? `${editForm.validUntil}T23:59:59` : null,
                })}
                disabled={busy || !editForm.title.trim() || !editForm.summary.trim() || !editForm.scope.trim()}
                className={`inline-flex items-center gap-[7px] rounded-[8px] bg-[#155eef] px-[13px] py-[9px] text-[13px] font-semibold text-white disabled:opacity-50 ${BUTTON_SKEUO}`}
              >
                Save proposal changes
              </button>
            </div>
          </div>
        ) : null}
      </article>

      <div className="flex flex-wrap items-center justify-between gap-[12px] rounded-[12px] border border-[#e9eaeb] bg-white p-[16px]">
        <span className="flex items-center gap-[8px] text-[13px] leading-[18px] text-[#535862]">
          <CheckCircle2 size={16} className="text-[#17b26a]" />
          Confirming this proposal opens the shared workspace for both parties.
        </span>
        <div className="flex flex-wrap items-center gap-[8px]">
          {canManage && (proposal.status === 'draft' || proposal.status === 'declined') && (
            <button
              type="button"
              onClick={onSubmit}
              disabled={busy}
              className={`inline-flex items-center gap-[8px] rounded-[8px] bg-[#155eef] px-[16px] py-[10px] text-[14px] font-semibold leading-[20px] text-white disabled:cursor-not-allowed disabled:opacity-50 ${BUTTON_SKEUO}`}
            >
              <Send size={18} />
              {proposal.status === 'declined' ? 'Resubmit proposal' : 'Send proposal'}
            </button>
          )}
          {canDecide && proposal.status === 'sent' && (
            <>
              <button
                type="button"
                onClick={onDecline}
                disabled={busy}
                className={`inline-flex items-center gap-[8px] rounded-[8px] border border-[#d5d7da] bg-white px-[14px] py-[10px] text-[14px] font-semibold leading-[20px] text-[#414651] transition-colors hover:bg-[#fef3f2] hover:text-[#d92d20] disabled:cursor-not-allowed disabled:opacity-50 ${BUTTON_SKEUO}`}
              >
                <XCircle size={18} />
                Decline
              </button>
              <button
                type="button"
                onClick={onAccept}
                disabled={busy}
                className={`inline-flex items-center gap-[8px] rounded-[8px] bg-[#155eef] px-[16px] py-[10px] text-[14px] font-semibold leading-[20px] text-white disabled:cursor-not-allowed disabled:opacity-50 ${BUTTON_SKEUO}`}
              >
                <Eye size={18} />
                Accept
              </button>
            </>
          )}
          {canManage && (proposal.status === 'draft' || proposal.status === 'sent') && (
            <button
              type="button"
              onClick={onWithdraw}
              disabled={busy}
              className={`inline-flex items-center gap-[8px] rounded-[8px] border border-[#d5d7da] bg-white px-[14px] py-[10px] text-[14px] font-semibold leading-[20px] text-[#414651] transition-colors hover:bg-[#fafafa] disabled:cursor-not-allowed disabled:opacity-50 ${BUTTON_SKEUO}`}
            >
              Withdraw
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="flex min-w-0 flex-col gap-[6px]">
      <span className="text-[13px] font-medium leading-[18px] text-[#414651]">{label}</span>
      {children}
    </label>
  )
}

function ProposalStatusBadge({
  status,
  viewerRole,
}: {
  status: ProposalStatus
  viewerRole: WorkspaceRole | null
}) {
  return (
    <span className={`inline-flex items-center gap-[6px] rounded-full px-[8px] py-[2px] text-[12px] font-medium leading-[18px] ${proposalStatusClass(status)}`}>
      <span className="size-[6px] rounded-full bg-current" />
      {statusLabelForViewer(status, viewerRole)}
    </span>
  )
}

function FactCell({ icon, label, children }: { icon: ReactNode; label: string; children: ReactNode }) {
  return (
    <div className="bg-white px-[32px] py-[20px]">
      <p className="flex items-center gap-[6px] text-[12px] font-medium uppercase tracking-[0.04em] text-[#717680]">
        {icon} {label}
      </p>
      <p className="mt-[6px] text-[16px] font-semibold leading-[24px] text-[#181d27]">{children}</p>
    </div>
  )
}
