'use client'

import { useState } from 'react'
import { CalendarPlus, Loader2, UserX, XCircle } from 'lucide-react'
import { BUTTON_SKEUO } from '@/components/workspace/WorkspaceShell'
import { buildGoogleCalendarEventUrl } from '@/features/native-scheduling/presentation'
import { useNativeMeetingActions } from '@/features/native-scheduling/hooks'
import type { WorkspaceRole } from '@/features/workspace/types'
import type { NativeMeeting } from '@/features/native-scheduling/types'

export function NativeMeetingActions({
  meeting,
  role,
  onUpdated,
}: {
  meeting: NativeMeeting
  role: WorkspaceRole | null
  onUpdated: (meeting: NativeMeeting) => void
}) {
  const actions = useNativeMeetingActions()
  const [error, setError] = useState<string | null>(null)
  const canNoShow = role === 'expert' || role === 'admin'
  const calendarExportUrl =
    meeting.provider === 'google_calendar'
      ? buildGoogleCalendarEventUrl({
          title: meeting.title,
          startsAt: meeting.startsAt,
          endsAt: meeting.endsAt,
          details: meeting.notes,
          location: meeting.locationUrl,
          timezone: meeting.timezone,
        })
      : null

  async function cancel() {
    setError(null)
    const result = await actions.cancel(meeting.id)
    if (result.ok) onUpdated(result.data)
    else setError(result.error.message)
  }

  async function noShow() {
    setError(null)
    const result = await actions.markNoShow(meeting.id)
    if (result.ok) onUpdated(result.data)
    else setError(result.error.message)
  }

  if (meeting.status !== 'scheduled' && meeting.status !== 'completed' && !error && !calendarExportUrl) {
    return null
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-[12px] rounded-[12px] border border-[#e9eaeb] bg-white p-[16px]">
      <div>
        <span className="block text-[13px] leading-[18px] text-[#535862]">
          Google Calendar changes sync back to Proploy. Use <strong>Add to Google Calendar</strong> to copy this event
          into your own calendar.
        </span>
        {error && (
          <span className="mt-[4px] block text-[12px] leading-[18px] text-[#b42318]">{error}</span>
        )}
      </div>
      <div className="flex flex-wrap gap-[8px]">
        {calendarExportUrl && (
          <a
            href={calendarExportUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-[8px] rounded-[8px] border border-[#c7d7fe] bg-white px-[14px] py-[10px] text-[14px] font-semibold text-[#155eef] hover:bg-[#eff4ff]"
          >
            <CalendarPlus size={16} />
            Add to Google Calendar
          </a>
        )}
        {meeting.status === 'scheduled' && (
          <button
            type="button"
            onClick={() => void cancel()}
            disabled={actions.loading}
            className={`inline-flex items-center gap-[8px] rounded-[8px] border border-[#d5d7da] bg-white px-[14px] py-[10px] text-[14px] font-semibold text-[#414651] hover:bg-[#fef3f2] hover:text-[#d92d20] disabled:opacity-50 ${BUTTON_SKEUO}`}
          >
            {actions.loading ? <Loader2 size={16} className="animate-spin" /> : <XCircle size={16} />}
            Cancel meeting
          </button>
        )}
        {meeting.status === 'scheduled' && canNoShow && (
          <button
            type="button"
            onClick={() => void noShow()}
            disabled={actions.loading}
            className="inline-flex items-center gap-[8px] rounded-[8px] border border-[#d5d7da] bg-white px-[14px] py-[10px] text-[14px] font-semibold text-[#414651] hover:bg-[#fffaeb] disabled:opacity-50"
          >
            <UserX size={16} />
            Mark no-show
          </button>
        )}
      </div>
    </div>
  )
}
