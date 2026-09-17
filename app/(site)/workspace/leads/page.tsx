'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { AlertTriangle, CheckCircle2, Inbox, LockKeyhole, RefreshCw, XCircle } from 'lucide-react'
import {

  WorkspaceLoading,
  WorkspaceShell,
  WorkspaceSignInState,
} from '@/components/workspace/WorkspaceShell'
import { Skeleton } from '@/components/ui/Skeleton'
import {
  intentStatusClass,
  longDate,
  relativeDate,
  statusLabel,
} from '@/components/workspace/workspace-format'
import { useCurrentUserRole, useWorkspace } from '@/features/workspace'
import type { WorkspaceMeetingIntent } from '@/features/workspace/types'
import type { NormalizedError } from '@/lib/service-apis/error-utils'

function shortId(value: string): string {
  if (!value) return '—'
  return value.length > 8 ? value.slice(0, 8) : value
}

function eventTypeLabel(intent: WorkspaceMeetingIntent): string {
  // `projectScope` is the only request-side label on this wire shape. Use a
  // short prefix plus a trimmed scope line so it reads like an "event type".
  const scope = (intent.projectScope ?? '').trim()
  if (!scope) return 'Buyer inquiry'
  const firstLine = scope.split(/\r?\n/)[0]
  return firstLine.length > 80 ? `${firstLine.slice(0, 77)}…` : firstLine
}

export default function WorkspaceLeadsPage() {
  const state = useCurrentUserRole()
  const workspace = useWorkspace()
  const expertId = state.expert?.id ?? null
  const isExpertWorkspace = state.role === 'expert'

  const [intents, setIntents] = useState<WorkspaceMeetingIntent[]>([])
  const [error, setError] = useState<NormalizedError | null>(null)
  const [loading, setLoading] = useState(false)
  const [busyId, setBusyId] = useState<string | null>(null)

  useEffect(() => {
    if (state.isPending || !state.user || !isExpertWorkspace) return
    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)
      // Prefer the expert-scoped read when we have an expert id; falls back
      // to the user-scoped read otherwise (e.g. admins viewing as themselves).
      try {
        const result = expertId
          ? await workspace.listExpertMeetingIntents(expertId)
          : await workspace.listMeetingIntents()

        if (cancelled) return

        if (result.ok) {
          setIntents(result.data.meetingIntents ?? [])
          setError(null)
        } else {
          setIntents([])
          setError(result)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [expertId, isExpertWorkspace, state.isPending, state.user, workspace])

  // A newly submitted buyer request starts in `awaiting_acceptance`. Once the
  // expert accepts it, it moves to `scheduling_open` and the backend creates
  // the engagement. The buyer proposal confirmation opens the shared work
  // conversation and downstream workspace.
  const openLeads = useMemo(
    () =>
      intents
        .filter(
          (intent) =>
            intent.status === 'awaiting_acceptance' ||
            intent.status === 'scheduling_open',
        )
        .slice()
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        ),
    [intents],
  )

  async function decide(intentId: string, decision: 'accept' | 'decline') {
    setBusyId(intentId)
    setError(null)
    const result = await workspace.decideMeetingIntent(intentId, decision)
    if (result.ok) {
      setIntents((current) =>
        current.map((intent) => (intent.id === intentId ? result.data : intent)),
      )
    } else {
      setError(result)
    }
    setBusyId(null)
  }

  if (state.isPending) return <WorkspaceLoading role={state.role} />
  if (!state.user) return <WorkspaceSignInState redirect="/workspace/leads" />

  // Buyer gate: keep the marketing copy consistent with the locked state
  // the rest of the workspace uses.
  if (!isExpertWorkspace) {
    return (
      <WorkspaceShell role={state.role}>
        <main className="flex min-h-[60vh] items-center justify-center px-[24px] py-[48px]">
          <div
            className="pf-card max-w-[440px] p-[32px] text-center"
          >
            <span className="mx-auto flex size-[56px] items-center justify-center rounded-full bg-cobalt-soft text-cobalt">
              <LockKeyhole size={28} />
            </span>
            <h1 className="pf-title mt-[16px]">
              Leads
            </h1>
            <p className="mt-[8px] text-[15px] leading-[24px] text-ink-soft">
              This section is for approved expert accounts.
            </p>
          </div>
        </main>
      </WorkspaceShell>
    )
  }

  return (
    <WorkspaceShell role={state.role}>
      <main className="flex min-w-0 flex-1 flex-col">
        <header className="pf-pagebar">
          <div className="flex min-w-0 items-center gap-[14px]">
            <span className="pf-ico pf-ico--lg pf-ico--soft"><Inbox size={20} /></span>
            <div className="pf-pagebar-text">
              <span className="pf-eyebrow">Workspace</span>
              <h1 className="pf-title truncate">Leads</h1>
            </div>
          </div>
          <span className="inline-flex items-center gap-[8px] rounded-full bg-cobalt-soft px-[12px] py-[6px] text-[13px] font-semibold leading-[18px] text-cobalt-deep">
            <span className="size-[8px] rounded-full bg-cobalt-deep" />
            {openLeads.length} open
          </span>
        </header>

        {error && (
          <div className="px-[24px] pt-[16px]">
            <div className="pf-note pf-note--warn">
              <AlertTriangle size={15} />
              {error.error.message || 'Unable to refresh leads.'}
            </div>
          </div>
        )}

        <section className="pf-card m-[24px]">
          <div className="flex items-center justify-between gap-[12px] border-b border-line px-[20px] py-[16px]">
            <div>
              <h2 className="pf-h2">
                Open leads
              </h2>
              <p className="mt-[2px] text-[13px] leading-[18px] text-ink-muted">
                New requests wait here until you accept or decline them.
              </p>
            </div>
            {loading && <RefreshCw size={16} className="animate-spin text-cobalt" />}
          </div>

          {loading ? (
            <LeadsSkeleton />
          ) : openLeads.length === 0 ? (
            <div className="px-[20px] py-[40px] text-center text-[14px] leading-[20px] text-ink-muted">
              No open leads right now.
            </div>
          ) : (
            <ul className="divide-y divide-line-soft">
              {openLeads.map((intent) => (
                <li
                  key={intent.id}
                  className="flex flex-col gap-[12px] px-[20px] py-[16px]"
                >
                  <div className="flex flex-wrap items-start justify-between gap-[12px]">
                    <div className="min-w-0">
                      <p className="truncate text-[15px] font-semibold leading-[22px] text-ink">
                        {intent.requesterName || `Lead ${shortId(intent.id)}`}
                      </p>
                      <p className="mt-[2px] truncate text-[13px] leading-[18px] text-ink-soft">
                        {eventTypeLabel(intent)}
                      </p>
                    </div>
                    <span
                      className={`inline-flex shrink-0 items-center gap-[6px] rounded-full px-[10px] py-[3px] text-[12px] font-semibold leading-[18px] ${intentStatusClass(intent.status)}`}
                    >
                      <span className="size-[6px] rounded-full bg-current" />
                      {statusLabel(intent.status)}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-[8px] text-[13px] leading-[18px] text-ink-soft">
                    <span>
                      Received {longDate(intent.createdAt)} · {relativeDate(intent.createdAt)}
                    </span>
                    {intent.status === 'awaiting_acceptance' ? (
                      <div className="flex flex-wrap items-center gap-[8px]">
                        <button
                          type="button"
                          onClick={() => void decide(intent.id, 'decline')}
                          disabled={busyId === intent.id}
                          className="inline-flex items-center gap-[6px] rounded-[8px] border border-line bg-white px-[10px] py-[7px] text-[13px] font-semibold text-ink-soft hover:bg-danger-soft hover:text-danger disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <XCircle size={15} /> Decline
                        </button>
                        <button
                          type="button"
                          onClick={() => void decide(intent.id, 'accept')}
                          disabled={busyId === intent.id}
                          className="inline-flex items-center gap-[6px] rounded-[8px] bg-cobalt px-[10px] py-[7px] text-[13px] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <CheckCircle2 size={15} />
                          {busyId === intent.id ? 'Saving…' : 'Accept'}
                        </button>
                      </div>
                    ) : (
                      <Link
                        href="/workspace/engagements"
                        className="inline-flex items-center gap-[6px] text-[13px] font-semibold text-cobalt hover:underline"
                      >
                        <CheckCircle2 size={15} /> Open engagement
                      </Link>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </WorkspaceShell>
  )
}

function LeadsSkeleton() {
  return (
    <ul className="divide-y divide-line-soft" aria-label="loading">
      {Array.from({ length: 3 }).map((_, idx) => (
        <li key={idx} className="flex flex-col gap-[10px] px-[20px] py-[16px]">
          <Skeleton className="h-[16px] w-[200px] rounded-[4px]" />
          <Skeleton className="h-[12px] w-[280px] rounded-[4px]" />
        </li>
      ))}
    </ul>
  )
}
