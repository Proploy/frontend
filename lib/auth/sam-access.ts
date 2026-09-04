import { serviceApisFetch } from '@/lib/service-apis/server'
import { isRestrictedFromSam } from './roles'

/**
 * Server-side "may this account use Sam?" check, backed by service-apis.
 *
 * This replaces a `getUserWithProfile()` call that read the Supabase `user`
 * and `expert` tables through the service-role admin client. That violated the
 * policy stated at the top of `lib/auth.ts` — Supabase is for the auth session
 * only, service-apis owns user and expert data — and it broke production
 * outright: `SUPABASE_SERVICE_ROLE_KEY` is not provisioned on Cloud Run, and
 * `createServerClient` throws on a missing key rather than degrading, so the
 * `/AI_workspace` server render threw on every request.
 *
 * Both reads are per-user, so `serviceApisFetch` marks them `no-store`
 * (see `catalogRevalidateSeconds` — only `/catalog/` paths are cacheable).
 */

/** A non-2xx or unreachable gateway yields null rather than throwing. */
async function readJson<T>(path: string): Promise<T | null> {
  try {
    const response = await serviceApisFetch(path, { requireAuth: true })
    if (!response.ok) return null
    return (await response.json()) as T
  } catch {
    return null
  }
}

export async function isCurrentUserRestrictedFromSam(): Promise<boolean> {
  const [profile, expert] = await Promise.all([
    // `role` — the account role. 401 when signed out; the route is already
    // behind the middleware session gate, so that should not happen here.
    readJson<{ role?: string | null }>('/api/v1/users/me'),
    // `status` — the expert application. 404 for a buyer with no expert
    // record, which reads as "no expert status" and is the common case.
    readJson<{ status?: string | null }>('/api/v1/experts/me/application'),
  ])

  // Fails open: if the gateway cannot be reached we render the workspace
  // rather than bouncing a buyer to the expert dashboard. Nothing is exposed
  // by doing so — every call the workspace then makes is authenticated and
  // authorised at the gateway.
  return isRestrictedFromSam(profile?.role, expert?.status)
}
