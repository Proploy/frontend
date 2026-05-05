'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function ResetPasswordEmailPage() {
  const router = useRouter()
  const [code, setCode] = useState(['', '', '', ''])
  const [isLoading, setIsLoading] = useState(false)

  const handleCodeChange = (index: number, value: string) => {
    if (value.length > 1) return
    const newCode = [...code]
    newCode[index] = value
    setCode(newCode)

    if (value && index < 3) {
      const nextInput = document.getElementById(`reset-code-${index + 1}`)
      nextInput?.focus()
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const fullCode = code.join('')
      console.log('Reset password code:', fullCode)
      router.push('/set-new-password')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex h-[calc(100vh-80px)] w-full">
      {/* Left Section - Hero */}
      <div className="hidden lg:flex flex-[3] relative flex-col items-center justify-center overflow-hidden">
        <Image alt="" src="/login-backdrop.png" fill className="absolute inset-0 object-cover" />
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
                <div key={i} className="w-10 h-10 rounded-full bg-gray-300 border-2 border-white" />
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
      <div className="w-full flex flex-col items-center justify-center bg-white px-[100px] py-12 h-full min-w-[480px] lg:flex-[2] overflow-auto">
        <div className="w-full">
          <Image alt="Proploy" src="/proploy-logomark.png" width={48} height={48} className="mb-8" />

          <div className="mb-8">
            <h2 className="font-dm-sans font-semibold text-[30px] leading-[38px] text-[#181d27] mb-2">
              Check your email
            </h2>
            <p className="font-inter text-[16px] text-[#535862]">
              We sent a password reset code to your email address.
            </p>
          </div>

          <div className="space-y-6 mb-6">
            <div className="flex gap-3 w-full mb-6">
              {[0, 1, 2, 3].map((index) => (
                <input
                  key={index}
                  id={`reset-code-${index}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={code[index]}
                  onChange={(e) => handleCodeChange(index, e.target.value)}
                  className="flex-1 min-h-[80px] border-2 border-[#2970ff] rounded-xl bg-white text-center text-[48px] leading-[60px] tracking-[-0.96px] font-[family-name:var(--font-dm-sans)] font-medium text-[#155eef] shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)] focus:outline-none focus:shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05),0px_0px_0px_2px_white,0px_0px_0px_4px_#2970ff]"
                />
              ))}
            </div>

            <button
              onClick={() => router.push('/set-new-password')}
              className="w-full bg-[#155eef] text-white font-inter font-semibold text-[16px] py-2.5 rounded-lg hover:bg-[#1248d4] transition"
            >
              Verify email
            </button>
          </div>

          <p className="text-center font-inter text-[14px] text-[#535862]">
            Didn't receive the email?{' '}
            <button className="text-[#004eeb] font-semibold hover:underline">
              Click to resend
            </button>
          </p>

          <button
            onClick={() => router.push('/sign-in')}
            className="w-full mt-4 text-[#535862] font-inter font-semibold text-[14px] py-2.5 hover:text-gray-900 transition flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to log in
          </button>
        </div>
      </div>
    </div>
  )
}
