'use client'

import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { ServiceApisBrowserClient } from '@/lib/service-apis/browser'
import { type NormalizedError } from '@/lib/service-apis/error-utils'
import type { ExpertListItem, ExpertListResponse } from './types/expert-contracts'

interface UseApprovedExpertsResult {
  experts: ExpertListItem[]
  loading: boolean
  error: NormalizedError | null
  refetch: () => void
}

export function useApprovedExperts(): UseApprovedExpertsResult {
  const [experts, setExperts] = useState<ExpertListItem[]>([])
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

    const result = await client.get<ExpertListResponse>(
      '/api/v1/experts',
      { requireAuth: false },
    )

    if (!mountedRef.current) return

    if (!result.ok) {
      setError(result)
      setLoading(false)
      return
    }

    setExperts(result.data.data)
    setLoading(false)
  }, [client])

  useEffect(() => {
    mountedRef.current = true
    fetch_() // eslint-disable-line react-hooks/set-state-in-effect
    return () => {
      mountedRef.current = false
    }
  }, [fetch_])

  return { experts, loading, error, refetch: fetch_ }
}