import { serviceApisBrowserFetch } from './browser'

export type AuthSyncProfile = {
  role: string | null
}

export async function syncUserToServiceApis(_accessToken: string): Promise<AuthSyncProfile | null> {
  try {
    const res = await serviceApisBrowserFetch('/api/v1/auth/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      requireAuth: true,
      accessToken: _accessToken,
    })

    if (!res.ok) {
      console.warn('[auth-sync] sync failed (non-blocking):', res.status)
      return null
    }

    const payload: unknown = await res.json().catch(() => null)
    if (!payload || typeof payload !== 'object') return null

    const role = (payload as { role?: unknown }).role
    return { role: typeof role === 'string' ? role : null }
  } catch {
    console.warn('[auth-sync] sync network error (non-blocking)')
    return null
  }
}
