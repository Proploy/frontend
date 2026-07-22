import type { NormalizedError } from '@/lib/service-apis/error-utils'

export type NativeApiResult<T> = { ok: true; data: T } | NormalizedError

export type GoogleCalendarConnectionStatus = {
  connected: boolean
  provider?: string | null
  providerAccountEmail?: string | null
  primaryCalendarId?: string | null
  primaryCalendarTimezone?: string | null
  status?: 'active' | 'error' | 'disconnected' | null
  lastProviderError?: string | null
  connectedAt?: string | null
}

export type GoogleCalendarConnectResponse = {
  authorizationUrl: string
}

export type NativeSchedulingProfile = {
  id: string
  expertId: string
  provider: 'google_calendar' | string
  status: 'active' | 'disabled' | 'error' | string
  displayLabel: string
  durationMinutes: number
  minimumNoticeMinutes: number
  bookingHorizonDays: number
  calendarTimezone?: string | null
}

export type NativeSchedulingProfileInput = {
  displayLabel: string
  durationMinutes: number
  minimumNoticeMinutes: number
  bookingHorizonDays: number
}

export type AvailabilitySlot = {
  startsAt: string
  endsAt: string
  viewerStartsAt: string
  viewerEndsAt: string
  calendarTimezone: string
  viewerTimezone: string
}

export type NativeAvailabilityResponse = {
  slots: AvailabilitySlot[]
  calendarTimezone: string
  viewerTimezone: string
  durationMinutes: number
}

export type NativeBookingRequestStatus =
  | 'pending_expert'
  | 'alternate_proposed'
  | 'pending_user'
  | 'booked'
  | 'declined'
  | 'cancelled'
  | 'conflict'
  | 'provider_error'

export type NativeBookingRequest = {
  id: string
  engagementId: string
  expertId: string
  requesterUserId: string
  schedulingProfileId: string
  requestedStartsAt: string
  requestedEndsAt: string
  requestedTimezone: string
  proposedStartsAt?: string | null
  proposedEndsAt?: string | null
  proposedTimezone?: string | null
  status: NativeBookingRequestStatus
  decisionReason?: string | null
  providerError?: string | null
  meetingId?: string | null
  createdAt: string
  updatedAt: string
}

export type NativeBookingRequestListResponse = {
  requests: NativeBookingRequest[]
}

export type NativeBookingRequestInput = {
  startsAt: string
  endsAt: string
  timezone: string
}

export type NativeAlternativeSlotInput = NativeBookingRequestInput & {
  reason?: string | null
}

export type NativeDecisionInput = {
  reason?: string | null
}

export type NativeMeeting = {
  id: string
  engagementId: string
  meetingIntentId?: string | null
  schedulingProfileId?: string | null
  provider: 'google_calendar' | 'cal_diy' | 'cal_com' | 'calendly' | 'manual' | 'none' | string
  providerBookingUid?: string | null
  providerCalendarId?: string | null
  providerEventId?: string | null
  providerETag?: string | null
  providerUpdatedAt?: string | null
  startsAt: string
  endsAt: string
  actualStartsAt?: string | null
  actualEndsAt?: string | null
  timezone: string
  status: 'scheduled' | 'completed' | 'cancelled' | 'no_show' | 'rescheduled' | string
  title: string
  locationType?: string | null
  locationUrl?: string | null
  notes?: string | null
  confirmedByUserId?: string | null
  createdAt: string
  updatedAt: string
}
