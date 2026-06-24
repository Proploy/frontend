'use client'

import { useEffect, useRef, useState } from 'react'
import type { ComponentType, ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, Search, X } from 'lucide-react'
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
  /** Logo tile background color. */
  markBg?: string
}

const DEFAULT_BRAND: DashboardBrand = {
  mark: 'p',
  word: 'proploy',
  href: '/',
  markBg: '#155eef',
}

function NavLink({ item, onNavigate }: { item: DashNavItem; onNavigate?: () => void }) {
  const pathname = usePathname()
  const Icon = item.icon
  const isActive = item.href === pathname
  const className = `flex w-full items-center gap-[12px] px-[12px] py-[8px] rounded-[6px] text-left font-semibold text-[14px] leading-[20px] transition-colors ${
    isActive ? 'bg-[#fafafa] text-[#252b37]' : 'text-[#414651]'
  } ${item.disabled ? 'cursor-not-allowed opacity-50' : 'hover:bg-[#fafafa]'}`
  const content = (
    <>
      <Icon size={20} className={`shrink-0 ${isActive ? 'text-[#155eef]' : 'text-[#717680]'}`} />
      <span className="flex-1 truncate">{item.label}</span>
      {item.badge && (
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
        aria-current={isActive ? 'page' : undefined}
      >
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

function UserCard({ user }: { user?: DashboardUser }) {
  const name = user?.name ?? 'Account'
  const email = user?.email ?? ''
  const initial = name.charAt(0).toUpperCase()
  return (
    <div className="flex items-center gap-[12px] p-[8px] rounded-[8px] hover:bg-[#fafafa] transition-colors">
      <div
        className={`size-[40px] rounded-full flex items-center justify-center text-white font-semibold text-[14px] shrink-0 ${
          user?.avatarClassName ?? 'bg-gradient-to-br from-[#84adff] to-[#155eef]'
        }`}
      >
        {initial}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-[14px] leading-[20px] text-[#181d27] truncate">{name}</p>
        <p className="font-normal text-[14px] leading-[20px] text-[#535862] truncate">{email}</p>
      </div>
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
  onNavigate,
}: {
  nav: DashNavItem[]
  secondaryNav?: DashNavItem[]
  user?: DashboardUser
  brand: DashboardBrand
  notifications?: NotificationItem[]
  onNavigate?: () => void
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
      <div className="flex items-center justify-between gap-[8px]">
        <Link href={brand.href} className="px-[8px] flex items-center gap-[10px]" onClick={onNavigate}>
          <div
            className="size-[32px] rounded-[8px] flex items-center justify-center text-white font-bold text-[14px]"
            style={{ background: brand.markBg ?? '#155eef' }}
          >
            {brand.mark}
          </div>
          <span className="font-semibold text-[18px] leading-[28px] text-[#181d27]">{brand.word}</span>
        </Link>
        {notifications && <NotificationsBell items={notifications} align="left" />}
      </div>

      <div className="relative">
        <Search size={16} className="absolute left-[12px] top-1/2 -translate-y-1/2 text-[#717680]" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search workspace"
          aria-label="Filter navigation"
          className={`w-full bg-white border border-[#d5d7da] rounded-[8px] pl-[36px] pr-[36px] py-[8px] text-[14px] leading-[20px] text-[#181d27] placeholder:text-[#717680] focus:outline-none focus:ring-2 focus:ring-[#155eef]/30 ${BUTTON_SKEUO}`}
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
          <span className="absolute right-[10px] top-1/2 -translate-y-1/2 px-[6px] py-[2px] text-[12px] leading-[18px] text-[#717680] border border-[#e9eaeb] rounded-[4px] bg-white">
            ⌘K
          </span>
        )}
      </div>

      <nav className="flex flex-col gap-[2px]">
        {filteredPrimary.map((item) => (
          <NavLink key={item.label} item={item} onNavigate={onNavigate} />
        ))}
      </nav>

      {noMatches && (
        <p className="px-[12px] text-[13px] leading-[18px] text-[#717680]">No matching pages.</p>
      )}

      <div className="flex-1" />

      {filteredSecondary.length > 0 && (
        <nav className="flex flex-col gap-[2px]">
          {filteredSecondary.map((item) => (
            <NavLink key={item.label} item={item} onNavigate={onNavigate} />
          ))}
        </nav>
      )}

      <UserCard user={user} />
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
}: {
  nav: DashNavItem[]
  secondaryNav?: DashNavItem[]
  user?: DashboardUser
  brand?: DashboardBrand
  notifications?: NotificationItem[]
}) {
  return (
    <aside className="hidden lg:flex flex-col w-[296px] shrink-0 h-screen sticky top-0 bg-white border-r border-[#e9eaeb] px-[16px] py-[24px] gap-[24px]">
      <SidebarBody nav={nav} secondaryNav={secondaryNav} user={user} brand={brand} notifications={notifications} />
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
  children,
}: {
  nav: DashNavItem[]
  secondaryNav?: DashNavItem[]
  user?: DashboardUser
  brand?: DashboardBrand
  notifications?: NotificationItem[]
  children: ReactNode
}) {
  const [open, setOpen] = useState(false)

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
    <div className="min-h-screen bg-[#fafafa] font-[family-name:var(--font-dm-sans)] text-[#181d27]">
      <div className="flex">
        <DashboardSidebar nav={nav} secondaryNav={secondaryNav} user={user} brand={brand} notifications={notifications} />

        <div className="flex-1 min-w-0">
          {/* Mobile top bar */}
          <div className="lg:hidden sticky top-0 z-30 flex items-center justify-between gap-[12px] border-b border-[#e9eaeb] bg-white px-[16px] py-[12px]">
            <Link href={brand.href} className="flex items-center gap-[10px]">
              <div
                className="size-[28px] rounded-[7px] flex items-center justify-center text-white font-bold text-[13px]"
                style={{ background: brand.markBg ?? '#155eef' }}
              >
                {brand.mark}
              </div>
              <span className="font-semibold text-[16px] leading-[24px] text-[#181d27]">{brand.word}</span>
            </Link>
            <div className="flex items-center gap-[4px]">
              {notifications && <NotificationsBell items={notifications} align="right" />}
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
