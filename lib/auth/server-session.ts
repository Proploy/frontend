import { serviceApisFetch } from '@/lib/service-apis/server'

export type AuthUserPayload = {
  id: string
  email?: string
  name?: string
  image?: string
  role?: string | null
}

export type AuthSyncProfile = {
  role: string | null
}

type SupabaseUserLike = {
  id: string
  email?: string
  user_metadata?: Record<string, unknown>
}

export function authUserPayload(user: SupabaseUserLike, role: string | null = null): AuthUserPayload {
  const metadata = user.user_metadata ?? {}
  const fullName = metadata.full_name
  const name = metadata.name
  const avatarUrl = metadata.avatar_url

  return {
    id: user.id,
    email: user.email,
    name: typeof fullName === 'string' ? fullName : typeof name === 'string' ? name : undefined,
    image: typeof avatarUrl === 'string' ? avatarUrl : undefined,
    role,
  }
}

export async function syncSessionToServiceApis(accessToken?: string | null): Promise<AuthSyncProfile | null> {
  if (!accessToken) return null

  try {
    const response = await serviceApisFetch('/api/v1/auth/sync', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      requireAuth: true,
      accessToken,
    })

    if (!response.ok) return null

    const payload: unknown = await response.json().catch(() => null)
    if (!payload || typeof payload !== 'object') return null

    const role = (payload as { role?: unknown }).role
    return { role: typeof role === 'string' ? role : null }
  } catch {
    return null
  }
}
