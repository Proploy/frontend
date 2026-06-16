'use client'

// Search Hooks — React hooks for keyword and hybrid search.

import { useState, useEffect, useCallback, useRef } from 'react'
import { clientCatalogApi } from '../shared/client-api'
import { createLatestRequestGuard } from '../shared/latest-request'
import type { NormalizedError } from '../shared/types'
import type { CatalogSearchRequest } from '../search/types'
import type { CardProduct, ProductListResult } from '../products/types'
import {
  mapKeywordSearchResponseToResults,
  mapCatalogSearchResponseToResults,
} from '../search/mappers'

// ── Types ────────────────────────────────────────────────────────────────────

interface UseKeywordSearchResult {
  products: CardProduct[]
  loading: boolean
  error: NormalizedError | null
  search: (query: string, limit?: number) => Promise<void>
  clear: () => void
}

type UseCatalogSearchOptions = CatalogSearchRequest

interface UseCatalogSearchResult {
  products: CardProduct[]
  pagination: ProductListResult['pagination'] | null
  loading: boolean
  error: NormalizedError | null
  refetch: () => void
}

// ── Hooks ────────────────────────────────────────────────────────────────────

/**
 * Keyword search for typeahead/autocomplete.
 * Backend: POST /api/v1/catalog/search/keyword
 * Returns lightweight results with product_id, name, slug, vendor, category, logo.
 */
export function useKeywordSearch(): UseKeywordSearchResult {
  const [products, setProducts] = useState<CardProduct[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<NormalizedError | null>(null)
  const requestGuardRef = useRef(createLatestRequestGuard())
  const debounceRef = useRef<{
    timer: ReturnType<typeof setTimeout>
    resolve: () => void
  } | null>(null)

  const cancelDebounce = useCallback(() => {
    if (!debounceRef.current) return

    clearTimeout(debounceRef.current.timer)
    debounceRef.current.resolve()
    debounceRef.current = null
  }, [])

  const search = useCallback(async (query: string, limit = 20) => {
    cancelDebounce()
    const requestId = requestGuardRef.current.begin()

    let debounce: {
      timer: ReturnType<typeof setTimeout>
      resolve: () => void
    } | null = null

    await new Promise<void>((resolve) => {
      debounce = {
        timer: setTimeout(resolve, 250),
        resolve,
      }
      debounceRef.current = debounce
    })
    if (debounceRef.current === debounce) debounceRef.current = null

    if (!requestGuardRef.current.isLatest(requestId)) return

    if (!query.trim()) {
      setProducts([])
      setLoading(false)
      setError(null)
      return
    }

    setLoading(true)
    setError(null)

    const result = await clientCatalogApi.search.keyword(query, limit)

    if (!requestGuardRef.current.isLatest(requestId)) return

    if (!result.ok) {
      setError(result)
      setProducts([])
      setLoading(false)
      return
    }

    const mapped = mapKeywordSearchResponseToResults(result.data, limit, 0)
    setProducts(mapped.products)
    setLoading(false)
  }, [cancelDebounce])

  const clear = useCallback(() => {
    cancelDebounce()
    requestGuardRef.current.invalidate()
    setProducts([])
    setLoading(false)
    setError(null)
  }, [cancelDebounce])

  useEffect(() => {
    const requestGuard = requestGuardRef.current
    return () => {
      cancelDebounce()
      requestGuard.invalidate()
    }
  }, [cancelDebounce])

  return { products, loading, error, search, clear }
}

/**
 * Full hybrid search with filters, pagination, and facets.
 * Backend: POST /api/v1/catalog/search/hybrid
 */
export function useCatalogSearch(options: UseCatalogSearchOptions = {}): UseCatalogSearchResult {
  const [products, setProducts] = useState<CardProduct[]>([])
  const [pagination, setPagination] = useState<ProductListResult['pagination'] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<NormalizedError | null>(null)
  const requestGuardRef = useRef(createLatestRequestGuard())
  const requestKey = JSON.stringify(options)

  const fetch_ = useCallback(async () => {
    const requestId = requestGuardRef.current.begin()
    await Promise.resolve()
    if (!requestGuardRef.current.isLatest(requestId)) return

    setLoading(true)
    setError(null)

    const request = JSON.parse(requestKey) as UseCatalogSearchOptions
    const { limit = 20, offset = 0, ...filters } = request

    const result = await clientCatalogApi.search.hybrid({
      ...filters,
      limit,
      offset,
    })

    if (!requestGuardRef.current.isLatest(requestId)) return

    if (!result.ok) {
      setError(result)
      setLoading(false)
      return
    }

    const mapped = mapCatalogSearchResponseToResults(result.data, limit, offset)
    setProducts(mapped.products)
    setPagination(mapped.pagination)
    setLoading(false)
  }, [requestKey])

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

  return { products, pagination, loading, error, refetch: fetch_ }
}
