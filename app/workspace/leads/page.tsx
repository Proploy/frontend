'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { CheckCircle2, Inbox, LockKeyhole, RefreshCw, XCircle } from 'lucide-react'
import {
  CARD_SHADOW,
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
  const isExpertWorkspace = state.role === 'expert' || state.role === 'admin'

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
      setLoading(false)
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
            className={`max-w-[440px] rounded-[16px] border border-[#e9eaeb] bg-white p-[32px] text-center ${CARD_SHADOW}`}
          >
            <span className="mx-auto flex size-[56px] items-center justify-center rounded-full bg-[#eff4ff] text-[#155eef]">
              <LockKeyhole size={28} />
            </span>
            <h1 className="mt-[16px] text-[24px] font-semibold leading-[32px] text-[#181d27]">
              Leads
            </h1>
            <p className="mt-[8px] text-[15px] leading-[24px] text-[#535862]">
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
        <header className="flex flex-wrap items-center justify-between gap-[16px] border-b border-[#e9eaeb] bg-white px-[24px] py-[20px]">
          <div className="flex flex-col gap-[4px]">
            <h1 className="flex items-center gap-[10px] text-[24px] font-semibold leading-[32px] text-[#181d27]">
              <Inbox size={22} className="text-[#155eef]" />
              Leads
            </h1>
          </div>
          <span className="inline-flex items-center gap-[8px] rounded-full bg-[#eff8ff] px-[12px] py-[6px] text-[13px] font-semibold leading-[18px] text-[#175cd3]">
            <span className="size-[8px] rounded-full bg-[#175cd3]" />
            {openLeads.length} open
          </span>
        </header>

        {error && (
          <div className="border-b border-[#fedf89] bg-[#fffaeb] px-[24px] py-[10px] text-[13px] leading-[18px] text-[#b54708]">
            {error.error.message || 'Unable to refresh leads.'}
          </div>
        )}

        <section className={`m-[24px] rounded-[12px] border border-[#e9eaeb] bg-white ${CARD_SHADOW}`}>
          <div className="flex items-center justify-between gap-[12px] border-b border-[#e9eaeb] px-[20px] py-[16px]">
            <div>
              <h2 className="text-[18px] font-semibold leading-[28px] text-[#181d27]">
                Open leads
              </h2>
              <p className="mt-[2px] text-[13px] leading-[18px] text-[#717680]">
                New requests wait here until you accept or decline them.
              </p>
            </div>
            {loading && <RefreshCw size={16} className="animate-spin text-[#155eef]" />}
          </div>

          {loading ? (
            <LeadsSkeleton />
          ) : openLeads.length === 0 ? (
            <div className="px-[20px] py-[40px] text-center text-[14px] leading-[20px] text-[#717680]">
              No open leads right now.
            </div>
          ) : (
            <ul className="divide-y divide-[#f0f1f1]">
              {openLeads.map((intent) => (
                <li
                  key={intent.id}
                  className="flex flex-col gap-[12px] px-[20px] py-[16px]"
                >
                  <div className="flex flex-wrap items-start justify-between gap-[12px]">
                    <div className="min-w-0">
                      <p className="truncate text-[15px] font-semibold leading-[22px] text-[#181d27]">
                        {intent.requesterName || intent.requesterEmail || `Lead ${shortId(intent.id)}`}
                      </p>
                      <p className="mt-[2px] truncate text-[13px] leading-[18px] text-[#535862]">
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

                  <div className="flex flex-wrap items-center justify-between gap-[8px] text-[13px] leading-[18px] text-[#535862]">
                    <span>
                      Received {longDate(intent.createdAt)} · {relativeDate(intent.createdAt)}
                    </span>
                    {intent.status === 'awaiting_acceptance' ? (
                      <div className="flex flex-wrap items-center gap-[8px]">
                        <button
                          type="button"
                          onClick={() => void decide(intent.id, 'decline')}
                          disabled={busyId === intent.id}
                          className="inline-flex items-center gap-[6px] rounded-[8px] border border-[#d5d7da] bg-white px-[10px] py-[7px] text-[13px] font-semibold text-[#414651] hover:bg-[#fef3f2] hover:text-[#d92d20] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <XCircle size={15} /> Decline
                        </button>
                        <button
                          type="button"
                          onClick={() => void decide(intent.id, 'accept')}
                          disabled={busyId === intent.id}
                          className="inline-flex items-center gap-[6px] rounded-[8px] bg-[#155eef] px-[10px] py-[7px] text-[13px] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <CheckCircle2 size={15} />
                          {busyId === intent.id ? 'Saving…' : 'Accept'}
                        </button>
                      </div>
                    ) : (
                      <Link
                        href="/workspace/engagements"
                        className="inline-flex items-center gap-[6px] text-[13px] font-semibold text-[#155eef] hover:underline"
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
    <ul className="divide-y divide-[#f0f1f1]" aria-label="loading">
      {Array.from({ length: 3 }).map((_, idx) => (
        <li key={idx} className="flex flex-col gap-[10px] px-[20px] py-[16px]">
          <Skeleton className="h-[16px] w-[200px] rounded-[4px]" />
          <Skeleton className="h-[12px] w-[280px] rounded-[4px]" />
        </li>
      ))}
    </ul>
  )
}
