'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import Link from 'next/link'
import { Bell, Check, Loader2, X } from 'lucide-react'
import { useAuth } from '@/components/providers/auth-provider'
import {
  ActionToast,
  type ActionToastState,
} from '@/components/ui/action-toast'
import { ServiceApisBrowserClient } from '@/lib/service-apis/browser'
import { useRealtimeNotifications } from '@/features/workspace/use-realtime-notifications'
import type { WorkspaceNotification } from '@/features/workspace/types'
import type { NotificationItem } from '@/lib/service-apis/notifications-mock'

const client = new ServiceApisBrowserClient()
const NOTIFICATIONS_PATH = '/api/v1/workspace/notifications'

export function notificationToItem(
  notification: WorkspaceNotification,
): NotificationItem {
  const createdAt = /(?:Z|[+-]\d{2}:\d{2})$/i.test(notification.createdAt)
    ? notification.createdAt
    : `${notification.createdAt}Z`
  return {
    id: notification.id,
    kind: notification.template === 'message_received' ? 'message' : 'approval',
    title: notification.title,
    body: notification.body,
    when: new Intl.DateTimeFormat(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(createdAt)),
    unread: notification.readAt == null,
    href: notification.href ?? undefined,
  }
}

export function unreadNotificationCount(
  notifications: WorkspaceNotification[],
): number {
  return notifications.filter((notification) => notification.readAt == null).length
}

export function mergeWorkspaceNotifications(
  _current: WorkspaceNotification[],
  incoming: WorkspaceNotification[],
): WorkspaceNotification[] {
  return Array.from(
    new Map(incoming.map((notification) => [notification.id, notification])).values(),
  )
}

type WorkspaceExperienceValue = {
  notifications: WorkspaceNotification[]
  unreadCount: number
  notificationOpen: boolean
  openNotifications: () => void
  closeNotifications: () => void
  markNotificationRead: (id: string) => Promise<void>
  markAllNotificationsRead: () => Promise<void>
  showToast: (toast: ActionToastState) => void
}

const WorkspaceExperienceContext = createContext<WorkspaceExperienceValue | null>(null)

export function WorkspaceExperienceProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState<WorkspaceNotification[]>([])
  const [notificationOwnerId, setNotificationOwnerId] = useState<string | null>(null)
  const [notificationOpen, setNotificationOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [toast, setToast] = useState<ActionToastState | null>(null)

  const loadNotifications = useCallback(async () => {
    if (!user) return
    setLoading(true)
    const result = await client.get<{ notifications: WorkspaceNotification[] }>(
      `${NOTIFICATIONS_PATH}/me`,
      { requireAuth: true },
    )
    if (result.ok) {
      setNotificationOwnerId(user.id)
      setNotifications((current) =>
        mergeWorkspaceNotifications(current, result.data.notifications),
      )
      setLoadError(null)
    } else {
      setLoadError(result.error.message || 'Could not load notifications.')
    }
    setLoading(false)
  }, [user])

  useEffect(() => {
    if (!user) return
    const timer = window.setTimeout(() => {
      void loadNotifications()
    }, 0)
    return () => window.clearTimeout(timer)
  }, [loadNotifications, user])

  const visibleNotifications = useMemo(
    () => (notificationOwnerId === user?.id ? notifications : []),
    [notificationOwnerId, notifications, user?.id],
  )

  useRealtimeNotifications({
    enabled: Boolean(user),
    onNotification: () => {
      void loadNotifications()
    },
  })

  const markNotificationRead = useCallback(
    async (id: string) => {
      const readAt = new Date().toISOString()
      setNotifications((current) =>
        current.map((notification) =>
          notification.id === id ? { ...notification, readAt } : notification,
        ),
      )
      const result = await client.patch<WorkspaceNotification>(
        `${NOTIFICATIONS_PATH}/${encodeURIComponent(id)}/read`,
        {},
        { requireAuth: true },
      )
      if (!result.ok) {
        await loadNotifications()
        setToast({ tone: 'error', title: result.error.message || 'Could not mark notification as read.' })
      }
    },
    [loadNotifications],
  )

  const markAllNotificationsRead = useCallback(async () => {
    const previous = visibleNotifications
    const readAt = new Date().toISOString()
    setNotifications((current) =>
      current.map((notification) => ({ ...notification, readAt })),
    )
    const result = await client.patch<{ updated: number }>(
      `${NOTIFICATIONS_PATH}/me/read-all`,
      {},
      { requireAuth: true },
    )
    if (!result.ok) {
      setNotifications(previous)
      setToast({ tone: 'error', title: result.error.message || 'Could not mark notifications as read.' })
    }
  }, [visibleNotifications])

  const value = useMemo<WorkspaceExperienceValue>(
    () => ({
      notifications: visibleNotifications,
      unreadCount: unreadNotificationCount(visibleNotifications),
      notificationOpen,
      openNotifications: () => setNotificationOpen(true),
      closeNotifications: () => setNotificationOpen(false),
      markNotificationRead,
      markAllNotificationsRead,
      showToast: setToast,
    }),
    [
      markAllNotificationsRead,
      markNotificationRead,
      notificationOpen,
      visibleNotifications,
    ],
  )

  return (
    <WorkspaceExperienceContext.Provider value={value}>
      {children}
      <WorkspaceNotificationModal
        open={notificationOpen}
        notifications={visibleNotifications}
        loading={loading}
        error={loadError}
        onClose={() => setNotificationOpen(false)}
        onRetry={() => void loadNotifications()}
        onRead={(id) => void markNotificationRead(id)}
        onReadAll={() => void markAllNotificationsRead()}
      />
      <ActionToast
        show={toast != null}
        toast={toast}
        onClose={() => setToast(null)}
      />
    </WorkspaceExperienceContext.Provider>
  )
}

export function useWorkspaceExperience(): WorkspaceExperienceValue {
  const value = useContext(WorkspaceExperienceContext)
  if (!value) {
    throw new Error('useWorkspaceExperience must be used within WorkspaceExperienceProvider')
  }
  return value
}

export function WorkspaceNotificationTrigger() {
  const experience = useContext(WorkspaceExperienceContext)
  if (!experience) return null
  const { unreadCount, openNotifications } = experience
  return (
    <button
      type="button"
      onClick={openNotifications}
      aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ''}`}
      className="relative inline-flex size-[36px] items-center justify-center rounded-[8px] text-[#414651] transition-colors hover:bg-[#fafafa]"
    >
      <Bell size={19} />
      {unreadCount > 0 && (
        <span className="absolute right-[4px] top-[3px] flex min-w-[16px] items-center justify-center rounded-full bg-[#d92d20] px-[4px] text-[10px] font-semibold leading-[16px] text-white">
          {unreadCount}
        </span>
      )}
    </button>
  )
}

function WorkspaceNotificationModal({
  open,
  notifications,
  loading,
  error,
  onClose,
  onRetry,
  onRead,
  onReadAll,
}: {
  open: boolean
  notifications: WorkspaceNotification[]
  loading: boolean
  error: string | null
  onClose: () => void
  onRetry: () => void
  onRead: (id: string) => void
  onReadAll: () => void
}) {
  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose, open])

  if (!open) return null
  const unread = unreadNotificationCount(notifications)

  return (
    <div className="fixed inset-0 z-[96]" role="dialog" aria-modal="true" aria-label="Notifications">
      <button
        type="button"
        aria-label="Close notifications"
        onClick={onClose}
        className="absolute inset-0 size-full bg-[#0a0d12]/25 backdrop-blur-[1px]"
      />
      <section className="absolute right-[16px] top-[16px] z-[1] flex max-h-[min(640px,calc(100vh-32px))] w-[420px] max-w-[calc(100vw-32px)] flex-col overflow-hidden rounded-[16px] border border-[#e9eaeb] bg-white shadow-[0_24px_48px_-12px_rgba(10,13,18,0.28)]">
        <header className="flex items-center justify-between gap-[12px] border-b border-[#e9eaeb] px-[18px] py-[14px]">
          <div>
            <h2 className="text-[16px] font-semibold text-[#181d27]">Notifications</h2>
            <p className="text-[12px] text-[#717680]">{unread} unread</p>
          </div>
          <div className="flex items-center gap-[6px]">
            {unread > 0 && (
              <button type="button" onClick={onReadAll} className="inline-flex items-center gap-[4px] text-[12px] font-semibold text-[#155eef]">
                <Check size={14} />
                Mark all read
              </button>
            )}
            <button type="button" onClick={onClose} aria-label="Close" className="inline-flex size-[32px] items-center justify-center rounded-[8px] text-[#717680] hover:bg-[#f5f5f5]">
              <X size={17} />
            </button>
          </div>
        </header>
        <div className="overflow-y-auto">
          {loading && notifications.length === 0 ? (
            <div className="flex items-center justify-center gap-[8px] px-[20px] py-[40px] text-[13px] text-[#717680]">
              <Loader2 size={16} className="animate-spin" />
              Loading notifications
            </div>
          ) : error && notifications.length === 0 ? (
            <div className="px-[20px] py-[32px] text-center">
              <p className="text-[13px] text-[#b42318]">{error}</p>
              <button type="button" onClick={onRetry} className="mt-[10px] text-[13px] font-semibold text-[#155eef]">Retry</button>
            </div>
          ) : notifications.length === 0 ? (
            <p className="px-[20px] py-[40px] text-center text-[13px] text-[#717680]">No notifications yet.</p>
          ) : (
            <ul className="divide-y divide-[#f0f0f1]">
              {notifications.map((notification) => {
                const content = (
                  <div className="flex gap-[10px] px-[18px] py-[14px]">
                    <span className={`mt-[6px] size-[8px] shrink-0 rounded-full ${notification.readAt == null ? 'bg-[#155eef]' : 'bg-transparent'}`} />
                    <span className="min-w-0">
                      <span className="block text-[14px] font-semibold text-[#181d27]">{notification.title}</span>
                      <span className="mt-[2px] block text-[13px] text-[#717680]">{notification.body}</span>
                      <span className="mt-[4px] block text-[11px] text-[#a4a7ae]">
                        {notificationToItem(notification).when}
                      </span>
                    </span>
                  </div>
                )
                return (
                  <li key={notification.id} className="hover:bg-[#fafafa]">
                    {notification.href ? (
                      <Link
                        href={notification.href}
                        onClick={() => {
                          onRead(notification.id)
                          onClose()
                        }}
                        className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#155eef]"
                      >
                        {content}
                      </Link>
                    ) : (
                      <button type="button" onClick={() => onRead(notification.id)} className="block w-full text-left">
                        {content}
                      </button>
                    )}
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </section>
    </div>
  )
}
