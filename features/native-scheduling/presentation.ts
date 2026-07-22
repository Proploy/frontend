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
