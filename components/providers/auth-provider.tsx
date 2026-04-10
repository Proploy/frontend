'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { createClient } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'

type AuthUser = {
  id: string
  email?: string
  name?: string
  image?: string
}

type Expert = {
  id: string
  status: string
  displayName: string
  headline: string
  entityType: string
  regionCountry: string
  regionCity: string
  timezone: string
  yearsExperience: number
  projectsCompletedTotal: number
  introVideoLink: string
  availabilityHoursPerWeek: number
  availabilityNotes: string
  whyPlatform: string
  uniqueStrength: string
  idealClients: string
  biggestWin: string
  primaryPlatforms: string[]
  secondaryPlatforms: string[]
  industryExpertise: string[]
  preferredProjectTypes: string[]
  toolsStack: string[]
  tags: { tagType: string; tagValue: string }[]
  links: { linkType: string; url: string }[]
  projects: { title: string; summary: string; link: string; outcomes: string }[]
}

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
  const supabase = createClient()

  const fetchExpert = async (userId: string) => {
    try {
      const res = await fetch('/api/experts/me')
      if (res.ok) {
        const json = await res.json()
        if (json.data) {
          setExpert(json.data)
        }
      }
    } catch {
      // expert fetch is best-effort
    }
  }

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        const u = {
          id: session.user.id,
          email: session.user.email,
          name: session.user.user_metadata?.full_name as string || session.user.user_metadata?.name as string,
          image: session.user.user_metadata?.avatar_url as string,
        }
        setUser(u)
        await fetchExpert(u.id)
      } else {
        setUser(null)
        setExpert(null)
      }
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
        await fetchExpert(u.id)
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