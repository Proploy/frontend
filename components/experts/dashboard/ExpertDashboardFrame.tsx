'use client'

import { useEffect, useState } from 'react'
import type { ComponentType, ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  AlertCircle,
  Clock3,
  FolderClosed,
  Home,
  Inbox,
  LayoutGrid,
  LifeBuoy,
  Loader2,
  Search,
  Settings,
  Users,
  Wallet,
} from 'lucide-react'
import { useAuth } from '@/components/providers/auth-provider'
import { useExpertDashboard } from '@/hooks/use-expert-dashboard'
import type { ExpertDashboardResponse, ExpertMe } from '@/hooks/types/expert-contracts'
import type { NormalizedError } from '@/lib/service-apis/error-utils'

export const BUTTON_SKEUO =
  'shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05),inset_0px_0px_0px_1px_rgba(10,13,18,0.18),inset_0px_-2px_0px_0px_rgba(10,13,18,0.05)]'
export const CARD_SHADOW = 'shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)]'

type NavItem = {
  label: string
  icon: ComponentType<{ size?: number; className?: string }>
  href?: string
  badge?: string
  disabled?: boolean
}

export type DashboardLoadState = {
  user: ReturnType<typeof useAuth>['user']
  dashboard: ExpertDashboardResponse | null
  dashboardError: NormalizedError | null
  isPending: boolean
}

const NAV_PRIMARY: NavItem[] = [
  { label: 'Home', icon: Home, href: '/experts/dashboard' },
  { label: 'Workspace', icon: LayoutGrid, disabled: true },
  { label: 'Projects', icon: FolderClosed, href: '/experts/dashboard/projects' },
  { label: 'Leads', icon: Inbox, disabled: true },
  { label: 'Earnings', icon: Wallet, disabled: true },
  { label: 'Clients', icon: Users, disabled: true },
]

const NAV_SECONDARY: NavItem[] = [
  { label: 'Settings', icon: Settings, disabled: true },
  { label: 'Support', icon: LifeBuoy, disabled: true },
]

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

  return {
    user,
    dashboard,
    dashboardError,
    isPending: isAuthLoading || isLoading || Boolean(user && !dashboard && !dashboardError),
  }
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

export function DashboardShell({
  children,
  expert,
}: {
  children: ReactNode
  expert?: ExpertMe
}) {
  return (
    <div className="min-h-screen bg-[#fafafa] font-[family-name:var(--font-dm-sans)] text-[#181d27]">
      <div className="flex">
        <Sidebar expert={expert} />
        {children}
      </div>
    </div>
  )
}

function Sidebar({ expert }: { expert?: ExpertMe }) {
  return (
    <aside className="hidden lg:flex flex-col w-[296px] shrink-0 h-screen sticky top-0 bg-white border-r border-[#e9eaeb] px-[16px] py-[24px] gap-[24px]">
      <div className="px-[8px] flex items-center gap-[10px]">
        <div className="size-[32px] rounded-[8px] bg-[#155eef] flex items-center justify-center text-white font-bold text-[14px]">
          p
        </div>
        <span className="font-semibold text-[18px] leading-[28px] text-[#181d27]">proploy</span>
      </div>

      <div className="relative">
        <Search size={16} className="absolute left-[12px] top-1/2 -translate-y-1/2 text-[#717680]" />
        <input
          type="text"
          placeholder="Search"
          className={`w-full bg-white border border-[#d5d7da] rounded-[8px] pl-[36px] pr-[36px] py-[8px] text-[14px] leading-[20px] placeholder:text-[#717680] focus:outline-none focus:ring-2 focus:ring-[#155eef]/30 ${BUTTON_SKEUO}`}
        />
        <span className="absolute right-[10px] top-1/2 -translate-y-1/2 px-[6px] py-[2px] text-[12px] leading-[18px] text-[#717680] border border-[#e9eaeb] rounded-[4px] bg-white">
          ⌘K
        </span>
      </div>

      <nav className="flex flex-col gap-[2px]">
        {NAV_PRIMARY.map((item) => (
          <NavLink key={item.label} item={item} />
        ))}
      </nav>

      <div className="flex-1" />

      <nav className="flex flex-col gap-[2px]">
        {NAV_SECONDARY.map((item) => (
          <NavLink key={item.label} item={item} />
        ))}
      </nav>

      <UserCard expert={expert} />
    </aside>
  )
}

function UserCard({ expert }: { expert?: ExpertMe }) {
  const { user } = useAuth()
  const name = expert?.displayName ?? user?.name ?? 'Expert'
  const email = user?.email ?? ''
  const initial = name.charAt(0).toUpperCase()

  return (
    <div className="flex items-center gap-[12px] p-[8px] rounded-[8px] hover:bg-[#fafafa] transition-colors">
      <div className="size-[40px] rounded-full bg-gradient-to-br from-[#fde68a] to-[#c084fc] flex items-center justify-center text-white font-semibold text-[14px] shrink-0">
        {initial}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-[14px] leading-[20px] text-[#181d27] truncate">{name}</p>
        <p className="font-normal text-[14px] leading-[20px] text-[#535862] truncate">{email}</p>
      </div>
    </div>
  )
}

function NavLink({ item }: { item: NavItem }) {
  const pathname = usePathname()
  const Icon = item.icon
  const isActive = item.href === pathname
  const className = `flex w-full items-center gap-[12px] px-[12px] py-[8px] rounded-[6px] text-left font-semibold text-[14px] leading-[20px] transition-colors ${
    isActive ? 'bg-[#fafafa] text-[#252b37]' : 'text-[#414651]'
  } ${item.disabled ? 'cursor-not-allowed opacity-50' : 'hover:bg-[#fafafa]'}`
  const content = (
    <>
      <Icon size={20} className="text-[#717680] shrink-0" />
      <span className="flex-1 truncate">{item.label}</span>
      {item.badge && (
        <span className="px-[8px] py-[2px] rounded-full border border-[#e9eaeb] bg-white text-[12px] leading-[18px] font-medium text-[#414651]">
          {item.badge}
        </span>
      )}
    </>
  )

  if (item.href && !item.disabled) {
    return (
      <Link href={item.href} className={className} aria-current={isActive ? 'page' : undefined}>
        {content}
      </Link>
    )
  }

  return (
    <button type="button" disabled={item.disabled} className={className}>
      {content}
    </button>
  )
}

export function EmptyState({
  icon,
  title,
  body,
  actionHref,
  actionLabel,
}: {
  icon: ReactNode
  title: string
  body: string
  actionHref: string
  actionLabel: string
}) {
  return (
    <main className="flex min-h-screen flex-1 items-center justify-center px-[32px]">
      <div className="max-w-[440px] rounded-[16px] border border-[#e9eaeb] bg-white p-[32px] text-center">
        <div className="mx-auto mb-[16px] flex size-[56px] items-center justify-center rounded-full bg-[#f5f5f5] text-[#717680]">
          {icon}
        </div>
        <h1 className="font-semibold text-[24px] leading-[32px] text-[#181d27]">{title}</h1>
        <p className="mt-[8px] text-[15px] leading-[22px] text-[#535862]">{body}</p>
        <Link
          href={actionHref}
          className={`mt-[24px] inline-flex rounded-[8px] bg-[#155eef] px-[14px] py-[10px] text-[14px] font-semibold leading-[20px] text-white ${BUTTON_SKEUO}`}
        >
          {actionLabel}
        </Link>
      </div>
    </main>
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
