'use client'

// features/compare/use-compare-entities.ts — fetches live compare data for a set
// of product ids and maps each into the Entity shape used by the /compare table.
//
// Two paths, switched at runtime by NEXT_PUBLIC_COMPARE_ENDPOINT_V2:
//   - flag OFF (default): N parallel GET /api/v1/catalog/products/{id}/ui
//     calls via the legacy productDetailToEntity mapper.
//   - flag ON: single POST /api/v1/catalog/products/compare call via
//     compareEntryToEntity. Requires the backend to ship that endpoint first.

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { clientCatalogApi } from '@/features/catalog/shared/client-api'
import { compareApi, isCompareV2Enabled } from '@/features/compare/client-api'
import { compareEntryToEntity, productDetailToEntity } from '@/lib/compare/from-catalog'
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
  const useV2 = isCompareV2Enabled()

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

    if (useV2) {
      // New path: one round-trip via the dedicated compare endpoint.
      const res = await compareApi.compareProducts({ product_ids: list })
      if (requestRef.current !== requestId) return // a newer request superseded this one

      const map: Record<string, Entity> = {}
      if (res.ok) {
        for (const entry of res.data.results) {
          map[entry.product_id] = compareEntryToEntity(entry)
        }
        // If the server reported missing ids, log them but don't surface as an error
        // unless we ended up with zero results — partial success is OK.
        if (res.data.missing_ids && res.data.missing_ids.length > 0 && res.data.count === 0) {
          setError('Could not load the selected products.')
        }
      } else {
        setError('Could not load the selected products.')
      }
      setById(map)
      setLoading(false)
      return
    }

    // Legacy path: N parallel getDetail calls.
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
  }, [idsKey, useV2])

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
