import { elapsedSeconds } from './time-format'
import type { TimeEntry } from './use-workspace-project-detail'

export interface TimeLogDayGroup {
  key: string
  label: string
  totalSeconds: number
  entries: TimeEntry[]
}

export interface TimeLogPeriodGroup {
  key: string
  label: string
  totalSeconds: number
  days: TimeLogDayGroup[]
}

export function serviceDate(value: string): Date {
  const hasOffset = /(?:z|[+-]\d{2}:?\d{2})$/i.test(value)
  return new Date(hasOffset ? value : `${value}Z`)
}

export function formatTimeOfDay(value: string): string {
  return new Intl.DateTimeFormat(undefined, { hour: '2-digit', minute: '2-digit' }).format(serviceDate(value))
}

function dayKey(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${date.getFullYear()}-${month}-${day}`
}

function startOfWeek(date: Date): Date {
  const start = new Date(date)
  const day = start.getDay()
  const daysFromMonday = day === 0 ? 6 : day - 1
  start.setHours(0, 0, 0, 0)
  start.setDate(start.getDate() - daysFromMonday)
  return start
}

function durationSeconds(entry: TimeEntry, now: Date): number {
  if (!entry.endedAt) return elapsedSeconds(entry.startedAt, now.getTime())
  if (typeof entry.durationMinutes === 'number') return Math.max(0, entry.durationMinutes * 60)
  return Math.max(0, Math.floor((serviceDate(entry.endedAt).getTime() - serviceDate(entry.startedAt).getTime()) / 1000))
}

function dayLabel(date: Date, now: Date): string {
  const today = dayKey(now)
  const yesterday = new Date(now)
  yesterday.setDate(yesterday.getDate() - 1)
  const key = dayKey(date)
  if (key === today) return 'Today'
  if (key === dayKey(yesterday)) return 'Yesterday'
  return new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric', year: 'numeric' }).format(date)
}

function periodLabel(periodStart: Date, currentWeekStart: Date): string {
  const difference = Math.round((currentWeekStart.getTime() - periodStart.getTime()) / 86400000)
  if (difference === 0) return 'This week'
  if (difference === 7) return 'Last week'
  return `Week of ${new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' }).format(periodStart)}`
}

export function groupTimeEntries(entries: TimeEntry[], now: Date): TimeLogPeriodGroup[] {
  const currentWeekStart = startOfWeek(now)
  const periodMap = new Map<string, { start: Date; days: Map<string, TimeLogDayGroup> }>()

  for (const entry of entries) {
    const startedAt = serviceDate(entry.startedAt)
    const weekStart = startOfWeek(startedAt)
    const periodKey = dayKey(weekStart)
    const dateKey = dayKey(startedAt)
    const period = periodMap.get(periodKey) ?? { start: weekStart, days: new Map<string, TimeLogDayGroup>() }
    const day = period.days.get(dateKey) ?? {
      key: dateKey,
      label: dayLabel(startedAt, now),
      totalSeconds: 0,
      entries: [],
    }
    day.entries.push(entry)
    day.totalSeconds += durationSeconds(entry, now)
    period.days.set(dateKey, day)
    periodMap.set(periodKey, period)
  }

  return [...periodMap.entries()]
    .sort(([, left], [, right]) => right.start.getTime() - left.start.getTime())
    .map(([key, period]) => {
      const days = [...period.days.values()].sort((left, right) => right.key.localeCompare(left.key))
      return {
        key,
        label: periodLabel(period.start, currentWeekStart),
        totalSeconds: days.reduce((total, day) => total + day.totalSeconds, 0),
        days,
      }
    })
}
