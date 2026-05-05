'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import InputField from '@/components/ui/InputField'
import Button from '@/components/ui/Button'
import { createClient } from '@/lib/supabase/client'

const oauthProviders = [
  { label: 'Sign up with Google', provider: 'google' as const },
  { label: 'Sign up with GitHub', provider: 'github' as const },
  { label: 'Sign up with Azure', provider: 'azure' as const },
]

export default function SignUpPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  })
  const [errors, setErrors] = useState({ minChars: false, specialChar: false })
  const [isLoading, setIsLoading] = useState(false)
  const [oauthLoading, setOauthLoading] = useState<string | null>(null)
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    if (name === 'password') {
      const hasMinChars = value.length >= 8
      const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{}:";,.<>?]/.test(value)
      setErrors({
        minChars: !hasMinChars,
        specialChar: !hasSpecialChar,
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const supabase = createClient()
      const [firstName, ...rest] = formData.name.trim().split(/\s+/)
      const lastName = rest.join(' ')
      const origin = window.location.origin

      const { error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: `${origin}/auth/callback`,
          data: {
            full_name: formData.name,
            first_name: firstName || '',
            last_name: lastName || '',
          },
        },
      })

      if (error) throw error

      router.push('/check-email')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to create account')
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
          redirectTo: `${origin}/auth/callback`,
        },
      })

      if (error) throw error
    } catch (err) {
      setError(err instanceof Error ? err.message : `Unable to sign up with ${provider}`)
      setOauthLoading(null)
    }
  }

  return (
    <div className="flex h-[calc(100vh-80px)] w-full">
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
        </div>
      </div>

      <div className="w-full flex flex-col items-center justify-start bg-white px-[100px] py-12 h-full min-w-[480px] lg:flex-[2] overflow-auto">
        <div className="w-full">
          <Image alt="Proploy" src="/proploy-logomark.png" width={48} height={48} className="mb-8" />

          <div className="mb-8">
            <h2 className="font-dm-sans font-semibold text-[30px] leading-[38px] text-[#181d27] mb-2">Create an account</h2>
            <p className="font-inter text-[16px] text-[#535862]">Start your 30-day free trial.</p>
          </div>

          {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-6 mb-6">
            <InputField label="Name" name="name" value={formData.name} onChange={handleChange} placeholder="Enter your name" />
            <InputField label="Email" name="email" inputType="email" value={formData.email} onChange={handleChange} placeholder="Enter your email" />

            <div className="flex flex-col gap-2">
              <InputField label="Password" name="password" inputType="password" value={formData.password} onChange={handleChange} placeholder="Create a password" />

              <div className="space-y-2 mt-3">
                <div className="flex items-center gap-2">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center ${errors.minChars ? 'bg-gray-200' : 'bg-green-100'}`}>
                    {!errors.minChars && <span className="text-green-600 text-sm">&#10003;</span>}
                  </div>
                  <span className={`font-inter text-[14px] ${errors.minChars ? 'text-[#999]' : 'text-[#414651]'}`}>Must be at least 8 characters</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center ${errors.specialChar ? 'bg-gray-200' : 'bg-green-100'}`}>
                    {!errors.specialChar && <span className="text-green-600 text-sm">&#10003;</span>}
                  </div>
                  <span className={`font-inter text-[14px] ${errors.specialChar ? 'text-[#999]' : 'text-[#414651]'}`}>Must contain one special character</span>
                </div>
              </div>
            </div>

            <Button type="submit" variant="primary" size="lg" disabled={errors.minChars || errors.specialChar} loading={isLoading} loadingText="Getting started..." className="w-full mt-8">
              Get started
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#e9eaeb]" />
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
            Already have an account?{' '}
            <Link href="/sign-in" className="text-[#004eeb] font-semibold hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
