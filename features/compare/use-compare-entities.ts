'use client'

// features/compare/use-compare-entities.ts — fetches live ProductDetail for a set of
// product ids and maps each into the Entity shape used by the /compare table.

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { clientCatalogApi } from '@/features/catalog/shared/client-api'
import { productDetailToEntity } from '@/lib/compare/from-catalog'
import type { Entity } from '@/lib/compare/data'

interface UseCompareEntitiesResult {
  entities: Entity[]
  byId: Record<string, Entity>
  loading: boolean
  error: string | null
}

export function useCompareEntities(ids: string[]): UseCompareEntitiesResult {
  const idsKey = ids.join(',')
  const [byId, setById] = useState<Record<string, Entity>>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const requestRef = useRef(0)

  const fetchAll = useCallback(async () => {
    const requestId = ++requestRef.current
    const list = idsKey ? idsKey.split(',') : []
    if (list.length === 0) {
      setById({})
      setLoading(false)
      setError(null)
      return
    }
    setLoading(true)
    setError(null)

    const results = await Promise.all(list.map((id) => clientCatalogApi.products.getDetail(id)))
    if (requestRef.current !== requestId) return // a newer request superseded this one

    const map: Record<string, Entity> = {}
    let anyFailed = false
    results.forEach((res, i) => {
      if (res.ok) map[list[i]] = productDetailToEntity(res.data)
      else anyFailed = true
    })

    setById(map)
    setError(anyFailed && Object.keys(map).length === 0 ? 'Could not load the selected products.' : null)
    setLoading(false)
  }, [idsKey])

  useEffect(() => {
    // Defer out of the effect body so the initial setState isn't synchronous
    // (mirrors features/catalog/products/hooks.ts useProductDetail).
    let active = true
    void Promise.resolve().then(() => {
      if (active) fetchAll()
    })
    return () => {
      active = false
    }
  }, [fetchAll])

  const entities = useMemo(
    () => (idsKey ? idsKey.split(',').map((id) => byId[id]).filter(Boolean) : []),
    [idsKey, byId],
  )

  return { entities, byId, loading, error }
}
