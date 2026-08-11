'use client'

/**
 * Workspace meetings calendar.
 *
 * Implements the Figma "Calendar" module (node 2448:18095) as the
 * /workspace/meetings page content: page header, event tabs, a month-view
 * grid, and the native "Schedule a call" booking flow. Data comes from
 * useMeetings() (real API with a dev mock fallback).
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  Loader2,
  Plus,
  RefreshCw,
} from 'lucide-react'
import { BUTTON_SKEUO, CARD_SHADOW } from '@/components/workspace/WorkspaceShell'
import { useMeetings } from '@/features/workspace/use-meetings'
import { MOCK_PARTIES, type MockParty } from '@/lib/service-apis/meetings-mock'
import type { ScheduleMeetingRequest, WorkspaceMeeting } from '@/features/workspace/types'
import {
  addMonths,
  buildMonthMatrix,
  formatMonthShort,
  formatMonthYear,
  formatRange,
  gridBounds,
  groupEventsByDay,
  startOfMonth,
  toCalendarEvent,
  toCalendarEvents,
  weekOfMonth,
  type CalendarEvent,
} from './calendar-utils'
import { MonthGrid } from './MonthGrid'
import { SchedulePlannerModal } from './SchedulePlannerModal'
import { EventDetailsModal } from './EventDetailsModal'
import { SchedulingProviders } from './SchedulingProviders'
import { useIntegrations } from '@/lib/integrations/integrations-store'

type TabKey = 'all' | 'shared' | 'public' | 'archived'

const TABS: { key: TabKey; label: string }[] = [
  { key: 'all', label: 'All events' },
  { key: 'shared', label: 'Shared' },
  { key: 'public', label: 'Public' },
  { key: 'archived', label: 'Archived' },
]

export function CalendarView({ padded = true }: { padded?: boolean } = {}) {
  const { listMeetings, scheduleMeeting } = useMeetings()
  const { activeSchedulerDef } = useIntegrations()
  const activeProvider = activeSchedulerDef?.provider ?? 'cal_diy'
  const activeSchedulerName = activeSchedulerDef?.name ?? 'Proploy Scheduling'

  const [today] = useState(() => new Date())
  const [reference, setReference] = useState(() => startOfMonth(new Date()))
  const [activeTab, setActiveTab] = useState<TabKey>('all')
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [scheduleDate, setScheduleDate] = useState<Date | null>(null)
  const [detailsEvent, setDetailsEvent] = useState<CalendarEvent | null>(null)

  const parties: MockParty[] = MOCK_PARTIES

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    const { from, to } = gridBounds(reference)
    const result = await listMeetings(from, to)
    if (result.ok) {
      setEvents(toCalendarEvents(result.data))
    } else {
      setEvents([])
      setError(result.error?.message ?? 'Could not load meetings.')
    }
    setLoading(false)
  }, [listMeetings, reference])

  useEffect(() => {
    void load()
  }, [load])

  const matrix = useMemo(() => buildMonthMatrix(reference), [reference])

  const filteredEvents = useMemo(() => {
    if (activeTab === 'all') return events
    return events.filter((e) => e.visibility === activeTab)
  }, [events, activeTab])

  const eventsByDay = useMemo(() => groupEventsByDay(filteredEvents), [filteredEvents])

  const goToday = () => setReference(startOfMonth(today))
  const goPrev = () => setReference((r) => addMonths(r, -1))
  const goNext = () => setReference((r) => addMonths(r, 1))

  async function handleSchedule(payload: ScheduleMeetingRequest) {
    const result = await scheduleMeeting(payload)
    if (!result.ok) {
      return { ok: false, message: result.error?.message ?? 'Could not schedule the call.' }
    }
    const created = toCalendarEvent(result.data as WorkspaceMeeting)
    if (created) {
      // Only surface it if it lands in the visible grid; otherwise a reload
      // on navigation will pick it up.
      const { from, to } = gridBounds(reference)
      if (created.start >= from && created.start <= to) {
        setEvents((prev) => [...prev, created].sort((a, b) => a.start.getTime() - b.start.getTime()))
      }
    }
    setScheduleDate(null)
    return { ok: true }
  }

  function handleCancelMeeting(event: CalendarEvent) {
    setEvents((prev) =>
      prev.map((e) =>
        e.id === event.id ? { ...e, status: 'cancelled', visibility: 'archived', colorKey: 'gray' } : e,
      ),
    )
    setDetailsEvent(null)
  }

  const body = (
    <>
        {/* Page header */}
        <header className="flex flex-col gap-[4px]">
          <p className="text-[13px] font-semibold leading-[20px] text-[#155eef]">Scheduled calls</p>
          <h1 className="font-semibold text-[24px] leading-[32px] text-[#181d27]">Meetings</h1>
          <p className="max-w-[720px] text-[16px] leading-[24px] text-[#535862]">
            Schedule and manage calls with your clients and businesses. Book a time, and both parties get
            a calendar invite and a video link.
          </p>
        </header>

        {/* Scheduling providers (Cal.com and friends) */}
        <SchedulingProviders />

        {/* Tabs */}
        <div className="inline-flex w-fit items-center gap-[2px] rounded-[10px] border border-[#e9eaeb] bg-[#fafafa] p-[4px]">
          {TABS.map((tab) => {
            const isActive = tab.key === activeTab
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={[
                  'rounded-[6px] px-[12px] py-[6px] text-[14px] font-semibold leading-[20px] transition-colors',
                  isActive
                    ? `bg-white text-[#252b37] ${CARD_SHADOW}`
                    : 'text-[#717680] hover:text-[#252b37]',
                ].join(' ')}
              >
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Calendar */}
        <section className={`overflow-hidden rounded-[12px] border border-[#e9eaeb] bg-white ${CARD_SHADOW}`}>
          {/* Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-[16px] border-b border-[#e9eaeb] px-[20px] py-[16px]">
            <div className="flex items-center gap-[16px]">
              <div className="flex size-[48px] flex-col items-center justify-center rounded-[10px] border border-[#e9eaeb] bg-white">
                <span className="text-[10px] font-semibold uppercase leading-[14px] tracking-[0.04em] text-[#717680]">
                  {formatMonthShort(today)}
                </span>
                <span className="text-[18px] font-semibold leading-[22px] text-[#181d27]">{today.getDate()}</span>
              </div>
              <div className="flex flex-col gap-[2px]">
                <div className="flex items-center gap-[8px]">
                  <h2 className="font-semibold text-[18px] leading-[26px] text-[#181d27]">
                    {formatMonthYear(reference)}
                  </h2>
                  <span className="rounded-[6px] border border-[#e9eaeb] bg-white px-[6px] py-[1px] text-[12px] font-medium leading-[18px] text-[#414651]">
                    Week {weekOfMonth(today)}
                  </span>
                </div>
                <p className="text-[13px] leading-[18px] text-[#717680]">{formatRange(reference)}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-[8px]">
              <button
                type="button"
                onClick={() => void load()}
                aria-label="Refresh"
                className={`inline-flex size-[36px] items-center justify-center rounded-full border border-[#d5d7da] bg-white text-[#414651] hover:bg-[#fafafa] ${BUTTON_SKEUO}`}
              >
                <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
              </button>

              <div className={`inline-flex items-center rounded-[8px] border border-[#d5d7da] bg-white ${BUTTON_SKEUO}`}>
                <button
                  type="button"
                  onClick={goPrev}
                  aria-label="Previous month"
                  className="inline-flex size-[36px] items-center justify-center rounded-l-[8px] text-[#414651] hover:bg-[#fafafa]"
                >
                  <ArrowLeft size={16} />
                </button>
                <button
                  type="button"
                  onClick={goToday}
                  className="border-x border-[#d5d7da] px-[14px] py-[8px] text-[14px] font-semibold leading-[20px] text-[#414651] hover:bg-[#fafafa]"
                >
                  Today
                </button>
                <button
                  type="button"
                  onClick={goNext}
                  aria-label="Next month"
                  className="inline-flex size-[36px] items-center justify-center rounded-r-[8px] text-[#414651] hover:bg-[#fafafa]"
                >
                  <ArrowRight size={16} />
                </button>
              </div>

              <ViewMenu />

              <button
                type="button"
                onClick={() => setScheduleDate(today)}
                className={`inline-flex items-center gap-[6px] rounded-[8px] border-2 border-white/[0.12] bg-[#155eef] px-[14px] py-[9px] text-[14px] font-semibold leading-[20px] text-white ${BUTTON_SKEUO}`}
              >
                <Plus size={16} />
                Schedule call
              </button>
            </div>
          </div>

          {/* Grid / states */}
          <div className="relative p-[20px]">
            {error ? (
              <div className="flex flex-col items-center gap-[12px] py-[64px] text-center">
                <p className="text-[14px] leading-[20px] text-[#b42318]">{error}</p>
                <button
                  type="button"
                  onClick={() => void load()}
                  className={`rounded-[8px] border border-[#d5d7da] bg-white px-[14px] py-[8px] text-[14px] font-semibold text-[#414651] ${BUTTON_SKEUO}`}
                >
                  Retry
                </button>
              </div>
            ) : (
              <>
                <MonthGrid
                  matrix={matrix}
                  reference={reference}
                  today={today}
                  eventsByDay={eventsByDay}
                  onSelectDay={(day) => setScheduleDate(day)}
                  onSelectEvent={(event) => setDetailsEvent(event)}
                />
                {loading && events.length === 0 && (
                  <div className="absolute inset-0 flex items-center justify-center rounded-[12px] bg-white/60">
                    <Loader2 size={28} className="animate-spin text-[#155eef]" />
                  </div>
                )}
              </>
            )}
          </div>
        </section>
    </>
  )

  return (
    <>
      {padded ? (
        <div className="flex-1 min-w-0">
          <div className="mx-auto flex max-w-[1144px] flex-col gap-[24px] px-[32px] py-[32px]">
            {body}
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-[24px]">{body}</div>
      )}

      {scheduleDate && (
        <SchedulePlannerModal
          initialDate={scheduleDate}
          parties={parties}
          provider={activeProvider === 'google_cal' ? 'google_calendar' : activeProvider}
          providerName={activeSchedulerName}
          onClose={() => setScheduleDate(null)}
          onSubmit={handleSchedule}
        />
      )}

      {detailsEvent && (
        <EventDetailsModal
          event={detailsEvent}
          onClose={() => setDetailsEvent(null)}
          onCancelMeeting={handleCancelMeeting}
        />
      )}
    </>
  )
}

/**
 * View switcher. Month view is fully implemented; Week/Day are placeholders
 * for a later pass (disabled so the affordance is honest).
 */
function ViewMenu() {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [open])

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className={`inline-flex items-center gap-[6px] rounded-[8px] border border-[#d5d7da] bg-white px-[14px] py-[8px] text-[14px] font-semibold leading-[20px] text-[#414651] hover:bg-[#fafafa] ${BUTTON_SKEUO}`}
      >
        Month view
        <ChevronDown size={16} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div
          role="menu"
          className="absolute right-0 top-[calc(100%+6px)] z-20 w-[160px] overflow-hidden rounded-[8px] border border-[#e9eaeb] bg-white py-[4px] shadow-[0px_8px_16px_-4px_rgba(10,13,18,0.12)]"
        >
          <button
            type="button"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="flex w-full items-center justify-between px-[12px] py-[8px] text-left text-[14px] font-medium text-[#252b37] hover:bg-[#fafafa]"
          >
            Month view
            <Check size={16} className="text-[#155eef]" />
          </button>
          {['Week view', 'Day view'].map((label) => (
            <span
              key={label}
              className="flex w-full cursor-not-allowed items-center justify-between px-[12px] py-[8px] text-left text-[14px] font-medium text-[#a4a7ae]"
            >
              {label}
              <span className="text-[11px] font-medium text-[#a4a7ae]">Soon</span>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
