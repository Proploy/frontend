'use client'

/**
 * Workspace shell — sidebar + content chrome.
 *
 * Absorbed from components/experts/dashboard/ExpertDashboardFrame.tsx
 * (DashboardShell + Sidebar + NavLink + UserCard). Visual constants
 * (BUTTON_SKEUO, CARD_SHADOW) are kept inline so this shell is self-contained
 * and the original expert dashboard is not affected.
 */

import type { ComponentType, ReactNode } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Bell,
  Calendar,
  FolderClosed,
  Home,
  Inbox,
  Loader2,
  MessageSquare,
  Search,
  Settings,
  Users,
} from 'lucide-react'
import { useAuth } from '@/components/providers/auth-provider'

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

const NAV_PRIMARY: NavItem[] = [
  { label: 'Home', icon: Home, href: '/workspace' },
  { label: 'Requests', icon: Inbox, href: '/workspace/requests' },
  { label: 'Engagements', icon: Users, href: '/workspace/engagements' },
  { label: 'Conversations', icon: MessageSquare, href: '/workspace/conversations' },
  { label: 'Meetings', icon: Calendar, href: '/workspace/meetings' },
  { label: 'Projects', icon: FolderClosed, href: '/workspace/projects' },
]

const NAV_SECONDARY: NavItem[] = [
  { label: 'Settings', icon: Settings, href: '/workspace/settings' },
]

export function WorkspaceShell({
  children,
}: {
  children: ReactNode
}) {
  return (
    <div className="min-h-screen bg-[#fafafa] font-[family-name:var(--font-dm-sans)] text-[#181d27]">
      <div className="flex">
        <Sidebar />
        <div className="flex-1 min-w-0 flex flex-col">
          <WorkspaceTopBar />
          {children}
        </div>
      </div>
    </div>
  )
}

/**
 * Workspace top bar.
 *
 * The global Navbar (components/Navbar.tsx) hides itself on /workspace/* to
 * avoid double chrome, so workspace-internal controls (notifications, search,
 * etc.) live here instead. The bell is a visual placeholder for Phase 0; the
 * real popover + unread count wires up in Phase 5 via
 * features/workspace/use-notifications.ts.
 */
export function WorkspaceTopBar() {
  return (
    <div className="h-[64px] bg-white border-b border-[#e9eaeb] flex items-center justify-end px-[24px] gap-[8px] shrink-0">
      <button
        type="button"
        aria-label="Notifications"
        className="flex items-center justify-center size-9 rounded-full hover:bg-gray-100 transition-colors text-[#414651]"
      >
        <Bell size={18} />
      </button>
    </div>
  )
}

export function Sidebar() {
  return (
    <aside className="hidden lg:flex flex-col w-[296px] shrink-0 h-screen sticky top-0 bg-white border-r border-[#e9eaeb] px-[16px] py-[24px] gap-[24px]">
      <Link href="/" className="flex items-center px-[8px]">
        <Image
          src="/PROPLOY.svg"
          alt="Proploy"
          width={132}
          height={38}
          className="h-[32px] w-auto object-contain"
          priority
        />
      </Link>

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

      <UserCard />
    </aside>
  )
}

function UserCard() {
  const { user } = useAuth()
  const name = user?.name ?? 'You'
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
  const isActive = item.href === '/workspace'
    ? pathname === '/workspace'
    : item.href !== undefined && pathname?.startsWith(item.href)
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

export function WorkspaceLoading() {
  return (
    <WorkspaceShell>
      <div className="flex min-h-screen flex-1 items-center justify-center">
        <Loader2 size={32} className="animate-spin text-[#155eef]" />
      </div>
    </WorkspaceShell>
  )
}
