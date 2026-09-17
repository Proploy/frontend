'use client'

import { type ReactNode } from 'react'
import {
  Bell,
  Calendar,
  FileText,
  FolderClosed,
  Handshake,
  Home,
  Inbox,
  Loader2,
  MessageSquare,
  Receipt,
  Settings,
  TrendingUp,
  Users,
  Wallet,
} from 'lucide-react'
import { useAuth } from '@/components/providers/auth-provider'
import {
  BUTTON_SKEUO,
  CARD_SHADOW,
  DashboardChrome,
  DashboardEmptyState,
  type DashboardUser,
  type DashNavGroup,
  type DashNavItem,
} from '@/components/dashboard/DashboardChrome'
import type { WorkspaceRole } from '@/features/workspace/types'
import { WorkspaceNotificationTrigger } from '@/features/workspace/workspace-experience'
import { useUserProfilePicture } from '@/features/users/use-user-profile-picture'

export { BUTTON_SKEUO, CARD_SHADOW }

type WorkspaceNavItem = DashNavItem & {
  roles?: WorkspaceRole[]
}

type WorkspaceNavGroup = {
  label?: string
  items: WorkspaceNavItem[]
}

/**
 * Grouped so the rail reads as a workflow rather than a flat 12-item list:
 * money-in at the top (pipeline), the work in the middle (delivery), and the
 * money-out at the bottom. Group labels render as mono eyebrows.
 */
const NAV_GROUPS: WorkspaceNavGroup[] = [
  {
    items: [{ label: 'Home', icon: Home, href: '/workspace' }],
  },
  {
    label: 'Pipeline',
    items: [
      { label: 'Sales', icon: TrendingUp, href: '/workspace/sales', roles: ['expert'] },
      { label: 'Leads', icon: Inbox, href: '/workspace/leads', roles: ['expert'] },
      { label: 'Requests', icon: Inbox, href: '/workspace/requests', roles: ['buyer'] },
      { label: 'Proposals', icon: Handshake, href: '/workspace/proposals' },
      { label: 'Contracts', icon: FileText, href: '/workspace/contracts' },
    ],
  },
  {
    label: 'Delivery',
    items: [
      { label: 'Projects', icon: FolderClosed, href: '/workspace/projects' },
      { label: 'Clients', icon: Users, href: '/workspace/engagements', roles: ['expert'] },
      { label: 'Meetings', icon: Calendar, href: '/workspace/meetings' },
      { label: 'Messages', icon: MessageSquare, href: '/workspace/messages' },
    ],
  },
  {
    label: 'Money',
    items: [
      { label: 'Invoices', icon: Receipt, href: '/workspace/invoices' },
      { label: 'Earnings', icon: Wallet, href: '/workspace/earnings', roles: ['expert'] },
    ],
  },
]

const NAV_SECONDARY: WorkspaceNavItem[] = [
  { label: 'Settings', icon: Settings, href: '/workspace/settings' },
]

const WORKSPACE_BRAND = {
  mark: 'p',
  word: 'Proploy',
  href: '/',
  markBg: 'var(--cobalt)',
  logoSrc: '/PROPLOY.svg',
  logoAlt: 'Proploy',
  logoWidth: 192,
  logoHeight: 54,
}

function useWorkspaceUser(): DashboardUser | undefined {
  const { user } = useAuth()
  const avatarUrl = useUserProfilePicture()

  if (!user) return undefined

  return {
    name: user.name ?? 'Workspace',
    email: user.email ?? '',
    avatarUrl: avatarUrl ?? undefined,
    avatarClassName: 'bg-gradient-to-br from-warn-line to-violet-line',
  }
}


function isVisible(item: WorkspaceNavItem, role?: WorkspaceRole | null): boolean {
  if (!item.roles) return true
  return Boolean(role && item.roles.includes(role))
}

function toDashItem(item: WorkspaceNavItem): DashNavItem {
  return {
    label: item.label,
    icon: item.icon,
    href: item.href,
    badge: item.badge,
    disabled: item.disabled,
  }
}

/** Drops role-gated entries, then any group left empty by that filtering. */
function visibleNavGroups(groups: WorkspaceNavGroup[], role?: WorkspaceRole | null): DashNavGroup[] {
  return groups
    .map((group) => ({
      label: group.label,
      items: group.items.filter((item) => isVisible(item, role)).map(toDashItem),
    }))
    .filter((group) => group.items.length > 0)
}

function visibleNavItems(items: WorkspaceNavItem[], role?: WorkspaceRole | null): DashNavItem[] {
  return items.filter((item) => isVisible(item, role)).map(toDashItem)
}

export function WorkspaceShell({
  children,
  role,
}: {
  children: ReactNode
  role?: WorkspaceRole | null
}) {
  const user = useWorkspaceUser()
  return (
    <DashboardChrome
      nav={visibleNavGroups(NAV_GROUPS, role)}
      secondaryNav={visibleNavItems(NAV_SECONDARY, role)}
      user={user}
      brand={WORKSPACE_BRAND}
      notificationTrigger={<WorkspaceNotificationTrigger />}
    >
      {children}
    </DashboardChrome>
  )
}

export function WorkspaceLoading({ role }: { role?: WorkspaceRole | null } = {}) {
  return (
    <WorkspaceShell role={role}>
      <div className="flex min-h-screen flex-1 items-center justify-center">
        <Loader2 size={32} className="animate-spin text-cobalt" />
      </div>
    </WorkspaceShell>
  )
}

export function WorkspaceEmptyState({
  icon,
  title,
  body,
  actionHref,
  actionLabel,
}: {
  icon?: ReactNode
  title: string
  body: string
  actionHref?: string
  actionLabel?: string
}) {
  return (
    <WorkspaceShell>
      <DashboardEmptyState
        icon={icon ?? <Bell size={28} />}
        title={title}
        body={body}
        actionHref={actionHref}
        actionLabel={actionLabel}
      />
    </WorkspaceShell>
  )
}

export function WorkspaceSignInState({ redirect = '/workspace' }: { redirect?: string }) {
  return (
    <WorkspaceEmptyState
      icon={<FileText size={28} />}
      title="Sign in required"
      body="Use your Proploy account to open the workspace."
      actionHref={`/sign-in?redirect=${encodeURIComponent(redirect)}`}
      actionLabel="Sign in"
    />
  )
}
