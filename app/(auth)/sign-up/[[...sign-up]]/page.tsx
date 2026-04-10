'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@/components/providers/auth-provider'

export default function SignUpPage() {
  const { signUp, signInWithOAuth } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/'
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [pendingVerification, setPendingVerification] = useState(false)
  const [code, setCode] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const { error } = await signUp(email, password)
      if (error) {
        setError(error.message)
      } else {
        router.push(redirect)
      }
    } catch (err) {
      setError('An error occurred during sign up')
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerification = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      // For Supabase, we need to use the session from the URL after email confirmation
      // For now, let's just redirect to login
      setError('Please check your email and click the confirmation link')
    } catch (err) {
      setError('Invalid verification code')
    } finally {
      setIsLoading(false)
    }
  }

  const handleOAuthSignUp = async (provider: 'google' | 'github' | 'azure') => {
    try {
      await signInWithOAuth(provider, redirect)
    } catch (err) {
      setError('OAuth error occurred')
    }
  }

  if (pendingVerification) {
    return (
      <div className="min-h-screen bg-[#F8F7F4] flex flex-col">
        <div className="flex-1 flex pt-[40px]">
          <div className="w-full lg:w-1/2 flex flex-col justify-center items-center px-8 lg:px-16">
            <div className="w-full max-w-[239px]">
              <h1 className="text-[24px] font-bold text-gray-900 mb-[40px] text-center lg:text-left font-dm-sans">
                Verify your email
              </h1>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm font-inter">
                  {error}
                </div>
              )}

              <form onSubmit={handleVerification} className="space-y-[16px]">
                <div>
                  <label 
                    htmlFor="code" 
                    className="block text-[12px] font-bold text-[#666666] mb-[6px] font-inter"
                  >
                    Verification Code
                  </label>
                  <input
                    id="code"
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Enter the code from your email"
                    required
                    className="input-field"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-cta w-full mt-2"
                >
                  {isLoading ? 'Verifying...' : 'Verify'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F8F7F4] flex flex-col">
      <div className="flex-1 flex pt-[40px]">
        <div className="w-full lg:w-1/2 flex flex-col justify-center items-center px-8 lg:px-16">
          <div className="w-full max-w-[239px]">
            <h1 className="text-[24px] font-bold text-gray-900 mb-[40px] text-center lg:text-left font-dm-sans">
              Sign Up for Proploy
            </h1>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm font-inter">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-[16px]">
              <div className="flex gap-2">
                <div className="flex-1">
                  <label 
                    htmlFor="firstName" 
                    className="block text-[12px] font-bold text-[#666666] mb-[6px] font-inter"
                  >
                    First Name
                  </label>
                  <input
                    id="firstName"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="John"
                    className="input-field"
                  />
                </div>
                <div className="flex-1">
                  <label 
                    htmlFor="lastName" 
                    className="block text-[12px] font-bold text-[#666666] mb-[6px] font-inter"
                  >
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Doe"
                    className="input-field"
                  />
                </div>
              </div>

              <div>
                <label 
                  htmlFor="email" 
                  className="block text-[12px] font-bold text-[#666666] mb-[6px] font-inter"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="youremail@email.com"
                  required
                  className="input-field"
                />
              </div>

              <div>
                <label 
                  htmlFor="password" 
                  className="block text-[12px] font-bold text-[#666666] mb-[6px] font-inter"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a password"
                    required
                    className="input-field pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="btn-cta w-full mt-2"
              >
                {isLoading ? 'Creating account...' : 'Create Account'}
              </button>
            </form>

            <div className="relative my-[24px]">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-100"></div>
              </div>
              <div className="relative flex justify-center text-[12px]">
                <span className="px-2 bg-[#F8F7F4] text-[#CCCCCC] font-inter">Or</span>
              </div>
            </div>

            <div className="space-y-[12px]">
              <button
                type="button"
                onClick={() => handleOAuthSignUp('google')}
                className="btn-sso w-full"
              >
                <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Sign up with Google
              </button>

              <button
                type="button"
                onClick={() => handleOAuthSignUp('azure')}
                className="btn-sso w-full"
              >
                <svg className="w-[18px] h-[18px]" viewBox="0 0 23 23">
                  <path fill="#f3f3f3" d="M0 0h23v23H0z"/>
                  <path fill="#f35325" d="M1 1h10v10H1z"/>
                  <path fill="#81bc06" d="M12 1h10v10H12z"/>
                  <path fill="#05a6f0" d="M1 12h10v10H1z"/>
                  <path fill="#ffba08" d="M12 12h10v10H12z"/>
                </svg>
                Sign up with Microsoft
              </button>
            </div>

            <p className="mt-[40px] text-center text-gray-600 text-[12px] font-inter">
              Already have an account?{' '}
              <Link 
                href="/sign-in" 
                className="text-[#197CFF] font-semibold hover:underline"
              >
                Sign In
              </Link>
            </p>

            <div className="mt-[60px] text-center lg:text-left text-[10px] text-[#CCCCCC] uppercase tracking-wider font-inter">
              &copy; 2026 Proploy. ALL RIGHTS RESERVED
            </div>
          </div>
        </div>

        <div className="hidden lg:block lg:w-1/2 p-10 pr-56 pb-56">
          <div className="relative h-full w-full rounded-[24px] overflow-hidden shadow-2xl">
            <Image
              src="/images/sign-in banner.png"
              alt="Discover, Decide, Deploy, Done"
              fill
              className="object-cover"
              priority
            />
            
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-10">
              <h2 className="headline-main text-center">
                Discover, Decide,
              </h2>
              <h2 className="headline-main text-center">
                Deploy, Done.
              </h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}