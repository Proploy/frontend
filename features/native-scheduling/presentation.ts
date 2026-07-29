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
  const start = formatGoogleCalendarDate(input.startsAt)
  const end = formatGoogleCalendarDate(input.endsAt)
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

function formatGoogleCalendarDate(value: string | null | undefined): string | null {
  if (!value) return null
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return null
  return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z')
}
