'use client'

/**
 * useRealtimeNotifications — surfaces newly-arrived notifications.
 *
 * Polls `GET /api/v1/workspace/notifications/me` and invokes `onNotification`
 * for rows the viewer has not seen yet.
 *
 * "Not seen yet" is measured against a persisted watermark — the newest
 * `createdAt` this browser has already surfaced for this user — rather than
 * against the first poll of the current mount. That distinction matters: the
 * previous implementation discarded whatever was present when the hook mounted,
 * so anything that arrived while the user was away was silently swallowed and
 * never announced. With a watermark, history is skipped exactly once (on the
 * first visit in this browser) and every later arrival is reported, including
 * those that landed between sessions.
 *
 * Rows already marked read elsewhere are never announced.
 */

import { useEffect, useEffectEvent } from 'react'

import { ServiceApisBrowserClient } from '@/lib/service-apis/browser'
import type { WorkspaceNotification } from '@/features/workspace/types'

/** Shape of the realtime config returned by service-apis. */
export interface RealtimeConfig {
  channelName: string
  tableName: 'notification_event'
  schema: 'workspace'
  filter: string
}

const serviceApis = new ServiceApisBrowserClient()
const NOTIFICATION_POLL_MS = 30000
const WATERMARK_PREFIX = 'proploy:notifications-watermark:'

/**
 * Fetch the realtime config from service-apis. Returns null on any error so the
 * caller can degrade gracefully (no toast, no subscription, app keeps working).
 */
export async function fetchRealtimeConfig(): Promise<RealtimeConfig | null> {
  const result = await serviceApis.get<RealtimeConfig>(
    '/api/v1/workspace/notifications/realtime-config',
    { requireAuth: true },
  )
  if (!('ok' in result) || !result.ok) {
    return null
  }
  const data = result.data
  if (
    !data ||
    typeof data.channelName !== 'string' ||
    typeof data.tableName !== 'string' ||
    typeof data.schema !== 'string' ||
    typeof data.filter !== 'string'
  ) {
    return null
  }
  return {
    channelName: data.channelName,
    tableName: data.tableName as RealtimeConfig['tableName'],
    schema: data.schema as RealtimeConfig['schema'],
    filter: data.filter,
  }
}

async function fetchNotifications(): Promise<WorkspaceNotification[] | null> {
  const result = await serviceApis.get<{ notifications: WorkspaceNotification[] }>(
    '/api/v1/workspace/notifications/me',
    { requireAuth: true },
  )
  if (!('ok' in result) || !result.ok) {
    return null
  }
  return Array.isArray(result.data.notifications) ? result.data.notifications : null
}

/** Timestamps are compared numerically; unparseable values sort as "oldest". */
function timestamp(iso: string | null | undefined): number {
  if (!iso) return 0
  const value = Date.parse(/(?:Z|[+-]\d{2}:\d{2})$/i.test(iso) ? iso : `${iso}Z`)
  return Number.isFinite(value) ? value : 0
}

function readWatermark(key: string): number | null {
  try {
    const raw = window.localStorage.getItem(key)
    if (!raw) return null
    const value = Number(raw)
    return Number.isFinite(value) ? value : null
  } catch {
    // Private mode or blocked storage: behave like a first visit.
    return null
  }
}

function writeWatermark(key: string, value: number): void {
  try {
    window.localStorage.setItem(key, String(value))
  } catch {
    // Non-fatal: the watermark degrades to in-session only.
  }
}

export interface UseRealtimeNotificationsOptions {
  /** Called once for every notification the viewer has not seen before. */
  onNotification: (row: WorkspaceNotification) => void
  /** Scopes the watermark so one browser can serve several accounts. */
  userId?: string | null
  /** Whether the hook should poll. Defaults to true. */
  enabled?: boolean
}

export function useRealtimeNotifications({
  onNotification,
  userId,
  enabled = true,
}: UseRealtimeNotificationsOptions): void {
  const notify = useEffectEvent(onNotification)

  useEffect(() => {
    if (!enabled) return

    let cancelled = false
    const key = `${WATERMARK_PREFIX}${userId ?? 'anonymous'}`

    const poll = async () => {
      const rows = await fetchNotifications()
      if (cancelled || !rows) return

      const newest = rows.reduce((max, row) => Math.max(max, timestamp(row.createdAt)), 0)
      const watermark = readWatermark(key)

      // First visit for this account in this browser: adopt the current head so
      // the whole backlog is not replayed, then report everything after it.
      if (watermark === null) {
        if (newest > 0) writeWatermark(key, newest)
        return
      }

      const fresh = rows
        .filter((row) => row.readAt == null && timestamp(row.createdAt) > watermark)
        .sort((a, b) => timestamp(a.createdAt) - timestamp(b.createdAt))

      fresh.forEach((row) => notify(row))

      if (newest > watermark) writeWatermark(key, newest)
    }

    void poll()
    const interval = window.setInterval(() => {
      void poll()
    }, NOTIFICATION_POLL_MS)

    return () => {
      cancelled = true
      window.clearInterval(interval)
    }
  }, [enabled, userId])
}
