import { createClient } from '@/lib/supabase/server'

import type { User } from '@supabase/supabase-js'

export type AuthUser = {
  id: string
  email: string | null
  role: string | null
  user: User | null
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    return null
  }

  return {
    id: user.id,
    email: user.email ?? null,
    role: typeof user.app_metadata?.role === 'string' ? user.app_metadata.role : null,
    user,
  }
}

export async function requireUser(): Promise<AuthUser> {
  const user = await getCurrentUser()

  if (!user) {
    throw new Error('Unauthorized')
  }

  return user
}

export function isAdminEmail(email: string | null) {
  if (!email) return false

  const adminEmails = (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean)

  return adminEmails.includes(email.toLowerCase())
}

export function hasAdminRole(role: string | null) {
  return ['admin', 'super_admin', 'owner'].includes((role || '').toLowerCase())
}
