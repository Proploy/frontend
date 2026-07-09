/**
 * Workspace meetings hook — the calendar's only data source.
 *
 * Mirrors use-dashboard.ts: a useMemo-wrapped object of async functions that
 * call service-apis directly from the browser. Pages never touch service-apis.
 *
 * Data policy (per product decision "Real API + local mock fallback"):
 *   - Real feed: GET  /api/v1/workspace/meetings?from&to
 *   - Booking:   POST /api/v1/workspace/meetings
 *   - In development, if the endpoint is unconfigured/unreachable/erroring,
 *     the hook falls back to lib/service-apis/meetings-mock so the calendar
 *     renders while the backend is being built. Force-mock with
 *     NEXT_PUBLIC_DASHBOARD_MOCK=1. In production there is no fallback.
 */

import { useMemo } from 'react'
import { ServiceApisBrowserClient } from '@/lib/service-apis/browser'
import type { NormalizedError } from '@/lib/service-apis/error-utils'
import {
  MEETINGS_MOCK_ENABLED,
  buildMockMeetings,
} from '@/lib/service-apis/meetings-mock'
import type {
  ScheduleMeetingRequest,
  WorkspaceMeeting,
  WorkspaceMeetingsResponse,
} from '@/features/workspace/types'

const client = new ServiceApisBrowserClient()
const MEETINGS_PATH = '/api/v1/workspace/meetings'
const IS_DEV = process.env.NODE_ENV !== 'production'

export type ListMeetingsResult =
  | { ok: true; data: WorkspaceMeeting[]; source: 'api' | 'mock' }
  | NormalizedError

export type ScheduleMeetingResult =
  | { ok: true; data: WorkspaceMeeting; source: 'api' | 'mock' }
  | NormalizedError

function normalizeMeetings(payload: WorkspaceMeetingsResponse | WorkspaceMeeting[]): WorkspaceMeeting[] {
  if (Array.isArray(payload)) return payload
  return payload?.meetings ?? []
}

/**
 * GET /api/v1/workspace/meetings?from&to
 * @param from inclusive lower bound (ISO); typically the first visible grid day
 * @param to   inclusive upper bound (ISO); typically the last visible grid day
 */
async function listMeetings(from: Date, to: Date): Promise<ListMeetingsResult> {
  // The mock seeds events into the *visible* month. `from` is the grid's first
  // cell (often in the previous month), so anchor on the range midpoint.
  const visibleMonth = new Date((from.getTime() + to.getTime()) / 2)

  if (MEETINGS_MOCK_ENABLED) {
    return { ok: true, data: buildMockMeetings(visibleMonth, from, to), source: 'mock' }
  }

  const query = `?from=${encodeURIComponent(from.toISOString())}&to=${encodeURIComponent(to.toISOString())}`
  const result = await client.get<WorkspaceMeetingsResponse | WorkspaceMeeting[]>(
    `${MEETINGS_PATH}${query}`,
    { requireAuth: true },
  )

  if (result.ok) {
    return { ok: true, data: normalizeMeetings(result.data), source: 'api' }
  }

  if (IS_DEV) {
    // Endpoint not ready yet — render fixtures so the UI is usable in dev.
    console.warn('[workspace] meetings endpoint unavailable, using mock fixtures', result)
    return { ok: true, data: buildMockMeetings(visibleMonth, from, to), source: 'mock' }
  }

  return result
}

/**
 * POST /api/v1/workspace/meetings — book a call.
 * Returns the created meeting so the caller can optimistically add it.
 */
async function scheduleMeeting(payload: ScheduleMeetingRequest): Promise<ScheduleMeetingResult> {
  if (!MEETINGS_MOCK_ENABLED) {
    const result = await client.post<WorkspaceMeeting>(MEETINGS_PATH, payload, { requireAuth: true })
    if (result.ok) return { ok: true, data: result.data, source: 'api' }
    if (!IS_DEV) return result
    console.warn('[workspace] schedule endpoint unavailable, synthesizing meeting locally', result)
  }

  // Mock/dev fallback: synthesize the booked meeting locally.
  const synthesized: WorkspaceMeeting = {
    id: `local-${Date.now()}`,
    engagementId: payload.engagementId ?? 'local-engagement',
    startsAt: payload.startsAt,
    endsAt: payload.endsAt,
    status: 'scheduled',
    title: payload.attendeeName ? `${payload.title} · ${payload.attendeeName}` : payload.title,
    provider: payload.provider ?? 'cal_diy',
    meetingUrl: `https://cal.proploy.dev/meet/local-${Date.now()}`,
    locationUrl: null,
  }
  return { ok: true, data: synthesized, source: 'mock' }
}

export const useMeetings = () =>
  useMemo(
    () => ({
      listMeetings,
      scheduleMeeting,
    }),
    [],
  )
