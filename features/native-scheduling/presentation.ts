import type {
  NativeBookingRequestStatus,
  NativeMeeting,
} from '@/features/native-scheduling/types'

const REQUEST_STATUS_LABELS: Record<NativeBookingRequestStatus, string> = {
  pending_expert: 'Waiting for expert',
  alternate_proposed: 'Alternative proposed',
  pending_user: 'Waiting for your approval',
  booked: 'Booked',
  declined: 'Declined',
  cancelled: 'Cancelled',
  conflict: 'Slot became unavailable',
  provider_error: 'Calendar error',
}

export function nativeRequestStatusLabel(status: NativeBookingRequestStatus): string {
  return REQUEST_STATUS_LABELS[status]
}

export function nativeMeetingStatusLabel(status: NativeMeeting['status']): string {
  return status.replace('_', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase())
}

export function formatNativeSlot(
  startsAt: string,
  endsAt: string,
  timezone: string,
): string {
  const formatter = new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: timezone,
  })
  return `${formatter.format(new Date(startsAt))} – ${formatter.format(new Date(endsAt))} (${timezone})`
}

type GoogleCalendarEventInput = {
  title: string
  startsAt: string
  endsAt: string
  details?: string | null
  location?: string | null
  timezone?: string | null
}

/**
 * Builds the Google Calendar 'Add to my calendar' render URL for a meeting.
 * Format documented at https://support.google.com/calendar/thread/81344786.
 * Returns null if the meeting has no usable start time.
 */
export function buildGoogleCalendarEventUrl(input: GoogleCalendarEventInput): string | null {
  const start = formatGoogleCalendarDate(input.startsAt, input.timezone)
  const end = formatGoogleCalendarDate(input.endsAt, input.timezone)
  if (!start || !end) return null
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: input.title,
    dates: `${start}/${end}`,
  })
  if (input.details) params.set('details', input.details)
  if (input.location) params.set('location', input.location)
  if (input.timezone) params.set('ctz', input.timezone)
  return `https://calendar.google.com/calendar/render?${params.toString()}`
}

function formatGoogleCalendarDate(value: string | null | undefined, timezone?: string | null): string | null {
  if (!value) return null
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return null
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone || undefined,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).formatToParts(date)
  const lookup = (type: string) => parts.find((part) => part.type === type)?.value
  const year = lookup('year')
  const month = lookup('month')
  const day = lookup('day')
  const hour = lookup('hour')
  const minute = lookup('minute')
  const second = lookup('second')
  if (!year || !month || !day || hour === undefined || minute === undefined || second === undefined) {
    return null
  }
  return `${year}${month}${day}T${hour}${minute}${second}Z`
}
