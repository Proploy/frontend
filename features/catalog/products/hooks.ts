'use client'

// Product Hooks — React hooks for product listing, detail, and media.

import { useState, useEffect, useCallback, useRef } from 'react'
import { clientCatalogApi } from '../shared/client-api'
import { createLatestRequestGuard } from '../shared/latest-request'
import type { NormalizedError } from '../shared/types'
import type {
  ProductDetail,
  ProductMediaAssetItem,
  ProductListResult,
  ProductPageModel,
  ProductSort,
} from './types'
import {
  mapProductListResponseToPage,
  mapProductDetailToPageModel,
} from './mappers'

// ── Types ────────────────────────────────────────────────────────────────────

interface UseProductListOptions {
  category?: string
  pricing_bucket?: string
  free_plan?: boolean
  free_trial?: boolean
  search?: string
  sort?: ProductSort
  page?: number
  limit?: number
}

interface UseProductListResult {
  products: ProductListResult['products']
  pagination: ProductListResult['pagination'] | null
  loading: boolean
  error: NormalizedError | null
  refetch: () => void
}

interface UseProductDetailOptions {
  productId: string | null
}

interface UseProductDetailResult {
  product: ProductPageModel | null
  loading: boolean
  error: NormalizedError | null
  notFound: boolean
  refetch: () => void
}

interface UseProductMediaResult {
  media: ProductMediaAssetItem[]
  loading: boolean
  error: NormalizedError | null
  refetch: () => void
}

// ── Hooks ────────────────────────────────────────────────────────────────────

/**
 * Fetches product list with pagination and filtering.
 * Backend: GET /api/v1/catalog/products/ui
 */
export function useProductList(options: UseProductListOptions = {}): UseProductListResult {
  const {
    category,
    pricing_bucket,
    free_plan,
    free_trial,
    search,
    sort = 'name',
    page = 1,
    limit = 30,
  } = options

  const [products, setProducts] = useState<ProductListResult['products']>([])
  const [pagination, setPagination] = useState<ProductListResult['pagination'] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<NormalizedError | null>(null)
  const requestGuardRef = useRef(createLatestRequestGuard())

  const fetch_ = useCallback(async () => {
    const requestId = requestGuardRef.current.begin()
    await Promise.resolve()
    if (!requestGuardRef.current.isLatest(requestId)) return

    setLoading(true)
    setError(null)

    const offset = (page - 1) * limit

    const result = await clientCatalogApi.products.list({
      category,
      pricing_bucket,
      free_plan,
      free_trial,
      search,
      sort,
      limit,
      offset,
    })

    if (!requestGuardRef.current.isLatest(requestId)) return

    if (!result.ok) {
      setError(result)
      setLoading(false)
      return
    }

    const mapped = mapProductListResponseToPage(result.data, limit, offset)
    setProducts(mapped.products)
    setPagination(mapped.pagination)
    setLoading(false)
  }, [category, pricing_bucket, free_plan, free_trial, search, sort, page, limit])

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
 * Fetches full product detail with inline sub-resources (pricing_plans, ratings, categories).
 * Backend: GET /api/v1/catalog/products/{productId}/ui
 * Note: Backend does NOT provide alternatives, written reviews, or pricing comparison tables.
 *       UI should hide those sections or show empty states.
 */
export function useProductDetail({ productId }: UseProductDetailOptions): UseProductDetailResult {
  const [product, setProduct] = useState<ProductPageModel | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<NormalizedError | null>(null)
  const [notFound, setNotFound] = useState(false)
  const requestGuardRef = useRef(createLatestRequestGuard())

  const fetchDetail = useCallback(async () => {
    const requestId = requestGuardRef.current.begin()
    await Promise.resolve()
    if (!requestGuardRef.current.isLatest(requestId)) return

    if (!productId) {
      setProduct(null)
      setLoading(false)
      setError(null)
      setNotFound(false)
      return
    }

    setLoading(true)
    setError(null)
    setNotFound(false)

    // Fetch detail and media in parallel
    const [detailResult, mediaResult] = await Promise.all([
      clientCatalogApi.products.getDetail(productId),
      clientCatalogApi.products.getMedia(productId),
    ])

    if (!requestGuardRef.current.isLatest(requestId)) return

    if (!detailResult.ok) {
      setError(detailResult)
      setLoading(false)
      if (detailResult.status === 404) setNotFound(true)
      return
    }

    const detail: ProductDetail = detailResult.data
    const media: ProductMediaAssetItem[] = mediaResult.ok ? mediaResult.data : []

    const mapped = mapProductDetailToPageModel(detail, media)
    setProduct(mapped)
    setLoading(false)
  }, [productId])

  useEffect(() => {
    const requestGuard = requestGuardRef.current
    let active = true
    void Promise.resolve().then(() => {
      if (active) fetchDetail()
    })
    return () => {
      active = false
      requestGuard.invalidate()
    }
  }, [fetchDetail])

  return { product, loading, error, notFound, refetch: fetchDetail }
}

/**
 * Fetches product media assets.
 * Backend: GET /api/v1/catalog/products/{productId}/media
 */
export function useProductMedia(productId: string | null, kind?: string): UseProductMediaResult {
  const [media, setMedia] = useState<ProductMediaAssetItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<NormalizedError | null>(null)
  const requestGuardRef = useRef(createLatestRequestGuard())

  const fetch_ = useCallback(async () => {
    const requestId = requestGuardRef.current.begin()
    await Promise.resolve()
    if (!requestGuardRef.current.isLatest(requestId)) return

    if (!productId) {
      setMedia([])
      setLoading(false)
      setError(null)
      return
    }

    setLoading(true)
    setError(null)

    const result = await clientCatalogApi.products.getMedia(productId, kind)

    if (!requestGuardRef.current.isLatest(requestId)) return

    if (!result.ok) {
      setError(result)
      setLoading(false)
      return
    }

    setMedia(result.data)
    setLoading(false)
  }, [productId, kind])

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

  return { media, loading, error, refetch: fetch_ }
}
