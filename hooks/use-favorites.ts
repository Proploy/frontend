// use-favorites.ts
// Browser hook for /api/v1/favorites via Next proxy under /api/favorites.

/**
 * @deprecated
 *
 * The underlying proxy shim (`/api/favorites`) has been removed because it
 * forwards to `/api/v1/favorites`, a path the deployed service-apis does NOT
 * expose (returns 404). The correct path on the deployed service is
 * `/api/v1/users/favorites*`.
 *
 * Per project policy, the only Supabase use allowed is the auth session;
 * direct reads/writes to the Supabase `favorite` table are not a valid
 * workaround — service-apis is the source of truth for user data.
 *
 * Replacement: a new hook under `features/users/` that calls
 * `/api/v1/users/favorites` and `/api/v1/users/favorites/by-product/{id}`
 * (and the `by-id` variant) directly via `ServiceApisBrowserClient`. Until
 * that hook exists, favorites functionality on the frontend is offline.
 *
 * Do NOT reintroduce direct Supabase reads as a workaround.
 */
import { useCallback, useEffect, useState } from 'react'

export type FavoriteTargetType = 'expert' | 'product' | 'software'

export interface FavoriteRecord {
  id: string
  userId: string
  targetType: FavoriteTargetType
  targetId: string
  productId: string | null
  createdAt: string
}

interface UseFavoritesResult {
  favorites: FavoriteRecord[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
  add: (targetId: string, targetType?: FavoriteTargetType) => Promise<FavoriteRecord | null>
  removeByProduct: (productId: string) => Promise<boolean>
  removeById: (favoriteId: string) => Promise<boolean>
}

export function useFavorites(targetType?: FavoriteTargetType): UseFavoritesResult {
  const [favorites, setFavorites] = useState<FavoriteRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refetch = useCallback(async () => {
    setLoading(true)
    setError(null)
    const qs = targetType ? `?targetType=${encodeURIComponent(targetType)}` : ''
    const res = await fetch(`/api/favorites${qs}`, { credentials: 'include' })
    const json = await res.json().catch(() => null)
    if (!res.ok) {
      setError(json?.error?.message || 'Failed to load favorites')
      setFavorites([])
    } else {
      setFavorites(Array.isArray(json?.data) ? json.data : [])
    }
    setLoading(false)
  }, [targetType])

  useEffect(() => {
    refetch()
  }, [refetch])

  const add = useCallback(
    async (targetId: string, type: FavoriteTargetType = targetType ?? 'product') => {
      const res = await fetch('/api/favorites', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ targetId, targetType: type }),
      })
      const json = await res.json().catch(() => null)
      if (!res.ok) {
        setError(json?.error?.message || 'Failed to add favorite')
        return null
      }
      await refetch()
      return json?.data ?? null
    },
    [targetType, refetch],
  )

  const removeByProduct = useCallback(
    async (productId: string) => {
      const res = await fetch(`/api/favorites/${encodeURIComponent(productId)}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      if (!res.ok) {
        setError('Failed to remove favorite')
        return false
      }
      await refetch()
      return true
    },
    [refetch],
  )

  const removeById = useCallback(
    async (favoriteId: string) => {
      const res = await fetch(`/api/favorites/by-id/${encodeURIComponent(favoriteId)}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      if (!res.ok) {
        setError('Failed to remove favorite')
        return false
      }
      await refetch()
      return true
    },
    [refetch],
  )

  return { favorites, loading, error, refetch, add, removeByProduct, removeById }
}
