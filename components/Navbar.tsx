'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { Menu, X, LogOut, UserRound, LayoutGrid, Sparkles } from 'lucide-react'
import CatalogMegaMenu from '@/components/catalog/CatalogMegaMenu'
import ExpertMegaMenu from '@/components/experts/ExpertMegaMenu'
import { useAuth } from '@/components/providers/auth-provider'
import { useExpertApplication } from '@/features/experts/use-expert-application'
import type { ExpertMe } from '@/features/experts/types'
import { setAuthIntent } from '@/lib/utils/auth-intent-client'
import {
  canUsePersonalization,
  getUserProfile,
  getUserProfilePicture,
  USER_PROFILE_PICTURE_CHANGED_EVENT,
} from '@/features/users'

// Routes that own their own sidebar/shell and therefore should suppress the
// global Navbar to avoid a double chrome.
const WORKSPACE_PREFIXES = [
  '/experts/dashboard',
  '/experts/account',
  '/experts/chat',
  '/workspace',
  '/AI_workspace',
]

const ABOUT_LINKS = [
  { href: '/for-businesses', label: 'For Business', description: 'See how buyers use Proploy to choose and deploy software.' },
  { href: '/for-experts', label: 'For Expert', description: 'Learn how implementation experts join and work on Proploy.' },
]

const BUTTON_SHADOW =
  'shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05),inset_0px_0px_0px_1px_rgba(10,13,18,0.18),inset_0px_-2px_0px_0px_rgba(10,13,18,0.05)]'

function UserAvatar({ src, name, sizeClass = 'size-9' }: { src?: string | null; name?: string | null; sizeClass?: string }) {
  const initial = name?.trim().charAt(0).toUpperCase() || 'U'
  if (src) {
    return (
      <img
        src={src}
        alt={name || 'User'}
        className={`${sizeClass} rounded-full object-cover`}
      />
    )
  }

  return (
    <div className={`${sizeClass} flex items-center justify-center rounded-full bg-[#0466e7] font-medium text-white`}>
      {initial}
    </div>
  )
}

export default function Navbar() {
  const pathname = usePathname()
  const { user, signOut } = useAuth()
  const { getApplication } = useExpertApplication()
  const [expertState, setExpertState] = useState<{ userId: string; expert: ExpertMe | null } | null>(null)
  const [profileAvatarUrl, setProfileAvatarUrl] = useState<string | null>(null)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isCatalogOpen, setIsCatalogOpen] = useState(false)
  const [isExpertsOpen, setIsExpertsOpen] = useState(false)
  const [isAboutOpen, setIsAboutOpen] = useState(false)
  const [isMobileCatalogOpen, setIsMobileCatalogOpen] = useState(false)
  const [isMobileExpertsOpen, setIsMobileExpertsOpen] = useState(false)
  const [isMobileAboutOpen, setIsMobileAboutOpen] = useState(false)
  const catalogCloseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const expertsCloseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const aboutCloseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const profileMenuRef = useRef<HTMLDivElement>(null)
  const profileAvatarObjectUrlRef = useRef<string | null>(null)
  // The homepage ("/") ships its own Nav as part of the v2 design system, so the
  // global marketing Navbar is suppressed there (in addition to workspace routes).
  const hideOnWorkspace = pathname === '/' || WORKSPACE_PREFIXES.some((p) => pathname?.startsWith(p))
  const userId = user?.id
  const canAccessProfile = canUsePersonalization(user?.role)

  // Must be called before any early returns - rules-of-hooks
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (!userId || hideOnWorkspace) return
    const currentUserId = userId

    let cancelled = false

    async function loadExpertStatus() {
      const result = await getApplication()
      if (cancelled) return
      setExpertState({ userId: currentUserId, expert: result.ok ? result.data : null })
    }

    void loadExpertStatus()

    return () => {
      cancelled = true
    }
  }, [getApplication, hideOnWorkspace, userId])

  useEffect(() => {
    const clearBlobAvatar = () => {
      if (!profileAvatarObjectUrlRef.current) return
      URL.revokeObjectURL(profileAvatarObjectUrlRef.current)
      profileAvatarObjectUrlRef.current = null
    }

    let cancelled = false

    if (!userId || hideOnWorkspace || !canAccessProfile) {
      clearBlobAvatar()
      void Promise.resolve().then(() => {
        if (!cancelled) setProfileAvatarUrl(null)
      })
      return () => {
        cancelled = true
      }
    }

    async function loadProfileAvatar() {
      const profileResult = await getUserProfile()
      if (cancelled) return

      if (!profileResult.ok) {
        clearBlobAvatar()
        setProfileAvatarUrl(null)
        return
      }

      if (!profileResult.data.profilePictureKey) {
        clearBlobAvatar()
        setProfileAvatarUrl(profileResult.data.avatarUrl ?? null)
        return
      }

      const pictureResult = await getUserProfilePicture()
      if (cancelled) return

      if (!pictureResult.ok) {
        clearBlobAvatar()
        setProfileAvatarUrl(profileResult.data.avatarUrl ?? null)
        return
      }

      const objectUrl = URL.createObjectURL(pictureResult.data)
      clearBlobAvatar()
      profileAvatarObjectUrlRef.current = objectUrl
      setProfileAvatarUrl(objectUrl)
    }

    void loadProfileAvatar()

    const refreshProfileAvatar = () => {
      void loadProfileAvatar()
    }
    window.addEventListener(USER_PROFILE_PICTURE_CHANGED_EVENT, refreshProfileAvatar)

    return () => {
      cancelled = true
      window.removeEventListener(USER_PROFILE_PICTURE_CHANGED_EVENT, refreshProfileAvatar)
      clearBlobAvatar()
    }
  }, [canAccessProfile, hideOnWorkspace, userId])

  useEffect(() => () => {
    if (catalogCloseTimerRef.current) clearTimeout(catalogCloseTimerRef.current)
    if (expertsCloseTimerRef.current) clearTimeout(expertsCloseTimerRef.current)
    if (aboutCloseTimerRef.current) clearTimeout(aboutCloseTimerRef.current)
  }, [])

  useEffect(() => {
    if (!isProfileOpen) return
    const closeOnOutside = (event: MouseEvent | TouchEvent) => {
      if (profileMenuRef.current?.contains(event.target as Node)) return
      setIsProfileOpen(false)
    }
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsProfileOpen(false)
    }
    document.addEventListener('mousedown', closeOnOutside)
    document.addEventListener('touchstart', closeOnOutside)
    document.addEventListener('keydown', closeOnEscape)
    return () => {
      document.removeEventListener('mousedown', closeOnOutside)
      document.removeEventListener('touchstart', closeOnOutside)
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [isProfileOpen])

  if (hideOnWorkspace) return null

  const expert = expertState && expertState.userId === userId ? expertState.expert : null
  const expertStatus = expert?.status
  const showDashboard = expertStatus === 'approved'
  const showCompleteApplication = expertStatus === 'draft' || expertStatus === 'changes_requested'
  const showApplicationPending = expertStatus === 'submitted'
  const settingsHref = '/profile'
  const avatarUrl = profileAvatarUrl ?? user?.image ?? null

  const handleSignOut = async () => {
    await signOut()
    setIsProfileOpen(false)
  }

  const ctaLabel = showDashboard
    ? 'Workspace'
    : showApplicationPending
    ? 'Application Pending'
    : showCompleteApplication
    ? 'Complete Application'
    : 'Find an Expert'

  const ctaHref = showDashboard
    ? '/workspace'
    : showCompleteApplication
    ? '/become-expert'
    : showApplicationPending
    ? '#'
    : '/experts'

  const handleCtaClick = (e: React.MouseEvent) => {
    setIsProfileOpen(false)
    if (showApplicationPending) {
      e.preventDefault()
      return
    }
    if (!user && ctaHref === '/become-expert') {
      e.preventDefault()
      setAuthIntent('/become-expert')
      window.location.href = '/sign-in?redirect=/become-expert'
    }
  }

  const keepCatalogOpen = () => {
    if (catalogCloseTimerRef.current) {
      clearTimeout(catalogCloseTimerRef.current)
      catalogCloseTimerRef.current = null
    }
    setIsExpertsOpen(false)
    setIsAboutOpen(false)
    setIsProfileOpen(false)
    setIsCatalogOpen(true)
  }

  const scheduleCatalogClose = () => {
    if (catalogCloseTimerRef.current) clearTimeout(catalogCloseTimerRef.current)
    catalogCloseTimerRef.current = setTimeout(() => {
      setIsCatalogOpen(false)
      catalogCloseTimerRef.current = null
    }, 220)
  }

  const keepExpertsOpen = () => {
    if (expertsCloseTimerRef.current) {
      clearTimeout(expertsCloseTimerRef.current)
      expertsCloseTimerRef.current = null
    }
    setIsCatalogOpen(false)
    setIsAboutOpen(false)
    setIsProfileOpen(false)
    setIsExpertsOpen(true)
  }

  const scheduleExpertsClose = () => {
    if (expertsCloseTimerRef.current) clearTimeout(expertsCloseTimerRef.current)
    expertsCloseTimerRef.current = setTimeout(() => {
      setIsExpertsOpen(false)
      expertsCloseTimerRef.current = null
    }, 220)
  }

  const keepAboutOpen = () => {
    if (aboutCloseTimerRef.current) {
      clearTimeout(aboutCloseTimerRef.current)
      aboutCloseTimerRef.current = null
    }
    setIsCatalogOpen(false)
    setIsExpertsOpen(false)
    setIsProfileOpen(false)
    setIsAboutOpen(true)
  }

  const scheduleAboutClose = () => {
    if (aboutCloseTimerRef.current) clearTimeout(aboutCloseTimerRef.current)
    aboutCloseTimerRef.current = setTimeout(() => {
      setIsAboutOpen(false)
      aboutCloseTimerRef.current = null
    }, 220)
  }

  const closeNavMenus = () => {
    setIsCatalogOpen(false)
    setIsExpertsOpen(false)
    setIsAboutOpen(false)
    setIsProfileOpen(false)
    setIsMenuOpen(false)
  }

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 h-[80px] flex items-center bg-[#fafbfc]/95 backdrop-blur-md transition-all duration-300 ${
        isScrolled || isMenuOpen ? 'shadow-sm' : ''
      }`}
    >
      <div className="max-w-[1280px] mx-auto w-full px-4 md:px-[32px] flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center shrink-0"
          onClick={() => {
            closeNavMenus()
          }}
        >
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
          <div
            className="relative"
            onMouseEnter={keepCatalogOpen}
            onMouseLeave={scheduleCatalogClose}
          >
            <Link
              href="/products"
              aria-expanded={isCatalogOpen}
              aria-haspopup="menu"
              onClick={() => {
                setIsCatalogOpen(false)
                setIsProfileOpen(false)
              }}
              onFocus={() => setIsCatalogOpen(true)}
              className="flex items-center rounded-[8px] px-[6px] py-[4px] font-[family-name:var(--font-dm-sans)] text-[16px] font-semibold leading-[24px] text-[#414651] transition-colors hover:text-[#0466e7]"
            >
              Explore Products
            </Link>

            {isCatalogOpen && (
              <div
                role="menu"
                onMouseEnter={keepCatalogOpen}
                onMouseLeave={scheduleCatalogClose}
                className="fixed left-1/2 top-[64px] w-[min(960px,calc(100vw-48px))] -translate-x-1/2 pt-[16px] animate-in fade-in-0 zoom-in-95 slide-in-from-top-1 duration-150"
              >
                <CatalogMegaMenu onNavigate={() => setIsCatalogOpen(false)} />
              </div>
            )}
          </div>

          <div
            className="relative"
            onMouseEnter={keepExpertsOpen}
            onMouseLeave={scheduleExpertsClose}
          >
            <Link
              href="/experts"
              aria-expanded={isExpertsOpen}
              aria-haspopup="menu"
              onClick={() => {
                setIsExpertsOpen(false)
                setIsProfileOpen(false)
              }}
              onFocus={() => setIsExpertsOpen(true)}
              className="flex items-center rounded-[8px] px-[6px] py-[4px] font-[family-name:var(--font-dm-sans)] text-[16px] font-semibold leading-[24px] text-[#414651] transition-colors hover:text-[#0466e7]"
            >
              Explore Experts
            </Link>

            {isExpertsOpen && (
              <div
                role="menu"
                onMouseEnter={keepExpertsOpen}
                onMouseLeave={scheduleExpertsClose}
                className="fixed left-1/2 top-[64px] w-[min(960px,calc(100vw-48px))] -translate-x-1/2 pt-[16px] animate-in fade-in-0 zoom-in-95 slide-in-from-top-1 duration-150"
              >
                <ExpertMegaMenu onNavigate={() => setIsExpertsOpen(false)} />
              </div>
            )}
          </div>

          <div
            className="relative"
            onMouseEnter={keepAboutOpen}
            onMouseLeave={scheduleAboutClose}
          >
            <button
              type="button"
              aria-expanded={isAboutOpen}
              aria-haspopup="menu"
              onClick={() => {
                setIsProfileOpen(false)
                setIsAboutOpen((open) => !open)
              }}
              onFocus={() => setIsAboutOpen(true)}
              className="flex items-center rounded-[8px] px-[6px] py-[4px] font-[family-name:var(--font-dm-sans)] text-[16px] font-semibold leading-[24px] text-[#414651] transition-colors hover:text-[#0466e7]"
            >
              About Us
            </button>

            {isAboutOpen && (
              <div
                role="menu"
                onMouseEnter={keepAboutOpen}
                onMouseLeave={scheduleAboutClose}
                className="absolute left-1/2 top-full w-[360px] -translate-x-1/2 pt-[16px] animate-in fade-in-0 zoom-in-95 slide-in-from-top-1 duration-150"
              >
                <div className="overflow-hidden rounded-[16px] border border-[#e9eaeb] bg-white p-[8px] shadow-[0_24px_48px_-12px_rgba(10,13,18,0.2)]">
                  {ABOUT_LINKS.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsAboutOpen(false)}
                      className="block rounded-[10px] px-[12px] py-[11px] text-left transition-colors hover:bg-[#f5f8ff]"
                    >
                      <span className="block text-[14px] font-semibold text-[#181d27]">{link.label}</span>
                      <span className="mt-[3px] block text-[12px] leading-[18px] text-[#717680]">{link.description}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-[12px]">
          <Link
            href="/AI_workspace"
            className={`hidden md:flex items-center justify-center gap-[8px] bg-white border border-[#d5d7da] rounded-[8px] px-[14px] py-[10px] font-[family-name:var(--font-dm-sans)] font-semibold text-[15px] leading-[22px] text-[#155eef] hover:bg-[#eff4ff] transition-colors ${BUTTON_SHADOW}`}
            onClick={() => {
              closeNavMenus()
            }}
          >
            <Sparkles size={16} />
            AI_workspace
          </Link>

          {user ? (
            <>
              <div ref={profileMenuRef} className="hidden md:block relative">
                <button
                  type="button"
                  onClick={() => {
                    setIsCatalogOpen(false)
                    setIsExpertsOpen(false)
                    setIsAboutOpen(false)
                    setIsProfileOpen(!isProfileOpen)
                  }}
                  className="flex items-center gap-2"
                >
                  <UserAvatar src={avatarUrl} name={user.name} />
                </button>

              {isProfileOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-50 animate-in fade-in-0 zoom-in-95 slide-in-from-top-1 duration-150">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">{user.name || 'User'}</p>
                  </div>
                  <Link
                    href="/workspace"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    <LayoutGrid size={16} />
                    Workspace
                  </Link>
                  {showCompleteApplication && (
                    <Link
                      href="/become-expert"
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
                  {canAccessProfile && (
                    <Link
                      href={settingsHref}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <UserRound size={16} />
                      Profile
                    </Link>
                  )}
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut size={16} />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
            </>
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
            type="button"
            className="lg:hidden p-2 text-[#414651]"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 max-h-[calc(100vh-80px)] w-full overflow-y-auto bg-white border-t border-gray-100 shadow-xl p-6 flex flex-col gap-6 animate-in slide-in-from-top duration-300">
          <div>
            <button
              type="button"
              aria-expanded={isMobileCatalogOpen}
              onClick={() => setIsMobileCatalogOpen((open) => !open)}
              className="w-full text-left font-[family-name:var(--font-dm-sans)] text-lg font-semibold text-[#181d27]"
            >
              Explore Products
            </button>
            {isMobileCatalogOpen && (
              <div className="mt-[14px] animate-in fade-in-0 slide-in-from-top-1 duration-150">
                <CatalogMegaMenu mobile onNavigate={() => setIsMenuOpen(false)} />
              </div>
            )}
          </div>

          <div>
            <button
              type="button"
              aria-expanded={isMobileExpertsOpen}
              onClick={() => setIsMobileExpertsOpen((open) => !open)}
              className="w-full text-left font-[family-name:var(--font-dm-sans)] text-lg font-semibold text-[#181d27]"
            >
              Explore Experts
            </button>
            {isMobileExpertsOpen && (
              <div className="mt-[14px] animate-in fade-in-0 slide-in-from-top-1 duration-150">
                <ExpertMegaMenu mobile onNavigate={() => setIsMenuOpen(false)} />
              </div>
            )}
          </div>

          <div>
            <button
              type="button"
              aria-expanded={isMobileAboutOpen}
              onClick={() => setIsMobileAboutOpen((open) => !open)}
              className="w-full text-left font-[family-name:var(--font-dm-sans)] text-lg font-semibold text-[#181d27]"
            >
              About Us
            </button>
            {isMobileAboutOpen && (
              <div className="mt-[14px] flex flex-col gap-[8px] rounded-[10px] border border-[#e9eaeb] bg-[#fafafa] p-[8px] animate-in fade-in-0 slide-in-from-top-1 duration-150">
                {ABOUT_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="rounded-[8px] bg-white px-[12px] py-[10px] text-[15px] font-semibold text-[#181d27]"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="pt-6 border-t border-gray-100 flex flex-col gap-4">
            <Link
              href="/AI_workspace"
              className={`flex items-center justify-center gap-[8px] bg-white border border-[#d5d7da] rounded-[8px] px-[16px] py-[10px] font-[family-name:var(--font-dm-sans)] font-semibold text-[16px] leading-[24px] text-[#155eef] ${BUTTON_SHADOW}`}
              onClick={() => setIsMenuOpen(false)}
            >
              <Sparkles size={18} />
              AI_workspace
            </Link>

            {user ? (
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <UserAvatar src={avatarUrl} name={user.name} sizeClass="size-10" />
                  <div>
                    <p className="font-medium text-[#181d27]">{user.name || 'User'}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    handleSignOut()
                    setIsMenuOpen(false)
                  }}
                  className="text-left text-lg font-semibold text-red-600"
                >
                  Sign Out
                </button>
                <Link
                  href="/workspace"
                  className="text-left text-lg font-semibold text-[#181d27]"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Workspace
                </Link>
                {canAccessProfile && (
                  <Link
                    href={settingsHref}
                    className="text-left text-lg font-semibold text-[#181d27]"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profile
                  </Link>
                )}
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
