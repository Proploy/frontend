'use client'

import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { ServiceApisBrowserClient } from '@/lib/service-apis/browser'
import { type NormalizedError } from '@/lib/service-apis/error-utils'
import type { AdminExpertDetail } from './types/admin-contracts'

interface UseAdminExpertDetailResult {
  expert: AdminExpertDetail | null
  loading: boolean
  error: NormalizedError | null
  isUpdating: boolean
  refetch: () => void
  updateStatus: (status: 'approved' | 'changes_requested' | 'rejected', notes?: string) => Promise<{ ok: boolean }>
}

export function useAdminExpertDetail(expertId: string | undefined): UseAdminExpertDetailResult {
  const [expert, setExpert] = useState<AdminExpertDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<NormalizedError | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)

  // One client instance per component lifecycle
  const client = useMemo(() => new ServiceApisBrowserClient(), [])

  // Guard against stale state updates after unmount or param change
  const mountedRef = useRef(true)

  const fetch_ = useCallback(async () => {
    if (!expertId) return
    
    mountedRef.current = true
    await Promise.resolve()
    setLoading(true)
    setError(null)

    const result = await client.get<AdminExpertDetail>(
      `/api/v1/admin/experts/${expertId}`,
      { requireAuth: true },
    )

    if (!mountedRef.current) return

    if (!result.ok) {
      setError(result)
      setLoading(false)
      return
    }

    setExpert(result.data)
    setLoading(false)
  }, [expertId, client])

  useEffect(() => {
    mountedRef.current = true
    fetch_()
    return () => {
      mountedRef.current = false
    }
  }, [fetch_])

  const updateStatus = async (status: 'approved' | 'changes_requested' | 'rejected', notes?: string) => {
    if (!expertId) return { ok: false }
    
    setIsUpdating(true)
    setError(null)

    const result = await client.patch<AdminExpertDetail>(
      `/api/v1/admin/experts/${expertId}`,
      { status, notes: notes || null },
      { requireAuth: true },
    )

    if (!mountedRef.current) return { ok: false }

    setIsUpdating(false)

    if (!result.ok) {
      setError(result)
      return { ok: false }
    }

    setExpert(result.data)
    return { ok: true }
  }

  return { expert, loading, error, isUpdating, refetch: fetch_, updateStatus }
}
