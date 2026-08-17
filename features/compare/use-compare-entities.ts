'use client'

// features/compare/use-compare-entities.ts — fetches live compare data for a set
// of product ids and maps each into the Entity shape used by the /compare table.
//
// Each selected id is loaded from the canonical service-apis product detail
// endpoint. This keeps the compare page on the same live contract as product
// details and avoids the older compare-v2 payload mismatch.

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { compareApi } from './client-api'
import type { Entity } from '@/lib/compare/data'
import { compareEntryToEntity } from '@/lib/compare/from-catalog'

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

    try {
      const result = await compareApi.compareProducts({
        product_ids: list,
      })
      if (requestRef.current !== requestId) return // a newer request superseded this one

      const map: Record<string, Entity> = {}
      if (result.ok) {
        result.data.results.forEach((entry) => {
          map[entry.product_id] = compareEntryToEntity(entry)
        })
      }

      setById(map)
      setError(!result.ok ? result.error.message : Object.keys(map).length === 0 ? 'Could not load the selected products.' : null)
    } finally {
      if (requestRef.current === requestId) {
        setLoading(false)
      }
    }
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
