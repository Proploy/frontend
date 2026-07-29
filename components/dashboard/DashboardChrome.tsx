'use client'

import { useEffect, useRef, useState } from 'react'
import type { ComponentType, ReactNode } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Menu,
  Search,
  UserRound,
  X,
} from 'lucide-react'
import { useAuth } from '@/components/providers/auth-provider'
import { NotificationsBell } from '@/components/dashboard/NotificationsBell'
import type { NotificationItem } from '@/lib/service-apis/notifications-mock'

/**
 * Generic, role-agnostic dashboard chrome shared by the expert and business
 * workspaces. Provides the sticky desktop sidebar, a mobile top bar + slide-in
 * drawer, a working nav filter (⌘K focuses it), and the content frame.
 *
 * Colors follow the established dashboard convention of inline hex that mirrors
 * the `--color-*` tokens in globals.css (e.g. #155eef = brand-600,
 * #181d27 = text-primary), kept consistent with the surrounding components.
 */

export const BUTTON_SKEUO =
  'shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05),inset_0px_0px_0px_1px_rgba(10,13,18,0.18),inset_0px_-2px_0px_0px_rgba(10,13,18,0.05)]'
export const CARD_SHADOW = 'shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)]'

export type DashNavItem = {
  label: string
  icon: ComponentType<{ size?: number; className?: string }>
  href?: string
  badge?: string
  disabled?: boolean
}

export type DashboardUser = {
  name: string
  email: string
  /** Optional avatar background (gradient classes or a single color). */
  avatarClassName?: string
}

export type DashboardBrand = {
  /** Single-letter mark shown in the logo tile. */
  mark: string
  /** Wordmark text. */
  word: string
  /** Where the logo links to (home of this workspace). */
  href: string
  /** Optional full brand image shown instead of the tile + wordmark. */
  logoSrc?: string
  logoAlt?: string
  logoWidth?: number
  logoHeight?: number
  /** Logo tile background color. */
  markBg?: string
}

const DEFAULT_BRAND: DashboardBrand = {
  mark: 'p',
  word: 'proploy',
  href: '/',
  markBg: '#155eef',
}

function BrandLink({
  brand,
  onNavigate,
  compact = false,
}: {
  brand: DashboardBrand
  onNavigate?: () => void
  compact?: boolean
}) {
  if (brand.logoSrc) {
    return (
      <Link href={brand.href} className="px-[8px] flex items-center" onClick={onNavigate}>
        <Image
          src={brand.logoSrc}
          alt={brand.logoAlt ?? brand.word}
          width={brand.logoWidth ?? 152}
          height={brand.logoHeight ?? 42}
          className={`${compact ? 'h-[32px]' : 'h-[34px]'} w-auto object-contain`}
          priority
        />
      </Link>
    )
  }

  return (
    <Link href={brand.href} className="px-[8px] flex items-center gap-[10px]" onClick={onNavigate}>
      <div
        className="size-[32px] rounded-[8px] flex items-center justify-center text-white font-bold text-[14px]"
        style={{ background: brand.markBg ?? '#155eef' }}
      >
        {brand.mark}
      </div>
      <span className="font-semibold text-[18px] leading-[28px] text-[#181d27]">{brand.word}</span>
    </Link>
  )
}

function NavLink({ item, onNavigate, collapsed = false }: { item: DashNavItem; onNavigate?: () => void; collapsed?: boolean }) {
  const pathname = usePathname()
  const Icon = item.icon
  const isActive = item.href === pathname
  const className = `flex w-full items-center ${collapsed ? 'justify-center gap-0 px-[8px]' : 'gap-[12px] px-[12px]'} py-[8px] rounded-[6px] text-left font-semibold text-[14px] leading-[20px] transition-colors ${
    isActive ? 'bg-[#eff4ff] text-[#155eef]' : 'text-[#414651]'
  } ${item.disabled ? 'cursor-not-allowed opacity-50' : 'hover:bg-[#f5f8ff]'}`
  const content = (
    <>
      <Icon size={20} className={`shrink-0 ${isActive ? 'text-[#155eef]' : 'text-[#717680]'}`} />
      {!collapsed && <span className="flex-1 truncate">{item.label}</span>}
      {!collapsed && item.badge && (
        <span className="px-[8px] py-[2px] rounded-full border border-[#e9eaeb] bg-white text-[12px] leading-[18px] font-semibold text-[#414651]">
          {item.badge}
        </span>
      )}
    </>
  )

  if (item.href && !item.disabled) {
    return (
      <Link
        href={item.href}
        onClick={onNavigate}
        className={className}
        title={collapsed ? item.label : undefined}
        aria-current={isActive ? 'page' : undefined}
      >
        {content}
      </Link>
    )
  }

  return (
    <button type="button" disabled={item.disabled} title={collapsed ? item.label : undefined} className={className}>
      {content}
    </button>
  )
}

export function WorkspaceAccountMenu({
  user,
  collapsed = false,
  onNavigate,
}: {
  user?: DashboardUser
  collapsed?: boolean
  onNavigate?: () => void
}) {
  const { signOut } = useAuth()
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const name = user?.name ?? 'Account'
  const initial = name.charAt(0).toUpperCase()

  useEffect(() => {
    if (!open) return

    function onPointerDown(event: PointerEvent) {
      if (!menuRef.current?.contains(event.target as Node)) setOpen(false)
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false)
    }

    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  const closeAndNavigate = () => {
    setOpen(false)
    onNavigate?.()
  }

  const handleSignOut = async () => {
    setOpen(false)
    await signOut()
    onNavigate?.()
  }

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls="workspace-account-menu"
        className={`flex w-full items-center gap-[12px] rounded-[8px] p-[8px] text-left transition-colors hover:bg-[#f5f8ff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#155eef]/40 ${collapsed ? 'justify-center' : ''}`}
        title={collapsed ? name : undefined}
      >
        <div
          className={`flex size-[40px] shrink-0 items-center justify-center rounded-full text-[14px] font-semibold text-white ${
            user?.avatarClassName ?? 'bg-gradient-to-br from-[#84adff] to-[#155eef]'
          }`}
        >
          {initial}
        </div>
        {!collapsed && (
          <>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[14px] font-semibold leading-[20px] text-[#181d27]">{name}</p>
            </div>
            <ChevronDown
              size={16}
              className={`shrink-0 text-[#717680] transition-transform ${open ? 'rotate-180' : ''}`}
            />
          </>
        )}
      </button>

      {open && (
        <div
          id="workspace-account-menu"
          role="menu"
          aria-label="Account"
          className={`absolute bottom-full z-50 mb-[8px] min-w-[220px] rounded-[8px] border border-[#e9eaeb] bg-white p-[6px] shadow-[0px_12px_24px_-8px_rgba(10,13,18,0.18)] ${
            collapsed ? 'left-full ml-[8px]' : 'inset-x-0'
          }`}
        >
          <div className="border-b border-[#e9eaeb] px-[10px] py-[8px]">
            <p className="truncate text-[13px] font-semibold leading-[18px] text-[#181d27]">{name}</p>
            {user?.email ? (
              <p className="mt-[2px] truncate text-[12px] leading-[18px] text-[#717680]">{user.email}</p>
            ) : null}
          </div>
          <Link
            href="/profile"
            role="menuitem"
            onClick={closeAndNavigate}
            className="mt-[4px] flex w-full items-center gap-[8px] rounded-[6px] px-[10px] py-[8px] text-[13px] font-medium leading-[18px] text-[#414651] hover:bg-[#f5f8ff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#155eef]/30"
          >
            <UserRound size={16} />
            Profile
          </Link>
          <button
            type="button"
            role="menuitem"
            onClick={() => void handleSignOut()}
            className="flex w-full items-center gap-[8px] rounded-[6px] px-[10px] py-[8px] text-left text-[13px] font-medium leading-[18px] text-[#b42318] hover:bg-[#fef3f2] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f04438]/30"
          >
            <LogOut size={16} />
            Sign out
          </button>
        </div>
      )}
    </div>
  )
}

/** The inner sidebar body — shared by the desktop aside and the mobile drawer. */
function SidebarBody({
  nav,
  secondaryNav,
  user,
  brand,
  notifications,
  notificationTrigger,
  onNavigate,
  collapsed = false,
  onToggle,
}: {
  nav: DashNavItem[]
  secondaryNav?: DashNavItem[]
  user?: DashboardUser
  brand: DashboardBrand
  notifications?: NotificationItem[]
  notificationTrigger?: ReactNode
  onNavigate?: () => void
  collapsed?: boolean
  onToggle?: () => void
}) {
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        inputRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  const q = query.trim().toLowerCase()
  const filteredPrimary = q ? nav.filter((i) => i.label.toLowerCase().includes(q)) : nav
  const filteredSecondary = q
    ? (secondaryNav ?? []).filter((i) => i.label.toLowerCase().includes(q))
    : secondaryNav ?? []
  const noMatches = q.length > 0 && filteredPrimary.length === 0 && filteredSecondary.length === 0

  return (
    <>
      <div className={`flex items-center gap-[8px] ${collapsed ? 'justify-center' : 'justify-between'}`}>
        {!collapsed && <BrandLink brand={brand} onNavigate={onNavigate} />}
        <div className="flex items-center gap-[4px]">
          {notificationTrigger ?? (notifications && <NotificationsBell items={notifications} align="left" />)}
          {onToggle && (
            <button
              type="button"
              onClick={onToggle}
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              className="inline-flex size-[32px] items-center justify-center rounded-[8px] text-[#717680] hover:bg-[#f5f8ff] hover:text-[#155eef]"
            >
              {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </button>
          )}
        </div>
      </div>

      {!collapsed && (
        <div className="relative">
          <Search size={16} className="absolute left-[12px] top-1/2 -translate-y-1/2 text-[#717680]" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search workspace"
            aria-label="Filter navigation"
            className={`w-full rounded-[8px] border border-[#d5d7da] bg-white py-[8px] pl-[36px] pr-[36px] text-[14px] leading-[20px] text-[#181d27] placeholder:text-[#717680] focus:outline-none focus:ring-2 focus:ring-[#155eef]/30 ${BUTTON_SKEUO}`}
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery('')}
              aria-label="Clear search"
              className="absolute right-[10px] top-1/2 -translate-y-1/2 text-[#717680] hover:text-[#414651]"
            >
              <X size={14} />
            </button>
          ) : (
            <span className="absolute right-[10px] top-1/2 -translate-y-1/2 rounded-[4px] border border-[#e9eaeb] bg-white px-[6px] py-[2px] text-[12px] leading-[18px] text-[#717680]">
              ⌘K
            </span>
          )}
        </div>
      )}

      <nav className="flex flex-col gap-[2px]">
        {filteredPrimary.map((item) => (
          <NavLink key={item.label} item={item} onNavigate={onNavigate} collapsed={collapsed} />
        ))}
      </nav>

      {noMatches && (
        <p className="px-[12px] text-[13px] leading-[18px] text-[#717680]">No matching pages.</p>
      )}

      <div className="flex-1" />

      {filteredSecondary.length > 0 && (
        <nav className="flex flex-col gap-[2px]">
          {filteredSecondary.map((item) => (
            <NavLink key={item.label} item={item} onNavigate={onNavigate} collapsed={collapsed} />
          ))}
        </nav>
      )}

      <WorkspaceAccountMenu user={user} collapsed={collapsed} onNavigate={onNavigate} />
    </>
  )
}

/** Desktop sticky sidebar (also rendered standalone by chat/account pages). */
export function DashboardSidebar({
  nav,
  secondaryNav,
  user,
  brand = DEFAULT_BRAND,
  notifications,
  notificationTrigger,
  collapsed = false,
  onToggle,
}: {
  nav: DashNavItem[]
  secondaryNav?: DashNavItem[]
  user?: DashboardUser
  brand?: DashboardBrand
  notifications?: NotificationItem[]
  notificationTrigger?: ReactNode
  collapsed?: boolean
  onToggle?: () => void
}) {
  return (
    <aside className={`sticky top-0 hidden h-screen shrink-0 flex-col gap-[24px] overflow-hidden border-r border-[#e9eaeb] bg-white px-[16px] py-[24px] transition-[width] duration-200 lg:flex ${collapsed ? 'w-[80px]' : 'w-[296px]'}`}>
      <SidebarBody nav={nav} secondaryNav={secondaryNav} user={user} brand={brand} notifications={notifications} notificationTrigger={notificationTrigger} collapsed={collapsed} onToggle={onToggle} />
    </aside>
  )
}

/** Full chrome: desktop sidebar + mobile top bar/drawer + content frame. */
export function DashboardChrome({
  nav,
  secondaryNav,
  user,
  brand = DEFAULT_BRAND,
  notifications,
  notificationTrigger,
  children,
}: {
  nav: DashNavItem[]
  secondaryNav?: DashNavItem[]
  user?: DashboardUser
  brand?: DashboardBrand
  notifications?: NotificationItem[]
  notificationTrigger?: ReactNode
  children: ReactNode
}) {
  const [open, setOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  // Lock body scroll while the drawer is open.
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  return (
    <div className="min-h-screen bg-white font-[family-name:var(--font-dm-sans)] text-[#181d27]">
      <div className="flex">
        <DashboardSidebar
          nav={nav}
          secondaryNav={secondaryNav}
          user={user}
          brand={brand}
          notifications={notifications}
          notificationTrigger={notificationTrigger}
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed((current) => !current)}
        />

        <div className="flex-1 min-w-0">
          {/* Mobile top bar */}
          <div className="lg:hidden sticky top-0 z-30 flex items-center justify-between gap-[12px] border-b border-[#e9eaeb] bg-white px-[16px] py-[12px]">
            <BrandLink brand={brand} compact />
            <div className="flex items-center gap-[4px]">
              {notificationTrigger ?? (notifications && <NotificationsBell items={notifications} align="right" />)}
              <button
                type="button"
                onClick={() => setOpen(true)}
                aria-label="Open navigation"
                className={`inline-flex size-[40px] items-center justify-center rounded-[8px] border border-[#d5d7da] bg-white text-[#414651] ${BUTTON_SKEUO}`}
              >
                <Menu size={20} />
              </button>
            </div>
          </div>

          {children}
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-[#0a0d12]/40 backdrop-blur-[2px]"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <aside className="relative flex h-full w-[296px] max-w-[85vw] flex-col gap-[24px] overflow-y-auto bg-white px-[16px] py-[24px] shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1)]">
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close navigation"
              className="absolute right-[12px] top-[20px] inline-flex size-[32px] items-center justify-center rounded-[8px] text-[#717680] hover:bg-[#fafafa]"
            >
              <X size={18} />
            </button>
            <SidebarBody
              nav={nav}
              secondaryNav={secondaryNav}
              user={user}
              brand={brand}
              onNavigate={() => setOpen(false)}
            />
          </aside>
        </div>
      )}
    </div>
  )
}

export function DashboardEmptyState({
  icon,
  title,
  body,
  actionHref,
  actionLabel,
}: {
  icon: ReactNode
  title: string
  body: string
  actionHref?: string
  actionLabel?: string
}) {
  return (
    <main className="flex min-h-[60vh] flex-1 items-center justify-center px-[24px] py-[48px]">
      <div className="max-w-[440px] rounded-[16px] border border-[#e9eaeb] bg-white p-[32px] text-center">
        <div className="mx-auto mb-[16px] flex size-[56px] items-center justify-center rounded-full bg-[#f5f5f5] text-[#717680]">
          {icon}
        </div>
        <h1 className="font-semibold text-[24px] leading-[32px] text-[#181d27]">{title}</h1>
        <p className="mt-[8px] text-[15px] leading-[22px] text-[#535862]">{body}</p>
        {actionHref && actionLabel && (
          <Link
            href={actionHref}
            className={`mt-[24px] inline-flex rounded-[8px] bg-[#155eef] px-[14px] py-[10px] text-[14px] font-semibold leading-[20px] text-white ${BUTTON_SKEUO}`}
          >
            {actionLabel}
          </Link>
        )}
      </div>
    </main>
  )
}
