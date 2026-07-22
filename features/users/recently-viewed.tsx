'use client'

import { useCallback, useEffect, useState } from 'react'
import { useAuth } from '@/components/providers/auth-provider'
import { listRecentlyViewed, trackRecentlyViewed } from './client'
import { canUsePersonalization, type FavoriteTargetType, type RecentlyViewedRecord } from './types'

export function useRecentlyViewed() {
  const { user, isLoading: authLoading } = useAuth()
  const [items, setItems] = useState<RecentlyViewedRecord[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const refetch = useCallback(async () => {
    if (!user || !canUsePersonalization(user.role)) {
      setItems([])
      setLoading(false)
      return
    }
    setLoading(true)
    setError(null)
    const result = await listRecentlyViewed()
    if (result.ok) setItems(result.data)
    else setError(result.error.message)
    setLoading(false)
  }, [user])

  useEffect(() => {
    if (authLoading) return
    const timer = window.setTimeout(() => void refetch(), 0)
    return () => window.clearTimeout(timer)
  }, [authLoading, refetch])

  const track = useCallback(async (targetId: string, targetType: FavoriteTargetType = 'product') => {
    if (!user || !canUsePersonalization(user.role)) return
    const result = await trackRecentlyViewed({ targetId, targetType })
    if (result.ok) {
      setItems((current) => [
        result.data,
        ...current.filter((item) => item.id !== result.data.id && !(item.targetId === targetId && item.targetType === targetType)),
      ].slice(0, 50))
    }
  }, [user])

  return { items, loading, error, refetch, track }
}
