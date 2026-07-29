'use client'

import type { ReactNode } from 'react'
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
  TrendingUp,
  Users,
} from 'lucide-react'
import { useAuth } from '@/components/providers/auth-provider'
import {
  BUTTON_SKEUO,
  CARD_SHADOW,
  DashboardChrome,
  DashboardEmptyState,
  type DashboardUser,
  type DashNavItem,
} from '@/components/dashboard/DashboardChrome'
import type { WorkspaceRole } from '@/features/workspace/types'
import { WorkspaceNotificationTrigger } from '@/features/workspace/workspace-experience'

export { BUTTON_SKEUO, CARD_SHADOW }

type WorkspaceNavItem = DashNavItem & {
  roles?: WorkspaceRole[]
}

const NAV_PRIMARY: WorkspaceNavItem[] = [
  { label: 'Home', icon: Home, href: '/workspace' },
  { label: 'Sales', icon: TrendingUp, href: '/workspace/sales', roles: ['expert', 'admin'] },
  { label: 'Leads', icon: Inbox, href: '/workspace/leads', roles: ['expert', 'admin'] },
  { label: 'Requests', icon: Inbox, href: '/workspace/requests', roles: ['buyer'] },
  { label: 'Proposals', icon: Handshake, href: '/workspace/proposals' },
  { label: 'Projects', icon: FolderClosed, href: '/workspace/projects' },
  { label: 'Contracts', icon: FileText, href: '/workspace/contracts' },
  { label: 'Invoices', icon: FileText, href: '/workspace/invoices' },
  { label: 'Earnings', icon: TrendingUp, href: '/workspace/earnings', roles: ['expert', 'admin'] },
  { label: 'Messages', icon: MessageSquare, href: '/workspace/messages' },
  { label: 'Clients', icon: Users, href: '/workspace/engagements', roles: ['expert', 'admin'] },
  { label: 'Meetings', icon: Calendar, href: '/workspace/meetings' },
]

const WORKSPACE_BRAND = {
  mark: 'p',
  word: 'Proploy',
  href: '/',
  markBg: '#155eef',
  logoSrc: '/PROPLOY.svg',
  logoAlt: 'Proploy',
  logoWidth: 192,
  logoHeight: 54,
}

function useWorkspaceUser(): DashboardUser | undefined {
  const { user } = useAuth()
  if (!user) return undefined
  return {
    name: user.name ?? 'Workspace',
    email: user.email ?? '',
    avatarClassName: 'bg-gradient-to-br from-[#fde68a] to-[#c084fc]',
  }
}

function visibleNavItems(items: WorkspaceNavItem[], role?: WorkspaceRole | null): DashNavItem[] {
  return items.filter((item) => {
    if (!item.roles) return true
    if (role === 'admin') return true
    return Boolean(role && item.roles.includes(role))
  }).map((item) => ({
    label: item.label,
    icon: item.icon,
    href: item.href,
    badge: item.badge,
    disabled: item.disabled,
  }))
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
      nav={visibleNavItems(NAV_PRIMARY, role)}
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
        <Loader2 size={32} className="animate-spin text-[#155eef]" />
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
