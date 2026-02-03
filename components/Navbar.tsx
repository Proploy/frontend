'use client'

import Link from 'next/link'
import Image from 'next/image'
import { SignInButton, UserButton, useUser, useAuth } from '@clerk/nextjs'
import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'

export default function Navbar() {
  const { isSignedIn } = useUser()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  // Handle scroll for transparent -> solid transition
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav className={`navbar-container transition-all duration-300 ${isScrolled || isMenuOpen ? 'bg-[#F4F8FD]/95 backdrop-blur-md shadow-sm' : 'bg-transparent'}`}>
      <div className="flex items-center justify-between">
        {/* Logo - 30px spacing from nav content on desktop */}
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

        {/* Navigation Links - Centered - Desktop only */}
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

        {/* Action Items - 30px spacing from nav content on desktop */}
        <div className="flex items-center gap-3 md:gap-6 lg:ml-[30px]">
          <div className="hidden md:flex items-center gap-4">
            {isSignedIn ? (
              <UserButton afterSignOutUrl="/" />
            ) : (
              <Link href="/sign-in" className="navbar-link">
                Sign In
              </Link>
            )}
          </div>
          
          <Link 
            href="/become-expert" 
            className="hidden md:flex px-6 py-3 bg-[#0466E7] text-white font-semibold text-[14px] rounded-full hover:bg-[#0355c0] transition-colors"
            style={{ borderRadius: '100px' }}
          >
            Become an Expert
          </Link>

          {/* Mobile Menu Button */}
          <button 
            className="lg:hidden p-2 text-text-primary"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
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
            href="/for-experts" 
            className="text-lg font-semibold text-text-primary"
            onClick={() => setIsMenuOpen(false)}
          >
            For Experts
          </Link>
          
          <div className="pt-6 border-t border-gray-100 flex flex-col gap-4">
            {isSignedIn ? (
              <div className="flex items-center gap-4">
                <UserButton afterSignOutUrl="/" />
                <span className="font-medium text-text-primary">My Account</span>
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
              href="/become-expert" 
              className="w-full py-4 bg-[#0466E7] text-white font-bold rounded-xl text-center shadow-lg"
              onClick={() => setIsMenuOpen(false)}
            >
              Become an Expert
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}

