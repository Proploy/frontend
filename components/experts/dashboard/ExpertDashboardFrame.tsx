'use client'

import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import {
  AlertCircle,
  Clock3,
  FileSignature,
  FolderClosed,
  Handshake,
  Home,
  Inbox,
  LifeBuoy,
  Loader2,
  MessageSquare,
  Receipt,
  Settings,
  TrendingUp,
  Users,
  Wallet,
} from 'lucide-react'
import { useAuth } from '@/components/providers/auth-provider'
import { useExpertDashboard } from '@/hooks/use-expert-dashboard'
import { MOCK_ENABLED, MOCK_AUTH_USER, MOCK_DASHBOARD } from '@/lib/service-apis/dashboard-mock'
import type { ExpertDashboardResponse, ExpertMe } from '@/hooks/types/expert-contracts'
import type { NormalizedError } from '@/lib/service-apis/error-utils'
import {
  BUTTON_SKEUO,
  CARD_SHADOW,
  DashboardChrome,
  DashboardEmptyState,
  DashboardSidebar,
  type DashNavItem,
  type DashboardUser,
} from '@/components/dashboard/DashboardChrome'
import { EXPERT_NOTIFICATIONS } from '@/lib/service-apis/notifications-mock'
import type { NotificationItem } from '@/lib/service-apis/notifications-mock'
import { useDemo } from '@/lib/demo/demo-store'

function useExpertNotifications(): NotificationItem[] {
  const { notifications } = useDemo()
  const extra: NotificationItem[] = notifications
    .filter((n) => n.role === 'expert')
    .map((n) => ({ id: n.id, kind: n.kind, title: n.title, body: n.body, when: 'now', unread: true, href: n.href }))
  return [...extra, ...EXPERT_NOTIFICATIONS]
}

// Re-exported so the many expert sub-pages keep their existing import paths.
export { BUTTON_SKEUO, CARD_SHADOW }
export const EmptyState = DashboardEmptyState

export type DashboardLoadState = {
  user: ReturnType<typeof useAuth>['user']
  dashboard: ExpertDashboardResponse | null
  dashboardError: NormalizedError | null
  isPending: boolean
}

const NAV_PRIMARY: DashNavItem[] = [
  { label: 'Home', icon: Home, href: '/experts/dashboard' },
  { label: 'Sales', icon: TrendingUp, href: '/experts/dashboard/sales' },
  { label: 'Leads', icon: Inbox, href: '/experts/dashboard/leads' },
  { label: 'Proposals', icon: Handshake, href: '/experts/dashboard/proposals' },
  { label: 'Projects', icon: FolderClosed, href: '/experts/dashboard/projects' },
  { label: 'Contracts', icon: FileSignature, href: '/experts/dashboard/contracts' },
  { label: 'Invoices', icon: Receipt, href: '/experts/dashboard/invoices' },
  { label: 'Earnings', icon: Wallet, href: '/experts/dashboard/earnings' },
  { label: 'Messages', icon: MessageSquare, href: '/experts/chat' },
  { label: 'Clients', icon: Users, href: '/experts/dashboard/clients' },
]

const NAV_SECONDARY: DashNavItem[] = [
  { label: 'Settings', icon: Settings, href: '/experts/account' },
  { label: 'Support', icon: LifeBuoy, href: '/experts/dashboard/support' },
]

const EXPERT_BRAND = { mark: 'p', word: 'proploy', href: '/experts/dashboard', markBg: '#155eef' }

function useExpertChromeUser(expert?: ExpertMe): DashboardUser | undefined {
  const { user } = useAuth()
  const effectiveUser = user ?? (MOCK_ENABLED ? MOCK_AUTH_USER : null)
  if (!effectiveUser && !expert) return undefined
  return {
    name: expert?.displayName ?? effectiveUser?.name ?? 'Expert',
    email: effectiveUser?.email ?? '',
    avatarClassName: 'bg-gradient-to-br from-[#fde68a] to-[#c084fc]',
  }
}

export function getDashboardErrorMessage(error: NormalizedError): string {
  switch (error.status) {
    case 401:
      return 'Please sign in to view your dashboard.'
    case 403:
      return error.error.message || 'You must be an approved expert to access this dashboard.'
    case 404:
      return 'No expert application was found for this account.'
    case 429:
      return 'Too many requests. Please try again in a moment.'
    case 0:
      return 'Unable to reach service-apis.'
    default:
      return error.error.message || 'Failed to load dashboard.'
  }
}

export function useExpertDashboardData(): DashboardLoadState {
  const { user, isLoading: isAuthLoading } = useAuth()
  const { getDashboard } = useExpertDashboard()
  const [dashboard, setDashboard] = useState<ExpertDashboardResponse | null>(null)
  const [dashboardError, setDashboardError] = useState<NormalizedError | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (MOCK_ENABLED) return
    if (isAuthLoading) return
    if (!user) return

    let cancelled = false

    async function fetchDashboard() {
      setIsLoading(true)
      setDashboardError(null)
      const result = await getDashboard()

      if (cancelled) return

      if (result.ok) {
        setDashboard(result.data)
      } else {
        setDashboard(null)
        setDashboardError(result)
      }
      setIsLoading(false)
    }

    void fetchDashboard()

    return () => {
      cancelled = true
    }
  }, [getDashboard, isAuthLoading, user])

  if (MOCK_ENABLED) {
    return {
      user: MOCK_AUTH_USER,
      dashboard: MOCK_DASHBOARD,
      dashboardError: null,
      isPending: false,
    }
  }

  return {
    user,
    dashboard,
    dashboardError,
    isPending: isAuthLoading || isLoading || Boolean(user && !dashboard && !dashboardError),
  }
}

/** Standalone sidebar — used directly by /experts/chat and /experts/account. */
export function Sidebar({ expert }: { expert?: ExpertMe }) {
  const user = useExpertChromeUser(expert)
  const notifications = useExpertNotifications()
  return (
    <DashboardSidebar
      nav={NAV_PRIMARY}
      secondaryNav={NAV_SECONDARY}
      user={user}
      brand={EXPERT_BRAND}
      notifications={notifications}
    />
  )
}

export function DashboardShell({
  children,
  expert,
}: {
  children: ReactNode
  expert?: ExpertMe
}) {
  const user = useExpertChromeUser(expert)
  const notifications = useExpertNotifications()
  return (
    <DashboardChrome
      nav={NAV_PRIMARY}
      secondaryNav={NAV_SECONDARY}
      user={user}
      brand={EXPERT_BRAND}
      notifications={notifications}
    >
      {children}
    </DashboardChrome>
  )
}

export function DashboardLoading() {
  return (
    <DashboardShell>
      <div className="flex min-h-screen flex-1 items-center justify-center">
        <Loader2 size={32} className="animate-spin text-[#155eef]" />
      </div>
    </DashboardShell>
  )
}

export function DashboardFailureState({ state }: { state: DashboardLoadState }) {
  if (!state.user) {
    return (
      <DashboardShell>
        <EmptyState
          icon={<AlertCircle size={28} />}
          title="Sign in required"
          body="Use your Proploy account to open the expert dashboard."
          actionHref="/sign-in?redirect=/experts/dashboard"
          actionLabel="Sign in"
        />
      </DashboardShell>
    )
  }

  if (state.dashboardError) {
    const isPending = state.dashboardError.status === 403 || state.dashboardError.status === 404
    return (
      <DashboardShell>
        <EmptyState
          icon={isPending ? <Clock3 size={28} /> : <AlertCircle size={28} />}
          title={isPending ? 'Dashboard unavailable' : 'Something went wrong'}
          body={getDashboardErrorMessage(state.dashboardError)}
          actionHref={isPending ? '/become-expert' : '/'}
          actionLabel={isPending ? 'Open application' : 'Go home'}
        />
      </DashboardShell>
    )
  }

  return (
    <DashboardShell>
      <EmptyState
        icon={<AlertCircle size={28} />}
        title="Dashboard unavailable"
        body="The dashboard endpoint returned no data."
        actionHref="/"
        actionLabel="Go home"
      />
    </DashboardShell>
  )
}
