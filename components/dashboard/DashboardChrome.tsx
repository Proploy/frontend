'use client'

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react'
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
import type { NotificationItem } from '@/features/workspace/types'

/**
 * Generic, role-agnostic dashboard chrome shared by the expert and business
 * workspaces: sticky desktop sidebar, mobile top bar + slide-in drawer, a
 * working nav filter (⌘K focuses it), and the content frame.
 *
 * Styling lives in `app/portal.css` (.pf-*), which is built on the same V2
 * runtime tokens as the marketing site (--paper / --ink / --cobalt / --line,
 * DM Sans display, IBM Plex Mono labels). Pages should reach for the .pf-*
 * primitives rather than re-declaring hex values.
 */

/**
 * Kept for source compatibility with pages not yet migrated. Both are now
 * no-ops: the portal uses hairline borders and a single cobalt lift instead of
 * the old inset "skeuomorphic" shadows. Prefer `.pf-btn` / `.pf-card`.
 * @deprecated
 */
export const BUTTON_SKEUO = ''
/** @deprecated use the `.pf-card` class */
export const CARD_SHADOW = ''

export type DashNavItem = {
  label: string
  icon: ComponentType<{ size?: number; className?: string }>
  href?: string
  badge?: string
  disabled?: boolean
}

/** A labelled cluster of nav items. The label is rendered as a mono eyebrow. */
export type DashNavGroup = {
  label?: string
  items: DashNavItem[]
}

export type DashNav = DashNavItem[] | DashNavGroup[]

export type DashboardUser = {
  name: string
  email: string
  avatarUrl?: string
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
  markBg: 'var(--cobalt)',
}

function isGrouped(nav: DashNav): nav is DashNavGroup[] {
  return nav.length > 0 && 'items' in nav[0]
}

function toGroups(nav: DashNav): DashNavGroup[] {
  return isGrouped(nav) ? nav : [{ items: nav }]
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
      <Link href={brand.href} className="flex items-center" onClick={onNavigate}>
        <Image
          src={brand.logoSrc}
          alt={brand.logoAlt ?? brand.word}
          width={brand.logoWidth ?? 152}
          height={brand.logoHeight ?? 42}
          className={`${compact ? 'h-[28px]' : 'h-[30px]'} w-auto object-contain`}
          priority
        />
      </Link>
    )
  }

  return (
    <Link href={brand.href} className="flex items-center gap-[9px]" onClick={onNavigate}>
      <span
        className="flex size-[28px] items-center justify-center rounded-[8px] text-[13px] font-semibold text-white"
        style={{ background: brand.markBg ?? 'var(--cobalt)' }}
      >
        {brand.mark}
      </span>
      <span className="pf-h2">{brand.word}</span>
    </Link>
  )
}

function NavLink({
  item,
  onNavigate,
  collapsed = false,
}: {
  item: DashNavItem
  onNavigate?: () => void
  collapsed?: boolean
}) {
  const pathname = usePathname()
  const Icon = item.icon
  const isActive = item.href === pathname

  const content = (
    <>
      <Icon size={18} />
      {!collapsed && <span className="min-w-0 flex-1 truncate">{item.label}</span>}
      {!collapsed && item.badge && <span className="pf-nav-badge">{item.badge}</span>}
    </>
  )

  if (item.href && !item.disabled) {
    return (
      <Link
        href={item.href}
        onClick={onNavigate}
        className="pf-nav-link"
        title={collapsed ? item.label : undefined}
        aria-current={isActive ? 'page' : undefined}
      >
        {content}
      </Link>
    )
  }

  return (
    <button
      type="button"
      disabled={item.disabled}
      data-disabled={item.disabled ? 'true' : undefined}
      title={collapsed ? item.label : undefined}
      className="pf-nav-link"
    >
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
        className="pf-account"
        title={collapsed ? name : undefined}
      >
        <span className={`pf-avatar overflow-hidden ${user?.avatarClassName ?? ''}`}>
          {user?.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={user.avatarUrl} alt="" className="size-full object-cover" />
          ) : (
            initial
          )}
        </span>
        {!collapsed && (
          <>
            <span className="min-w-0 flex-1">
              <span className="pf-h3 block truncate">{name}</span>
              {user?.email ? <span className="pf-micro block truncate">{user.email}</span> : null}
            </span>
            <ChevronDown
              size={15}
              className={`shrink-0 text-[color:var(--ink-faint)] transition-transform ${open ? 'rotate-180' : ''}`}
            />
          </>
        )}
      </button>

      {open && (
        <div
          id="workspace-account-menu"
          role="menu"
          aria-label="Account"
          className={`pf-menu bottom-full mb-[8px] ${collapsed ? 'left-full ml-[8px]' : 'inset-x-0'}`}
        >
          <div className="border-b border-[color:var(--line-soft)] px-[10px] pb-[8px] pt-[6px]">
            <p className="pf-h3 truncate">{name}</p>
            {user?.email ? <p className="pf-micro truncate">{user.email}</p> : null}
          </div>
          <Link href="/profile" role="menuitem" onClick={closeAndNavigate} className="pf-menu-item mt-[4px]">
            <UserRound size={15} />
            Profile
          </Link>
          <button
            type="button"
            role="menuitem"
            onClick={() => void handleSignOut()}
            className="pf-menu-item pf-menu-item--danger"
          >
            <LogOut size={15} />
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
  nav: DashNav
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

  const groups = useMemo(() => toGroups(nav), [nav])
  const q = query.trim().toLowerCase()

  const filteredGroups = q
    ? groups
        .map((g) => ({ ...g, items: g.items.filter((i) => i.label.toLowerCase().includes(q)) }))
        .filter((g) => g.items.length > 0)
    : groups
  const filteredSecondary = q
    ? (secondaryNav ?? []).filter((i) => i.label.toLowerCase().includes(q))
    : secondaryNav ?? []
  const noMatches = q.length > 0 && filteredGroups.length === 0 && filteredSecondary.length === 0

  return (
    <>
      {/* The collapsed rail deliberately drops the brand (see
          features/workspace/workspace-sidebar.test.tsx) — at 76px the wordmark
          does not fit and a lone mark reads as a stray button. */}
      <div className="pf-side-head">
        {!collapsed && <BrandLink brand={brand} onNavigate={onNavigate} />}
        <div className="flex items-center gap-[2px]">
          {!collapsed &&
            (notificationTrigger ?? (notifications && <NotificationsBell items={notifications} align="left" />))}
          {onToggle && (
            <button
              type="button"
              onClick={onToggle}
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              className="pf-btn pf-btn--ghost pf-btn--icon pf-btn--sm"
            >
              {collapsed ? <ChevronRight size={17} /> : <ChevronLeft size={17} />}
            </button>
          )}
        </div>
      </div>

      {!collapsed && (
        <div className="pf-side-search">
          <Search size={15} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Jump to…"
            aria-label="Filter navigation"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery('')}
              aria-label="Clear search"
              className="text-[color:var(--ink-faint)] hover:text-[color:var(--ink)]"
            >
              <X size={14} />
            </button>
          ) : (
            <span className="pf-kbd">⌘K</span>
          )}
        </div>
      )}

      <div className="pf-side-scroll">
        {filteredGroups.map((group, index) => (
          <nav key={group.label ?? `group-${index}`} className="pf-nav-group">
            {group.label && <span className="pf-nav-label">{group.label}</span>}
            {group.items.map((item) => (
              <NavLink key={item.label} item={item} onNavigate={onNavigate} collapsed={collapsed} />
            ))}
          </nav>
        ))}

        {noMatches && <p className="pf-small px-[10px]">No matching pages.</p>}

        <div className="flex-1" />

        {filteredSecondary.length > 0 && (
          <nav className="pf-nav-group border-t border-[color:var(--line-soft)] pt-[12px]">
            {filteredSecondary.map((item) => (
              <NavLink key={item.label} item={item} onNavigate={onNavigate} collapsed={collapsed} />
            ))}
          </nav>
        )}
      </div>

      <div className="border-t border-[color:var(--line-soft)] pt-[10px]">
        <WorkspaceAccountMenu user={user} collapsed={collapsed} onNavigate={onNavigate} />
      </div>
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
  nav: DashNav
  secondaryNav?: DashNavItem[]
  user?: DashboardUser
  brand?: DashboardBrand
  notifications?: NotificationItem[]
  notificationTrigger?: ReactNode
  collapsed?: boolean
  onToggle?: () => void
}) {
  return (
    <aside className="pf-side" data-collapsed={collapsed ? 'true' : 'false'}>
      <SidebarBody
        nav={nav}
        secondaryNav={secondaryNav}
        user={user}
        brand={brand}
        notifications={notifications}
        notificationTrigger={notificationTrigger}
        collapsed={collapsed}
        onToggle={onToggle}
      />
    </aside>
  )
}

const SIDEBAR_PREF_KEY = 'proploy:portal:sidebar-collapsed'

/**
 * The rail's collapsed state lives in a tiny external store rather than an
 * effect, so it can be restored from localStorage without a setState cascade.
 * `getServerSnapshot` returns false, and useSyncExternalStore re-renders after
 * hydration if the stored preference disagrees — no markup mismatch.
 */
let sidebarCollapsedState: boolean | null = null
const sidebarListeners = new Set<() => void>()

function readSidebarPref(): boolean {
  try {
    return window.localStorage.getItem(SIDEBAR_PREF_KEY) === '1'
  } catch {
    return false // storage unavailable (private mode) — default to expanded
  }
}

function subscribeSidebar(listener: () => void): () => void {
  sidebarListeners.add(listener)
  return () => {
    sidebarListeners.delete(listener)
  }
}

function getSidebarSnapshot(): boolean {
  if (sidebarCollapsedState === null) sidebarCollapsedState = readSidebarPref()
  return sidebarCollapsedState
}

function getSidebarServerSnapshot(): boolean {
  return false
}

function setSidebarCollapsed(next: boolean): void {
  sidebarCollapsedState = next
  try {
    window.localStorage.setItem(SIDEBAR_PREF_KEY, next ? '1' : '0')
  } catch {
    /* ignore — the preference simply won't persist */
  }
  sidebarListeners.forEach((listener) => listener())
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
  nav: DashNav
  secondaryNav?: DashNavItem[]
  user?: DashboardUser
  brand?: DashboardBrand
  notifications?: NotificationItem[]
  notificationTrigger?: ReactNode
  children: ReactNode
}) {
  const [open, setOpen] = useState(false)
  // Remembered across navigations and sessions — re-collapsing the rail on
  // every page load was a standing annoyance of the old chrome.
  const sidebarCollapsed = useSyncExternalStore(
    subscribeSidebar,
    getSidebarSnapshot,
    getSidebarServerSnapshot,
  )

  const toggleSidebar = () => setSidebarCollapsed(!sidebarCollapsed)

  // Lock body scroll while the drawer is open.
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  // Escape closes the mobile drawer.
  useEffect(() => {
    if (!open) return
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open])

  return (
    <div className="pf-scope font-[family-name:var(--font-dm-sans)]">
      <div className="pf-shell">
        <DashboardSidebar
          nav={nav}
          secondaryNav={secondaryNav}
          user={user}
          brand={brand}
          notifications={notifications}
          notificationTrigger={notificationTrigger}
          collapsed={sidebarCollapsed}
          onToggle={toggleSidebar}
        />

        <div className="min-w-0 flex-1">
          {/* Mobile top bar */}
          <div className="pf-topbar">
            <BrandLink brand={brand} compact />
            <div className="flex items-center gap-[4px]">
              {notificationTrigger ?? (notifications && <NotificationsBell items={notifications} align="right" />)}
              <button
                type="button"
                onClick={() => setOpen(true)}
                aria-label="Open navigation"
                className="pf-btn pf-btn--secondary pf-btn--icon"
              >
                <Menu size={18} />
              </button>
            </div>
          </div>

          {children}
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="pf-scrim" onClick={() => setOpen(false)} aria-hidden />
          <aside className="pf-drawer">
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close navigation"
              className="pf-btn pf-btn--ghost pf-btn--icon pf-btn--sm absolute right-[10px] top-[16px]"
            >
              <X size={17} />
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
    <main className="flex min-h-[70vh] flex-1 items-center justify-center px-[24px] py-[48px]">
      <div className="pf-card pf-empty max-w-[440px]">
        <span className="pf-empty-ico">{icon}</span>
        <h3>{title}</h3>
        <p>{body}</p>
        {actionHref && actionLabel && (
          <Link href={actionHref} className="pf-btn pf-btn--primary mt-[4px]">
            {actionLabel}
          </Link>
        )}
      </div>
    </main>
  )
}
