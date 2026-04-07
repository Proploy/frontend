'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import InputField from '@/components/ui/InputField'
import Button from '@/components/ui/Button'
import Checkbox from '@/components/ui/Checkbox'

export default function SignInPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      // TODO: Implement your auth logic here
      console.log('Sign in:', formData)
      router.push('/')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex h-[calc(100vh-80px)] w-full">
      {/* Left Section - Hero */}
      <div className="hidden lg:flex flex-[3] relative flex-col items-center justify-center overflow-hidden">
        <Image
          alt=""
          src="/login-backdrop.png"
          fill
          className="absolute inset-0 object-cover"
        />
        <div className="absolute inset-0 bg-[#0040c1] opacity-80"></div>

        <div className="relative z-10 flex flex-col gap-12 w-[640px] px-8">
          <Image
            alt="Proploy"
            src="/proploy-logomark-white.png"
            width={48}
            height={48}
          />

          <div className="flex flex-col gap-6">
            <h1 className="font-dm-sans font-semibold text-[72px] leading-[90px] text-white" style={{ letterSpacing: '-1.44px' }}>
              Discover, Decide, Deploy, Done.
            </h1>
            <p className="font-inter font-medium text-[20px] leading-[30px] text-[#b2ccff]">
              AI-powered marketplace that matches businesses with the right software solutions and the vetted experts to implement them successfully.
            </p>
          </div>

          {/* Testimonials */}
          <div className="flex items-center gap-4">
            <div className="flex -space-x-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-10 h-10 rounded-full bg-gray-300 border-2 border-white"></div>
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

      {/* Right Section - Form */}
      <div className="w-full flex flex-col items-center justify-center bg-white px-[100px] py-12 h-full min-w-[480px] lg:flex-[2] overflow-auto">
        <div className="w-full">
          {/* Logo */}
          <Image
            alt="Proploy"
            src="/proploy-logomark.png"
            width={48}
            height={48}
            className="mb-8"
          />

          <div className="mb-8">
            <h2 className="font-dm-sans font-semibold text-[30px] leading-[38px] text-[#181d27] mb-2">
              Log in
            </h2>
            <p className="font-inter text-[16px] text-[#535862]">
              Welcome back! Please enter your details.
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6 mb-6">
            <InputField
              label="Email"
              name="email"
              inputType="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
            />

            <div className="flex flex-col gap-4">
              <InputField
                label="Password"
                name="password"
                inputType="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
              />

              <div className="flex items-center justify-between">
                <Checkbox
                  checked={rememberMe}
                  onChange={setRememberMe}
                  label="Remember for 30 days"
                  size="sm"
                />
                <Link href="/forgot-password" className="text-[#004eeb] font-semibold text-[14px] hover:underline">
                  Forgot password
                </Link>
              </div>
            </div>

            <Button type="submit" variant="primary" size="lg" loading={isLoading} loadingText="Logging in..." className="w-full">
              Log in
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#e9eaeb]"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-[#535862]">OR</span>
            </div>
          </div>

          {/* Social Buttons */}
          <div className="space-y-3 mb-6">
            <Button
              variant="secondary"
              size="lg"
              className="w-full"
              leadingIcon={
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              }
            >
              Continue with Google
            </Button>

            <Button
              variant="secondary"
              size="lg"
              className="w-full"
              leadingIcon={
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path fill="#1877F2" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              }
            >
              Continue with Facebook
            </Button>
          </div>

          {/* Sign Up Link */}
          <p className="text-center font-inter text-[14px] text-[#535862]">
            Don't have an account?{' '}
            <Link href="/sign-up" className="text-[#004eeb] font-semibold hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
