import { createClient } from './supabase/server'

/**
 * NOTE — Supabase policy
 *
 * The ONLY allowed use of Supabase in this codebase is the **auth session**
 * (sign-in, sign-up, OAuth, access/refresh tokens). `createClient` is
 * reserved for that purpose.
 *
 * Direct reads/writes to the Supabase application tables (`user`, `expert`,
 * `favorite`, `recently_viewed`, `product`, etc.) are NOT allowed —
 * service-apis is the source of truth for all data.
 *
 * The helpers that used to break that rule through the service-role admin
 * client (`getUserWithProfile`, `getUserRole`, `getExpert`, `requireExpert`,
 * `requireApprovedExpert`, `createOrGetUser`) have been removed. Only
 * `getUserWithProfile` had a caller — the `/AI_workspace` route guard, now
 * served by `lib/auth/sam-access.ts` over service-apis. The rest were already
 * dead. Their documented replacements:
 *
 *  - account role / expert status → `/api/v1/users/me`,
 *    `/api/v1/experts/me/application` (see `lib/auth/sam-access.ts`)
 *  - expert dashboard data        → `useExpertDashboard()`
 *    (`/api/v1/experts/me/dashboard`)
 *  - user record creation         → the existing `/api/v1/auth/sync` flow in
 *    `components/providers/auth-provider.tsx` and `app/auth/callback/route.ts`
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

export async function getUserSession() {
  const supabase = await createClient()
  // getUser() validates with server (auto-refreshes if needed) before getSession()
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) return null
  const { data: { session } } = await supabase.auth.getSession()
  return session
}
