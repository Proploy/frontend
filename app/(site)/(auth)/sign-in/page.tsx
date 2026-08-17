'use client'

import { Suspense, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { signInWithPassword, startOAuthSignIn } from '@/lib/auth/browser-client'
import { AuthShell } from '../auth-shell'
import { AuthError, AuthField, OAuthButtons, OrDivider, type OAuthProvider } from '../auth-ui'

export default function SignInPage() {
  return (
    <AuthShell>
      <Suspense fallback={<div className="pp-stack pp-gap-8 animate-pulse"><div className="h-[400px] w-full bg-gray-200 rounded-lg" /></div>}>
        <SignInPageContent />
      </Suspense>
    </AuthShell>
  )
}

function SignInPageContent() {
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
      const { error } = await signInWithPassword(formData.email, formData.password)
      if (error) throw error

      window.dispatchEvent(new Event('proploy-auth-changed'))
      router.push(redirectTo)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to sign in')
    } finally {
      setIsLoading(false)
    }
  }

  const handleOAuth = async (provider: OAuthProvider) => {
    setError('')
    setOauthLoading(provider)

    try {
      const { url, error } = await startOAuthSignIn({ provider, redirectTo, rememberMe })
      if (error) throw error
      if (url) window.location.assign(url)
    } catch (err) {
      setError(err instanceof Error ? err.message : `Unable to sign in with ${provider}`)
      setOauthLoading(null)
    }
  }

  return (
      <div className="pp-stack pp-gap-8">
        <div className="pp-stack pp-gap-3">
          <p className="pp-label">Welcome back</p>
          <h2 className="pp-display pp-d3">Log in</h2>
          <p className="pp-body">Please enter your details.</p>
        </div>

        {(error || errorParam) && (
          <AuthError
            message={
              error ||
              (errorParam === 'auth_callback_failed'
                ? 'Sign-in callback failed. Please try again.'
                : 'Authentication error. Please try again.')
            }
          />
        )}

        <form onSubmit={handleSubmit} className="pp-stack pp-gap-6">
          <AuthField
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            autoComplete="email"
          />

          <div className="pp-stack pp-gap-4">
            <AuthField
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              autoComplete="current-password"
            />

            <div className="pp-flex" style={{ alignItems: 'center', justifyContent: 'space-between' }}>
              <label className="pp-check">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                Remember for 30 days
              </label>
              <Link
                href="/forgot-password"
                className="pp-small"
                style={{ color: 'var(--cobalt)', fontWeight: 'var(--weight-semibold)' }}
              >
                Forgot password
              </Link>
            </div>
          </div>

          <button type="submit" className="pp-btn pp-btn--cobalt pp-btn--block" disabled={isLoading}>
            {isLoading ? 'Logging in…' : 'Log in'}
          </button>
        </form>

        <OrDivider />

        <OAuthButtons verb="Continue" loadingProvider={oauthLoading} onSelect={handleOAuth} />

        <p className="pp-body" style={{ textAlign: 'center' }}>
          Don&apos;t have an account?{' '}
          <Link
            href="/sign-up"
            style={{ color: 'var(--cobalt)', fontWeight: 'var(--weight-semibold)' }}
          >
            Create an account
          </Link>
        </p>
      </div>
  )
}
