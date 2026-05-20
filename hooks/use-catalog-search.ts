// use-catalog-search.ts
// SearchBar typeahead hook — simple ILIKE text search on product_name.
// Calls GET /catalog/products?search={query}&limit=5. No auto-retry.
// retryAfter exposed on error for UI to handle.

import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { ServiceApisBrowserClient } from '@/lib/service-apis/browser'
import { type NormalizedError } from '@/lib/service-apis/error-utils'
import { mapProductSummaryToCardProduct } from './mappers/catalog-mappers'
import type { CardProduct } from './types/catalog-view-models'
import type { ProductListResponse } from './types/catalog-contracts'

interface UseCatalogSearchOptions {
  query: string
}

interface UseCatalogSearchResult {
  products: CardProduct[]
  loading: boolean
  error: NormalizedError | null
  refetch: () => void
}

const SEARCH_LIMIT = 5

/**
 * Fetches product suggestions for SearchBar typeahead.
 * Simple text search via GET /catalog/products?search={query}&limit=5.
 * No auto-retry — retryAfter is exposed on error for the UI to handle.
 */
export function useCatalogSearch(options: UseCatalogSearchOptions): UseCatalogSearchResult {
  const { query } = options

  const [products, setProducts] = useState<CardProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<NormalizedError | null>(null)

  // Memoized client — one instance per component lifecycle
  const client = useMemo(() => new ServiceApisBrowserClient(), [])

  // Guard against stale state updates after unmount or param change
  const mountedRef = useRef(true)

  const fetch_ = useCallback(async () => {
    mountedRef.current = true
    setLoading(true)
    setError(null)

    const params = new URLSearchParams()
    params.set('search', query)
    params.set('limit', String(SEARCH_LIMIT))

    const result = await client.get<ProductListResponse>(`/catalog/products?${params.toString()}`)

    if (!mountedRef.current) return

    if (!result.ok) {
      setError(result)
      setLoading(false)
      return
    }

    const mapped = result.data.results.map(mapProductSummaryToCardProduct)
    setProducts(mapped)
    setLoading(false)
  }, [query]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    mountedRef.current = true
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetch_()
    return () => {
      mountedRef.current = false
    }
  }, [fetch_])

  return { products, loading, error, refetch: fetch_ }
}