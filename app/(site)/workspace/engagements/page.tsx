'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import {
  ArrowRight,
  CheckCircle2,
  FolderClosed,
  MessageSquare,
  RefreshCw,
  Users,
} from 'lucide-react'
import {

  WorkspaceLoading,
  WorkspaceShell,
  WorkspaceSignInState,
} from '@/components/workspace/WorkspaceShell'
import {
  engagementTitle,
  initials,
  longDate,
  relativeDate,
  statusLabel,
} from '@/components/workspace/workspace-format'
import { useCurrentUserRole, useWorkspace } from '@/features/workspace'
import type { WorkspaceEngagement } from '@/features/workspace/types'
import type { NormalizedError } from '@/lib/service-apis/error-utils'
import { useWorkspaceQueryParam } from '@/features/workspace/use-workspace-query-param'
import { NativeAvailabilityCard } from '@/features/native-scheduling/components/NativeAvailabilityCard'
import { applyEngagementStatusResponse } from '@/features/workspace/engagement-status'

type EngagementFilter = 'all' | WorkspaceEngagement['status']

const FILTERS: { id: EngagementFilter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'active', label: 'Active' },
  { id: 'paused', label: 'Paused' },
  { id: 'closed', label: 'Closed' },
]

const STATUS_CLASS: Record<WorkspaceEngagement['status'], string> = {
  active: 'bg-ok-soft text-ok',
  paused: 'bg-warn-soft text-warn',
  closed: 'bg-danger-soft text-danger',
}

export default function WorkspaceEngagementsPage() {
  const state = useCurrentUserRole()
  const workspace = useWorkspace()
  const requestedEngagementId = useWorkspaceQueryParam('engagement')
  const [engagements, setEngagements] = useState<WorkspaceEngagement[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [filter, setFilter] = useState<EngagementFilter>('all')
  const [error, setError] = useState<NormalizedError | null>(null)
  const [loading, setLoading] = useState(false)
  const [busyId, setBusyId] = useState<string | null>(null)

  useEffect(() => {
    if (state.isPending || !state.user) return
    let cancelled = false

    async function loadEngagements() {
      setLoading(true)
      setError(null)
      try {
        const result = await workspace.listEngagements()
        if (cancelled) return
        if (result.ok) {
          setEngagements(result.data.engagements)
          setSelectedId(
            (current) => current ?? requestedEngagementId ?? result.data.engagements[0]?.id ?? null,
          )
        } else {
          setError(result)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    void loadEngagements()
    return () => {
      cancelled = true
    }
  }, [requestedEngagementId, state.isPending, state.user, workspace])

  useEffect(() => {
    if (
      !requestedEngagementId
      || !engagements.some((engagement) => engagement.id === requestedEngagementId)
    ) return
     
    setSelectedId(requestedEngagementId)
  }, [engagements, requestedEngagementId])

  const visible = useMemo(
    () => (filter === 'all' ? engagements : engagements.filter((engagement) => engagement.status === filter)),
    [engagements, filter],
  )
  const selected = engagements.find((engagement) => engagement.id === selectedId) ?? engagements[0] ?? null
  const isExpertWorkspace = state.role === 'expert'

  async function updateStatus(engagementId: string, status: WorkspaceEngagement['status']) {
    setBusyId(engagementId)
    const result = await workspace.updateEngagementStatus(engagementId, status)
    if (result.ok) {
      setEngagements((current) => applyEngagementStatusResponse(current, result.data))
      setSelectedId(result.data.id)
      setError(null)
    } else {
      setError(result)
    }
    setBusyId(null)
  }

  async function openConversation(engagementId: string) {
    setBusyId(engagementId)
    const result = await workspace.ensureConversation(engagementId)
    if (result.ok) {
      window.location.href = `/workspace/messages?conversation=${encodeURIComponent(result.data.id)}`
    } else {
      setError(result)
      setBusyId(null)
    }
  }

  if (state.isPending) return <WorkspaceLoading role={state.role} />
  if (!state.user) return <WorkspaceSignInState redirect="/workspace/engagements" />
  return (
    <WorkspaceShell role={state.role}>
      <main className="flex min-w-0 flex-1 flex-col">
        <header className="pf-pagebar">
          <div className="flex min-w-0 items-center gap-[14px]">
            <span className="pf-ico pf-ico--lg pf-ico--soft"><Users size={20} /></span>
            <div className="pf-pagebar-text">
              <span className="pf-eyebrow">Workspace</span>
              <h1 className="pf-title truncate">{isExpertWorkspace ? 'Clients' : 'Engagements'}</h1>
            </div>
          </div>
          {isExpertWorkspace && (
            <Link
              href="/workspace/proposals"
              className="pf-btn pf-btn--primary"
            >
              <FolderClosed size={16} />
              New proposal
            </Link>
          )}
        </header>

        {error && (
          <div className="border-b border-warn-line bg-warn-soft px-[24px] py-[10px] text-[13px] leading-[18px] text-warn">
            {error.error.message || 'Unable to update engagements.'}
          </div>
        )}

        <div className="flex min-h-0 flex-1 flex-col xl:flex-row">
          <section className="flex flex-col border-b border-line bg-white xl:w-[380px] xl:shrink-0 xl:border-b-0 xl:border-r">
            <div className="flex items-center justify-between gap-[12px] border-b border-line p-[16px]">
              <div className="flex gap-[4px] overflow-x-auto">
                {FILTERS.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setFilter(item.id)}
                    className={`whitespace-nowrap rounded-[6px] px-[10px] py-[6px] text-[13px] font-semibold leading-[18px] transition-colors ${
                      filter === item.id ? 'bg-cobalt-soft text-cobalt' : 'text-ink-soft hover:bg-surface-hover'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
              {loading && <RefreshCw size={16} className="shrink-0 animate-spin text-cobalt" />}
            </div>

            <div className="flex flex-1 flex-col gap-[4px] overflow-y-auto p-[8px]">
              {visible.length === 0 && (
                <p className="px-[12px] py-[24px] text-center text-[14px] leading-[20px] text-ink-muted">
                  No engagements in this view.
                </p>
              )}
              {visible.map((engagement) => {
                const active = engagement.id === selected?.id
                const title = engagementTitle(engagement, state.role)
                return (
                  <button
                    key={engagement.id}
                    type="button"
                    onClick={() => setSelectedId(engagement.id)}
                    className={`rounded-[10px] border p-[12px] text-left transition-colors ${
                      active ? 'border-cobalt bg-cobalt-soft' : 'border-transparent hover:bg-surface-hover'
                    }`}
                  >
                    <div className="flex items-center gap-[10px]">
                      <span className="flex size-[34px] shrink-0 items-center justify-center rounded-[10px] bg-cobalt text-[12px] font-semibold text-white">
                        {initials(title)}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[14px] font-semibold leading-[20px] text-ink">
                          {title}
                        </span>
                        <span className="block truncate text-[13px] leading-[18px] text-ink-soft">
                          Updated {relativeDate(engagement.updatedAt)}
                        </span>
                      </span>
                    </div>
                    <div className="mt-[10px] flex items-center justify-between gap-[8px]">
                      <StatusBadge status={engagement.status} />
                      <span className="text-[12px] leading-[18px] text-ink-muted">{longDate(engagement.createdAt)}</span>
                    </div>
                  </button>
                )
              })}
            </div>
          </section>

          <section className="min-w-0 flex-1 overflow-y-auto bg-white p-[24px]">
            {selected ? (
              <div className="mx-auto flex max-w-[840px] flex-col gap-[16px]">
                <article className="pf-card">
                  <div className="pf-pagebar !static">
                    <div className="flex items-start gap-[12px]">
                      <span className="flex size-[48px] shrink-0 items-center justify-center rounded-[12px] bg-cobalt text-[16px] font-semibold text-white">
                        {initials(engagementTitle(selected, state.role))}
                      </span>
                      <div>
                        <h2 className="pf-title">
                          {engagementTitle(selected, state.role)}
                        </h2>
                        <p className="mt-[2px] text-[14px] leading-[20px] text-ink-soft">
                          Engagement created {longDate(selected.createdAt)}
                        </p>
                      </div>
                    </div>
                    <StatusBadge status={selected.status} />
                  </div>

                  <div className="grid grid-cols-1 gap-px bg-line md:grid-cols-3">
                    <Fact label="Expert" value={selected.expertDisplayName ?? 'Not available'} />
                    <Fact label="Buyer" value={selected.buyerDisplayName ?? 'Not available'} />
                    <Fact label="Request" value={selected.meetingIntentId ?? 'Not linked'} />
                  </div>
                </article>

                {state.role === 'buyer' && selected.status === 'active' ? (
                  <NativeAvailabilityCard key={selected.id} engagementId={selected.id} />
                ) : null}

                <div className="grid grid-cols-1 gap-[12px] md:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => void openConversation(selected.id)}
                    disabled={busyId === selected.id}
                    className="pf-card pf-card-link flex items-center justify-between p-[16px] text-left disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <span className="flex items-center gap-[10px]">
                      <span className="flex size-[40px] items-center justify-center rounded-[10px] bg-cobalt-soft text-cobalt">
                        <MessageSquare size={18} />
                      </span>
                      <span>
                        <span className="block text-[14px] font-semibold leading-[20px] text-ink">Open messages</span>
                        <span className="block text-[13px] leading-[18px] text-ink-soft">Create or open the shared thread</span>
                      </span>
                    </span>
                    <ArrowRight size={18} className="text-ink-muted" />
                  </button>

                  {isExpertWorkspace && (
                    <Link
                      href="/workspace/proposals"
                      className="pf-card pf-card-link flex items-center justify-between p-[16px] text-left"
                    >
                      <span className="flex items-center gap-[10px]">
                        <span className="flex size-[40px] items-center justify-center rounded-[10px] bg-cobalt-soft text-cobalt">
                          <FolderClosed size={18} />
                        </span>
                        <span>
                          <span className="block text-[14px] font-semibold leading-[20px] text-ink">Proposal template</span>
                          <span className="block text-[13px] leading-[18px] text-ink-soft">Scope the agreed project</span>
                        </span>
                      </span>
                      <ArrowRight size={18} className="text-ink-muted" />
                    </Link>
                  )}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-[12px] rounded-[12px] border border-line bg-white p-[16px]">
                  <span className="flex items-center gap-[8px] text-[13px] leading-[18px] text-ink-soft">
                    <CheckCircle2 size={16} className="text-ok" />
                    Status changes sync to the workspace engagement.
                  </span>
                  <div className="flex flex-wrap items-center gap-[8px]">
                    {isExpertWorkspace && selected.status !== 'closed' && (
                      <button
                        type="button"
                        onClick={() => void updateStatus(selected.id, 'closed')}
                        disabled={busyId === selected.id}
                        className="pf-btn pf-btn--danger pf-btn--sm"
                      >
                        Unlink connection
                      </button>
                    )}
                    {(['active', 'paused', 'closed'] as const).map((status) => {
                      if (isExpertWorkspace && status === 'closed') return null
                      return (
                        <button
                          key={status}
                          type="button"
                          onClick={() => void updateStatus(selected.id, status)}
                          disabled={selected.status === status || busyId === selected.id}
                          className="pf-btn pf-btn--secondary pf-btn--sm"
                        >
                          {statusLabel(status)}
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex h-full items-center justify-center">
                <div className="max-w-[360px] text-center">
                  <Users size={32} className="mx-auto text-line" />
                  <h2 className="pf-h2 mt-[12px]">No engagement selected</h2>
                  <p className="mt-[4px] text-[14px] leading-[20px] text-ink-soft">
                    Accept a request to start a shared engagement.
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

function StatusBadge({ status }: { status: WorkspaceEngagement['status'] }) {
  return (
    <span className={`inline-flex items-center gap-[6px] rounded-full px-[8px] py-[2px] text-[12px] font-medium leading-[18px] ${STATUS_CLASS[status]}`}>
      <span className="size-[6px] rounded-full bg-current" />
      {statusLabel(status)}
    </span>
  )
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 bg-white px-[24px] py-[18px]">
      <p className="text-[12px] font-medium uppercase tracking-[0.04em] text-ink-muted">{label}</p>
      <p className="mt-[6px] truncate text-[14px] font-semibold leading-[20px] text-ink">{value}</p>
    </div>
  )
}
