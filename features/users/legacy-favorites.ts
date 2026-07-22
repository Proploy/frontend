'use client'

import { useCallback, useEffect, useState } from 'react'
import { useAuth } from '@/components/providers/auth-provider'
import { addFavorite, listFavorites, removeFavorite } from './client'
import { canUsePersonalization, type FavoriteRecord, type FavoriteTargetType } from './types'

export type LegacyFavoriteRecord = FavoriteRecord & {
  productId: string | null
}

type LegacyFavoritesResult = {
  favorites: LegacyFavoriteRecord[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
  add: (targetId: string, targetType?: FavoriteTargetType) => Promise<LegacyFavoriteRecord | null>
  removeByProduct: (productId: string) => Promise<boolean>
  removeById: (favoriteId: string) => Promise<boolean>
}

export function useLegacyFavorites(targetType?: FavoriteTargetType): LegacyFavoritesResult {
  const { user, isLoading: authLoading } = useAuth()
  const [favorites, setFavorites] = useState<LegacyFavoriteRecord[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const refetch = useCallback(async () => {
    if (!user || !canUsePersonalization(user.role)) {
      setFavorites([])
      setLoading(false)
      return
    }
    setLoading(true)
    setError(null)
    const result = await listFavorites(targetType)
    if (result.ok) {
      setFavorites(result.data as LegacyFavoriteRecord[])
    } else {
      setFavorites([])
      setError(result.error.message)
    }
    setLoading(false)
  }, [targetType, user])

  useEffect(() => {
    if (authLoading) return
    const timer = window.setTimeout(() => void refetch(), 0)
    return () => window.clearTimeout(timer)
  }, [authLoading, refetch])

  const add = useCallback(async (targetId: string, type = targetType ?? 'product') => {
    if (!user || !canUsePersonalization(user.role)) return null
    const result = await addFavorite({ targetId, targetType: type })
    if (!result.ok) {
      setError(result.error.message)
      return null
    }
    const favorite = result.data as LegacyFavoriteRecord
    setFavorites((current) => [...current.filter((item) => item.id !== favorite.id), favorite])
    return favorite
  }, [targetType, user])

  const removeById = useCallback(async (favoriteId: string) => {
    const result = await removeFavorite(favoriteId)
    if (!result.ok) {
      setError(result.error.message)
      return false
    }
    setFavorites((current) => current.filter((favorite) => favorite.id !== favoriteId))
    return true
  }, [])

  const removeByProduct = useCallback(async (productId: string) => {
    const favorite = favorites.find((item) => item.targetId === productId && item.targetType === 'product')
    return favorite ? removeById(favorite.id) : false
  }, [favorites, removeById])

  return { favorites, loading, error, refetch, add, removeByProduct, removeById }
}
