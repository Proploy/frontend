'use client'

import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { ExpertMe } from '@/hooks/types/expert-contracts'

const SERVICE_APIS_URL = (process.env.NEXT_PUBLIC_SERVICE_APIS_URL || '').replace(/\/$/, '')
if (!SERVICE_APIS_URL) {
  console.warn('[AuthProvider] NEXT_PUBLIC_SERVICE_APIS_URL is not set.')
}

async function syncUserToServiceApis(accessToken: string) {
  try {
    const res = await fetch(`${SERVICE_APIS_URL}/api/v1/auth/sync`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    })
    return res.ok
  } catch {
    return false
  }
}

type AuthUser = {
  id: string
  email?: string
  name?: string
  image?: string
}

type Expert = ExpertMe

type AuthContextType = {
  user: AuthUser | null
  expert: Expert | null
  isLoading: boolean
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>
  signOut: () => Promise<void>
  signInWithOAuth: (provider: 'google' | 'github' | 'azure' | 'linkedin', redirectTo?: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [expert, setExpert] = useState<Expert | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const supabase = useMemo(() => createClient(), [])

  useEffect(() => {
    const getUser = async () => {
      // Step 1: getUser() validates with Supabase Auth server, auto-refreshes
      // the access token if the refresh token is still valid
      const { data: { user }, error: userError } = await supabase.auth.getUser()

      if (userError || !user) {
        setUser(null)
        setExpert(null)
        setIsLoading(false)
        return
      }

      // Step 2: getSession() now returns the FRESH token (post-refresh)
      const { data: { session } } = await supabase.auth.getSession()

      // Step 3: Ensure user exists in service-apis DB. Must await to prevent
      // race condition where subsequent API calls 401 because sync hasn't completed.
      if (session?.access_token) {
        await syncUserToServiceApis(session.access_token)
      } else {
        setExpert(null)
      }

      const u = {
        id: user.id,
        email: user.email,
        name: user.user_metadata?.full_name as string || user.user_metadata?.name as string,
        image: user.user_metadata?.avatar_url as string,
      }
      setUser(u)
      setIsLoading(false)
    }

    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, authSession) => {
      if (authSession?.user) {
        // Sync user to service-apis on auth state change. Await to prevent
        // race condition on first OAuth login where API calls fail before sync completes.
        if (authSession.access_token) {
          await syncUserToServiceApis(authSession.access_token)
        }
        const u = {
          id: authSession.user.id,
          email: authSession.user.email,
          name: authSession.user.user_metadata?.full_name as string || authSession.user.user_metadata?.name as string,
          image: authSession.user.user_metadata?.avatar_url as string,
        }
        setUser(u)
        setExpert(null)
      } else {
        setUser(null)
        setExpert(null)
      }
      setIsLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { error: error as Error | null }
  }

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    })
    return { error: error as Error | null }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setExpert(null)
  }

  const signInWithOAuth = async (provider: 'google' | 'github' | 'azure' | 'linkedin', redirectTo?: string) => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(redirectTo || '/')}`,
      },
    })
    if (error) {
      console.error('OAuth error:', error)
    }
  }

  return (
    <AuthContext.Provider value={{ user, expert, isLoading, signIn, signUp, signOut, signInWithOAuth }}>
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
