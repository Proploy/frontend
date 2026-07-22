'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { useAuth } from '@/components/providers/auth-provider'
import { addFavorite, listFavorites, removeFavorite } from './client'
import { canUsePersonalization, type FavoriteRecord, type FavoriteTargetType } from './types'

type FavoritesContextValue = {
  favorites: FavoriteRecord[]
  loading: boolean
  pendingIds: Set<string>
  isFavorite: (targetId: string, targetType?: FavoriteTargetType) => boolean
  toggleFavorite: (targetId: string, targetType?: FavoriteTargetType) => Promise<boolean>
  removeFavoriteById: (favoriteId: string) => Promise<boolean>
  refreshFavorites: () => Promise<void>
}

const FavoritesContext = createContext<FavoritesContextValue | undefined>(undefined)

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const { user, isLoading: authLoading } = useAuth()
  const [favorites, setFavorites] = useState<FavoriteRecord[]>([])
  const [loading, setLoading] = useState(false)
  const [pendingIds, setPendingIds] = useState<Set<string>>(new Set())
  const personalizationEnabled = canUsePersonalization(user?.role)

  const refreshFavorites = useCallback(async () => {
    if (!user || !personalizationEnabled) {
      setFavorites([])
      setLoading(false)
      return
    }
    setLoading(true)
    const result = await listFavorites()
    if (result.ok) setFavorites(result.data)
    setLoading(false)
  }, [personalizationEnabled, user])

  useEffect(() => {
    if (authLoading) return
    const timer = window.setTimeout(() => void refreshFavorites(), 0)
    return () => window.clearTimeout(timer)
  }, [authLoading, refreshFavorites])

  const isFavorite = useCallback((targetId: string, targetType: FavoriteTargetType = 'product') => {
    return favorites.some((favorite) => favorite.targetId === targetId && favorite.targetType === targetType)
  }, [favorites])

  const toggleFavorite = useCallback(async (
    targetId: string,
    targetType: FavoriteTargetType = 'product',
  ): Promise<boolean> => {
    if (!user) {
      window.location.href = `/sign-in?redirect=${encodeURIComponent(window.location.pathname)}`
      return false
    }
    if (!personalizationEnabled) return false
    if (pendingIds.has(targetId)) return false
    setPendingIds((current) => new Set(current).add(targetId))
    const existing = favorites.find((favorite) => favorite.targetId === targetId && favorite.targetType === targetType)
    const result = existing
      ? await removeFavorite(existing.id)
      : await addFavorite({ targetId, targetType })
    if (result.ok) {
      setFavorites((current) => existing
        ? current.filter((favorite) => favorite.id !== existing.id)
        : [...current, result.data as FavoriteRecord])
    }
    setPendingIds((current) => {
      const next = new Set(current)
      next.delete(targetId)
      return next
    })
    return result.ok
  }, [favorites, pendingIds, personalizationEnabled, user])

  const removeFavoriteById = useCallback(async (favoriteId: string): Promise<boolean> => {
    const result = await removeFavorite(favoriteId)
    if (result.ok) setFavorites((current) => current.filter((favorite) => favorite.id !== favoriteId))
    return result.ok
  }, [])

  const value = useMemo(() => ({
    favorites,
    loading,
    pendingIds,
    isFavorite,
    toggleFavorite,
    removeFavoriteById,
    refreshFavorites,
  }), [favorites, isFavorite, loading, pendingIds, refreshFavorites, removeFavoriteById, toggleFavorite])

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>
}

export function useFavorites() {
  const value = useContext(FavoritesContext)
  if (!value) throw new Error('useFavorites must be used within a FavoritesProvider')
  return value
}

export function useFavorite(targetId: string, targetType: FavoriteTargetType = 'product') {
  const { isFavorite, pendingIds, toggleFavorite } = useFavorites()
  return {
    isFavorite: isFavorite(targetId, targetType),
    isPending: pendingIds.has(targetId),
    toggle: () => toggleFavorite(targetId, targetType),
  }
}
