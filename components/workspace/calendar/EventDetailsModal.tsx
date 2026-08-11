'use client'

/**
 * Read view for a single calendar event (a booked call).
 * Opened by clicking an event chip in the month grid.
 */

import { useEffect } from 'react'
import { Building2, CalendarClock, Clock, Video, X } from 'lucide-react'
import { BUTTON_SKEUO } from '@/components/workspace/WorkspaceShell'
import { EVENT_COLORS, formatDayLong, formatTime, type CalendarEvent } from './calendar-utils'

const STATUS_STYLES: Record<string, { bg: string; border: string; text: string; label: string }> = {
  scheduled: { bg: '#ecfdf3', border: '#abefc6', text: '#067647', label: 'Scheduled' },
  completed: { bg: '#f5f5f5', border: '#e9eaeb', text: '#414651', label: 'Completed' },
  cancelled: { bg: '#fef3f2', border: '#fecdca', text: '#b42318', label: 'Cancelled' },
}

function durationLabel(event: CalendarEvent): string {
  if (!event.end) return formatTime(event.start)
  const minutes = Math.round((event.end.getTime() - event.start.getTime()) / 60_000)
  return `${formatTime(event.start)} – ${formatTime(event.end)} · ${minutes} min`
}

export function EventDetailsModal({
  event,
  onClose,
  onCancelMeeting,
}: {
  event: CalendarEvent
  onClose: () => void
  onCancelMeeting: (event: CalendarEvent) => void
}) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  const color = EVENT_COLORS[event.colorKey]
  const status = STATUS_STYLES[event.status] ?? STATUS_STYLES.scheduled
  const isActive = event.status !== 'cancelled' && event.status !== 'completed'

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-[16px]">
      <div className="absolute inset-0 bg-[#0a0d12]/40 backdrop-blur-[2px]" onClick={onClose} aria-hidden />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="event-details-title"
        className="relative w-full max-w-[460px] overflow-hidden rounded-[16px] border border-[#e9eaeb] bg-white shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1)]"
      >
        <div className="h-[6px] w-full" style={{ backgroundColor: color.dot }} />
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-[16px] top-[16px] inline-flex size-[32px] items-center justify-center rounded-[8px] text-[#717680] hover:bg-[#fafafa]"
        >
          <X size={18} />
        </button>

        <div className="px-[24px] pb-[24px] pt-[20px]">
          <span
            className="inline-flex items-center gap-[4px] rounded-full border px-[8px] py-[2px] text-[12px] font-medium leading-[18px]"
            style={{ backgroundColor: status.bg, borderColor: status.border, color: status.text }}
          >
            {status.label}
          </span>

          <h2 id="event-details-title" className="mt-[12px] font-semibold text-[20px] leading-[28px] text-[#181d27]">
            {event.title}
          </h2>

          <div className="mt-[16px] flex flex-col gap-[12px]">
            {event.partyName && (
              <Row icon={<Building2 size={16} />} label={event.partyName} />
            )}
            <Row icon={<CalendarClock size={16} />} label={formatDayLong(event.start)} />
            <Row icon={<Clock size={16} />} label={durationLabel(event)} />
            {event.provider && (
              <Row icon={<Video size={16} />} label={`Video call · ${providerLabel(event.provider)}`} />
            )}
          </div>

          <div className="mt-[24px] flex items-center justify-between gap-[10px]">
            {isActive ? (
              <button
                type="button"
                onClick={() => onCancelMeeting(event)}
                className={`rounded-[8px] border border-[#d5d7da] bg-white px-[14px] py-[10px] text-[14px] font-semibold leading-[20px] text-[#b42318] ${BUTTON_SKEUO}`}
              >
                Cancel meeting
              </button>
            ) : (
              <span />
            )}
            {event.meetingUrl && isActive ? (
              <a
                href={event.meetingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-[6px] rounded-[8px] border-2 border-white/[0.12] bg-[#155eef] px-[14px] py-[10px] text-[14px] font-semibold leading-[20px] text-white ${BUTTON_SKEUO}`}
              >
                <Video size={16} />
                Join call
              </a>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className={`rounded-[8px] border border-[#d5d7da] bg-white px-[14px] py-[10px] text-[14px] font-semibold leading-[20px] text-[#414651] ${BUTTON_SKEUO}`}
              >
                Close
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function Row({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-[10px] text-[14px] leading-[20px] text-[#414651]">
      <span className="shrink-0 text-[#717680]">{icon}</span>
      <span className="min-w-0 truncate">{label}</span>
    </div>
  )
}

function providerLabel(provider: string): string {
  switch (provider) {
    case 'cal_diy':
      return 'Proploy Scheduling'
    case 'cal_com':
      return 'Cal.com'
    case 'calendly':
      return 'Calendly'
    case 'google':
      return 'Google Meet'
    case 'google_cal':
      return 'Google Calendar'
    case 'zoom':
      return 'Zoom'
    default:
      return provider
  }
}
