// Notification fixtures for the dashboard bell. Role-based so each workspace
// surfaces relevant events. Shaped to map onto a future `/api/v1/notifications`.

export type NotificationKind = 'payment' | 'project' | 'message' | 'review' | 'approval' | 'dispute' | 'system'

export interface NotificationItem {
  id: string
  kind: NotificationKind
  title: string
  body: string
  when: string
  unread: boolean
  href?: string
}

export const EXPERT_NOTIFICATIONS: NotificationItem[] = [
  { id: 'n1', kind: 'payment', title: 'Payout released', body: '$6,800 released from escrow for Lumen Health milestone.', when: '20m', unread: true, href: '/experts/dashboard/earnings' },
  { id: 'n2', kind: 'review', title: 'New 5★ review', body: 'Atlas Logistics left a review on your go-live work.', when: '2h', unread: true, href: '/experts/dashboard' },
  { id: 'n3', kind: 'message', title: 'New message', body: 'Priya Nair: “Can we move the UAT session to Friday?”', when: '3h', unread: true, href: '/experts/chat' },
  { id: 'n4', kind: 'project', title: 'Milestone due soon', body: 'UAT sign-off for Northwind Capital is due Sat 27 Jun.', when: '1d', unread: false, href: '/experts/dashboard/projects' },
]

export const BUSINESS_NOTIFICATIONS: NotificationItem[] = [
  { id: 'bn1', kind: 'approval', title: 'Approval needed', body: 'June consolidated statement ($52,400) is ready to approve.', when: '15m', unread: true, href: '/business/dashboard/approvals' },
  { id: 'bn2', kind: 'dispute', title: 'Milestone disputed', body: 'You raised a dispute on the Workato connectors milestone.', when: '1h', unread: true, href: '/business/dashboard/payments' },
  { id: 'bn3', kind: 'project', title: 'Project blocked', body: 'Workato integration is blocked — waiting on IT credentials.', when: '4h', unread: true, href: '/business/dashboard/projects' },
  { id: 'bn4', kind: 'message', title: 'New message', body: 'Avery Mock: “UAT environment is ready for your team.”', when: '5h', unread: false, href: '/business/dashboard/messages' },
  { id: 'bn5', kind: 'system', title: 'Expert verified', body: 'Mei Lin completed identity + tax verification.', when: '1d', unread: false, href: '/business/dashboard/compliance' },
]
