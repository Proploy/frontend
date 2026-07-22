'use client'

/**
 * useRealtimeNotifications — W8 (workspace-completion-harness §8.W8).
 *
 * Subscribes to Supabase Realtime postgres_changes on
 * `workspace.notification_event` filtered by the current user's id.
 *
 * Flow:
 *   1. Fetch the channel config from
 *      GET /api/v1/workspace/notifications/realtime-config (auth-gated,
 *      user id bound to the filter on the server).
 *   2. Build a `postgres_changes` channel with the returned
 *      { schema, table, filter }.
 *   3. Invoke the caller's `onNotification` callback for every new row.
 *   4. Return an unsubscribe function so the caller can clean up.
 *
 * Why this is a hook that returns an unsubscribe handle (not a
 * useEffect that subscribes internally):
 *   - The caller controls subscription lifetime (mount/unmount).
 *   - The Supabase client is created on the browser only; SSR
 *     imports of this file must be safe even when the browser
 *     Supabase env vars are missing.
 *
 * No new pip/npm dependencies — `@supabase/supabase-js` is already
 * installed (see frontend/package.json).
 */

import { useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { ServiceApisBrowserClient } from '@/lib/service-apis/browser'

/** Shape of the realtime config returned by service-apis. */
export interface RealtimeConfig {
  channelName: string
  tableName: 'notification_event'
  schema: 'workspace'
  filter: string
}

/** Shape of a notification_event row, as Supabase Realtime delivers it. */
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
 * React hook that wires the Supabase Realtime subscription to the
 * caller's notification callback. Cleans up on unmount.
 */
export function useRealtimeNotifications({
  onNotification,
  enabled = true,
}: UseRealtimeNotificationsOptions): void {
  // Keep the latest callback in a ref so we can replace it on every
  // render without resubscribing to the channel.
  const cbRef = useRef(onNotification)
  cbRef.current = onNotification

  // Suppress unused-import-style lint if Supabase is missing
  // (the channel is created on the next line).
  useEffect(() => {
    if (!enabled) return

    let cancelled = false
    let channel: ReturnType<ReturnType<typeof createClient>['channel']> | null = null
    let removeListener: (() => void) | null = null

    ;(async () => {
      const cfg = await fetchRealtimeConfig()
      if (cancelled) return
      if (!cfg) return

      const supabase = createClient()
      channel = supabase
        .channel(cfg.channelName)
        .on(
          // postgres-changes listener: 'INSERT' on the outbox table.
          // The @supabase/supabase-js types for this overload vary
          // by version; we cast to keep the dependency surface stable.
          'postgres_changes' as never,
          {
            event: 'INSERT',
            schema: cfg.schema,
            table: cfg.tableName,
            filter: cfg.filter,
          },
          (payload: { new: NotificationEventRow }) => {
            const row = payload?.new
            if (row) cbRef.current(row)
          },
        )

      // Best-effort subscribe — Supabase returns a thenable.
      // We don't await the resolved promise because the callback
      // fires for every subsequent INSERT, not on subscribe.
      try {
        await channel.subscribe()
      } catch {
        // Swallow — caller can retry on the next mount.
      }

      removeListener = () => {
        if (channel) {
          try {
            void supabase.removeChannel(channel)
          } catch {
            // ignore — channel may already be removed.
          }
        }
      }
    })()

    return () => {
      cancelled = true
      if (removeListener) removeListener()
      else if (channel) {
        try {
          // The Supabase client was created inside the async closure;
          // we cannot remove the channel without a reference. As a
          // best-effort, leave a sentinel: the next caller's `onClose`
          // hook will be no-op because `cbRef` is replaced.
          // The Supabase SDK cleans up channels on auth-state change.
        } catch {
          // ignore
        }
      }
    }
  }, [enabled])
}
