// use-catalog-products.ts
// Public catalog product listing hook.
// Calls GET /catalog/products with limit, offset, search, category, sort.
// Returns mapped CardProduct[] + Pagination. No auto-retry — retryAfter exposed on error.

import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { ServiceApisBrowserClient } from '@/lib/service-apis/browser'
import { type NormalizedError } from '@/lib/service-apis/error-utils'
import { mapProductListResponseToPage } from './mappers/catalog-mappers'
import type { CardProduct, Pagination } from './types/catalog-view-models'
import type { ProductListResponse } from './types/catalog-contracts'

interface UseCatalogProductsOptions {
  search?: string
  /** Backend term_id of the primary category. Pass term_id directly — not slug, not label. */
  category?: string
  page?: number
  limit?: number
  sort?: 'name' | 'rating' | 'market_presence' | 'created_at'
}

interface UseCatalogProductsResult {
  products: CardProduct[]
  pagination: Pagination | null
  loading: boolean
  error: NormalizedError | null
  refetch: () => void
}

const DEFAULT_LIMIT = 30

/**
 * Fetches public product listing from service-apis.
 *
 * category param: pass the backend term_id (not slug, not label).
 * list_products filters by primary_category_term_id == term_id.
 */
export function useCatalogProducts(options: UseCatalogProductsOptions = {}): UseCatalogProductsResult {
  const {
    search,
    category,
    page = 1,
    limit = DEFAULT_LIMIT,
    sort = 'name',
  } = options

  const [products, setProducts] = useState<CardProduct[]>([])
  const [pagination, setPagination] = useState<Pagination | null>(null)
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
    if (search) params.set('search', search)
    if (category) params.set('category', category)
    params.set('limit', String(limit))
    params.set('offset', String((page - 1) * limit))
    params.set('sort', sort)

    const result = await client.get<ProductListResponse>(`/catalog/products?${params.toString()}`)

    if (!mountedRef.current) return

    if (!result.ok) {
      setError(result)
      setLoading(false)
      return
    }

    const mapped = mapProductListResponseToPage(result.data, limit, (page - 1) * limit)
    setProducts(mapped.products)
    setPagination(mapped.pagination)
    setLoading(false)
  }, [search, category, page, limit, sort]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    mountedRef.current = true
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetch_()
    return () => {
      mountedRef.current = false
    }
  }, [fetch_])

  return { products, pagination, loading, error, refetch: fetch_ }
}