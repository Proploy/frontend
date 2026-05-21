// use-recently-viewed.ts
// Browser hook for /api/v1/recently-viewed via Next proxy.

import { useCallback, useEffect, useState } from 'react'
import type { FavoriteTargetType } from './use-favorites'

export interface RecentlyViewedRecord {
  id: string
  userId: string
  targetType: FavoriteTargetType
  targetId: string
  productId: string | null
  viewedAt?: string
  createdAt?: string
}

interface UseRecentlyViewedResult {
  items: RecentlyViewedRecord[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
  track: (targetId: string, targetType?: FavoriteTargetType) => Promise<void>
}

export function useRecentlyViewed(): UseRecentlyViewedResult {
  const [items, setItems] = useState<RecentlyViewedRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refetch = useCallback(async () => {
    setLoading(true)
    setError(null)
    const res = await fetch('/api/recently-viewed', { credentials: 'include' })
    const json = await res.json().catch(() => null)
    if (!res.ok) {
      setError(json?.error?.message || 'Failed to load recently viewed')
      setItems([])
    } else {
      setItems(Array.isArray(json?.data) ? json.data : [])
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    refetch()
  }, [refetch])

  const track = useCallback(
    async (targetId: string, targetType: FavoriteTargetType = 'product') => {
      await fetch('/api/recently-viewed', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ targetId, targetType }),
      })
    },
    [],
  )

  return { items, loading, error, refetch, track }
}
