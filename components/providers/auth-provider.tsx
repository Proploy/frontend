'use client'

import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react'
import { createClient } from '@/lib/supabase/client'

const SERVICE_APIS_URL = process.env.NEXT_PUBLIC_SERVICE_APIS_URL

async function syncUserToServiceApis(accessToken: string) {
  if (!SERVICE_APIS_URL) return false

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
  const supabase = useMemo(() => createClient(), [])

  useEffect(() => {
    const getUser = async () => {
      // Step 1: getUser() validates with Supabase Auth server, auto-refreshes
      // the access token if the refresh token is still valid
      const { data: { user }, error: userError } = await supabase.auth.getUser()

      if (userError || !user) {
        setUser(null)
        setIsLoading(false)
        return
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

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const u = {
          id: session.user.id,
          email: session.user.email,
          name: session.user.user_metadata?.full_name as string || session.user.user_metadata?.name as string,
          image: session.user.user_metadata?.avatar_url as string,
        }
        setUser(u)
      } else {
        setUser(null)
      }
      setIsLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (!error && data.session?.access_token) {
      await syncUserToServiceApis(data.session.access_token)
    }
    return { error: error as Error | null }
  }

  const signUp = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })
    if (!error && data.session?.access_token) {
      await syncUserToServiceApis(data.session.access_token)
    }
    return { error: error as Error | null }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
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
    <AuthContext.Provider value={{ user, isLoading, signIn, signUp, signOut, signInWithOAuth }}>
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
