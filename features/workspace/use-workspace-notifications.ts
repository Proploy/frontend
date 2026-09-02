'use client'

/**
 * useWorkspaceNotifications — the dashboard bell, backed by the live feed.
 *
 * Reads `GET /api/v1/workspace/notifications/me` through service-apis and maps
 * each row onto the `NotificationItem` view model the bell renders. Refreshes
 * when `useRealtimeNotifications` reports a new row, so the badge stays current
 * without its own polling loop.
 *
 * The dashboards previously rendered hardcoded arrays here even though this
 * endpoint was already built and deployed. Use this hook instead of adding
 * fixtures — it degrades to an empty list on error rather than to fake rows.
 */

import { useCallback, useEffect, useMemo, useState } from 'react'

import { useAuth } from '@/components/providers/auth-provider'
import { ServiceApisBrowserClient } from '@/lib/service-apis/browser'
import type { NotificationItem, WorkspaceNotification } from '@/features/workspace/types'
import { notificationToItem, unreadNotificationCount } from '@/features/workspace/workspace-experience'
import { useRealtimeNotifications } from '@/features/workspace/use-realtime-notifications'

const client = new ServiceApisBrowserClient()
const NOTIFICATIONS_ME_PATH = '/api/v1/workspace/notifications/me'

export interface UseWorkspaceNotificationsResult {
  items: NotificationItem[]
  unreadCount: number
  loading: boolean
  /** Non-null when the feed could not be read; the bell still renders empty. */
  error: string | null
  refresh: () => Promise<void>
}

export function useWorkspaceNotifications(): UseWorkspaceNotificationsResult {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState<WorkspaceNotification[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    if (!user) {
      setNotifications([])
      return
    }
    setLoading(true)
    try {
      const result = await client.get<{ notifications: WorkspaceNotification[] }>(
        NOTIFICATIONS_ME_PATH,
        { requireAuth: true },
      )
      if (result.ok) {
        setNotifications(
          Array.isArray(result.data.notifications) ? result.data.notifications : [],
        )
        setError(null)
      } else {
        setError(result.error.message || 'Could not load notifications.')
      }
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    void refresh()
  }, [refresh])

  // A new row arriving is the signal to re-read the feed.
  useRealtimeNotifications({
    enabled: Boolean(user),
    userId: user?.id ?? null,
    onNotification: () => {
      void refresh()
    },
  })

  // Never show another account's rows if the signed-in user changes.
  const owned = useMemo(() => (user ? notifications : []), [notifications, user])

  return {
    items: useMemo(() => owned.map(notificationToItem), [owned]),
    unreadCount: useMemo(() => unreadNotificationCount(owned), [owned]),
    loading,
    error,
    refresh,
  }
}
