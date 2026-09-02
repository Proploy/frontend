'use client'

// Product Hooks — React hooks for product listing, detail, and media.

import { useState, useEffect, useCallback, useRef } from 'react'
import { clientCatalogApi } from '../shared/client-api'
import { createLatestRequestGuard } from '../shared/latest-request'
import type { NormalizedError } from '../shared/types'
import type {
  ProductDetail,
  ProductAlternative,
  ProductFacets,
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
  category?: string[]
  pricing_bucket?: string[]
  free_plan?: boolean
  free_trial?: boolean
  company_size?: string[]
  deployment_model?: string[]
  compliance?: string[]
  integration?: string[]
  industry?: string[]
  implementation_complexity?: string[]
  min_rating?: number
  max_starting_price_usd?: number
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
    company_size,
    deployment_model,
    compliance,
    integration,
    industry,
    implementation_complexity,
    min_rating,
    max_starting_price_usd,
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

    try {
      const requestOffset = offset ?? (page - 1) * limit

      const result = await clientCatalogApi.products.list({
        category,
        pricing_bucket,
        free_plan,
        free_trial,
        company_size,
        deployment_model,
        compliance,
        integration,
        industry,
        implementation_complexity,
        min_rating,
        max_starting_price_usd,
        search,
        sort,
        limit,
        offset: requestOffset,
      })

      if (!requestGuardRef.current.isLatest(requestId)) return

      if (!result.ok) {
        setError(result)
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
    } finally {
      if (requestGuardRef.current.isLatest(requestId)) {
        setLoading(false)
      }
    }
  }, [
    category,
    pricing_bucket,
    free_plan,
    free_trial,
    company_size,
    deployment_model,
    compliance,
    integration,
    industry,
    implementation_complexity,
    min_rating,
    max_starting_price_usd,
    search,
    sort,
    page,
    limit,
    offset,
    append,
  ])

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

interface UseCatalogProductListOptions extends UseProductListOptions {
  enabled?: boolean
  initialData?: {
    products: ProductListResult['products']
    pagination: ProductListResult['pagination'] | null
  }
}

/**
 * Product list for the Explore Products page. The API expands a category to
 * its descendants and orders searched lists by relevance, so this is a single
 * request per page. `initialData` (server-rendered first page) skips the first
 * client fetch; `enabled=false` parks the hook while natural search owns the
 * results.
 */
export function useCatalogProductList({
  enabled = true,
  initialData,
  ...options
}: UseCatalogProductListOptions = {}): UseProductListResult {
  const {
    category,
    pricing_bucket,
    free_plan,
    free_trial,
    company_size,
    deployment_model,
    compliance,
    integration,
    industry,
    implementation_complexity,
    min_rating,
    max_starting_price_usd,
    search,
    sort = 'name',
    page = 1,
    limit = 30,
    offset,
    append = false,
  } = options
  const requestKey = JSON.stringify({
    category, pricing_bucket, free_plan, free_trial, company_size, deployment_model, compliance,
    integration, industry, implementation_complexity, min_rating, max_starting_price_usd,
    search, sort, page, limit, offset, append,
  })
  const [products, setProducts] = useState<ProductListResult['products']>(initialData?.products ?? [])
  const [pagination, setPagination] = useState<ProductListResult['pagination'] | null>(initialData?.pagination ?? null)
  const [loading, setLoading] = useState(!initialData)
  const [error, setError] = useState<NormalizedError | null>(null)
  const requestGuardRef = useRef(createLatestRequestGuard())
  const initialDataSkippedRef = useRef(!!initialData)

  const fetch_ = useCallback(async () => {
    if (initialDataSkippedRef.current) {
      initialDataSkippedRef.current = false
      setLoading(false)
      return
    }

    if (!enabled) {
      setLoading(false)
      return
    }

    const requestId = requestGuardRef.current.begin()
    await Promise.resolve()
    if (!requestGuardRef.current.isLatest(requestId)) return

    setLoading(true)
    setError(null)
    try {
      const request = JSON.parse(requestKey) as UseProductListOptions
      const requestLimit = request.limit ?? 30
      const requestOffset = request.offset ?? ((request.page ?? 1) - 1) * requestLimit
      const { page: _page, offset: _offset, append: _append, ...filters } = request
      void _page
      void _offset
      void _append

      const result = await clientCatalogApi.products.list({
        ...filters,
        limit: requestLimit,
        offset: requestOffset,
      })
      if (!requestGuardRef.current.isLatest(requestId)) return
      if (!result.ok) {
        setError(result)
        return
      }
      const mapped = mapProductListResponseToPage(result.data, requestLimit, requestOffset)
      setProducts((currentProducts) => request.append
        ? mergeProductListPage({ currentProducts, incomingProducts: mapped.products, offset: requestOffset })
        : mapped.products)
      setPagination(mapped.pagination)
    } finally {
      if (requestGuardRef.current.isLatest(requestId)) {
        setLoading(false)
      }
    }
  }, [enabled, requestKey])

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

interface UseProductFacetsResult {
  facets: ProductFacets | null
  error: NormalizedError | null
}

const facetsCache = new Map<string, { at: number; facets: ProductFacets }>()
const FACETS_CLIENT_TTL_MS = 60_000

/**
 * Filter options with counts. Backend: GET /api/v1/catalog/products/facets.
 *
 * Pass the active search so the options describe that result set — otherwise
 * the sidebar offers filters that have no overlap with the search and the
 * buyer lands on an empty page. The previous options stay on screen while a
 * new scope loads, so the sidebar never flickers empty.
 */
export function useProductFacets(
  initialData?: ProductFacets | null,
  search?: string,
): UseProductFacetsResult {
  const scope = (search ?? '').trim().toLowerCase()
  const [facets, setFacets] = useState<ProductFacets | null>(initialData ?? null)
  const [error, setError] = useState<NormalizedError | null>(null)
  const requestGuardRef = useRef(createLatestRequestGuard())

  useEffect(() => {
    // The server already resolved the unscoped options for the first paint.
    if (!scope && initialData) return

    const requestGuard = requestGuardRef.current
    const requestId = requestGuard.begin()
    let active = true

    void (async () => {
      const cached = facetsCache.get(scope)
      if (cached && Date.now() - cached.at < FACETS_CLIENT_TTL_MS) {
        if (active && requestGuard.isLatest(requestId)) setFacets(cached.facets)
        return
      }
      const result = await clientCatalogApi.products.getFacets(scope || undefined)
      if (!active || !requestGuard.isLatest(requestId)) return
      if (result.ok) {
        facetsCache.set(scope, { at: Date.now(), facets: result.data })
        setFacets(result.data)
        setError(null)
      } else {
        setError(result)
      }
    })()

    return () => {
      active = false
      requestGuard.invalidate()
    }
  }, [scope, initialData])

  return { facets, error }
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

    try {
      // Fetch detail and media in parallel
      const [detailResult, mediaResult] = await Promise.all([
        clientCatalogApi.products.getDetail(productId),
        clientCatalogApi.products.getMedia(productId),
      ])

      if (!requestGuardRef.current.isLatest(requestId)) return

      if (!detailResult.ok) {
        setError(detailResult)
        if (detailResult.status === 404) setNotFound(true)
        return
      }

      const detail: ProductDetail = detailResult.data
      const media: ProductMediaAssetItem[] = mediaResult.ok ? mediaResult.data : []
      setMediaError(mediaResult.ok ? null : mediaResult)

      const mapped = mapProductDetailToPageModel(detail, media)
      setProduct(mapped)
    } finally {
      if (requestGuardRef.current.isLatest(requestId)) {
        setLoading(false)
      }
    }
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

    try {
      const result = await clientCatalogApi.products.getMedia(productId, kind)

      if (!requestGuardRef.current.isLatest(requestId)) return

      if (!result.ok) {
        setError(result)
        return
      }

      setMedia(result.data)
    } finally {
      if (requestGuardRef.current.isLatest(requestId)) {
        setLoading(false)
      }
    }
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

    try {
      const result = await clientCatalogApi.products.getAlternatives(productId, limit)

      if (!requestGuardRef.current.isLatest(requestId)) return

      if (!result.ok) {
        setError(result)
        setAlternatives([])
        return
      }

      setAlternatives(result.data.alternatives.map(mapProductAlternative))
    } finally {
      if (requestGuardRef.current.isLatest(requestId)) {
        setLoading(false)
      }
    }
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
