import { createClient, createAdminClient } from './supabase/server'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

const ADMIN_EMAILS = process.env.ADMIN_EMAILS || ''

export async function getUser() {
  try {
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error || !user) return null
    return user
  } catch {
    return null
  }
}

export async function requireUser() {
  const user = await getUser()
  if (!user) {
    throw new Error('UNAUTHORIZED')
  }
  return user
}

export async function isAdmin() {
  try {
    const user = await getUser()
    if (!user || !user.email) return false
    const adminList = ADMIN_EMAILS.split(',').map(e => e.trim().toLowerCase())
    return adminList.includes(user.email.toLowerCase())
  } catch {
    return false
  }
}

export async function verifyAdmin() {
  const admin = await isAdmin()
  if (!admin) {
    throw new Error('UNAUTHORIZED: Admin access required')
  }
}

export async function getUserWithProfile() {
  const user = await getUser()
  if (!user) return null

  const supabase = createAdminClient()
  
  const { data: userProfile } = await supabase
    .from('user')
    .select('*, expert(*, tags(*), links(*), projects(*))')
    .eq('supabaseUserId', user.id)
    .single()

  return userProfile
}

export async function getUserSession() {
  const supabase = await createClient()
  // getUser() validates with server (auto-refreshes if needed) before getSession()
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) return null
  const { data: { session } } = await supabase.auth.getSession()
  return session
}

export async function getExpert() {
  const user = await getUser()
  if (!user) return null

  const supabase = createAdminClient()
  
  const { data: expert } = await supabase
    .from('expert')
    .select('*, tags(*), links(*), projects(*), reviews(*)')
    .eq('supabaseUserId', user.id)
    .single()

  return expert
}

export async function requireExpert() {
  const expert = await getExpert()
  if (!expert) {
    throw new Error('EXPERT_PROFILE_NOT_FOUND')
  }
  return expert
}

export async function requireApprovedExpert() {
  const expert = await requireExpert()
  if (expert.status !== 'approved') {
    throw new Error('EXPERT_NOT_APPROVED')
  }
  return expert
}

// Returns the user's account role ('user' | 'expert' | 'business' | 'admin')
// from the `user` table, or null when unauthenticated. Used to route the
// generic /dashboard entry point to the right workspace.
export async function getUserRole(): Promise<string | null> {
  const profile = await getUserWithProfile()
  if (!profile) return null
  // A linked expert record always implies the expert workspace, even if the
  // base role hasn't been migrated yet.
  if (profile.expert) return 'expert'
  return (profile.role as string | undefined) ?? 'user'
}

export async function requireBusiness() {
  const role = await getUserRole()
  if (role !== 'business') {
    throw new Error('BUSINESS_ACCOUNT_REQUIRED')
  }
  return role
}

export async function createOrGetUser(user: { id: string; email?: string; user_metadata?: Record<string, unknown> }) {
  const supabase = createAdminClient()
  
  const { data: existingUser } = await supabase
    .from('user')
    .select('*')
    .eq('supabaseUserId', user.id)
    .single()

  if (existingUser) {
    return existingUser
  }

  const now = new Date().toISOString()
  const userId = generateId()
  
  const { data: newUser, error } = await supabase
    .from('user')
    .insert({
      supabaseUserId: user.id,
      email: user.email || '',
      name: (user.user_metadata?.full_name as string) || (user.user_metadata?.name as string) || null,
      avatarUrl: (user.user_metadata?.avatar_url as string) || null,
      createdAt: now,
      updatedAt: now,
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating user:', error)
    throw new Error('Failed to create user')
  }

  return newUser
}

function generateId(): string {
  return 'xxxxxxxxxxxx'.replace(/x/g, () => 
    Math.floor(Math.random() * 36).toString(36)
  ) + Date.now().toString(36)
}