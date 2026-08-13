'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { signUpWithPassword, startOAuthSignIn } from '@/lib/auth/browser-client'
import { AuthShell } from '../auth-shell'
import { AuthError, AuthField, OAuthButtons, OrDivider, type OAuthProvider } from '../auth-ui'

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
      const { error } = await signUpWithPassword(formData.name, formData.email, formData.password)
      if (error) throw error

      window.dispatchEvent(new Event('proploy-auth-changed'))
      const params = new URLSearchParams({ email: formData.email })
      const redirectTo = new URL(window.location.href).searchParams.get('redirectTo')
      if (redirectTo) params.set('redirectTo', redirectTo)
      router.push(`/check-email?${params.toString()}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to create account')
    } finally {
      setIsLoading(false)
    }
  }

  const handleOAuth = async (provider: OAuthProvider) => {
    setError('')
    setOauthLoading(provider)

    try {
      const { url, error } = await startOAuthSignIn({ provider })
      if (error) throw error
      if (url) window.location.assign(url)
    } catch (err) {
      setError(err instanceof Error ? err.message : `Unable to sign up with ${provider}`)
      setOauthLoading(null)
    }
  }

  const passwordChecks = [
    { ok: formData.password.length >= 8, label: 'At least 8 characters' },
    {
      ok: /[!@#$%^&*()_+\-=\[\]{}:";,.<>?]/.test(formData.password),
      label: 'At least one special character',
    },
  ]

  return (
    <AuthShell>
      <div className="pp-stack pp-gap-8">
        <div className="pp-stack pp-gap-3">
          <p className="pp-label">Get started</p>
          <h2 className="pp-display pp-d3">Create an account</h2>
          <p className="pp-body">Free to join — for buyers and experts alike.</p>
        </div>

        {error && <AuthError message={error} />}

        <form onSubmit={handleSubmit} className="pp-stack pp-gap-6">
          <AuthField
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your name"
            autoComplete="name"
          />
          <AuthField
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            autoComplete="email"
          />

          <div className="pp-stack pp-gap-3">
            <AuthField
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
              autoComplete="new-password"
            />

            <ul className="pp-stack pp-gap-2" aria-live="polite">
              {passwordChecks.map(({ ok, label }) => (
                <li key={label} className="pp-flex pp-gap-2" style={{ alignItems: 'center' }}>
                  <span
                    className="pp-yes"
                    style={
                      ok
                        ? undefined
                        : { background: 'var(--color-gray-100)', color: 'var(--color-gray-400)' }
                    }
                    aria-hidden="true"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  <span
                    className="pp-small"
                    style={ok ? { color: 'var(--ink)' } : undefined}
                  >
                    {label}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <button
            type="submit"
            className="pp-btn pp-btn--cobalt pp-btn--block"
            disabled={isLoading || errors.minChars || errors.specialChar}
          >
            {isLoading ? 'Getting started…' : 'Get started'}
          </button>
        </form>

        <OrDivider />

        <OAuthButtons verb="Sign up" loadingProvider={oauthLoading} onSelect={handleOAuth} />

        <p className="pp-body" style={{ textAlign: 'center' }}>
          Already have an account?{' '}
          <Link
            href="/sign-in"
            style={{ color: 'var(--cobalt)', fontWeight: 'var(--weight-semibold)' }}
          >
            Log in
          </Link>
        </p>
      </div>
    </AuthShell>
  )
}
