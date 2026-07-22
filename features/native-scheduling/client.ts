import { ServiceApisBrowserClient } from '@/lib/service-apis/browser'
import type {
  AvailabilitySlot,
  GoogleCalendarConnectResponse,
  GoogleCalendarConnectionStatus,
  NativeAlternativeSlotInput,
  NativeApiResult,
  NativeAvailabilityResponse,
  NativeBookingRequest,
  NativeBookingRequestInput,
  NativeBookingRequestListResponse,
  NativeDecisionInput,
  NativeMeeting,
  NativeSchedulingProfile,
  NativeSchedulingProfileInput,
} from '@/features/native-scheduling/types'

const client = new ServiceApisBrowserClient()
const ROOT = '/api/v1'

export type NativeRequestAction =
  | 'accept'
  | 'propose-alternative'
  | 'accept-alternative'
  | 'decline'
  | 'cancel'

export function buildNativeAvailabilityPath(
  engagementId: string,
  fromAt: string,
  toAt: string,
  viewerTimezone: string,
): string {
  const params = new URLSearchParams({ fromAt, toAt, viewerTimezone })
  return `${ROOT}/native-scheduling/engagements/${encodeURIComponent(engagementId)}/availability?${params.toString()}`
}

export function buildNativeRequestActionPath(
  requestId: string,
  action: NativeRequestAction,
): string {
  return `${ROOT}/native-scheduling/booking-requests/${encodeURIComponent(requestId)}/${action}`
}

export async function getGoogleCalendarStatus(): Promise<NativeApiResult<GoogleCalendarConnectionStatus>> {
  return client.get<GoogleCalendarConnectionStatus>(
    `${ROOT}/integrations/google-calendar/status`,
    { requireAuth: true },
  )
}

export async function connectGoogleCalendar(
  returnPath = '/workspace/settings',
): Promise<NativeApiResult<GoogleCalendarConnectResponse>> {
  return client.post<GoogleCalendarConnectResponse>(
    `${ROOT}/integrations/google-calendar/connect`,
    { returnPath },
    { requireAuth: true },
  )
}

export async function disconnectGoogleCalendar(): Promise<NativeApiResult<Record<string, never>>> {
  return client.delete<Record<string, never>>(
    `${ROOT}/integrations/google-calendar/connection`,
    { requireAuth: true },
  )
}

export async function getNativeSchedulingProfile(): Promise<NativeApiResult<NativeSchedulingProfile>> {
  return client.get<NativeSchedulingProfile>(
    `${ROOT}/native-scheduling/me/profile`,
    { requireAuth: true },
  )
}

export async function saveNativeSchedulingProfile(
  payload: NativeSchedulingProfileInput,
): Promise<NativeApiResult<NativeSchedulingProfile>> {
  return client.put<NativeSchedulingProfile>(
    `${ROOT}/native-scheduling/me/profile`,
    payload,
    { requireAuth: true },
  )
}

export async function listNativeAvailability(
  engagementId: string,
  fromAt: string,
  toAt: string,
  viewerTimezone: string,
): Promise<NativeApiResult<NativeAvailabilityResponse>> {
  return client.get<NativeAvailabilityResponse>(
    buildNativeAvailabilityPath(engagementId, fromAt, toAt, viewerTimezone),
    { requireAuth: true },
  )
}

export async function createNativeBookingRequest(
  engagementId: string,
  payload: NativeBookingRequestInput,
): Promise<NativeApiResult<NativeBookingRequest>> {
  return client.post<NativeBookingRequest>(
    `${ROOT}/native-scheduling/engagements/${encodeURIComponent(engagementId)}/booking-requests`,
    payload,
    { requireAuth: true },
  )
}

export async function listNativeBookingRequests(): Promise<NativeApiResult<NativeBookingRequestListResponse>> {
  return client.get<NativeBookingRequestListResponse>(
    `${ROOT}/native-scheduling/me/booking-requests`,
    { requireAuth: true },
  )
}

export async function decideNativeBookingRequest(
  requestId: string,
  action: Exclude<NativeRequestAction, 'propose-alternative'>,
  payload?: NativeDecisionInput,
): Promise<NativeApiResult<NativeBookingRequest>> {
  return client.post<NativeBookingRequest>(
    buildNativeRequestActionPath(requestId, action),
    payload,
    { requireAuth: true },
  )
}

export async function proposeNativeAlternative(
  requestId: string,
  payload: NativeAlternativeSlotInput,
): Promise<NativeApiResult<NativeBookingRequest>> {
  return client.post<NativeBookingRequest>(
    buildNativeRequestActionPath(requestId, 'propose-alternative'),
    payload,
    { requireAuth: true },
  )
}

export async function cancelNativeMeeting(
  meetingId: string,
): Promise<NativeApiResult<NativeMeeting>> {
  return client.post<NativeMeeting>(
    `${ROOT}/native-scheduling/meetings/${encodeURIComponent(meetingId)}/cancel`,
    undefined,
    { requireAuth: true },
  )
}

export async function markNativeMeetingNoShow(
  meetingId: string,
): Promise<NativeApiResult<NativeMeeting>> {
  return client.post<NativeMeeting>(
    `${ROOT}/workspace/meetings/${encodeURIComponent(meetingId)}/no-show`,
    undefined,
    { requireAuth: true },
  )
}

export type { AvailabilitySlot }
