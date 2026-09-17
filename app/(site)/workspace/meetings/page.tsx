'use client'

import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import {
  AlertTriangle,
  Calendar,
  ChevronDown,
  ExternalLink,
  MapPin,
  RefreshCw,
  XCircle,
} from 'lucide-react'
import { ActionToast } from '@/components/ui/action-toast'
import {

  WorkspaceLoading,
  WorkspaceShell,
  WorkspaceSignInState,
} from '@/components/workspace/WorkspaceShell'
import { engagementTitle, longDate, statusLabel, timeDate } from '@/components/workspace/workspace-format'
import { useCurrentUserRole, useWorkspace } from '@/features/workspace'
import type { WorkspaceEngagement, WorkspaceMeeting } from '@/features/workspace/types'
import type { NormalizedError } from '@/lib/service-apis/error-utils'
import { NativeAvailabilityCard } from '@/features/native-scheduling/components/NativeAvailabilityCard'
import { NativeMeetingActions } from '@/features/native-scheduling/components/NativeMeetingActions'
import { NativeBookingRequestsPanel } from '@/features/native-scheduling/components/NativeBookingRequestsPanel'
import { NativeMeetingEntryCard } from '@/features/native-scheduling/components/NativeMeetingEntryCard'
import { ConnectCalendarModal } from '@/features/native-scheduling/components/ConnectCalendarModal'

type MeetingFilter = 'all' | WorkspaceMeeting['status']

const FILTERS: { id: MeetingFilter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'scheduled', label: 'Scheduled' },
  { id: 'completed', label: 'Completed' },
  { id: 'cancelled', label: 'Cancelled' },
]

const STATUS_CLASS: Record<string, string> = {
  scheduled: 'bg-cobalt-soft text-cobalt',
  completed: 'bg-ok-soft text-ok',
  cancelled: 'bg-danger-soft text-danger',
  no_show: 'bg-warn-soft text-warn',
  rescheduled: 'bg-surface-sunken text-ink-soft',
}

export default function WorkspaceMeetingsPage() {
  return (
    <Suspense fallback={<WorkspaceLoading />}>
      <WorkspaceMeetingsContent />
    </Suspense>
  )
}

function WorkspaceMeetingsContent() {
  const state = useCurrentUserRole()
  const workspace = useWorkspace()
  const searchParams = useSearchParams()
  const googleCalendarParam = searchParams.get('google_calendar')
  const [meetings, setMeetings] = useState<WorkspaceMeeting[]>([])
  const [engagements, setEngagements] = useState<WorkspaceEngagement[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [selectedEngagementId, setSelectedEngagementId] = useState<string | null>(null)
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false)
  const [engagementDropdownOpen, setEngagementDropdownOpen] = useState(false)
  const [filter, setFilter] = useState<MeetingFilter>('all')
  const [error, setError] = useState<NormalizedError | null>(null)
  const [loading, setLoading] = useState(false)
  const [busyId, setBusyId] = useState<string | null>(null)
  const [toast, setToast] = useState<{ kind: 'success' | 'error'; message: string } | null>(null)
  const dropdownRef = useRef<HTMLDivElement | null>(null)
  const bookingRequestsAnchorRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!googleCalendarParam) return
    if (googleCalendarParam === 'connected') {
      setToast({ kind: 'success', message: 'Google Calendar connected successfully.' })
    } else if (googleCalendarParam === 'denied') {
      setToast({ kind: 'error', message: 'Google Calendar connection was denied.' })
    } else if (googleCalendarParam === 'server_error') {
      setToast({ kind: 'error', message: 'Google Calendar connection failed due to a server error.' })
    }
  }, [googleCalendarParam])

  useEffect(() => {
    if (state.isPending || !state.user) return
    let cancelled = false

    async function loadMeetings() {
      setLoading(true)
      setError(null)
      try {
        const [result, engagementResult] = await Promise.all([
          workspace.listMeetings(),
          workspace.listEngagements(),
        ])
        if (cancelled) return
        if (result.ok) {
          setMeetings(result.data.meetings)
          setSelectedId((current) => current ?? result.data.meetings[0]?.id ?? null)
        } else {
          setError(result)
        }
        if (engagementResult.ok) {
          setEngagements(engagementResult.data.engagements)
        } else {
          setError((current) => current ?? engagementResult)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    void loadMeetings()
    return () => {
      cancelled = true
    }
  }, [state.isPending, state.user, workspace])

  // Close the engagement dropdown on outside click.
  useEffect(() => {
    function onClick(event: MouseEvent) {
      if (!dropdownRef.current) return
      if (!dropdownRef.current.contains(event.target as Node)) {
        setEngagementDropdownOpen(false)
      }
    }
    if (engagementDropdownOpen) {
      document.addEventListener('mousedown', onClick)
      return () => document.removeEventListener('mousedown', onClick)
    }
    return undefined
  }, [engagementDropdownOpen])

  const visible = useMemo(
    () => (filter === 'all' ? meetings : meetings.filter((meeting) => meeting.status === filter)),
    [filter, meetings],
  )
  const selected = meetings.find((meeting) => meeting.id === selectedId) ?? meetings[0] ?? null
  const engagementMap = useMemo(
    () => new Map(engagements.map((engagement) => [engagement.id, engagement])),
    [engagements],
  )

  const scheduleableEngagements = useMemo(
    () => engagements.filter((engagement) => engagement.status === 'active' || engagement.status === 'paused'),
    [engagements],
  )

  // Keep selection in sync: prefer the explicitly selected engagement, else the
  // meeting's engagement, else the first scheduleable engagement.
  const resolvedEngagementId =
    selectedEngagementId ??
    (selected?.engagementId && engagementMap.has(selected.engagementId) ? selected.engagementId : null) ??
    scheduleableEngagements[0]?.id ??
    null

  const selectedEngagement = resolvedEngagementId ? engagementMap.get(resolvedEngagementId) ?? null : null

  const counterpartyLabel = selectedEngagement
    ? engagementTitle(selectedEngagement, state.role)
    : state.role === 'buyer'
      ? 'an expert'
      : state.role === 'expert'
        ? 'a client'
        : 'an expert'

  const pendingRequestCountForSelected = useMemo(() => {
    if (!selectedEngagement) return 0
    // Approximate: we don't have access to the booking-requests hook here, so we
    // count open native meetings for this engagement as a proxy for "pending requests".
    return meetings.filter(
      (meeting) =>
        meeting.engagementId === selectedEngagement.id &&
        meeting.provider === 'google_calendar' &&
        meeting.status === 'scheduled'
    ).length
  }, [meetings, selectedEngagement])

  async function cancelMeeting(meetingId: string) {
    setBusyId(meetingId)
    const result = await workspace.cancelMeeting(meetingId)
    if (result.ok) {
      setMeetings((current) => current.map((meeting) => (meeting.id === meetingId ? result.data : meeting)))
      setError(null)
    } else {
      setError(result)
    }
    setBusyId(null)
  }

  function openCalendarForEngagement(engagementId: string) {
    if (!engagementMap.has(engagementId)) return
    setSelectedEngagementId(engagementId)
    setIsCalendarOpen(true)
    setTimeout(() => {
      document
        .getElementById('native-availability-inline')
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 50)
  }

  function openBookingRequestsForEngagement(engagementId: string) {
    if (!engagementMap.has(engagementId)) return
    setSelectedEngagementId(engagementId)
    setIsCalendarOpen(false)
    setTimeout(() => {
      bookingRequestsAnchorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 50)
  }

  function selectEngagement(engagementId: string) {
    setSelectedEngagementId(engagementId)
    setEngagementDropdownOpen(false)
    setIsCalendarOpen(false)
  }

  if (state.isPending) return <WorkspaceLoading role={state.role} />
  if (!state.user) return <WorkspaceSignInState redirect="/workspace/meetings" />
  const isBuyer = state.role === 'buyer'
  const dropdownPlaceholder =
    state.role === 'buyer' ? 'Select an expert to schedule with' : 'Select a client to schedule with'
  const dropdownPrefix = state.role === 'buyer' ? 'Scheduling with' : 'Working with'

  return (
    <WorkspaceShell role={state.role}>
      <main className="flex min-w-0 flex-1 flex-col">
        <header className="pf-pagebar">
          <div className="flex flex-col gap-[6px]">
            <div className="flex min-w-0 items-center gap-[14px]">
              <span className="pf-ico pf-ico--lg pf-ico--soft"><Calendar size={20} /></span>
              <div className="pf-pagebar-text">
                <span className="pf-eyebrow">Workspace</span>
                <h1 className="pf-title truncate">Meetings</h1>
              </div>
            </div>
            <div ref={dropdownRef} className="relative">
              <button
                type="button"
                onClick={() => setEngagementDropdownOpen((current) => !current)}
                disabled={scheduleableEngagements.length === 0}
                className="inline-flex items-center gap-[8px] rounded-[8px] border border-line bg-white px-[12px] py-[7px] text-[13px] font-semibold text-ink hover:border-cobalt disabled:cursor-not-allowed disabled:opacity-60"
                aria-haspopup="listbox"
                aria-expanded={engagementDropdownOpen}
              >
                <span className="text-ink-muted">{dropdownPrefix}:</span>
                <span className="truncate">{selectedEngagement ? counterpartyLabel : dropdownPlaceholder}</span>
                <ChevronDown
                  size={14}
                  className={engagementDropdownOpen ? 'rotate-180 transition-transform text-cobalt' : 'text-ink-muted'}
                />
              </button>
              {engagementDropdownOpen && (
                <div
                  role="listbox"
                  className="absolute left-0 top-[calc(100%+6px)] z-30 flex max-h-[280px] min-w-[280px] flex-col overflow-y-auto rounded-[10px] border border-line bg-white shadow-lg"
                >
                  {scheduleableEngagements.map((engagement) => {
                    const label = engagementTitle(engagement, state.role)
                    const active = engagement.id === resolvedEngagementId
                    return (
                      <button
                        key={engagement.id}
                        type="button"
                        role="option"
                        aria-selected={active}
                        onClick={() => selectEngagement(engagement.id)}
                        className={`flex flex-col items-start gap-[2px] px-[12px] py-[10px] text-left transition-colors ${
                          active ? 'bg-cobalt-soft' : 'hover:bg-surface-hover'
                        }`}
                      >
                        <span className="text-[13px] font-semibold text-ink">{label}</span>
                        <span className="text-[11px] uppercase tracking-[0.04em] text-ink-muted">
                          {statusLabel(engagement.status)}
                        </span>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
          {loading && <RefreshCw size={18} className="animate-spin text-cobalt" />}
        </header>

        {error && (
          <div className="px-[24px] pt-[16px]">
            <div className="pf-note pf-note--warn">
              <AlertTriangle size={15} />
              {error.error.message ||
              'Unable to load meetings. Native booking controls remain available below.'}
            </div>
          </div>
        )}

        <div className="flex flex-col gap-[12px] border-b border-line bg-white p-[16px] md:p-[20px]">
          <NativeMeetingEntryCard
            role={state.role}
            engagement={selectedEngagement}
            counterpartyLabel={counterpartyLabel}
            isCalendarOpen={isCalendarOpen}
            onToggleCalendar={() => {
              if (!selectedEngagement) return
              if (!isCalendarOpen) {
                setSelectedEngagementId(selectedEngagement.id)
              }
              setIsCalendarOpen((current) => !current)
            }}
            onOpenChange={openBookingRequestsForEngagement}
            onConnectCalendar={() => setIsConnectModalOpen(true)}
            pendingRequestCountForSelected={pendingRequestCountForSelected}
          />
          {isBuyer && isCalendarOpen && selectedEngagement && selectedEngagement.status === 'active' && (
            <div id="native-availability-inline" key={selectedEngagement.id}>
              <NativeAvailabilityCard engagementId={selectedEngagement.id} />
            </div>
          )}
        </div>

        <div ref={bookingRequestsAnchorRef} className="flex flex-col gap-[12px] border-b border-line bg-white p-[16px] md:p-[20px]">
          <NativeBookingRequestsPanel
            role={state.role}
            selectedEngagementId={resolvedEngagementId}
            engagementLabel={(engagementId) => engagementLabelFor(engagementId, engagementMap, state.role)}
            onOpenCalendar={openCalendarForEngagement}
          />
        </div>

        <div className="flex min-h-0 flex-1 flex-col xl:flex-row">
          <section className="flex flex-col border-b border-line bg-white xl:w-[380px] xl:shrink-0 xl:border-b-0 xl:border-r">
            <div className="border-b border-line p-[16px]">
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
            </div>
            <div className="flex flex-1 flex-col gap-[4px] overflow-y-auto p-[8px]">
              {visible.length === 0 && (
                <p className="px-[12px] py-[24px] text-center text-[14px] leading-[20px] text-ink-muted">
                  No meetings in this view.
                </p>
              )}
              {visible.map((meeting) => {
                const active = meeting.id === selected?.id
                const meetingEngagement = engagementMap.get(meeting.engagementId)
                const subtitle = meetingEngagement
                  ? engagementTitle(meetingEngagement, state.role)
                  : 'Engagement'
                return (
                  <button
                    key={meeting.id}
                    type="button"
                    onClick={() => {
                      setSelectedId(meeting.id)
                      if (meeting.engagementId && engagementMap.has(meeting.engagementId)) {
                        setSelectedEngagementId(meeting.engagementId)
                        setIsCalendarOpen(false)
                      }
                    }}
                    className={`rounded-[10px] border p-[12px] text-left transition-colors ${
                      active ? 'border-cobalt bg-cobalt-soft' : 'border-transparent hover:bg-surface-hover'
                    }`}
                  >
                    <span className="block truncate text-[14px] font-semibold leading-[20px] text-ink">
                      {meeting.title}
                    </span>
                    <span className="mt-[2px] block truncate text-[13px] leading-[18px] text-ink-soft">
                      {subtitle}
                    </span>
                    <span className="mt-[2px] block text-[13px] leading-[18px] text-ink-soft">
                      {timeDate(meeting.startsAt)}
                    </span>
                    <div className="mt-[10px] flex items-center justify-between gap-[8px]">
                      <MeetingStatusBadge status={meeting.status} />
                      <span className="text-[12px] leading-[18px] text-ink-muted">{meeting.timezone}</span>
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
                  <div className="pf-pagebar !static">
                    <div>
                      <MeetingStatusBadge status={selected.status} />
                      <h2 className="pf-title mt-[12px]">
                        {selected.title}
                      </h2>
                      <p className="mt-[4px] text-[14px] leading-[20px] text-ink-soft">
                        {timeDate(selected.startsAt)} to {timeDate(selected.endsAt)}
                      </p>
                    </div>
                    {selected.locationUrl && selected.status === 'scheduled' && (
                      <a
                        href={selected.locationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="pf-btn pf-btn--primary"
                      >
                        <ExternalLink size={16} />
                        Join Google Meet
                      </a>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-px border-b border-line bg-line sm:grid-cols-3">
                    <Fact
                      label="Engagement"
                      value={
                        engagementMap.get(selected.engagementId)
                          ? engagementTitle(engagementMap.get(selected.engagementId)!, state.role)
                          : 'Engagement'
                      }
                    />
                    <Fact label="Provider" value={statusLabel(selected.provider)} />
                    <Fact label="Created" value={longDate(selected.createdAt)} />
                  </div>

                  <div className="px-[32px] py-[24px]">
                    <p className="pf-eyebrow flex items-center gap-[6px]">
                      <MapPin size={16} className="text-ink-muted" />
                      Location
                    </p>
                    <p className="mt-[10px] break-words text-[15px] leading-[24px] text-ink">
                      {selected.locationUrl ?? selected.locationType ?? 'Not set'}
                    </p>
                    {selected.actualStartsAt ? (
                      <p className="mt-[16px] text-[13px] leading-[20px] text-ink-soft">
                        Actual time: {timeDate(selected.actualStartsAt)}
                        {selected.actualEndsAt ? ` to ${timeDate(selected.actualEndsAt)}` : ''}
                      </p>
                    ) : null}
                    {selected.notes && (
                      <>
                        <p className="pf-eyebrow mt-[20px]">
                          Notes
                        </p>
                        <p className="mt-[10px] whitespace-pre-wrap text-[15px] leading-[24px] text-ink">
                          {selected.notes}
                        </p>
                      </>
                    )}
                  </div>
                </article>

                {selected.provider === 'google_calendar' ? (
                  <NativeMeetingActions
                    meeting={selected}
                    role={state.role}
                    onUpdated={(updated) => {
                      setMeetings((current) =>
                        current.map((meeting) =>
                          meeting.id === updated.id
                            ? {
                                ...meeting,
                                ...updated,
                                provider: updated.provider as WorkspaceMeeting['provider'],
                                locationType: updated.locationType as WorkspaceMeeting['locationType'],
                                locationUrl: updated.locationUrl,
                                status: updated.status as WorkspaceMeeting['status'],
                              }
                            : meeting
                        )
                      )
                      setError(null)
                    }}
                  />
                ) : (
                  selected.status === 'scheduled' && (
                    <div className="flex flex-wrap items-center justify-between gap-[12px] rounded-[12px] border border-line bg-white p-[16px]">
                      <span className="text-[13px] leading-[18px] text-ink-soft">
                        Cancel this scheduled meeting. Any Google Calendar event will be removed if linked.
                      </span>
                      <button
                        type="button"
                        onClick={() => void cancelMeeting(selected.id)}
                        disabled={busyId === selected.id}
                        className="pf-btn pf-btn--danger"
                      >
                        <XCircle size={18} />
                        Cancel meeting
                      </button>
                    </div>
                  )
                )}
              </div>
            ) : (
              <div className="flex h-full items-center justify-center">
                <div className="max-w-[360px] text-center">
                  <Calendar size={32} className="mx-auto text-line" />
                  <h2 className="pf-h2 mt-[12px]">No meeting selected</h2>
                  <p className="mt-[4px] text-[14px] leading-[20px] text-ink-soft">
                    Scheduled engagement meetings appear here.
                  </p>
                </div>
              </div>
            )}
          </section>
        </div>
      </main>
      <ConnectCalendarModal
        open={isConnectModalOpen}
        onClose={() => setIsConnectModalOpen(false)}
        returnPath="/workspace/meetings"
      />
      <ActionToast
        show={!!toast}
        toast={toast ? { tone: toast.kind, title: toast.message } : null}
        onClose={() => setToast(null)}
      />
    </WorkspaceShell>
  )
}

function engagementLabelFor(
  engagementId: string,
  engagementMap: Map<string, WorkspaceEngagement>,
  role: ReturnType<typeof useCurrentUserRole>['role']
): string {
  const engagement = engagementMap.get(engagementId)
  if (!engagement) return 'Engagement'
  return engagementTitle(engagement, role)
}

function MeetingStatusBadge({ status }: { status: WorkspaceMeeting['status'] }) {
  return (
    <span
      className={`inline-flex items-center gap-[6px] rounded-full px-[8px] py-[2px] text-[12px] font-medium leading-[18px] ${
        STATUS_CLASS[status] ?? 'bg-surface-sunken text-ink-soft'
      }`}
    >
      <span className="size-[6px] rounded-full bg-current" />
      {statusLabel(status)}
    </span>
  )
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 bg-white px-[24px] py-[18px]">
      <p className="pf-eyebrow">{label}</p>
      <p className="mt-[6px] truncate text-[14px] font-semibold leading-[20px] text-ink">{value}</p>
    </div>
  )
}
