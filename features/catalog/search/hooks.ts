'use client'

// Search Hooks — React hooks for keyword and hybrid search.

import { useState, useEffect, useCallback, useRef } from 'react'
import { clientCatalogApi } from '../shared/client-api'
import { createLatestRequestGuard } from '../shared/latest-request'
import type { NormalizedError } from '../shared/types'
import type { CatalogSearchRequest, NaturalSearchRequest } from '../search/types'
import type { CardProduct, ProductListResult } from '../products/types'
import {
  mapKeywordSearchResponseToResults,
  mapCatalogSearchResponseToResults,
} from '../search/mappers'
import { isUnpublishedValue } from '../products/published-values'

import {
  findInlineCompletion,
  findSpellingCorrection,
  type SpellingCorrectionResult,
} from './spell-check'

// ── Types ────────────────────────────────────────────────────────────────────

interface UseKeywordSearchResult {
  products: CardProduct[]
  loading: boolean
  error: NormalizedError | null
  suggestedCorrection: SpellingCorrectionResult | null
  ghostSuffix: string | null
  fullCompletion: string | null
  search: (query: string, limit?: number) => Promise<void>
  clear: () => void
}

type UseCatalogSearchOptions = CatalogSearchRequest & {
  enabled?: boolean
}

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
 * Keyword search for typeahead/autocomplete with spell judgment and ghost completion.
 * Backend: POST /api/v1/catalog/search/keyword
 */
export function useKeywordSearch(): UseKeywordSearchResult {
  const [products, setProducts] = useState<CardProduct[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<NormalizedError | null>(null)
  const [suggestedCorrection, setSuggestedCorrection] = useState<SpellingCorrectionResult | null>(null)
  const [ghostSuffix, setGhostSuffix] = useState<string | null>(null)
  const [fullCompletion, setFullCompletion] = useState<string | null>(null)

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
        timer: setTimeout(resolve, 200),
        resolve,
      }
      debounceRef.current = debounce
    })
    if (debounceRef.current === debounce) debounceRef.current = null

    if (!requestGuardRef.current.isLatest(requestId)) return

    const trimmed = query.trim()

    // Client-side instant spell judgment & completion before API returns
    const localCorrection = findSpellingCorrection(trimmed)
    setSuggestedCorrection(localCorrection)

    if (!trimmed) {
      setProducts([])
      setLoading(false)
      setError(null)
      setGhostSuffix(null)
      setFullCompletion(null)
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Search with exact query or corrected query if exact is severe typo
      const targetSearchQuery = localCorrection && localCorrection.distance === 1 ? localCorrection.suggestion : trimmed
      const result = await clientCatalogApi.search.keyword(targetSearchQuery, limit)

      if (!requestGuardRef.current.isLatest(requestId)) return

      if (!result.ok) {
        setError(result)
        setProducts([])
        setGhostSuffix(null)
        setFullCompletion(null)
        return
      }

      const mapped = mapKeywordSearchResponseToResults(result.data, limit, 0)
      setProducts(mapped.products)

      // Compute ghost completion suffix from product candidates & dictionary
      const candidates = Array.from(new Set([
        ...mapped.products.map((p) => p.product_name),
        ...mapped.products.map((p) => p.primary_category).filter(Boolean) as string[],
      ]))

      const inline = findInlineCompletion(trimmed, candidates)
      if (inline) {
        setGhostSuffix(inline.ghostSuffix)
        setFullCompletion(inline.fullMatch)
      } else {
        setGhostSuffix(null)
        setFullCompletion(null)
      }

      // Dynamic correction calculation including returned product names
      const refinedCorrection = findSpellingCorrection(
        trimmed,
        mapped.products.map((p) => p.product_name),
      )
      setSuggestedCorrection(refinedCorrection)
    } finally {
      if (requestGuardRef.current.isLatest(requestId)) {
        setLoading(false)
      }
    }
  }, [cancelDebounce])

  const clear = useCallback(() => {
    cancelDebounce()
    requestGuardRef.current.invalidate()
    setProducts([])
    setLoading(false)
    setError(null)
    setSuggestedCorrection(null)
    setGhostSuffix(null)
    setFullCompletion(null)
  }, [cancelDebounce])

  useEffect(() => {
    const requestGuard = requestGuardRef.current
    return () => {
      cancelDebounce()
      requestGuard.invalidate()
    }
  }, [cancelDebounce])

  return {
    products,
    loading,
    error,
    suggestedCorrection,
    ghostSuffix,
    fullCompletion,
    search,
    clear,
  }
}

export interface UseNaturalSearchFilters {
  pricingBucket?: string
  companySize?: string[]
  deploymentModel?: string[]
  compliance?: string[]
  freePlan?: boolean
  /** Free-trial products only — resolved to `trial_available` on the wire. */
  freeTrial?: boolean
}

interface UseNaturalSearchResult {
  products: CardProduct[]
  loading: boolean
  error: NormalizedError | null
  note: string | null
  search: (query: string, limit?: number) => Promise<void>
  clear: () => void
}

/**
 * Natural-language search — semantic-first with hard-filter refinement and
 * keyword fallback. Backend: POST /api/v1/catalog/search/natural
 */
export function useNaturalSearch(filters: UseNaturalSearchFilters = {}): UseNaturalSearchResult {
  const [products, setProducts] = useState<CardProduct[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<NormalizedError | null>(null)
  const [note, setNote] = useState<string | null>(null)

  const requestGuardRef = useRef(createLatestRequestGuard())
  const debounceRef = useRef<{
    timer: ReturnType<typeof setTimeout>
    resolve: () => void
  } | null>(null)
  const filtersRef = useRef(filters)
  filtersRef.current = filters

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
        timer: setTimeout(resolve, 200),
        resolve,
      }
      debounceRef.current = debounce
    })
    if (debounceRef.current === debounce) debounceRef.current = null

    if (!requestGuardRef.current.isLatest(requestId)) return

    const trimmed = query.trim()

    if (!trimmed) {
      setProducts([])
      setLoading(false)
      setError(null)
      setNote(null)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const activeFilters = filtersRef.current
      const request: NaturalSearchRequest = { query: trimmed, limit }
      if (activeFilters.pricingBucket) {
        request.pricing_bucket = [activeFilters.pricingBucket]
      }
      if (activeFilters.companySize?.length) {
        request.company_size = activeFilters.companySize
      }
      if (activeFilters.deploymentModel?.length) {
        request.deployment_model = activeFilters.deploymentModel
      }
      if (activeFilters.compliance?.length) {
        request.compliance = activeFilters.compliance
      }
      if (activeFilters.freePlan) {
        request.free_plan = true
      }
      if (activeFilters.freeTrial) {
        request.trial_available = true
      }

      const result = await clientCatalogApi.search.natural(request)

      if (!requestGuardRef.current.isLatest(requestId)) return

      if (!result.ok) {
        setError(result)
        setProducts([])
        setNote(null)
        return
      }

      const mapped = mapCatalogSearchResponseToResults(result.data, limit, 0)
      setProducts(mapped.products)
      setNote(result.data.note ?? null)
    } finally {
      if (requestGuardRef.current.isLatest(requestId)) {
        setLoading(false)
      }
    }
  }, [cancelDebounce])

  const clear = useCallback(() => {
    cancelDebounce()
    requestGuardRef.current.invalidate()
    setProducts([])
    setLoading(false)
    setError(null)
    setNote(null)
  }, [cancelDebounce])

  useEffect(() => {
    const requestGuard = requestGuardRef.current
    return () => {
      cancelDebounce()
      requestGuard.invalidate()
    }
  }, [cancelDebounce])

  return {
    products,
    loading,
    error,
    note,
    search,
    clear,
  }
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
  const enabled = options.enabled ?? true

  const fetch_ = useCallback(async () => {
    if (!enabled) {
      setProducts([])
      setPagination(null)
      setError(null)
      setLoading(false)
      return
    }

    const requestId = requestGuardRef.current.begin()
    await Promise.resolve()
    if (!requestGuardRef.current.isLatest(requestId)) return

    setLoading(true)
    setError(null)

    try {
      const request = JSON.parse(requestKey) as UseCatalogSearchOptions
      delete request.enabled
      const { limit = 20, offset = 0, ...filters } = request

      const result = await clientCatalogApi.search.hybrid({
        ...filters,
        limit,
        offset,
      })

      if (!requestGuardRef.current.isLatest(requestId)) return

      if (!result.ok) {
        setError(result)
        return
      }

      const mapped = mapCatalogSearchResponseToResults(result.data, limit, offset)
      setProducts(mapped.products)
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
    try {
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
    } finally {
      if (requestGuardRef.current.isLatest(requestId)) {
        setLoading(false)
      }
    }
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
