'use client'

import Link from 'next/link'
import Image from 'next/image'
import { SignInButton, UserButton, useUser, useAuth } from '@clerk/nextjs'
import { useEffect, useState } from 'react'

export default function Navbar() {
  const { isSignedIn } = useUser()
  const [isScrolled, setIsScrolled] = useState(false)

  // Handle scroll for transparent -> solid transition
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav className={`navbar-container transition-all duration-300 ${isScrolled ? 'bg-[#F4F8FD]/95 backdrop-blur-md shadow-sm' : 'bg-transparent'}`}>
      <div className="flex items-center justify-between">
        {/* Logo - 30px spacing from nav content */}
        <div className="flex items-center mr-[30px]">
          <Link href="/">
            <Image 
              src="/PROPLOY.svg" 
              alt="Proploy" 
              width={192} 
              height={54}
              className="h-[54px] w-[192px] object-contain"
              priority
            />
          </Link>
        </div>

        {/* Navigation Links - Centered */}
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

        {/* Action Items - 30px spacing from nav content */}
        <div className="flex items-center gap-6 ml-[30px]">
          {isSignedIn ? (
            <UserButton afterSignOutUrl="/" />
          ) : (
            <Link href="/sign-in" className="navbar-link">
              Sign In
            </Link>
          )}
          
          <Link 
            href="/become-expert" 
            className="px-6 py-3 bg-[#0466E7] text-white font-semibold text-[14px] rounded-full hover:bg-[#0355c0] transition-colors"
            style={{ borderRadius: '100px' }}
          >
            Become an Expert
          </Link>
        </div>
      </div>
    </nav>
  )
}
