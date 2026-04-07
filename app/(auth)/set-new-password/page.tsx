'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function SetNewPasswordPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setIsLoading(false)
      return
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters')
      setIsLoading(false)
      return
    }

    try {
      console.log('Set new password:', formData)
      router.push('/password-reset-confirmation')
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
              Set new password
            </h2>
            <p className="font-inter text-[16px] text-[#535862]">
              Your new password must be different to previously used passwords.
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-6 mb-6">
            <div>
              <label htmlFor="password" className="block font-inter font-medium text-[14px] text-[#414651] mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 border border-[#d5d7da] rounded-lg bg-white text-[16px] placeholder-[#717680] font-inter focus:outline-none focus:border-[#2970ff]"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block font-inter font-medium text-[14px] text-[#414651] mb-2">
                Confirm password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 border border-[#d5d7da] rounded-lg bg-white text-[16px] placeholder-[#717680] font-inter focus:outline-none focus:border-[#2970ff]"
              />
            </div>

            <div className="space-y-3">
              <div className="flex gap-2 items-center">
                <div className={`w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center ${formData.password.length >= 8 ? 'bg-green-100' : 'bg-gray-200'}`}>
                  {formData.password.length >= 8 && <span className="text-green-600 text-sm">✓</span>}
                </div>
                <span className={`font-inter text-[14px] ${formData.password.length >= 8 ? 'text-[#414651]' : 'text-[#999]'}`}>
                  Must be at least 8 characters
                </span>
              </div>
              <div className="flex gap-2 items-center">
                <div className={`w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center ${/[!@#$%^&*]/.test(formData.password) ? 'bg-green-100' : 'bg-gray-200'}`}>
                  {/[!@#$%^&*]/.test(formData.password) && <span className="text-green-600 text-sm">✓</span>}
                </div>
                <span className={`font-inter text-[14px] ${/[!@#$%^&*]/.test(formData.password) ? 'text-[#414651]' : 'text-[#999]'}`}>
                  Must contain one special character
                </span>
              </div>
            </div>

            <button
              onClick={() => router.push('/password-reset-confirmation')}
              className="w-full bg-[#155eef] text-white font-inter font-semibold text-[16px] py-2.5 rounded-lg hover:bg-[#1248d4] transition"
            >
              Reset password
            </button>
          </div>

          <button
            onClick={() => router.push('/sign-in')}
            className="w-full text-[#535862] font-inter font-semibold text-[14px] py-2.5 hover:text-gray-900 transition flex items-center justify-center gap-2"
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
