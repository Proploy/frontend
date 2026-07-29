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
  active: 'bg-[#ecfdf3] text-[#067647]',
  paused: 'bg-[#fffaeb] text-[#b54708]',
  closed: 'bg-[#fef3f2] text-[#b42318]',
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
      setLoading(false)
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
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSelectedId(requestedEngagementId)
  }, [engagements, requestedEngagementId])

  const visible = useMemo(
    () => (filter === 'all' ? engagements : engagements.filter((engagement) => engagement.status === filter)),
    [engagements, filter],
  )
  const selected = engagements.find((engagement) => engagement.id === selectedId) ?? engagements[0] ?? null
  const isExpertWorkspace = state.role === 'expert' || state.role === 'admin'

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
        <header className="flex flex-wrap items-center justify-between gap-[16px] border-b border-[#e9eaeb] bg-white px-[24px] py-[20px]">
          <div className="flex flex-col gap-[4px]">
            <h1 className="flex items-center gap-[10px] text-[24px] font-semibold leading-[32px] text-[#181d27]">
              <Users size={22} className="text-[#155eef]" />
              {isExpertWorkspace ? 'Clients' : 'Engagements'}
            </h1>
          </div>
          {isExpertWorkspace && (
            <Link
              href="/workspace/proposals"
              className={`inline-flex items-center gap-[8px] rounded-[8px] bg-[#155eef] px-[14px] py-[10px] text-[14px] font-semibold leading-[20px] text-white ${BUTTON_SKEUO}`}
            >
              <FolderClosed size={16} />
              New proposal
            </Link>
          )}
        </header>

        {error && (
          <div className="border-b border-[#fedf89] bg-[#fffaeb] px-[24px] py-[10px] text-[13px] leading-[18px] text-[#b54708]">
            {error.error.message || 'Unable to update engagements.'}
          </div>
        )}

        <div className="flex min-h-0 flex-1 flex-col xl:flex-row">
          <section className="flex flex-col border-b border-[#e9eaeb] bg-white xl:w-[380px] xl:shrink-0 xl:border-b-0 xl:border-r">
            <div className="flex items-center justify-between gap-[12px] border-b border-[#e9eaeb] p-[16px]">
              <div className="flex gap-[4px] overflow-x-auto">
                {FILTERS.map((item) => (
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
                      active ? 'border-[#155eef] bg-[#f5f8ff]' : 'border-transparent hover:bg-[#fafafa]'
                    }`}
                  >
                    <div className="flex items-center gap-[10px]">
                      <span className="flex size-[34px] shrink-0 items-center justify-center rounded-[10px] bg-[#155eef] text-[12px] font-semibold text-white">
                        {initials(title)}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[14px] font-semibold leading-[20px] text-[#181d27]">
                          {title}
                        </span>
                        <span className="block truncate text-[13px] leading-[18px] text-[#535862]">
                          Updated {relativeDate(engagement.updatedAt)}
                        </span>
                      </span>
                    </div>
                    <div className="mt-[10px] flex items-center justify-between gap-[8px]">
                      <StatusBadge status={engagement.status} />
                      <span className="text-[12px] leading-[18px] text-[#717680]">{longDate(engagement.createdAt)}</span>
                    </div>
                  </button>
                )
              })}
            </div>
          </section>

          <section className="min-w-0 flex-1 overflow-y-auto bg-white p-[24px]">
            {selected ? (
              <div className="mx-auto flex max-w-[840px] flex-col gap-[16px]">
                <article className={`rounded-[16px] border border-[#e9eaeb] bg-white ${CARD_SHADOW}`}>
                  <div className="flex flex-wrap items-start justify-between gap-[16px] border-b border-[#e9eaeb] px-[32px] py-[28px]">
                    <div className="flex items-start gap-[12px]">
                      <span className="flex size-[48px] shrink-0 items-center justify-center rounded-[12px] bg-[#155eef] text-[16px] font-semibold text-white">
                        {initials(engagementTitle(selected, state.role))}
                      </span>
                      <div>
                        <h2 className="text-[24px] font-semibold leading-[32px] text-[#181d27]">
                          {engagementTitle(selected, state.role)}
                        </h2>
                        <p className="mt-[2px] text-[14px] leading-[20px] text-[#535862]">
                          Engagement created {longDate(selected.createdAt)}
                        </p>
                      </div>
                    </div>
                    <StatusBadge status={selected.status} />
                  </div>

                  <div className="grid grid-cols-1 gap-px bg-[#e9eaeb] md:grid-cols-3">
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
                    className={`flex items-center justify-between rounded-[12px] border border-[#e9eaeb] bg-white p-[16px] text-left transition-colors hover:border-[#155eef] disabled:cursor-not-allowed disabled:opacity-60 ${CARD_SHADOW}`}
                  >
                    <span className="flex items-center gap-[10px]">
                      <span className="flex size-[40px] items-center justify-center rounded-[10px] bg-[#eff4ff] text-[#155eef]">
                        <MessageSquare size={18} />
                      </span>
                      <span>
                        <span className="block text-[14px] font-semibold leading-[20px] text-[#181d27]">Open messages</span>
                        <span className="block text-[13px] leading-[18px] text-[#535862]">Create or open the shared thread</span>
                      </span>
                    </span>
                    <ArrowRight size={18} className="text-[#717680]" />
                  </button>

                  {isExpertWorkspace && (
                    <Link
                      href="/workspace/proposals"
                      className={`flex items-center justify-between rounded-[12px] border border-[#e9eaeb] bg-white p-[16px] text-left transition-colors hover:border-[#155eef] ${CARD_SHADOW}`}
                    >
                      <span className="flex items-center gap-[10px]">
                        <span className="flex size-[40px] items-center justify-center rounded-[10px] bg-[#eff4ff] text-[#155eef]">
                          <FolderClosed size={18} />
                        </span>
                        <span>
                          <span className="block text-[14px] font-semibold leading-[20px] text-[#181d27]">Proposal template</span>
                          <span className="block text-[13px] leading-[18px] text-[#535862]">Scope the agreed project</span>
                        </span>
                      </span>
                      <ArrowRight size={18} className="text-[#717680]" />
                    </Link>
                  )}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-[12px] rounded-[12px] border border-[#e9eaeb] bg-white p-[16px]">
                  <span className="flex items-center gap-[8px] text-[13px] leading-[18px] text-[#535862]">
                    <CheckCircle2 size={16} className="text-[#17b26a]" />
                    Status changes sync to the workspace engagement.
                  </span>
                  <div className="flex flex-wrap items-center gap-[8px]">
                    {(['active', 'paused', 'closed'] as const).map((status) => (
                      <button
                        key={status}
                        type="button"
                        onClick={() => void updateStatus(selected.id, status)}
                        disabled={selected.status === status || busyId === selected.id}
                        className={`rounded-[8px] border border-[#d5d7da] bg-white px-[12px] py-[8px] text-[13px] font-semibold leading-[18px] text-[#414651] transition-colors hover:bg-[#fafafa] disabled:cursor-not-allowed disabled:opacity-50 ${BUTTON_SKEUO}`}
                      >
                        {statusLabel(status)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex h-full items-center justify-center">
                <div className="max-w-[360px] text-center">
                  <Users size={32} className="mx-auto text-[#d5d7da]" />
                  <h2 className="mt-[12px] text-[18px] font-semibold text-[#181d27]">No engagement selected</h2>
                  <p className="mt-[4px] text-[14px] leading-[20px] text-[#535862]">
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
      <p className="text-[12px] font-medium uppercase tracking-[0.04em] text-[#717680]">{label}</p>
      <p className="mt-[6px] truncate text-[14px] font-semibold leading-[20px] text-[#181d27]">{value}</p>
    </div>
  )
}
