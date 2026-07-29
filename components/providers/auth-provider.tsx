'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState, ReactNode } from 'react'
import {
  fetchAuthSession,
  signInWithPassword,
  signOutSession,
  signUpWithPassword,
  startOAuthSignIn,
  type AuthUser,
} from '@/lib/auth/browser-client'

type AuthContextType = {
  user: AuthUser | null
  isLoading: boolean
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>
  signOut: () => Promise<void>
  signInWithOAuth: (provider: 'google' | 'github' | 'azure' | 'linkedin', redirectTo?: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const refreshSession = useCallback(async () => {
    const nextUser = await fetchAuthSession()
    setUser(nextUser)
    setIsLoading(false)
  }, [])

  useEffect(() => {
    const timeouts = new Set<number>()

    const scheduleRefresh = () => {
      const timeoutId = window.setTimeout(() => {
        timeouts.delete(timeoutId)
        void refreshSession()
      }, 0)
      timeouts.add(timeoutId)
    }

    scheduleRefresh()

    const handleAuthChanged = () => {
      scheduleRefresh()
    }
    const handleFocus = () => {
      scheduleRefresh()
    }
    window.addEventListener('proploy-auth-changed', handleAuthChanged)
    window.addEventListener('focus', handleFocus)

    return () => {
      timeouts.forEach((timeoutId) => window.clearTimeout(timeoutId))
      window.removeEventListener('proploy-auth-changed', handleAuthChanged)
      window.removeEventListener('focus', handleFocus)
    }
  }, [refreshSession])

  const signIn = useCallback(async (email: string, password: string) => {
    const { user, error } = await signInWithPassword(email, password)
    if (!error) setUser(user)
    return { error }
  }, [])

  const signUp = useCallback(async (email: string, password: string) => {
    const { user, error } = await signUpWithPassword('', email, password)
    if (!error) setUser(user)
    return { error }
  }, [])

  const signOut = useCallback(async () => {
    await signOutSession()
    setUser(null)
  }, [])

  const signInWithOAuth = useCallback(async (
    provider: 'google' | 'github' | 'azure' | 'linkedin',
    redirectTo?: string,
  ) => {
    const { url, error } = await startOAuthSignIn({ provider, redirectTo })
    if (error) {
      console.error('OAuth error:', error)
      return
    }
    if (url) {
      window.location.assign(url)
    }
  }, [])

  const value = useMemo(
    () => ({ user, isLoading, signIn, signUp, signOut, signInWithOAuth }),
    [user, isLoading, signIn, signUp, signOut, signInWithOAuth],
  )

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
