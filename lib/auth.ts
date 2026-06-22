import { createClient, createAdminClient } from './supabase/server'

/**
 * NOTE — Supabase policy
 *
 * The ONLY allowed use of Supabase in this codebase is the **auth session**
 * (sign-in, sign-up, OAuth, access/refresh tokens). `createClient` /
 * `createAdminClient` are reserved for that purpose.
 *
 * Direct reads/writes to the Supabase application tables (`user`, `expert`,
 * `favorite`, `recently_viewed`, `product`, etc.) are NOT allowed —
 * service-apis is the source of truth for all data. Functions below that
 * query application tables are marked `@deprecated` and must be replaced
 * by service-apis-backed equivalents.
 */

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

/**
 * @deprecated
 *
 * Reads the Supabase `user` and `expert` tables directly via the admin
 * client. Per project policy, the only allowed Supabase use is the auth
 * session — service-apis is the source of truth for user and expert data.
 *
 * Replacement: a service-apis-backed equivalent that reads from
 * `/api/v1/users/me` and `/api/v1/experts/me/dashboard`. Until those
 * endpoints exist, callers should fall back to `useExpertDashboard` on the
 * client and `getUser()` (auth session only) on the server.
 */
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

/**
 * @deprecated
 *
 * Reads the Supabase `expert` table directly via the admin client. Per
 * project policy, the only allowed Supabase use is the auth session —
 * service-apis is the source of truth for expert data.
 *
 * Replacement: `useExpertDashboard().getDashboard()` on the client
 * (`/api/v1/experts/me/dashboard`), or a service-apis-backed server
 * equivalent. Do NOT call this from new code.
 */
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

/**
 * @deprecated See {@link getExpert}. Replacement: service-apis call.
 */
export async function requireExpert() {
  const expert = await getExpert()
  if (!expert) {
    throw new Error('EXPERT_PROFILE_NOT_FOUND')
  }
  return expert
}

/**
 * @deprecated See {@link getExpert}. Replacement: service-apis call.
 */
export async function requireApprovedExpert() {
  const expert = await requireExpert()
  if (expert.status !== 'approved') {
    throw new Error('EXPERT_NOT_APPROVED')
  }
  return expert
}

/**
 * @deprecated
 *
 * Upserts the Supabase `user` table from Supabase auth metadata. Per project
 * policy, the only allowed Supabase use is the auth session — the `user`
 * table is not a valid source of truth.
 *
 * Replacement: rely on the existing `/api/v1/auth/sync` flow (called from
 * `components/providers/auth-provider.tsx` and `app/auth/callback/route.ts`
 * via `syncUserToServiceApis`). Service-apis owns the user record. This
 * function should be removed once the sync flow is confirmed to populate
 * the user record end-to-end.
 */
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
