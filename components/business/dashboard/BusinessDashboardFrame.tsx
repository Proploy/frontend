'use client'

import type { ReactNode } from 'react'
import {
  Calendar,
  ClipboardCheck,
  CreditCard,
  FileText,
  LayoutDashboard,
  LifeBuoy,
  MessageSquare,
  Search,
  Settings,
  ShieldCheck,
  Users,
  Wallet,
} from 'lucide-react'
import {
  DashboardChrome,
  type DashNavItem,
  type DashboardUser,
} from '@/components/dashboard/DashboardChrome'
import { MOCK_BUSINESS_USER } from '@/lib/service-apis/business-dashboard-mock'
import { MOCK_ENABLED } from '@/lib/service-apis/dashboard-mock'
import type { NotificationItem } from '@/features/workspace/types'
import { useWorkspaceNotifications } from '@/features/workspace/use-workspace-notifications'
import { useDemo } from '@/lib/demo/demo-store'
import { useAuth } from '@/components/providers/auth-provider'

function useBusinessNotifications(): NotificationItem[] {
  // Live feed: GET /api/v1/workspace/notifications/me.
  const { items } = useWorkspaceNotifications()
  const { notifications } = useDemo()

  // Demo-store rows are local, unsaved interactions and only surface when the
  // dashboard mock is explicitly enabled — never in production.
  if (!MOCK_ENABLED) return items

  const extra: NotificationItem[] = notifications
    .filter((n) => n.role === 'business')
    .map((n) => ({ id: n.id, kind: n.kind, title: n.title, body: n.body, when: 'now', unread: true, href: n.href }))
  return [...extra, ...items]
}

export { BUTTON_SKEUO, CARD_SHADOW } from '@/components/dashboard/DashboardChrome'

const NAV_PRIMARY: DashNavItem[] = [
  { label: 'Overview', icon: LayoutDashboard, href: '/business/dashboard' },
  { label: 'Projects', icon: Wallet, href: '/business/dashboard/projects' },
  { label: 'Find experts', icon: Search, href: '/business/dashboard/hire' },
  { label: 'Approvals', icon: ClipboardCheck, href: '/business/dashboard/approvals', badge: '3' },
  { label: 'Payments', icon: CreditCard, href: '/business/dashboard/payments' },
  { label: 'Tax & compliance', icon: ShieldCheck, href: '/business/dashboard/compliance' },
  { label: 'Documents', icon: FileText, href: '/business/dashboard/documents' },
  { label: 'Team', icon: Users, href: '/business/dashboard/team' },
  { label: 'Calendar', icon: Calendar, href: '/business/dashboard/calendar' },
  { label: 'Messages', icon: MessageSquare, href: '/business/dashboard/messages' },
]

const NAV_SECONDARY: DashNavItem[] = [
  { label: 'Settings', icon: Settings, href: '/business/dashboard/settings' },
  { label: 'Support', icon: LifeBuoy, href: '/contact' },
]

const BUSINESS_BRAND = { mark: 'p', word: 'proploy', href: '/business/dashboard', markBg: '#155eef' }

/** Chrome identity for the signed-in account; the mock name is dev-only. */
function useBusinessChromeUser(): DashboardUser {
  const { user } = useAuth()
  return {
    name: user?.name ?? (MOCK_ENABLED ? MOCK_BUSINESS_USER.name : 'Account'),
    email: user?.email ?? (MOCK_ENABLED ? MOCK_BUSINESS_USER.company : ''),
    avatarUrl: user?.image,
    avatarClassName: 'bg-gradient-to-br from-[#155eef] to-[#7f56d9]',
  }
}

export function BusinessDashboardShell({ children }: { children: ReactNode }) {
  const notifications = useBusinessNotifications()
  const user = useBusinessChromeUser()
  return (
    <DashboardChrome
      nav={NAV_PRIMARY}
      secondaryNav={NAV_SECONDARY}
      user={user}
      brand={BUSINESS_BRAND}
      notifications={notifications}
    >
      {children}
    </DashboardChrome>
  )
}

/** Shared page header for business dashboard pages. */
export function BusinessPageHeader({
  title,
  subtitle,
  actions,
}: {
  title: string
  subtitle?: string
  actions?: ReactNode
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-[16px]">
      <div className="flex flex-col gap-[6px]">
        <h1 className="font-semibold text-[28px] leading-[36px] text-[#181d27] tracking-[-0.02em]">{title}</h1>
        {subtitle && <p className="max-w-[640px] text-[15px] leading-[22px] text-[#535862]">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-[10px]">{actions}</div>}
    </div>
  )
}

/** Standard content frame width + padding for business pages. */
export function BusinessPage({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-[1200px] px-[20px] py-[24px] md:px-[32px] md:py-[32px]">
      {children}
    </div>
  )
}
