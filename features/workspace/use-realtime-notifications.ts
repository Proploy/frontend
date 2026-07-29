'use client'

/**
 * useRealtimeNotifications — W8 (workspace-completion-harness §8.W8).
 *
 * Polls the service-apis notification feed for new user-targeted rows.
 *
 * Flow:
 *   1. Fetch GET /api/v1/workspace/notifications/me through service-apis.
 *   2. Remember existing ids without replaying old notifications.
 *   3. Invoke the caller's `onNotification` callback for newly seen rows.
 *   4. Stop polling on unmount.
 */

import { useEffect, useEffectEvent } from 'react'
import { ServiceApisBrowserClient } from '@/lib/service-apis/browser'

/** Shape of the realtime config returned by service-apis. */
export interface RealtimeConfig {
  channelName: string
  tableName: 'notification_event'
  schema: 'workspace'
  filter: string
}

/** Shape of a notification_event row returned by service-apis. */
export interface NotificationEventRow {
  id: string
  template: string
  toEmail?: string
  toUserId?: string | null
  payload: Record<string, unknown>
  status: string
  createdAt: string
  [k: string]: unknown
}

const serviceApis = new ServiceApisBrowserClient()
const NOTIFICATION_POLL_MS = 30000

/**
 * Fetch the realtime config from service-apis. Returns null on
 * any error so the caller can degrade gracefully (no toast, no
 * subscription, but the app keeps working).
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

async function fetchNotificationEvents(): Promise<NotificationEventRow[] | null> {
  const result = await serviceApis.get<{ notifications: NotificationEventRow[] }>(
    '/api/v1/workspace/notifications/me',
    { requireAuth: true },
  )
  if (!('ok' in result) || !result.ok) {
    return null
  }
  return Array.isArray(result.data.notifications) ? result.data.notifications : null
}

export interface UseRealtimeNotificationsOptions {
  /** Called for every new notification row received. */
  onNotification: (row: NotificationEventRow) => void
  /**
   * Whether the hook should actively subscribe. Defaults to true.
   * Set to false to pause without unmounting.
   */
  enabled?: boolean
}

/**
 * React hook that polls the notification feed and calls back for new rows.
 * Cleans up on unmount.
 */
export function useRealtimeNotifications({
  onNotification,
  enabled = true,
}: UseRealtimeNotificationsOptions): void {
  const notify = useEffectEvent(onNotification)

  useEffect(() => {
    if (!enabled) return

    let cancelled = false
    let initialized = false
    const seenIds = new Set<string>()

    const poll = async () => {
      const rows = await fetchNotificationEvents()
      if (cancelled) return
      if (!rows) return

      if (!initialized) {
        rows.forEach((row) => seenIds.add(row.id))
        initialized = true
        return
      }

      rows.forEach((row) => {
        if (!seenIds.has(row.id)) {
          seenIds.add(row.id)
          notify(row)
        }
      })
    }

    void poll()
    const interval = window.setInterval(() => {
      void poll()
    }, NOTIFICATION_POLL_MS)

    return () => {
      cancelled = true
      window.clearInterval(interval)
    }
  }, [enabled])
}
