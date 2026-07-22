'use client'

import { useCallback, useEffect, useState } from 'react'
import type { NormalizedError } from '@/lib/service-apis/error-utils'
import {
  cancelNativeMeeting,
  connectGoogleCalendar,
  createNativeBookingRequest,
  decideNativeBookingRequest,
  disconnectGoogleCalendar,
  getGoogleCalendarStatus,
  getNativeSchedulingProfile,
  listNativeAvailability,
  listNativeBookingRequests,
  markNativeMeetingNoShow,
  proposeNativeAlternative,
  saveNativeSchedulingProfile,
} from '@/features/native-scheduling/client'
import type {
  AvailabilitySlot,
  GoogleCalendarConnectionStatus,
  NativeAlternativeSlotInput,
  NativeApiResult,
  NativeAvailabilityResponse,
  NativeBookingRequest,
  NativeBookingRequestInput,
  NativeMeeting,
  NativeSchedulingProfile,
  NativeSchedulingProfileInput,
} from '@/features/native-scheduling/types'

type NativeAsyncState = {
  loading: boolean
  error: NormalizedError | null
}

function isNotFound(result: { ok: false; status: number }): boolean {
  return result.status === 404
}

export function useNativeGoogleCalendar(enabled = true) {
  const [status, setStatus] = useState<GoogleCalendarConnectionStatus | null>(null)
  const [profile, setProfile] = useState<NativeSchedulingProfile | null>(null)
  const [state, setState] = useState<NativeAsyncState>({ loading: false, error: null })

  const refresh = useCallback(async () => {
    if (!enabled) return
    setState({ loading: true, error: null })
    const [statusResult, profileResult] = await Promise.all([
      getGoogleCalendarStatus(),
      getNativeSchedulingProfile(),
    ])

    if (statusResult.ok) setStatus(statusResult.data)
    if (profileResult.ok) {
      setProfile(profileResult.data)
    } else if (isNotFound(profileResult)) {
      setProfile(null)
    }

    const error = statusResult.ok
      ? profileResult.ok || isNotFound(profileResult)
        ? null
        : profileResult
      : statusResult
    setState({ loading: false, error })
  }, [enabled])

  useEffect(() => {
    const handle = window.setTimeout(() => {
      void refresh()
    }, 0)
    return () => window.clearTimeout(handle)
  }, [refresh])

  const connect = useCallback(async (returnPath = '/workspace/settings') => {
    setState({ loading: true, error: null })
    const result = await connectGoogleCalendar(returnPath)
    if (result.ok && typeof window !== 'undefined') {
      window.location.assign(result.data.authorizationUrl)
      return result
    }
    setState({ loading: false, error: result.ok ? null : result })
    return result
  }, [])

  const disconnect = useCallback(async () => {
    setState({ loading: true, error: null })
    const result = await disconnectGoogleCalendar()
    if (result.ok) {
      setStatus({ connected: false })
      setProfile(null)
    }
    setState({ loading: false, error: result.ok ? null : result })
    return result
  }, [])

  const saveProfile = useCallback(async (payload: NativeSchedulingProfileInput) => {
    setState({ loading: true, error: null })
    const result = await saveNativeSchedulingProfile(payload)
    if (result.ok) setProfile(result.data)
    setState({ loading: false, error: result.ok ? null : result })
    return result
  }, [])

  return {
    status,
    profile,
    loading: state.loading,
    error: state.error,
    refresh,
    connect,
    disconnect,
    saveProfile,
  }
}

export function useNativeAvailability(engagementId: string | null, enabled = true) {
  const [data, setData] = useState<NativeAvailabilityResponse | null>(null)
  const [state, setState] = useState<NativeAsyncState>({ loading: false, error: null })

  const load = useCallback(async (
    fromAt: string,
    toAt: string,
    viewerTimezone: string,
  ) => {
    if (!enabled || !engagementId) return null
    setState({ loading: true, error: null })
    const result = await listNativeAvailability(engagementId, fromAt, toAt, viewerTimezone)
    if (result.ok) setData(result.data)
    setState({ loading: false, error: result.ok ? null : result })
    return result
  }, [enabled, engagementId])

  return {
    data,
    slots: data?.slots ?? ([] as AvailabilitySlot[]),
    loading: state.loading,
    error: state.error,
    load,
  }
}

export function useNativeBookingRequests(enabled = true) {
  const [requests, setRequests] = useState<NativeBookingRequest[]>([])
  const [state, setState] = useState<NativeAsyncState>({ loading: false, error: null })

  const refresh = useCallback(async () => {
    if (!enabled) return
    setState({ loading: true, error: null })
    const result = await listNativeBookingRequests()
    if (result.ok) setRequests(result.data.requests)
    setState({ loading: false, error: result.ok ? null : result })
  }, [enabled])

  useEffect(() => {
    const handle = window.setTimeout(() => {
      void refresh()
    }, 0)
    return () => window.clearTimeout(handle)
  }, [refresh])

  const applyResult = useCallback((result: NativeApiResult<NativeBookingRequest>) => {
    if (result.ok) {
      setRequests((current) => current.map((request) => (
        request.id === result.data.id ? result.data : request
      )))
    }
    setState({ loading: false, error: result.ok ? null : result })
    return result
  }, [])

  const create = useCallback(async (
    engagementId: string,
    payload: NativeBookingRequestInput,
  ) => {
    setState({ loading: true, error: null })
    const result = await createNativeBookingRequest(engagementId, payload)
    if (result.ok) setRequests((current) => [result.data, ...current])
    setState({ loading: false, error: result.ok ? null : result })
    return result
  }, [])

  const decide = useCallback(async (
    requestId: string,
    action: 'accept' | 'accept-alternative' | 'decline' | 'cancel',
    reason?: string,
  ) => {
    setState({ loading: true, error: null })
    return applyResult(await decideNativeBookingRequest(
      requestId,
      action,
      reason ? { reason } : undefined,
    ))
  }, [applyResult])

  const proposeAlternative = useCallback(async (
    requestId: string,
    payload: NativeAlternativeSlotInput,
  ) => {
    setState({ loading: true, error: null })
    return applyResult(await proposeNativeAlternative(requestId, payload))
  }, [applyResult])

  return {
    requests,
    loading: state.loading,
    error: state.error,
    refresh,
    create,
    decide,
    proposeAlternative,
  }
}

export function useNativeMeetingActions() {
  const [state, setState] = useState<NativeAsyncState>({ loading: false, error: null })

  const cancel = useCallback(async (meetingId: string): Promise<NativeApiResult<NativeMeeting>> => {
    setState({ loading: true, error: null })
    const result = await cancelNativeMeeting(meetingId)
    setState({ loading: false, error: result.ok ? null : result })
    return result
  }, [])

  const markNoShow = useCallback(async (meetingId: string): Promise<NativeApiResult<NativeMeeting>> => {
    setState({ loading: true, error: null })
    const result = await markNativeMeetingNoShow(meetingId)
    setState({ loading: false, error: result.ok ? null : result })
    return result
  }, [])

  return { loading: state.loading, error: state.error, cancel, markNoShow }
}
