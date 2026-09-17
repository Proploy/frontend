'use client'

import { useEffect, useMemo, useState } from 'react'
import type { FormEvent, ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import {
  Building2,
  CalendarDays,
  CheckCircle2,
  Inbox,
  RefreshCw,
  ShieldCheck,
  XCircle,
} from 'lucide-react'
import {

  WorkspaceLoading,
  WorkspaceShell,
  WorkspaceSignInState,
} from '@/components/workspace/WorkspaceShell'
import {
  intentStatusClass,
  longDate,
  relativeDate,
  statusLabel,
} from '@/components/workspace/workspace-format'
import {
  clientRowsToRequestRows,
  meetingIntentToRequestRow,
  requestTitle,
  useCurrentUserRole,
  useWorkspace,
} from '@/features/workspace'
import type { WorkspaceRequestRow } from '@/features/workspace/types'
import type { NormalizedError } from '@/lib/service-apis/error-utils'
import { NativeBookingRequestsPanel } from '@/features/native-scheduling/components/NativeBookingRequestsPanel'

type RequestRow = WorkspaceRequestRow
type Filter = 'all' | RequestRow['status']

const FILTERS: { id: Filter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'awaiting_acceptance', label: 'Awaiting' },
  { id: 'scheduling_open', label: 'Accepted' },
  { id: 'booked', label: 'Booked' },
  { id: 'declined', label: 'Declined' },
  { id: 'cancelled', label: 'Cancelled' },
  { id: 'expired', label: 'Expired' },
]

export default function WorkspaceRequestsPage() {
  const state = useCurrentUserRole()
  const workspace = useWorkspace()
  const pathname = usePathname()
  const [requests, setRequests] = useState<RequestRow[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [filter, setFilter] = useState<Filter>('all')
  const [error, setError] = useState<NormalizedError | null>(null)
  const [loading, setLoading] = useState(false)
  const [busyId, setBusyId] = useState<string | null>(null)
  const [bookingOpen, setBookingOpen] = useState(false)
  const [booking, setBooking] = useState({
    startsAt: '',
    endsAt: '',
    title: 'Project kickoff',
    locationUrl: '',
    notes: '',
  })
  const [activatedIntentIds, setActivatedIntentIds] = useState<Set<string>>(new Set())
  const isExpertWorkspace = state.role === 'expert'
  const expertId = isExpertWorkspace ? state.expert?.id ?? null : null

  useEffect(() => {
    if (state.isPending || !state.user) return
    let cancelled = false

    async function loadRequests() {
      setLoading(true)
      setError(null)

      try {
        if (isExpertWorkspace) {
          const result = await workspace.listClients()
          if (cancelled) return

          if (result.ok) {
            const nextRequests = clientRowsToRequestRows(result.data.clients)
            setRequests(nextRequests)
            setSelectedId((current) => current ?? nextRequests[0]?.id ?? null)
          } else {
            setRequests([])
            setError(result)
          }
          return
        }

        const result = await workspace.listMeetingIntents()

        if (cancelled) return

        if (result.ok) {
          const nextRequests = result.data.meetingIntents.map(meetingIntentToRequestRow)
          setRequests(nextRequests)
          setSelectedId((current) => current ?? nextRequests[0]?.id ?? null)
        } else {
          setRequests([])
          setError(result)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    void loadRequests()
    return () => {
      cancelled = true
    }
  }, [expertId, isExpertWorkspace, state.isPending, state.user, workspace])

  useEffect(() => {
    if (state.isPending || !state.user) return
    let cancelled = false

    async function loadActivationState() {
      const [engagementResult, proposalResult] = await Promise.all([
        workspace.listEngagements(),
        workspace.listProposals(),
      ])
      if (cancelled || !engagementResult.ok || !proposalResult.ok) return
      const acceptedEngagementIds = new Set(
        proposalResult.data.proposals
          .filter((proposal) => proposal.status === 'accepted')
          .map((proposal) => proposal.engagementId),
      )
      setActivatedIntentIds(new Set(
        engagementResult.data.engagements
          .filter((engagement) => engagement.meetingIntentId && acceptedEngagementIds.has(engagement.id))
          .map((engagement) => engagement.meetingIntentId as string),
      ))
    }

    void loadActivationState()
    return () => {
      cancelled = true
    }
  }, [state.isPending, state.user, workspace])

  const visible = useMemo(
    () => (filter === 'all' ? requests : requests.filter((request) => request.status === filter)),
    [filter, requests],
  )
  const selected = requests.find((request) => request.id === selectedId) ?? requests[0] ?? null
  const newCount = requests.filter((request) => request.status === 'awaiting_acceptance').length
  const canDecide = isExpertWorkspace && selected?.status === 'awaiting_acceptance'
  const canCancel = Boolean(selected && !isExpertWorkspace && (
    selected.status === 'awaiting_acceptance' || selected.status === 'scheduling_open'
  ))
  const canBook = selected?.status === 'scheduling_open' && activatedIntentIds.has(selected.id)
  const pageTitle = isExpertWorkspace ? 'Leads' : 'Requests'
  const itemLabel = isExpertWorkspace ? 'leads' : 'requests'

  async function decide(intentId: string, decision: 'accept' | 'decline') {
    setBusyId(intentId)
    const result = await workspace.decideMeetingIntent(intentId, decision)
    if (result.ok) {
      const updated = meetingIntentToRequestRow(result.data)
      setRequests((current) => current.map((request) => (request.id === intentId ? updated : request)))
      setSelectedId(intentId)
      setError(null)
    } else {
      setError(result)
    }
    setBusyId(null)
  }

  async function cancel(intentId: string) {
    setBusyId(intentId)
    const result = await workspace.cancelMeetingIntent(intentId)
    if (result.ok) {
      const updated = meetingIntentToRequestRow(result.data)
      setRequests((current) => current.map((request) => (request.id === intentId ? updated : request)))
      setSelectedId(intentId)
      setError(null)
    } else {
      setError(result)
    }
    setBusyId(null)
  }

  async function bookMeeting(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!selected || !canBook) return
    const startsAt = new Date(booking.startsAt)
    const endsAt = new Date(booking.endsAt)
    if (!booking.startsAt || !booking.endsAt || Number.isNaN(startsAt.getTime()) || Number.isNaN(endsAt.getTime()) || endsAt <= startsAt) {
      setError({
        ok: false,
        status: 400,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Choose a valid start and end time; the end must be after the start.',
        },
      })
      return
    }

    setBusyId(selected.id)
    const result = await workspace.markMeetingBooked({
      meetingIntentId: selected.id,
      startsAt: startsAt.toISOString(),
      endsAt: endsAt.toISOString(),
      title: booking.title.trim() || 'Project kickoff',
      locationUrl: booking.locationUrl.trim() || null,
      notes: booking.notes.trim() || null,
    })
    if (result.ok) {
      setRequests((current) => current.map((request) => (
        request.id === selected.id ? { ...request, status: 'booked', updatedAt: new Date().toISOString() } : request
      )))
      setBookingOpen(false)
      setError(null)
    } else {
      setError(result)
    }
    setBusyId(null)
  }

  if (state.isPending) return <WorkspaceLoading role={state.role} />
  if (!state.user) return <WorkspaceSignInState redirect={pathname} />
  return (
    <WorkspaceShell role={state.role}>
      <main className="flex min-w-0 flex-1 flex-col">
        <header className="pf-pagebar">
          <div className="flex min-w-0 items-center gap-[14px]">
            <span className="pf-ico pf-ico--lg pf-ico--soft"><Inbox size={20} /></span>
            <div className="pf-pagebar-text">
              <span className="pf-eyebrow">Workspace</span>
              <h1 className="pf-title truncate">{pageTitle}</h1>
            </div>
          </div>
          <span className="inline-flex items-center gap-[8px] rounded-full bg-cobalt-soft px-[12px] py-[6px] text-[13px] font-semibold leading-[18px] text-cobalt-deep">
            <span className="size-[8px] rounded-full bg-cobalt-deep" />
            {newCount} awaiting
          </span>
        </header>

        {error && (
          <div className="border-b border-warn-line bg-warn-soft px-[24px] py-[10px] text-[13px] leading-[18px] text-warn">
            {error.error.message || `Unable to refresh ${itemLabel}.`}
          </div>
        )}

        <NativeBookingRequestsPanel
          role={state.role}
          selectedEngagementId={null}
          engagementLabel={(engagementId) => engagementId}
          onOpenCalendar={() => {}}
        />

        <div className="flex min-h-0 flex-1 flex-col xl:flex-row">
          <section className="flex flex-col border-b border-line bg-white xl:w-[420px] xl:shrink-0 xl:border-b-0 xl:border-r">
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
                  No {itemLabel} in this view.
                </p>
              )}
              {visible.map((request) => {
                const active = request.id === selected?.id
                return (
                  <button
                    key={request.id}
                    type="button"
                    onClick={() => setSelectedId(request.id)}
                    className={`rounded-[10px] border p-[12px] text-left transition-colors ${
                      active ? 'border-cobalt bg-cobalt-soft' : 'border-transparent hover:bg-surface-hover'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-[8px]">
                      <span className="min-w-0">
                        <span className="flex items-center gap-[6px]">
                          <span className="truncate text-[14px] font-semibold leading-[20px] text-ink">
                            {requestTitle(request)}
                          </span>
                          {(request.source === 'meeting_intent' || request.expertId === expertId) && (
                            <ShieldCheck size={14} className="shrink-0 text-cobalt" aria-label="Verified request" />
                          )}
                        </span>
                        <span className="mt-[2px] block line-clamp-2 text-[13px] leading-[18px] text-ink-soft">
                          {request.projectScope}
                        </span>
                      </span>
                    </div>
                    <div className="mt-[10px] flex items-center justify-between gap-[8px]">
                      <span className={`inline-flex items-center gap-[6px] rounded-full px-[8px] py-[2px] text-[12px] font-medium leading-[18px] ${intentStatusClass(request.status)}`}>
                        <span className="size-[6px] rounded-full bg-current" />
                        {statusLabel(request.status)}
                      </span>
                      <span className="text-[12px] leading-[18px] text-ink-muted">{relativeDate(request.createdAt)}</span>
                    </div>
                  </button>
                )
              })}
            </div>
          </section>

          <section className="min-w-0 flex-1 overflow-y-auto bg-white p-[24px]">
            {selected ? (
              <div className="mx-auto flex max-w-[760px] flex-col gap-[16px]">
                <article className="pf-card">
                  <div className="border-b border-line px-[32px] pb-[24px] pt-[32px]">
                    <div className="flex items-center justify-between gap-[12px]">
                      <span className={`inline-flex items-center gap-[6px] rounded-full px-[10px] py-[3px] text-[12px] font-medium leading-[18px] ${intentStatusClass(selected.status)}`}>
                        <span className="size-[6px] rounded-full bg-current" />
                        {statusLabel(selected.status)}
                      </span>
                      {selected.correlationToken && (
                        <span className="text-[12px] font-medium text-ink-muted">Token {selected.correlationToken}</span>
                      )}
                    </div>

                    <div className="mt-[16px] flex items-start gap-[12px]">
                      <span className="flex size-[44px] shrink-0 items-center justify-center rounded-[12px] bg-cobalt text-[16px] font-semibold text-white">
                        {requestTitle(selected).charAt(0).toUpperCase()}
                      </span>
                      <div className="min-w-0">
                        <h2 className="pf-title">
                          {requestTitle(selected)}
                        </h2>
                        <p className="mt-[2px] text-[14px] leading-[20px] text-ink-soft">
                          {isExpertWorkspace ? 'Incoming buyer request' : 'Outgoing expert request'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-px border-b border-line bg-line sm:grid-cols-2">
                    <FactCell icon={<CalendarDays size={16} className="text-ink-muted" />} label="Received">
                      {longDate(selected.createdAt)}
                    </FactCell>
                    <FactCell icon={<Building2 size={16} className="text-ink-muted" />} label="Expires">
                      {longDate(selected.expiresAt)}
                    </FactCell>
                  </div>

                  <div className="px-[32px] py-[24px]">
                    <p className="text-[12px] font-medium uppercase tracking-[0.04em] text-ink-muted">Project scope</p>
                    <p className="mt-[10px] whitespace-pre-wrap text-[15px] leading-[24px] text-ink">
                      {selected.projectScope}
                    </p>
                  </div>
                </article>

                {canDecide || canCancel ? (
                  <div className="flex flex-wrap items-center justify-between gap-[12px] rounded-[12px] border border-line bg-white p-[16px]">
                    <span className="flex items-center gap-[8px] text-[13px] leading-[18px] text-ink-soft">
                      {canDecide ? <CheckCircle2 size={16} className="text-ok" /> : <RefreshCw size={16} className="text-ink-muted" />}
                      {canDecide ? 'Accepting creates the engagement. The buyer must confirm the expert proposal before shared work opens.' : 'You can cancel this request while it is still pending.'}
                    </span>
                    <div className="flex flex-wrap items-center gap-[8px]">
                      {canCancel ? (
                        <button
                          type="button"
                          onClick={() => void cancel(selected.id)}
                          disabled={busyId === selected.id}
                          className="pf-btn pf-btn--danger"
                        >
                          <XCircle size={18} /> Cancel request
                        </button>
                      ) : null}
                      {canDecide ? (
                        <>
                      <button
                        type="button"
                        onClick={() => void decide(selected.id, 'decline')}
                        disabled={busyId === selected.id}
                        className="pf-btn pf-btn--danger"
                      >
                        <XCircle size={18} /> Decline
                      </button>
                      <button
                        type="button"
                        onClick={() => void decide(selected.id, 'accept')}
                        disabled={busyId === selected.id}
                        className="pf-btn pf-btn--primary"
                      >
                        <CheckCircle2 size={18} /> Accept request
                      </button>
                        </>
                      ) : null}
                    </div>
                  </div>
                ) : null}

                {canBook ? (
                  <section className="pf-card p-[16px]">
                    <div className="flex flex-wrap items-center justify-between gap-[12px]">
                      <div>
                        <h3 className="pf-h2">Schedule the shared meeting</h3>
                        <p className="mt-[2px] text-[13px] leading-[18px] text-ink-soft">Available after the buyer confirms the expert proposal.</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setBookingOpen((open) => !open)}
                        className="pf-btn pf-btn--primary"
                      >
                        <CalendarDays size={17} /> {bookingOpen ? 'Close' : 'Schedule meeting'}
                      </button>
                    </div>
                    {bookingOpen ? (
                      <form onSubmit={bookMeeting} className="mt-[16px] grid grid-cols-1 gap-[12px] border-t border-line pt-[16px] md:grid-cols-2">
                        <label className="flex flex-col gap-[6px]">
                          <span className="text-[13px] font-semibold text-ink-soft">Start</span>
                          <input required type="datetime-local" value={booking.startsAt} onChange={(event) => setBooking((current) => ({ ...current, startsAt: event.target.value }))} className="rounded-[8px] border border-line px-[12px] py-[10px] text-[14px]" />
                        </label>
                        <label className="flex flex-col gap-[6px]">
                          <span className="text-[13px] font-semibold text-ink-soft">End</span>
                          <input required type="datetime-local" value={booking.endsAt} onChange={(event) => setBooking((current) => ({ ...current, endsAt: event.target.value }))} className="rounded-[8px] border border-line px-[12px] py-[10px] text-[14px]" />
                        </label>
                        <label className="flex flex-col gap-[6px]">
                          <span className="text-[13px] font-semibold text-ink-soft">Title</span>
                          <input value={booking.title} onChange={(event) => setBooking((current) => ({ ...current, title: event.target.value }))} className="rounded-[8px] border border-line px-[12px] py-[10px] text-[14px]" />
                        </label>
                        <label className="flex flex-col gap-[6px]">
                          <span className="text-[13px] font-semibold text-ink-soft">Meeting link</span>
                          <input type="url" value={booking.locationUrl} onChange={(event) => setBooking((current) => ({ ...current, locationUrl: event.target.value }))} placeholder="https://meet.google.com/..." className="rounded-[8px] border border-line px-[12px] py-[10px] text-[14px]" />
                        </label>
                        <label className="flex flex-col gap-[6px] md:col-span-2">
                          <span className="text-[13px] font-semibold text-ink-soft">Notes</span>
                          <textarea rows={2} value={booking.notes} onChange={(event) => setBooking((current) => ({ ...current, notes: event.target.value }))} className="resize-y rounded-[8px] border border-line px-[12px] py-[10px] text-[14px]" />
                        </label>
                        <div className="flex justify-end md:col-span-2">
                          <button type="submit" disabled={busyId === selected.id} className="pf-btn pf-btn--primary">
                            {busyId === selected.id ? 'Scheduling…' : 'Confirm meeting'}
                          </button>
                        </div>
                      </form>
                    ) : null}
                  </section>
                ) : null}
              </div>
            ) : (
              <div className="flex h-full items-center justify-center">
                <div className="max-w-[360px] text-center">
                  <Inbox size={32} className="mx-auto text-line" />
                  <h2 className="pf-h2 mt-[12px]">
                    No {isExpertWorkspace ? 'lead' : 'request'} selected
                  </h2>
                  <p className="mt-[4px] text-[14px] leading-[20px] text-ink-soft">
                    {isExpertWorkspace
                      ? 'Leads appear here when a buyer asks to work with you.'
                      : 'Requests appear here after you ask to work with an expert.'}
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

function FactCell({ icon, label, children }: { icon: ReactNode; label: string; children: ReactNode }) {
  return (
    <div className="bg-white px-[32px] py-[20px]">
      <p className="flex items-center gap-[6px] text-[12px] font-medium uppercase tracking-[0.04em] text-ink-muted">
        {icon} {label}
      </p>
      <p className="mt-[6px] text-[16px] font-semibold leading-[24px] text-ink">{children}</p>
    </div>
  )
}
