'use client'

import { useState } from 'react'

// Small v2-styled form primitives shared by the auth pages.

export function AuthField({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  autoComplete,
}: {
  label: string
  name: string
  type?: 'text' | 'email' | 'password'
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  autoComplete?: string
}) {
  const [showPassword, setShowPassword] = useState(false)
  const isPassword = type === 'password'
  const inputType = isPassword && showPassword ? 'text' : type

  return (
    <div className="pp-field">
      <label htmlFor={`auth-${name}`}>{label}</label>
      <div style={{ position: 'relative' }}>
        <input
          id={`auth-${name}`}
          className="pp-input"
          name={name}
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required
          style={isPassword ? { paddingRight: 44 } : undefined}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            style={{
              position: 'absolute',
              right: 6,
              top: '50%',
              transform: 'translateY(-50%)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 34,
              height: 34,
              border: 0,
              background: 'none',
              color: 'var(--color-gray-500)',
              cursor: 'pointer',
            }}
          >
            {showPassword ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19M14.12 14.12a3 3 0 1 1-4.24-4.24" />
                <path d="m1 1 22 22" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </button>
        )}
      </div>
    </div>
  )
}

export function AuthError({ message }: { message: string }) {
  return (
    <div
      role="alert"
      className="pp-body"
      style={{
        padding: '10px 14px',
        borderRadius: 'var(--r-control)',
        border: 'var(--bw) solid var(--color-error-200)',
        background: 'var(--color-error-50)',
        color: 'var(--color-error-700)',
      }}
    >
      {message}
    </div>
  )
}

export function OrDivider() {
  return (
    <div className="pp-flex" style={{ alignItems: 'center', gap: 'var(--sp-4)' }}>
      <hr className="pp-rule" style={{ flex: 1 }} />
      <span className="pp-label">or</span>
      <hr className="pp-rule" style={{ flex: 1 }} />
    </div>
  )
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M23.5 12.27c0-.85-.08-1.66-.22-2.45H12v4.64h6.45a5.52 5.52 0 0 1-2.4 3.62v3h3.87c2.27-2.09 3.58-5.17 3.58-8.81Z" />
      <path fill="#34A853" d="M12 24c3.24 0 5.96-1.07 7.94-2.91l-3.87-3c-1.08.72-2.45 1.15-4.07 1.15-3.13 0-5.78-2.11-6.73-4.96H1.29v3.1A12 12 0 0 0 12 24Z" />
      <path fill="#FBBC05" d="M5.27 14.28A7.2 7.2 0 0 1 4.9 12c0-.79.14-1.56.37-2.28v-3.1H1.29a12 12 0 0 0 0 10.76l3.98-3.1Z" />
      <path fill="#EA4335" d="M12 4.77c1.76 0 3.34.6 4.59 1.8l3.44-3.44A11.98 11.98 0 0 0 12 0 12 12 0 0 0 1.29 6.62l3.98 3.1C6.22 6.88 8.87 4.77 12 4.77Z" />
    </svg>
  )
}

function GitHubIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.55v-2.15c-3.2.7-3.87-1.36-3.87-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.75 2.69 1.25 3.34.95.1-.74.4-1.25.73-1.53-2.55-.29-5.23-1.28-5.23-5.68 0-1.26.45-2.28 1.18-3.09-.12-.29-.51-1.46.11-3.05 0 0 .96-.31 3.15 1.18a10.9 10.9 0 0 1 5.74 0c2.19-1.49 3.15-1.18 3.15-1.18.62 1.59.23 2.76.11 3.05.74.81 1.18 1.83 1.18 3.09 0 4.42-2.69 5.39-5.25 5.67.41.36.78 1.06.78 2.14v3.17c0 .3.2.66.8.55A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
    </svg>
  )
}

function AzureIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#f25022" d="M1 1h10v10H1z" />
      <path fill="#7fba00" d="M13 1h10v10H13z" />
      <path fill="#00a4ef" d="M1 13h10v10H1z" />
      <path fill="#ffb900" d="M13 13h10v10H13z" />
    </svg>
  )
}

const PROVIDER_ICONS = {
  google: GoogleIcon,
  github: GitHubIcon,
  azure: AzureIcon,
} as const

export type OAuthProvider = keyof typeof PROVIDER_ICONS

export function OAuthButtons({
  verb,
  loadingProvider,
  onSelect,
}: {
  verb: string
  loadingProvider: string | null
  onSelect: (provider: OAuthProvider) => void
}) {
  const providers: { provider: OAuthProvider; label: string }[] = [
    { provider: 'google', label: `${verb} with Google` },
    { provider: 'github', label: `${verb} with GitHub` },
    { provider: 'azure', label: `${verb} with Microsoft` },
  ]

  return (
    <div className="pp-stack pp-gap-3">
      {providers.map(({ provider, label }) => {
        const Icon = PROVIDER_ICONS[provider]
        return (
          <button
            key={provider}
            type="button"
            className="pp-btn pp-btn--secondary pp-btn--block"
            onClick={() => onSelect(provider)}
            disabled={loadingProvider !== null}
          >
            <Icon />
            {loadingProvider === provider ? 'Redirecting…' : label}
          </button>
        )
      })}
    </div>
  )
}
