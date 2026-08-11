'use client'

import type { AuthUserPayload } from './server-session'

export type AuthUser = AuthUserPayload

type AuthResult = {
  user: AuthUser | null
  error: Error | null
}

type OAuthProvider = 'google' | 'github' | 'azure' | 'linkedin'

async function readJson(response: Response): Promise<unknown> {
  return await response.json().catch(() => null)
}

function errorFromPayload(payload: unknown, fallback: string): Error {
  if (payload && typeof payload === 'object') {
    const message = (payload as { error?: unknown }).error
    if (typeof message === 'string' && message) return new Error(message)
  }
  return new Error(fallback)
}

export async function fetchAuthSession(): Promise<AuthUser | null> {
  const response = await fetch('/api/auth/session', {
    cache: 'no-store',
    credentials: 'same-origin',
  })
  if (!response.ok) return null

  const payload = await readJson(response)
  if (!payload || typeof payload !== 'object') return null

  const user = (payload as { user?: unknown }).user
  return user && typeof user === 'object' ? (user as AuthUser) : null
}

export async function signInWithPassword(email: string, password: string): Promise<AuthResult> {
  const response = await fetch('/api/auth/sign-in', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ email, password }),
    cache: 'no-store',
    credentials: 'same-origin',
  })
  const payload = await readJson(response)
  if (!response.ok) return { user: null, error: errorFromPayload(payload, 'Unable to sign in') }

  const user = payload && typeof payload === 'object' ? (payload as { user?: unknown }).user : null
  return { user: user && typeof user === 'object' ? (user as AuthUser) : null, error: null }
}

export async function signUpWithPassword(
  name: string,
  email: string,
  password: string,
): Promise<AuthResult> {
  const response = await fetch('/api/auth/sign-up', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
    cache: 'no-store',
    credentials: 'same-origin',
  })
  const payload = await readJson(response)
  if (!response.ok) return { user: null, error: errorFromPayload(payload, 'Unable to create account') }

  const user = payload && typeof payload === 'object' ? (payload as { user?: unknown }).user : null
  return { user: user && typeof user === 'object' ? (user as AuthUser) : null, error: null }
}

export async function startOAuthSignIn({
  provider,
  redirectTo,
  rememberMe,
}: {
  provider: OAuthProvider
  redirectTo?: string
  rememberMe?: boolean
}): Promise<{ url: string | null; error: Error | null }> {
  const response = await fetch('/api/auth/oauth', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ provider, redirectTo, rememberMe }),
    cache: 'no-store',
    credentials: 'same-origin',
  })
  const payload = await readJson(response)
  if (!response.ok) return { url: null, error: errorFromPayload(payload, `Unable to continue with ${provider}`) }

  const url = payload && typeof payload === 'object' ? (payload as { url?: unknown }).url : null
  return { url: typeof url === 'string' ? url : null, error: null }
}

export async function signOutSession(): Promise<void> {
  await fetch('/api/auth/sign-out', {
    method: 'POST',
    cache: 'no-store',
    credentials: 'same-origin',
  })
}

export async function verifyEmail(
  email: string,
  code: string,
): Promise<AuthResult> {
  const response = await fetch('/api/auth/verify-email', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ email, code }),
    cache: 'no-store',
    credentials: 'same-origin',
  })
  const payload = await readJson(response)
  if (!response.ok) return { user: null, error: errorFromPayload(payload, 'Unable to verify email') }

  const user = payload && typeof payload === 'object' ? (payload as { user?: unknown }).user : null
  return { user: user && typeof user === 'object' ? (user as AuthUser) : null, error: null }
}

export async function resendVerification(
  email: string,
): Promise<{ error: Error | null }> {
  const response = await fetch('/api/auth/resend-verification', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ email }),
    cache: 'no-store',
    credentials: 'same-origin',
  })
  const payload = await readJson(response)
  if (!response.ok) return { error: errorFromPayload(payload, 'Unable to resend verification email') }
  return { error: null }
}
