'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { Menu, X, LogOut, User, Settings } from 'lucide-react'
import { useAuth } from '@/components/providers/auth-provider'
import { setAuthIntent, getAuthIntent } from '@/lib/utils/auth-intent-client'

export default function Navbar() {
  const { user, expert, signOut } = useAuth()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)

  const expertStatus = expert?.status
  const showDashboard = expertStatus === 'approved'
  const showApplicationPending = expertStatus === 'submitted' || expertStatus === 'changes_requested'
  const showCompleteApplication = expertStatus === 'draft'

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleSignOut = async () => {
    await signOut()
    setIsProfileOpen(false)
  }

  const handleBecomeExpertClick = (e: React.MouseEvent) => {
    if (!user) {
      e.preventDefault()
      setAuthIntent('/expert/apply')
      window.location.href = '/sign-in?redirect=/expert/apply'
    }
  }

  return (
    <nav className={`navbar-container transition-all duration-300 ${isScrolled || isMenuOpen ? 'bg-[#F4F8FD]/95 backdrop-blur-md shadow-sm' : 'bg-transparent'}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center lg:mr-[30px]">
          <Link href="/">
            <Image 
              src="/PROPLOY.svg" 
              alt="Proploy" 
              width={192} 
              height={54}
              className="h-[40px] md:h-[54px] w-auto object-contain"
              priority
            />
          </Link>
        </div>

        <div className="hidden lg:flex items-center navbar-links-container flex-1 justify-center">
          <Link href="/products" className="navbar-link">
            Explore Products
          </Link>
          <Link href="/experts" className="navbar-link">
            Explore Experts
          </Link>
          <Link href="/for-businesses" className="navbar-link">
            For Businesses
          </Link>
          <Link href="/for-experts" className="navbar-link">
            For Experts
          </Link>
        </div>

        <div className="flex items-center gap-3 md:gap-6 lg:ml-[30px]">
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="relative">
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
                    <div className="w-9 h-9 bg-[#0466E7] rounded-full flex items-center justify-center text-white font-medium">
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
                      href="/dashboard"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <User size={16} />
                      Dashboard
                    </Link>
                    {showDashboard && (
                      <Link
                        href="/expert/dashboard"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-[#0466E7] hover:bg-blue-50 font-medium"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        Expert Dashboard
                      </Link>
                    )}
                    {showCompleteApplication && (
                      <Link
                        href="/expert/apply"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-[#0466E7] hover:bg-blue-50 font-medium"
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
                      href="/settings"
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
              <Link href="/sign-in" className="navbar-link">
                Sign In
              </Link>
            )}
          </div>
          
          <Link
            href={showDashboard ? '/expert/dashboard' : showCompleteApplication ? '/expert/apply' : showApplicationPending ? '#' : user ? '/expert/apply' : '#'}
            onClick={!user && !showApplicationPending ? handleBecomeExpertClick : undefined}
            className="hidden md:flex px-6 py-3 bg-[#0466E7] text-white font-semibold text-[14px] rounded-full hover:bg-[#0355c0] transition-colors"
            style={{ borderRadius: '100px' }}
          >
            {showDashboard ? 'Expert Dashboard' : showApplicationPending ? 'Application Pending' : showCompleteApplication ? 'Complete Application' : 'Become an Expert'}
          </Link>

          <button 
            className="lg:hidden p-2 text-text-primary"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-white border-t border-gray-100 shadow-xl p-6 flex flex-col gap-6 animate-in slide-in-from-top duration-300">
          <Link 
            href="/products" 
            className="text-lg font-semibold text-text-primary"
            onClick={() => setIsMenuOpen(false)}
          >
            Explore Products
          </Link>
          <Link 
            href="/experts" 
            className="text-lg font-semibold text-text-primary"
            onClick={() => setIsMenuOpen(false)}
          >
            Explore Experts
          </Link>
          <Link 
            href="/for-businesses" 
            className="text-lg font-semibold text-text-primary"
            onClick={() => setIsMenuOpen(false)}
          >
            For Businesses
          </Link>
          <Link
            href={showDashboard ? '/expert/dashboard' : showCompleteApplication ? '/expert/apply' : showApplicationPending ? '#' : user ? '/expert/apply' : '#'}
            onClick={(e) => {
              if (!user && !showApplicationPending) {
                e.preventDefault()
                setAuthIntent('/expert/apply')
                window.location.href = '/sign-in?redirect=/expert/apply'
              }
              setIsMenuOpen(false)
            }}
            className="text-lg font-semibold text-[#0466E7]"
          >
            {showDashboard ? 'Expert Dashboard' : showApplicationPending ? 'Application Pending' : showCompleteApplication ? 'Complete Application' : 'Become an Expert'}
          </Link>
          
          <div className="pt-6 border-t border-gray-100 flex flex-col gap-4">
            {user ? (
              <div className="flex flex-col gap-2">
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
                    <div className="w-10 h-10 bg-[#0466E7] rounded-full flex items-center justify-center text-white font-medium">
                      {user.name?.[0] || user.email?.[0] || 'U'}
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-text-primary">{user.name || 'User'}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </div>
                <button 
                  onClick={() => { handleSignOut(); setIsMenuOpen(false); }}
                  className="text-left text-lg font-semibold text-red-600"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link 
                href="/sign-in" 
                className="text-lg font-semibold text-cta-button"
                onClick={() => setIsMenuOpen(false)}
              >
                Sign In
              </Link>
            )}
            <Link
              href={showDashboard ? '/expert/dashboard' : showCompleteApplication ? '/expert/apply' : showApplicationPending ? '#' : '/become-expert'}
              onClick={() => setIsMenuOpen(false)}
              className="w-full py-4 bg-[#0466E7] text-white font-bold rounded-xl text-center shadow-lg"
            >
              {showDashboard ? 'Expert Dashboard' : showApplicationPending ? 'Application Pending' : showCompleteApplication ? 'Complete Application' : 'Become an Expert'}
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}