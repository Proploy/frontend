'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  Calendar,
  ExternalLink,
  MapPin,
  RefreshCw,
  XCircle,
} from 'lucide-react'
import {
  BUTTON_SKEUO,
  CARD_SHADOW,
  WorkspaceLoading,
  WorkspaceShell,
  WorkspaceSignInState,
} from '@/components/workspace/WorkspaceShell'
import { engagementTitle, longDate, statusLabel, timeDate } from '@/components/workspace/workspace-format'
import { useCurrentUserRole, useWorkspace } from '@/features/workspace'
import type { WorkspaceEngagement, WorkspaceMeeting } from '@/features/workspace/types'
import type { NormalizedError } from '@/lib/service-apis/error-utils'
import { NativeMeetingActions } from '@/features/native-scheduling/components/NativeMeetingActions'
import { NativeBookingRequestsPanel } from '@/features/native-scheduling/components/NativeBookingRequestsPanel'
import { NativeMeetingEntryCard } from '@/features/native-scheduling/components/NativeMeetingEntryCard'

type MeetingFilter = 'all' | WorkspaceMeeting['status']

const FILTERS: { id: MeetingFilter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'scheduled', label: 'Scheduled' },
  { id: 'completed', label: 'Completed' },
  { id: 'cancelled', label: 'Cancelled' },
]

const STATUS_CLASS: Record<string, string> = {
  scheduled: 'bg-[#eff4ff] text-[#155eef]',
  completed: 'bg-[#ecfdf3] text-[#067647]',
  cancelled: 'bg-[#fef3f2] text-[#b42318]',
  no_show: 'bg-[#fffaeb] text-[#b54708]',
  rescheduled: 'bg-[#fafafa] text-[#535862]',
}

export default function WorkspaceMeetingsPage() {
  const state = useCurrentUserRole()
  const workspace = useWorkspace()
  const [meetings, setMeetings] = useState<WorkspaceMeeting[]>([])
  const [engagements, setEngagements] = useState<WorkspaceEngagement[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [filter, setFilter] = useState<MeetingFilter>('all')
  const [error, setError] = useState<NormalizedError | null>(null)
  const [loading, setLoading] = useState(false)
  const [busyId, setBusyId] = useState<string | null>(null)

  useEffect(() => {
    if (state.isPending || !state.user) return
    let cancelled = false

    async function loadMeetings() {
      setLoading(true)
      setError(null)
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
      setLoading(false)
    }

    void loadMeetings()
    return () => {
      cancelled = true
    }
  }, [state.isPending, state.user, workspace])

  const visible = useMemo(
    () => (filter === 'all' ? meetings : meetings.filter((meeting) => meeting.status === filter)),
    [filter, meetings],
  )
  const selected = meetings.find((meeting) => meeting.id === selectedId) ?? meetings[0] ?? null
  const engagementMap = useMemo(
    () => new Map(engagements.map((engagement) => [engagement.id, engagement])),
    [engagements],
  )

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

  if (state.isPending) return <WorkspaceLoading role={state.role} />
  if (!state.user) return <WorkspaceSignInState redirect="/workspace/meetings" />
  return (
    <WorkspaceShell role={state.role}>
      <main className="flex min-w-0 flex-1 flex-col">
        <header className="flex flex-wrap items-center justify-between gap-[16px] border-b border-[#e9eaeb] bg-white px-[24px] py-[20px]">
          <div className="flex flex-col gap-[4px]">
            <h1 className="flex items-center gap-[10px] text-[24px] font-semibold leading-[32px] text-[#181d27]">
              <Calendar size={22} className="text-[#155eef]" />
              Meetings
            </h1>
          </div>
          {loading && <RefreshCw size={18} className="animate-spin text-[#155eef]" />}
        </header>

        {error && (
          <div className="border-b border-[#fedf89] bg-[#fffaeb] px-[24px] py-[10px] text-[13px] leading-[18px] text-[#b54708]">
            {error.error.message || 'Unable to load meetings. Native booking controls remain available below.'}
          </div>
        )}

        <div className="flex flex-col gap-[12px] border-b border-[#e9eaeb] bg-white p-[16px] md:p-[20px]">
          <NativeMeetingEntryCard role={state.role} />
          <NativeBookingRequestsPanel role={state.role} />
        </div>

        <div className="flex min-h-0 flex-1 flex-col xl:flex-row">
          <section className="flex flex-col border-b border-[#e9eaeb] bg-white xl:w-[380px] xl:shrink-0 xl:border-b-0 xl:border-r">
            <div className="border-b border-[#e9eaeb] p-[16px]">
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
            </div>
            <div className="flex flex-1 flex-col gap-[4px] overflow-y-auto p-[8px]">
              {visible.length === 0 && (
                <p className="px-[12px] py-[24px] text-center text-[14px] leading-[20px] text-[#717680]">
                  No meetings in this view.
                </p>
              )}
              {visible.map((meeting) => {
                const active = meeting.id === selected?.id
                return (
                  <button
                    key={meeting.id}
                    type="button"
                    onClick={() => setSelectedId(meeting.id)}
                    className={`rounded-[10px] border p-[12px] text-left transition-colors ${
                      active ? 'border-[#155eef] bg-[#f5f8ff]' : 'border-transparent hover:bg-[#fafafa]'
                    }`}
                  >
                    <span className="block truncate text-[14px] font-semibold leading-[20px] text-[#181d27]">
                      {meeting.title}
                    </span>
                    <span className="mt-[2px] block text-[13px] leading-[18px] text-[#535862]">
                      {timeDate(meeting.startsAt)}
                    </span>
                    <div className="mt-[10px] flex items-center justify-between gap-[8px]">
                      <MeetingStatusBadge status={meeting.status} />
                      <span className="text-[12px] leading-[18px] text-[#717680]">{meeting.timezone}</span>
                    </div>
                  </button>
                )
              })}
            </div>
          </section>

          <section className="min-w-0 flex-1 overflow-y-auto bg-white p-[24px]">
            {selected ? (
              <div className="mx-auto flex max-w-[760px] flex-col gap-[16px]">
                <article className={`rounded-[16px] border border-[#e9eaeb] bg-white ${CARD_SHADOW}`}>
                  <div className="flex flex-wrap items-start justify-between gap-[16px] border-b border-[#e9eaeb] px-[32px] py-[28px]">
                    <div>
                      <MeetingStatusBadge status={selected.status} />
                      <h2 className="mt-[12px] text-[24px] font-semibold leading-[32px] text-[#181d27]">{selected.title}</h2>
                      <p className="mt-[4px] text-[14px] leading-[20px] text-[#535862]">
                        {timeDate(selected.startsAt)} to {timeDate(selected.endsAt)}
                      </p>
                    </div>
                    {selected.locationUrl && selected.status === 'scheduled' && (
                      <a
                        href={selected.locationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`inline-flex items-center gap-[8px] rounded-[8px] bg-[#155eef] px-[14px] py-[10px] text-[14px] font-semibold leading-[20px] text-white ${BUTTON_SKEUO}`}
                      >
                        <ExternalLink size={16} />
                        Join
                      </a>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-px border-b border-[#e9eaeb] bg-[#e9eaeb] sm:grid-cols-3">
                    <Fact label="Engagement" value={engagementMap.get(selected.engagementId) ? engagementTitle(engagementMap.get(selected.engagementId)!, state.role) : 'Engagement'} />
                    <Fact label="Provider" value={statusLabel(selected.provider)} />
                    <Fact label="Created" value={longDate(selected.createdAt)} />
                  </div>

                  <div className="px-[32px] py-[24px]">
                    <p className="flex items-center gap-[6px] text-[12px] font-medium uppercase tracking-[0.04em] text-[#717680]">
                      <MapPin size={16} className="text-[#717680]" />
                      Location
                    </p>
                    <p className="mt-[10px] break-words text-[15px] leading-[24px] text-[#252b37]">
                      {selected.locationUrl ?? selected.locationType ?? 'Not set'}
                    </p>
                    {selected.actualStartsAt ? (
                      <p className="mt-[16px] text-[13px] leading-[20px] text-[#535862]">
                        Actual time: {timeDate(selected.actualStartsAt)}{selected.actualEndsAt ? ` to ${timeDate(selected.actualEndsAt)}` : ''}
                      </p>
                    ) : null}
                    {selected.notes && (
                      <>
                        <p className="mt-[20px] text-[12px] font-medium uppercase tracking-[0.04em] text-[#717680]">Notes</p>
                        <p className="mt-[10px] whitespace-pre-wrap text-[15px] leading-[24px] text-[#252b37]">{selected.notes}</p>
                      </>
                    )}
                  </div>
                </article>

                {selected.provider === 'google_calendar' ? (
                  <NativeMeetingActions
                    meeting={selected}
                    role={state.role}
                    onUpdated={(updated) => {
                      setMeetings((current) => current.map((meeting) => (
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
                      )))
                      setError(null)
                    }}
                  />
                ) : selected.status === 'scheduled' && (
                  <div className="flex flex-wrap items-center justify-between gap-[12px] rounded-[12px] border border-[#e9eaeb] bg-white p-[16px]">
                    <span className="text-[13px] leading-[18px] text-[#535862]">Cancel this scheduled meeting.</span>
                    <button
                      type="button"
                      onClick={() => void cancelMeeting(selected.id)}
                      disabled={busyId === selected.id}
                      className={`inline-flex items-center gap-[8px] rounded-[8px] border border-[#d5d7da] bg-white px-[14px] py-[10px] text-[14px] font-semibold leading-[20px] text-[#414651] transition-colors hover:bg-[#fef3f2] hover:text-[#d92d20] disabled:cursor-not-allowed disabled:opacity-50 ${BUTTON_SKEUO}`}
                    >
                      <XCircle size={18} />
                      Cancel meeting
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex h-full items-center justify-center">
                <div className="max-w-[360px] text-center">
                  <Calendar size={32} className="mx-auto text-[#d5d7da]" />
                  <h2 className="mt-[12px] text-[18px] font-semibold text-[#181d27]">No meeting selected</h2>
                  <p className="mt-[4px] text-[14px] leading-[20px] text-[#535862]">
                    Scheduled engagement meetings appear here.
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

function MeetingStatusBadge({ status }: { status: WorkspaceMeeting['status'] }) {
  return (
    <span className={`inline-flex items-center gap-[6px] rounded-full px-[8px] py-[2px] text-[12px] font-medium leading-[18px] ${STATUS_CLASS[status] ?? 'bg-[#fafafa] text-[#535862]'}`}>
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
