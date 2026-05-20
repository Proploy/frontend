// use-admin-experts.ts
// Admin hook for fetching expert applications from service-apis.
// Calls GET /api/v1/admin/experts with page & limit.
// Requires an authenticated admin session — token resolved from browser Supabase.

import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { ServiceApisBrowserClient } from '@/lib/service-apis/browser'
import { type NormalizedError } from '@/lib/service-apis/error-utils'
import type { AdminExpert, AdminExpertsListResponse } from './types/admin-contracts'
import type { Pagination } from './types/catalog-view-models'

interface UseAdminExpertsOptions {
  page?: number
  limit?: number
  status?: 'draft' | 'submitted' | 'approved' | 'rejected'
}

interface UseAdminExpertsResult {
  experts: AdminExpert[]
  pagination: Pagination | null
  loading: boolean
  error: NormalizedError | null
  refetch: () => void
}

const DEFAULT_LIMIT = 20

export function useAdminExperts(options: UseAdminExpertsOptions = {}): UseAdminExpertsResult {
  const { page = 1, limit = DEFAULT_LIMIT, status } = options

  const [experts, setExperts] = useState<AdminExpert[]>([])
  const [pagination, setPagination] = useState<Pagination | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<NormalizedError | null>(null)

  // One client instance per component lifecycle
  const client = useMemo(() => new ServiceApisBrowserClient(), [])

  // Guard against stale state updates after unmount or param change
  const mountedRef = useRef(true)

  const fetch_ = useCallback(async () => {
    mountedRef.current = true
    setLoading(true)
    setError(null)

    const params = new URLSearchParams()
    params.set('page', String(page))
    params.set('limit', String(limit))
    if (status) params.set('status', status)

    const result = await client.get<AdminExpertsListResponse>(
      `/api/v1/admin/experts?${params.toString()}`,
      { requireAuth: true },
    )

    if (!mountedRef.current) return

    if (!result.ok) {
      setError(result)
      setLoading(false)
      return
    }

    const { data, total } = result.data
    setExperts(data)
    setPagination({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page * limit < total,
      hasPreviousPage: page > 1,
    })
    setLoading(false)
  }, [page, limit, status]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    mountedRef.current = true
    fetch_()
    return () => {
      mountedRef.current = false
    }
  }, [fetch_])

  return { experts, pagination, loading, error, refetch: fetch_ }
}
