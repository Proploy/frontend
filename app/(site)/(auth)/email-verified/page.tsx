'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'

function EmailVerifiedContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirectTo') ?? '/'
  const [isLoading, setIsLoading] = useState(false)

  const handleContinue = async () => {
    setIsLoading(true)
    try {
      window.dispatchEvent(new Event('proploy-auth-changed'))
      router.push(redirectTo)
      router.refresh()
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <div className="mb-8">
          <h2 className="font-dm-sans font-semibold text-[30px] leading-[38px] text-[#181d27] mb-2">
            Email verified
          </h2>
          <p className="font-inter text-[16px] text-[#535862]">
            Your email has been successfully verified. Click below to log in.
          </p>
        </div>

        <div className="space-y-4">
          <button
            type="button"
            onClick={handleContinue}
            disabled={isLoading}
            className="w-full bg-[#155eef] text-white font-inter font-semibold text-[16px] py-2.5 rounded-lg hover:bg-[#1248d4] disabled:opacity-50 transition"
          >
            {isLoading ? 'Continuing...' : 'Continue'}
          </button>

          <button
            type="button"
            onClick={() => router.push('/sign-in')}
            className="w-full text-[#535862] font-inter font-semibold text-[14px] py-2.5 hover:text-gray-900 transition flex items-center justify-center gap-2"
          >
            <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to log in
          </button>
        </div>
      </div>
    </>
  )
}

function EmailVerifiedSkeleton() {
  return (
    <div className="w-full animate-pulse">
      <div className="mb-8">
        <div className="h-8 w-64 bg-gray-200 rounded-lg mb-4" />
        <div className="h-5 w-full max-w-sm bg-gray-200 rounded-lg" />
      </div>
      <div className="space-y-4">
        <div className="h-11 w-full bg-gray-200 rounded-lg" />
        <div className="h-11 w-full bg-gray-200 rounded-lg" />
      </div>
    </div>
  )
}

export default function EmailVerifiedPage() {
  return (
    <div className="flex h-[calc(100vh-80px)] w-full">
      {/* Left Section - Hero */}
      <div className="hidden lg:flex flex-[3] relative flex-col items-center justify-center overflow-hidden">
        <Image alt="" src="/login-backdrop.png" fill sizes="(max-width: 1023px) 0px, 60vw" className="absolute inset-0 object-cover" />
        <div className="absolute inset-0 bg-[#0040c1] opacity-80" />

        <div className="relative z-10 flex flex-col gap-12 w-[640px] px-8">
          <Image alt="Proploy" src="/proploy-logomark-white.png" width={48} height={48} />

          <div className="flex flex-col gap-6">
            <h1 className="font-dm-sans font-semibold text-[72px] leading-[90px] text-white" style={{ letterSpacing: '-1.44px' }}>
              Discover, Decide, Deploy, Done.
            </h1>
            <p className="font-inter font-medium text-[20px] leading-[30px] text-[#b2ccff]">
              AI-powered marketplace that matches businesses with the right software solutions and the vetted experts to implement them successfully.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex -space-x-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="size-10 rounded-full bg-gray-300 border-2 border-white" />
              ))}
            </div>
            <div>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400">★</span>
                ))}
                <span className="text-white font-semibold ml-2">5.0</span>
              </div>
              <p className="text-[#b2ccff] text-sm">from 200+ reviews</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="w-full flex flex-col items-center justify-center bg-white px-6 py-12 h-full sm:px-10 lg:flex-[2] lg:px-[100px] overflow-auto">
        <div className="w-full">
          <Image alt="Proploy" src="/proploy-logomark.png" width={48} height={48} className="mb-8" />
          <Suspense fallback={<EmailVerifiedSkeleton />}>
            <EmailVerifiedContent />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
