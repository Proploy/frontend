/**
 * Experts directory listing — filters, sort, paging and facet counts, all
 * evaluated by `GET /api/v1/experts`.
 *
 * Filtering has to happen server-side: `ExpertListItem` does not carry
 * regionsServed, remoteOnly, availabilityHoursPerWeek or earliestStartDate, so
 * those groups cannot be evaluated against a loaded page. The same request
 * returns the option counts, which is why the directory no longer derives its
 * filter options from whatever happened to be on screen.
 *
 * Public endpoint: called from the browser with requireAuth: false.
 */
import { useCallback, useEffect, useRef, useState } from 'react'
import { ServiceApisBrowserClient } from '@/lib/service-apis/browser'
import { createLatestRequestGuard } from '@/features/catalog/shared/latest-request'
import type { NormalizedError } from '@/lib/service-apis/error-utils'
import type { ExpertFacets, ExpertListItem, ExpertListResponse } from '@/features/experts/types'
import { buildExpertListQuery } from '@/features/experts/filter-params'
import type { ExpertFilterValues } from '@/features/experts/filter-values'

const client = new ServiceApisBrowserClient()

interface UseExpertDirectoryOptions {
  filters: ExpertFilterValues
  search?: string
  page?: number
  limit?: number
  includeFacets?: boolean
}

interface UseExpertDirectoryResult {
  experts: ExpertListItem[]
  /** Experts matching every applied filter, across all pages. */
  total: number
  facets: ExpertFacets | null
  loading: boolean
  error: NormalizedError | null
  refetch: () => void
}

export function useExpertDirectory({
  filters,
  search,
  page = 1,
  limit = 24,
  includeFacets = true,
}: UseExpertDirectoryOptions): UseExpertDirectoryResult {
  const [experts, setExperts] = useState<ExpertListItem[]>([])
  const [total, setTotal] = useState(0)
  const [facets, setFacets] = useState<ExpertFacets | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<NormalizedError | null>(null)

  const guardRef = useRef(createLatestRequestGuard())
  const mountedRef = useRef(true)

  // The query string is the whole request identity, so it is also the effect
  // dependency — object identity of `filters` changes on every render.
  const query = buildExpertListQuery(filters, { search, page, limit, includeFacets }).toString()

  const load = useCallback(async () => {
    const requestId = guardRef.current.begin()
    setLoading(true)
    setError(null)

    try {
      const result = await client.get<ExpertListResponse>(`/api/v1/experts?${query}`, {
        requireAuth: false,
        // Not persisted, and short-lived: the cache key is the whole query, so
        // persisting would write a sessionStorage entry per filter combination
        // and keep serving stale facet options for minutes after the
        // vocabulary changes. `persist` is for shared reference data, which a
        // filtered directory query is not.
        readCache: { ttlMs: 30_000, staleMs: 0 },
      })

      if (!mountedRef.current || !guardRef.current.isLatest(requestId)) return

      if (!result.ok) {
        setError(result)
        setExperts([])
        setTotal(0)
        return
      }

      setExperts(result.data.experts)
      setTotal(result.data.total ?? result.data.experts.length)
      // Facets are only attached to the first page; keep the last set so the
      // sidebar does not empty out while paging.
      if (result.data.facets) setFacets(result.data.facets)
    } finally {
      if (mountedRef.current && guardRef.current.isLatest(requestId)) setLoading(false)
    }
  }, [query])

  useEffect(() => {
    mountedRef.current = true
    void load()
    return () => {
      mountedRef.current = false
    }
  }, [load])

  return { experts, total, facets, loading, error, refetch: load }
}
