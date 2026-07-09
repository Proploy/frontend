/**
 * Pure helpers for the workspace calendar: Monday-start month math, event
 * colour mapping (Untitled UI utility palette from the Figma spec) and the
 * WorkspaceMeeting → CalendarEvent view-model transform.
 *
 * No React, no side effects — safe to unit test.
 */

import type { WorkspaceMeeting } from '@/features/workspace/types'

// ─── Colours ─────────────────────────────────────────────────────────────
// Values lifted from the Figma export (utility badge families).

export type EventColorKey = 'gray' | 'blue' | 'brand' | 'indigo' | 'pink' | 'green' | 'orange'

export interface EventColor {
  bg: string
  border: string
  text: string
  dot: string
}

export const EVENT_COLORS: Record<EventColorKey, EventColor> = {
  gray: { bg: '#ffffff', border: '#e9eaeb', text: '#414651', dot: '#717680' },
  blue: { bg: '#eff8ff', border: '#b2ddff', text: '#175cd3', dot: '#1570ef' },
  brand: { bg: '#eff4ff', border: '#b2ccff', text: '#004eeb', dot: '#155eef' },
  indigo: { bg: '#eef4ff', border: '#c7d7fe', text: '#3538cd', dot: '#444ce7' },
  pink: { bg: '#fdf2fa', border: '#fcceee', text: '#c11574', dot: '#dd2590' },
  green: { bg: '#edfcf2', border: '#aaf0c4', text: '#087443', dot: '#099250' },
  orange: { bg: '#fef6ee', border: '#f9dbaf', text: '#b93815', dot: '#e04f16' },
}

// Colours assigned to real (non-cancelled) events. Cancelled/completed fall
// back to gray so the grid reads calmly.
const COLOR_CYCLE: EventColorKey[] = ['brand', 'pink', 'green', 'orange', 'indigo', 'blue']

/** Deterministic colour from an arbitrary seed (e.g. engagement id). */
export function colorForSeed(seed: string): EventColorKey {
  let hash = 0
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0
  }
  return COLOR_CYCLE[hash % COLOR_CYCLE.length]
}

// ─── View model ──────────────────────────────────────────────────────────

export type EventVisibility = 'shared' | 'public' | 'archived'

export interface CalendarEvent {
  id: string
  title: string
  partyName: string | null
  start: Date
  end: Date | null
  status: string
  colorKey: EventColorKey
  visibility: EventVisibility
  meetingUrl: string | null
  provider: string | null
}

/** Split a "Title · Party" meeting title into its two parts. */
function splitTitle(raw?: string | null): { title: string; party: string | null } {
  if (!raw) return { title: 'Meeting', party: null }
  const idx = raw.indexOf(' · ')
  if (idx === -1) return { title: raw, party: null }
  return { title: raw.slice(0, idx), party: raw.slice(idx + 3) }
}

function visibilityForStatus(status: string): EventVisibility {
  if (status === 'cancelled' || status === 'completed') return 'archived'
  return 'shared'
}

export function toCalendarEvent(meeting: WorkspaceMeeting): CalendarEvent | null {
  if (!meeting.startsAt) return null
  const start = new Date(meeting.startsAt)
  if (Number.isNaN(start.getTime())) return null
  const end = meeting.endsAt ? new Date(meeting.endsAt) : null
  const { title, party } = splitTitle(meeting.title)
  const isArchived = meeting.status === 'cancelled' || meeting.status === 'completed'
  return {
    id: meeting.id,
    title,
    partyName: party,
    start,
    end: end && !Number.isNaN(end.getTime()) ? end : null,
    status: meeting.status,
    colorKey: isArchived ? 'gray' : colorForSeed(meeting.engagementId || meeting.id),
    visibility: visibilityForStatus(meeting.status),
    meetingUrl: meeting.meetingUrl ?? null,
    provider: meeting.provider ?? null,
  }
}

export function toCalendarEvents(meetings: WorkspaceMeeting[]): CalendarEvent[] {
  return meetings
    .map(toCalendarEvent)
    .filter((e): e is CalendarEvent => e !== null)
    .sort((a, b) => a.start.getTime() - b.start.getTime())
}

// ─── Date math (Monday-start) ────────────────────────────────────────────

const DAY_MS = 86_400_000

export function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}

export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

export function isSameMonth(day: Date, reference: Date): boolean {
  return day.getFullYear() === reference.getFullYear() && day.getMonth() === reference.getMonth()
}

export function addMonths(d: Date, delta: number): Date {
  return new Date(d.getFullYear(), d.getMonth() + delta, 1)
}

export function startOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), 1)
}

export function endOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0)
}

/** 0 = Monday … 6 = Sunday. */
function mondayIndex(d: Date): number {
  return (d.getDay() + 6) % 7
}

/**
 * The 42-cell (6 week) matrix covering `reference`'s month, starting on the
 * Monday on/before the 1st.
 */
export function buildMonthMatrix(reference: Date): Date[] {
  const first = startOfMonth(reference)
  const gridStart = new Date(first.getTime() - mondayIndex(first) * DAY_MS)
  return Array.from({ length: 42 }, (_, i) => {
    const d = new Date(gridStart.getTime() + i * DAY_MS)
    return new Date(d.getFullYear(), d.getMonth(), d.getDate())
  })
}

export function gridBounds(reference: Date): { from: Date; to: Date } {
  const matrix = buildMonthMatrix(reference)
  const from = matrix[0]
  const last = matrix[matrix.length - 1]
  const to = new Date(last.getFullYear(), last.getMonth(), last.getDate(), 23, 59, 59, 999)
  return { from, to }
}

/** ISO-ish "Week N of the month" label for the toolbar chip. */
export function weekOfMonth(reference: Date): number {
  const first = startOfMonth(reference)
  const offset = mondayIndex(first)
  return Math.floor((offset + reference.getDate() - 1) / 7) + 1
}

// ─── Formatting ──────────────────────────────────────────────────────────

export const WEEKDAY_LABELS = ['Mon', 'Tues', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export function formatTime(d: Date): string {
  return d
    .toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    .replace(':00', ':00')
}

export function formatMonthYear(d: Date): string {
  return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
}

export function formatMonthShort(d: Date): string {
  return d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()
}

export function formatRange(reference: Date): string {
  const start = startOfMonth(reference)
  const end = endOfMonth(reference)
  const fmt = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  return `${fmt(start)} – ${fmt(end)}`
}

export function formatDayLong(d: Date): string {
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
}

/** Group events by day-key (YYYY-M-D) for O(1) cell lookup. */
export function dayKey(d: Date): string {
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
}

export function groupEventsByDay(events: CalendarEvent[]): Map<string, CalendarEvent[]> {
  const map = new Map<string, CalendarEvent[]>()
  for (const event of events) {
    const key = dayKey(event.start)
    const bucket = map.get(key)
    if (bucket) bucket.push(event)
    else map.set(key, [event])
  }
  return map
}
