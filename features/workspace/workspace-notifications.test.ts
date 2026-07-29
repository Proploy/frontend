import {
  mergeWorkspaceNotifications,
  notificationToItem,
  unreadNotificationCount,
} from '@/features/workspace/workspace-experience'
import type { WorkspaceNotification } from '@/features/workspace/types'

const notification: WorkspaceNotification = {
  id: 'notification-1',
  template: 'proposal_sent',
  status: 'sent',
  title: 'New proposal received',
  body: 'Migration',
  href: '/workspace/proposals?proposal=p1',
  readAt: null,
  createdAt: '2026-07-29T03:30:00Z',
}

describe('workspace notifications', () => {
  it('derives unread state from readAt rather than email delivery status', () => {
    expect(notificationToItem(notification).unread).toBe(true)
    expect(unreadNotificationCount([notification])).toBe(1)

    const read = { ...notification, readAt: '2026-07-29T04:00:00Z' }
    expect(notificationToItem(read).unread).toBe(false)
    expect(unreadNotificationCount([read])).toBe(0)
  })

  it('keeps backend-rendered source links and never invents a notification page', () => {
    expect(notificationToItem(notification).href).toBe(
      '/workspace/proposals?proposal=p1',
    )
    expect(notificationToItem({ ...notification, href: null }).href).toBeUndefined()
  })

  it('deduplicates realtime refresh results by notification id', () => {
    const updated = { ...notification, readAt: '2026-07-29T04:00:00Z' }
    expect(mergeWorkspaceNotifications([notification], [updated])).toEqual([updated])
  })
})
