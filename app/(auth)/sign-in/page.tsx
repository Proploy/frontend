'use client'

import { useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import InputField from '@/components/ui/InputField'
import Button from '@/components/ui/Button'
import Checkbox from '@/components/ui/Checkbox'
import { createClient } from '@/lib/supabase/client'
import { syncUserToServiceApis } from '@/lib/service-apis/auth-sync'

const oauthProviders = [
  { label: 'Continue with Google', provider: 'google' as const },
  { label: 'Continue with GitHub', provider: 'github' as const },
  { label: 'Continue with Azure', provider: 'azure' as const },
]

export default function SignInPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = useMemo(() => searchParams.get('redirectTo') || '/', [searchParams])
  const errorParam = searchParams.get('error')

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [oauthLoading, setOauthLoading] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const supabase = createClient()
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      })

      if (error) throw error
      if (data.session?.access_token) {
        const synced = await syncUserToServiceApis(data.session.access_token)
        if (!synced) throw new Error('Unable to sync account with service APIs')
      }

      router.push(redirectTo)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to sign in')
    } finally {
      setIsLoading(false)
    }
  }

  const handleOAuth = async (provider: 'google' | 'github' | 'azure') => {
    setError('')
    setOauthLoading(provider)

    try {
      const supabase = createClient()
      const origin = window.location.origin
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${origin}/auth/callback?redirectTo=${encodeURIComponent(redirectTo)}`,
          queryParams: rememberMe ? { access_type: 'offline', prompt: 'consent' } : undefined,
        },
      })

      if (error) throw error
    } catch (err) {
      setError(err instanceof Error ? err.message : `Unable to sign in with ${provider}`)
      setOauthLoading(null)
    }
  }

  return (
    <div className="flex h-screen w-full pt-[80px]">
      <div className="hidden lg:flex flex-[3] relative flex-col items-center justify-center overflow-hidden">
        <Image alt="" src="/login-backdrop.png" fill className="absolute inset-0 object-cover" />
        <div className="absolute inset-0 bg-[#0040c1] opacity-80"></div>

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
        </div>
      </div>

      <div className="w-full flex flex-col items-center justify-center bg-white px-[100px] py-12 h-full min-w-[480px] lg:flex-[2] overflow-auto">
        <div className="w-full max-w-[400px]">
          <Image alt="Proploy" src="/proploy-logomark.png" width={48} height={48} className="mb-8" />

          <div className="mb-8">
            <h2 className="font-dm-sans font-semibold text-[30px] leading-[38px] text-[#181d27] mb-2">Log in</h2>
            <p className="font-inter text-[16px] text-[#535862]">Welcome back! Please enter your details.</p>
          </div>

          {(error || errorParam) && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error || (errorParam === 'auth_callback_failed' ? 'Sign-in callback failed. Please try again.' : 'Authentication error. Please try again.')}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6 mb-6">
            <InputField label="Email" name="email" inputType="email" value={formData.email} onChange={handleChange} placeholder="Enter your email" />

            <div className="flex flex-col gap-4">
              <InputField label="Password" name="password" inputType="password" value={formData.password} onChange={handleChange} placeholder="Enter your password" />

              <div className="flex items-center justify-between">
                <Checkbox checked={rememberMe} onChange={setRememberMe} label="Remember for 30 days" size="sm" />
                <Link href="/forgot-password" className="text-[#004eeb] font-semibold text-[14px] hover:underline">
                  Forgot password
                </Link>
              </div>
            </div>

            <Button type="submit" variant="primary" size="lg" loading={isLoading} loadingText="Logging in..." className="w-full">
              Log in
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#e9eaeb]"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-[#535862]">OR</span>
            </div>
          </div>

          <div className="space-y-3 mb-6">
            {oauthProviders.map(({ label, provider }) => (
              <Button key={provider} type="button" variant="secondary" size="lg" className="w-full" onClick={() => handleOAuth(provider)} loading={oauthLoading === provider}>
                {label}
              </Button>
            ))}
          </div>

          <p className="text-center font-inter text-[14px] text-[#535862]">
            Don&apos;t have an account?{' '}
            <Link href="/sign-up" className="text-[#004eeb] font-semibold hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
