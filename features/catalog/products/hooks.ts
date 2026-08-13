'use client'

// Product Hooks — React hooks for product listing, detail, and media.

import { useState, useEffect, useCallback, useRef } from 'react'
import { clientCatalogApi } from '../shared/client-api'
import { createLatestRequestGuard } from '../shared/latest-request'
import type { NormalizedError } from '../shared/types'
import type {
  ProductDetail,
  ProductAlternative,
  ProductMediaAssetItem,
  ProductListResult,
  ProductPageModel,
  ProductSort,
} from './types'
import {
  mapProductListResponseToPage,
  mapProductDetailToPageModel,
  mapProductAlternative,
} from './mappers'
import { mergeProductListPage } from './pagination-state'

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
  offset?: number
  append?: boolean
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
  mediaError: NormalizedError | null
  notFound: boolean
  refetch: () => void
}

interface UseProductMediaResult {
  media: ProductMediaAssetItem[]
  loading: boolean
  error: NormalizedError | null
  refetch: () => void
}

interface UseProductAlternativesOptions {
  productId: string | null
  limit?: number
}

interface UseProductAlternativesResult {
  alternatives: ProductAlternative[]
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
    offset,
    append = false,
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

    const requestOffset = offset ?? (page - 1) * limit

    const result = await clientCatalogApi.products.list({
      category,
      pricing_bucket,
      free_plan,
      free_trial,
      search,
      sort,
      limit,
      offset: requestOffset,
    })

    if (!requestGuardRef.current.isLatest(requestId)) return

    if (!result.ok) {
      setError(result)
      setLoading(false)
      return
    }

    const mapped = mapProductListResponseToPage(result.data, limit, requestOffset)
    setProducts((currentProducts) => (
      append
        ? mergeProductListPage({
          currentProducts,
          incomingProducts: mapped.products,
          offset: requestOffset,
        })
        : mapped.products
    ))
    setPagination(mapped.pagination)
    setLoading(false)
  }, [category, pricing_bucket, free_plan, free_trial, search, sort, page, limit, offset, append])

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

interface UseRecursiveCategoryProductListOptions extends UseProductListOptions {
  categoryTermIds: string[]
  enabled?: boolean
}

/**
 * Lists a category and all of its descendant product categories. The catalog
 * API accepts one exact category term, so a branch is assembled from its
 * product-category requests and deduplicated before client-side pagination.
 */
export function useRecursiveCategoryProductList({
  categoryTermIds,
  enabled = true,
  ...options
}: UseRecursiveCategoryProductListOptions): UseProductListResult {
  const {
    pricing_bucket,
    free_plan,
    free_trial,
    search,
    sort = 'name',
    page = 1,
    limit = 30,
    offset,
    append = false,
  } = options
  const categoryTermIdsKey = Array.from(new Set(categoryTermIds)).sort().join('\u0001')
  const [products, setProducts] = useState<ProductListResult['products']>([])
  const [pagination, setPagination] = useState<ProductListResult['pagination'] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<NormalizedError | null>(null)
  const requestGuardRef = useRef(createLatestRequestGuard())

  const fetch_ = useCallback(async () => {
    if (!enabled) {
      setLoading(false)
      return
    }

    const requestId = requestGuardRef.current.begin()
    await Promise.resolve()
    if (!requestGuardRef.current.isLatest(requestId)) return

    setLoading(true)
    setError(null)
    const requestOffset = offset ?? (page - 1) * limit
    const sharedRequest = { pricing_bucket, free_plan, free_trial, search, sort }
    const termIds = categoryTermIdsKey ? categoryTermIdsKey.split('\u0001') : []

    if (termIds.length <= 1) {
      const result = await clientCatalogApi.products.list({
        ...sharedRequest,
        category: termIds[0],
        limit,
        offset: requestOffset,
      })
      if (!requestGuardRef.current.isLatest(requestId)) return
      if (!result.ok) {
        setError(result)
        setLoading(false)
        return
      }
      const mapped = mapProductListResponseToPage(result.data, limit, requestOffset)
      setProducts((currentProducts) => append
        ? mergeProductListPage({ currentProducts, incomingProducts: mapped.products, offset: requestOffset })
        : mapped.products)
      setPagination(mapped.pagination)
      setLoading(false)
      return
    }

    const firstPages = await Promise.all(termIds.map((category) =>
      clientCatalogApi.products.list({ ...sharedRequest, category, limit: 100, offset: 0 }),
    ))
    if (!requestGuardRef.current.isLatest(requestId)) return
    const failed = firstPages.find((result) => !result.ok)
    if (failed && !failed.ok) {
      setError(failed)
      setLoading(false)
      return
    }

    const successfulFirstPages = firstPages.filter((result): result is Extract<typeof result, { ok: true }> => result.ok)
    const remainingPages = await Promise.all(successfulFirstPages.flatMap((result, index) => {
      const requests = []
      for (let nextOffset = 100; nextOffset < result.data.total; nextOffset += 100) {
        requests.push(clientCatalogApi.products.list({
          ...sharedRequest,
          category: termIds[index],
          limit: 100,
          offset: nextOffset,
        }))
      }
      return requests
    }))
    if (!requestGuardRef.current.isLatest(requestId)) return
    const remainingFailure = remainingPages.find((result) => !result.ok)
    if (remainingFailure && !remainingFailure.ok) {
      setError(remainingFailure)
      setLoading(false)
      return
    }

    const uniqueProducts = new Map<string, ProductListResult['products'][number]>()
    for (const result of [...successfulFirstPages, ...remainingPages]) {
      if (!result.ok) continue
      for (const product of mapProductListResponseToPage(result.data, 100, 0).products) {
        uniqueProducts.set(product.product_id, product)
      }
    }
    const allProducts = Array.from(uniqueProducts.values())
    if (sort === 'name') {
      allProducts.sort((left, right) => left.product_name.localeCompare(right.product_name))
    }
    const incomingProducts = allProducts.slice(requestOffset, requestOffset + limit)
    const total = allProducts.length
    const currentPage = Math.floor(requestOffset / limit) + 1
    setProducts((currentProducts) => append
      ? mergeProductListPage({ currentProducts, incomingProducts, offset: requestOffset })
      : incomingProducts)
    setPagination({
      page: currentPage,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNextPage: requestOffset + limit < total,
      hasPreviousPage: requestOffset > 0,
    })
    setLoading(false)
  }, [append, categoryTermIdsKey, enabled, free_plan, free_trial, limit, offset, page, pricing_bucket, search, sort])

  useEffect(() => {
    const requestGuard = requestGuardRef.current
    let active = true
    void Promise.resolve().then(() => {
      if (active) void fetch_()
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
  const [mediaError, setMediaError] = useState<NormalizedError | null>(null)
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
      setMediaError(null)
      setNotFound(false)
      return
    }

    setLoading(true)
    setError(null)
    setMediaError(null)
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
    setMediaError(mediaResult.ok ? null : mediaResult)

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

  return { product, loading, error, mediaError, notFound, refetch: fetchDetail }
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

/**
 * Fetches products identified by the catalog as alternatives to a product.
 * Backend: GET /api/v1/catalog/products/{productId}/alternatives
 */
export function useProductAlternatives({
  productId,
  limit = 6,
}: UseProductAlternativesOptions): UseProductAlternativesResult {
  const [alternatives, setAlternatives] = useState<ProductAlternative[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<NormalizedError | null>(null)
  const requestGuardRef = useRef(createLatestRequestGuard())

  const fetch_ = useCallback(async () => {
    const requestId = requestGuardRef.current.begin()
    await Promise.resolve()
    if (!requestGuardRef.current.isLatest(requestId)) return

    if (!productId) {
      setAlternatives([])
      setLoading(false)
      setError(null)
      return
    }

    setLoading(true)
    setError(null)

    const result = await clientCatalogApi.products.getAlternatives(productId, limit)

    if (!requestGuardRef.current.isLatest(requestId)) return

    if (!result.ok) {
      setError(result)
      setAlternatives([])
      setLoading(false)
      return
    }

    setAlternatives(result.data.alternatives.map(mapProductAlternative))
    setLoading(false)
  }, [productId, limit])

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

  return { alternatives, loading, error, refetch: fetch_ }
}
