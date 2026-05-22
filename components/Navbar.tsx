'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Menu, X, LogOut, User, Settings } from 'lucide-react'
import { useAuth } from '@/components/providers/auth-provider'
import { setAuthIntent } from '@/lib/utils/auth-intent-client'

const WORKSPACE_PREFIXES = ['/experts/dashboard', '/experts/account']

const NAV_LINKS = [
  { href: '/products', label: 'Explore Products' },
  { href: '/experts', label: 'Explore Experts' },
  { href: '/for-businesses', label: 'For Businesses' },
  { href: '/for-experts', label: 'For Experts' },
]

const BUTTON_SHADOW =
  'shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05),inset_0px_0px_0px_1px_rgba(10,13,18,0.18),inset_0px_-2px_0px_0px_rgba(10,13,18,0.05)]'

export default function Navbar() {
  const pathname = usePathname()
  const { user, expert, signOut } = useAuth()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)

  // Must be called before any early returns - rules-of-hooks
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const hideOnWorkspace = WORKSPACE_PREFIXES.some((p) => pathname?.startsWith(p))
  if (hideOnWorkspace) return null

  const expertStatus = expert?.status
  const showDashboard = expertStatus === 'approved'
  const showCompleteApplication = expertStatus === 'draft' || expertStatus === 'changes_requested'
  const showApplicationPending = expertStatus === 'submitted'
  const dashboardHref = '/experts/dashboard'
  const settingsHref = '/settings'

  const handleSignOut = async () => {
    await signOut()
    setIsProfileOpen(false)
  }

  const ctaLabel = showDashboard
    ? 'Expert Dashboard'
    : showApplicationPending
    ? 'Application Pending'
    : showCompleteApplication
    ? 'Complete Application'
    : 'Find an Expert'

  const ctaHref = showDashboard
    ? '/experts/dashboard'
    : showCompleteApplication
    ? '/expert/apply'
    : showApplicationPending
    ? '#'
    : '/experts'

  const handleCtaClick = (e: React.MouseEvent) => {
    if (showApplicationPending) {
      e.preventDefault()
      return
    }
    if (!user && ctaHref === '/expert/apply') {
      e.preventDefault()
      setAuthIntent('/expert/apply')
      window.location.href = '/sign-in?redirect=/expert/apply'
    }
  }

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 h-[80px] flex items-center bg-[#fafbfc]/95 backdrop-blur-md transition-all duration-300 ${
        isScrolled || isMenuOpen ? 'shadow-sm' : ''
      }`}
    >
      <div className="max-w-[1280px] mx-auto w-full px-4 md:px-[32px] flex items-center justify-between">
        <Link href="/" className="flex items-center shrink-0">
          <Image
            src="/PROPLOY.svg"
            alt="Proploy"
            width={192}
            height={54}
            className="h-[32px] md:h-[40px] w-auto object-contain"
            priority
          />
        </Link>

        <div className="hidden lg:flex items-center gap-[36px]">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-[family-name:var(--font-dm-sans)] font-semibold text-[16px] leading-[24px] text-[#414651] hover:text-[#0466e7] transition-colors px-[6px] py-[4px] rounded-[8px]"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-[12px]">
          {user ? (
            <div className="hidden md:block relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2"
              >
                {user.image ? (
                  <Image
                    src={user.image}
                    alt={user.name || 'User'}
                    width={36}
                    height={36}
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-9 h-9 bg-[#0466e7] rounded-full flex items-center justify-center text-white font-medium">
                    {user.name?.[0] || user.email?.[0] || 'U'}
                  </div>
                )}
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">{user.name || 'User'}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                  <Link
                    href={dashboardHref}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    <User size={16} />
                    Dashboard
                  </Link>
                  {showCompleteApplication && (
                    <Link
                      href="/expert/apply"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-[#0466e7] hover:bg-blue-50 font-medium"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      Complete Application
                    </Link>
                  )}
                  {showApplicationPending && (
                    <div className="flex items-center gap-2 px-4 py-2 text-sm text-amber-600">
                      Application Pending
                    </div>
                  )}
                  <Link
                    href={settingsHref}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    <Settings size={16} />
                    Settings
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut size={16} />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/sign-in"
              className={`hidden md:flex items-center justify-center bg-white border border-[#d5d7da] rounded-[8px] px-[16px] py-[10px] font-[family-name:var(--font-dm-sans)] font-semibold text-[16px] leading-[24px] text-[#414651] hover:bg-gray-50 transition-colors ${BUTTON_SHADOW}`}
            >
              Log in
            </Link>
          )}

          <Link
            href={ctaHref}
            onClick={handleCtaClick}
            className={`hidden md:flex items-center justify-center bg-[#155eef] border-2 border-white/[0.12] rounded-[8px] px-[16px] py-[10px] font-[family-name:var(--font-dm-sans)] font-semibold text-[16px] leading-[24px] text-white hover:bg-[#0e4cc7] transition-colors ${BUTTON_SHADOW}`}
          >
            {ctaLabel}
          </Link>

          <button
            className="lg:hidden p-2 text-[#414651]"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-white border-t border-gray-100 shadow-xl p-6 flex flex-col gap-6 animate-in slide-in-from-top duration-300">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-[family-name:var(--font-dm-sans)] text-lg font-semibold text-[#181d27]"
              onClick={() => setIsMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}

          <div className="pt-6 border-t border-gray-100 flex flex-col gap-4">
            {user ? (
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  {user.image ? (
                    <Image
                      src={user.image}
                      alt={user.name || 'User'}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-[#0466e7] rounded-full flex items-center justify-center text-white font-medium">
                      {user.name?.[0] || user.email?.[0] || 'U'}
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-[#181d27]">{user.name || 'User'}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    handleSignOut()
                    setIsMenuOpen(false)
                  }}
                  className="text-left text-lg font-semibold text-red-600"
                >
                  Sign Out
                </button>
                <Link
                  href={dashboardHref}
                  className="text-left text-lg font-semibold text-[#181d27]"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  href={settingsHref}
                  className="text-left text-lg font-semibold text-[#181d27]"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Settings
                </Link>
              </div>
            ) : (
              <Link
                href="/sign-in"
                className={`flex items-center justify-center bg-white border border-[#d5d7da] rounded-[8px] px-[16px] py-[10px] font-[family-name:var(--font-dm-sans)] font-semibold text-[16px] leading-[24px] text-[#414651] ${BUTTON_SHADOW}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Log in
              </Link>
            )}
            <Link
              href={ctaHref}
              onClick={(e) => {
                handleCtaClick(e)
                setIsMenuOpen(false)
              }}
              className={`flex items-center justify-center bg-[#155eef] border-2 border-white/[0.12] rounded-[8px] px-[16px] py-[10px] font-[family-name:var(--font-dm-sans)] font-semibold text-[16px] leading-[24px] text-white ${BUTTON_SHADOW}`}
            >
              {ctaLabel}
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}