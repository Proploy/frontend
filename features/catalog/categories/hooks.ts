'use client'

// Category Hooks — React hooks for category tree and filters.

import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { clientCatalogApi } from '../shared/client-api'
import { createLatestRequestGuard } from '../shared/latest-request'
import type { NormalizedError } from '../shared/types'
import type { CategoryNode } from '../categories/types'
import type { CategoryFilter } from '../categories/types'
import { mapCategoryTreeToFilters, mapCategoryTreeToRoots } from '../categories/mappers'

// ── Types ────────────────────────────────────────────────────────────────────

interface UseCategoryTreeResult {
  tree: CategoryNode[]
  loading: boolean
  error: NormalizedError | null
  refetch: () => void
}

interface UseCategoryFiltersResult {
  filters: CategoryFilter[]
  loading: boolean
  error: NormalizedError | null
  refetch: () => void
}

// ── Hooks ────────────────────────────────────────────────────────────────────

/**
 * Fetches the full category tree (ui_category roots → product_category children).
 * Returns hierarchical tree for navigation/mega-menu.
 */
export function useCategoryTree(): UseCategoryTreeResult {
  const [tree, setTree] = useState<CategoryNode[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<NormalizedError | null>(null)
  const requestGuardRef = useRef(createLatestRequestGuard())

  const fetch_ = useCallback(async () => {
    const requestId = requestGuardRef.current.begin()
    await Promise.resolve()
    if (!requestGuardRef.current.isLatest(requestId)) return

    setLoading(true)
    setError(null)

    try {
      const result = await clientCatalogApi.categories.getTree()

      if (!requestGuardRef.current.isLatest(requestId)) return

      if (!result.ok) {
        setError(result)
        return
      }

      setTree(result.data.tree)
    } finally {
      if (requestGuardRef.current.isLatest(requestId)) {
        setLoading(false)
      }
    }
  }, [])

  useEffect(() => {
    const requestGuard = requestGuardRef.current
    let active = true
    void Promise.resolve().then(() => {
      if (active) fetch_()
    })
    return () => {
      active = false
      requestGuard.invalidate()
    }
  }, [fetch_])

  return { tree, loading, error, refetch: fetch_ }
}

/**
 * Fetches category tree and extracts flat product_category filters for product listing.
 * Used by product listing page for category filter tabs.
 */
export function useCategoryFilters(): UseCategoryFiltersResult {
  const [filters, setFilters] = useState<CategoryFilter[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<NormalizedError | null>(null)
  const requestGuardRef = useRef(createLatestRequestGuard())

  const fetch_ = useCallback(async () => {
    const requestId = requestGuardRef.current.begin()
    await Promise.resolve()
    if (!requestGuardRef.current.isLatest(requestId)) return

    setLoading(true)
    setError(null)

    try {
      const result = await clientCatalogApi.categories.getTree()

      if (!requestGuardRef.current.isLatest(requestId)) return

      if (!result.ok) {
        setError(result)
        return
      }

      const mapped = mapCategoryTreeToFilters(result.data.tree)
      setFilters(mapped)
    } finally {
      if (requestGuardRef.current.isLatest(requestId)) {
        setLoading(false)
      }
    }
  }, [])

  useEffect(() => {
    const requestGuard = requestGuardRef.current
    let active = true
    void Promise.resolve().then(() => {
      if (active) fetch_()
    })
    return () => {
      active = false
      requestGuard.invalidate()
    }
  }, [fetch_])

  return { filters, loading, error, refetch: fetch_ }
}

/**
 * Gets ui_category roots only (for top-level navigation tabs).
 */
export function useCategoryRoots(): UseCategoryTreeResult {
  const { tree, loading, error, refetch } = useCategoryTree()
  const roots = useMemo(() => mapCategoryTreeToRoots(tree), [tree])
  return { tree: roots, loading, error, refetch }
}
