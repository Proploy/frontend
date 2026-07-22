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
import { isUnpublishedValue } from '../products/published-values'

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

interface UseCatalogProductMatchesResult {
  products: CardProduct[]
  loading: boolean
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

/**
 * Resolves a small set of human-entered platform names to canonical catalog products.
 * Useful for expert profiles, where platform expertise is stored as labels rather than product IDs.
 */
export function useCatalogProductMatches(queries: string[]): UseCatalogProductMatchesResult {
  const [products, setProducts] = useState<CardProduct[]>([])
  const [loading, setLoading] = useState(false)
  const requestGuardRef = useRef(createLatestRequestGuard())
  const queryKey = JSON.stringify(
    Array.from(new Set(queries.map((query) => query.trim()).filter(Boolean))).sort(),
  )

  const fetch_ = useCallback(async () => {
    const requestId = requestGuardRef.current.begin()
    const normalizedQueries = JSON.parse(queryKey) as string[]

    if (normalizedQueries.length === 0) {
      setProducts([])
      setLoading(false)
      return
    }

    setLoading(true)
    const results = await Promise.all(
      normalizedQueries.map(async (query) => ({
        query,
        result: await clientCatalogApi.search.keyword(query, 5),
      })),
    )

    if (!requestGuardRef.current.isLatest(requestId)) return

    const matches = results.flatMap(({ query, result }) => {
      if (!result.ok) return []
      const visibleCandidates = result.data.results.filter(
        (candidate) => !isUnpublishedValue(candidate.product_name),
      )
      const match = visibleCandidates.find((candidate) => namesMatch(candidate.product_name, query))
        ?? visibleCandidates[0]
      return match ? [mapKeywordSearchResponseToResults({ results: [match], count: 1 }, 1, 0).products[0]] : []
    })

    setProducts(Array.from(new Map(matches.map((product) => [product.product_id, product])).values()))
    setLoading(false)
  }, [queryKey])

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

  return { products, loading }
}

function namesMatch(left: string, right: string) {
  const normalize = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, '')
  const a = normalize(left)
  const b = normalize(right)
  if (!a || !b) return false
  if (a === b) return true
  if (Math.min(a.length, b.length) < 4) return false
  return a.startsWith(b) || b.startsWith(a)
}
