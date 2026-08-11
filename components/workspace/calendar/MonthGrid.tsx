'use client'

/**
 * Month view grid — Monday-start, 6 weeks, event chips per day.
 * Faithful to the Figma "Calendar" component (node 2448:18104).
 */

import {
  EVENT_COLORS,
  WEEKDAY_LABELS,
  dayKey,
  formatTime,
  isSameDay,
  isSameMonth,
  type CalendarEvent,
} from './calendar-utils'

const MAX_VISIBLE_PER_DAY = 3

export function MonthGrid({
  matrix,
  reference,
  today,
  eventsByDay,
  onSelectDay,
  onSelectEvent,
}: {
  matrix: Date[]
  reference: Date
  today: Date
  eventsByDay: Map<string, CalendarEvent[]>
  onSelectDay: (day: Date) => void
  onSelectEvent: (event: CalendarEvent) => void
}) {
  return (
    <div className="overflow-hidden rounded-[12px] border border-[#e9eaeb] bg-white">
      {/* Weekday header */}
      <div className="grid grid-cols-7 border-b border-[#e9eaeb]">
        {WEEKDAY_LABELS.map((label) => (
          <div
            key={label}
            className="px-[12px] py-[10px] text-center text-[12px] font-medium leading-[18px] text-[#717680]"
          >
            {label}
          </div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7">
        {matrix.map((day, index) => {
          const inMonth = isSameMonth(day, reference)
          const isToday = isSameDay(day, today)
          const events = eventsByDay.get(dayKey(day)) ?? []
          const visible = events.slice(0, MAX_VISIBLE_PER_DAY)
          const overflow = events.length - visible.length
          const isLastCol = (index + 1) % 7 === 0
          const isLastRow = index >= matrix.length - 7

          return (
            <button
              key={dayKey(day)}
              type="button"
              onClick={() => onSelectDay(day)}
              aria-label={`Schedule a call on ${day.toDateString()}`}
              className={[
                'group flex min-h-[128px] flex-col gap-[4px] p-[8px] text-left align-top transition-colors',
                'border-[#e9eaeb]',
                isLastCol ? '' : 'border-r',
                isLastRow ? '' : 'border-b',
                inMonth ? 'bg-white hover:bg-[#fafafa]' : 'bg-[#fcfcfd] hover:bg-[#fafafa]',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#155eef]/40',
              ].join(' ')}
            >
              {/* Date number */}
              <div className="flex items-center px-[2px]">
                {isToday ? (
                  <span className="flex size-[24px] items-center justify-center rounded-full bg-[#155eef] text-[12px] font-semibold leading-[18px] text-white">
                    {day.getDate()}
                  </span>
                ) : (
                  <span
                    className={[
                      'flex h-[24px] items-center text-[12px] font-semibold leading-[18px]',
                      inMonth ? 'text-[#414651]' : 'text-[#a4a7ae]',
                    ].join(' ')}
                  >
                    {day.getDate()}
                  </span>
                )}
              </div>

              {/* Events */}
              <div className="flex flex-col gap-[3px]">
                {visible.map((event) => (
                  <EventChip key={event.id} event={event} onSelect={onSelectEvent} />
                ))}
                {overflow > 0 && (
                  <span className="mt-[1px] px-[4px] text-[12px] font-medium leading-[18px] text-[#717680] group-hover:text-[#414651]">
                    {overflow} more…
                  </span>
                )}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function EventChip({
  event,
  onSelect,
}: {
  event: CalendarEvent
  onSelect: (event: CalendarEvent) => void
}) {
  const color = EVENT_COLORS[event.colorKey]
  const isArchived = event.visibility === 'archived'
  const label = event.partyName ? `${event.title} · ${event.partyName}` : event.title

  return (
    <span
      role="button"
      tabIndex={0}
      title={`${label} · ${formatTime(event.start)}`}
      onClick={(e) => {
        e.stopPropagation()
        onSelect(event)
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          e.stopPropagation()
          onSelect(event)
        }
      }}
      className="flex items-center gap-[6px] rounded-[6px] border px-[6px] py-[3px] transition-shadow hover:shadow-[0px_1px_2px_0px_rgba(10,13,18,0.08)]"
      style={{ backgroundColor: color.bg, borderColor: color.border }}
    >
      <span className="size-[6px] shrink-0 rounded-full" style={{ backgroundColor: color.dot }} />
      <span
        className={[
          'flex-1 truncate text-[12px] font-medium leading-[18px]',
          isArchived ? 'line-through' : '',
        ].join(' ')}
        style={{ color: color.text }}
      >
        {event.title}
      </span>
      <span className="shrink-0 text-[12px] leading-[18px]" style={{ color: color.text, opacity: 0.75 }}>
        {formatTime(event.start)}
      </span>
    </span>
  )
}
