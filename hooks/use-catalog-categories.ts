// use-catalog-categories.ts
// Category filters hook for the product listing page.
// Calls GET /catalog/categories. Returns CategoryFilter[]. No auto-retry.

import { useState, useEffect, useCallback, useMemo, useRef } from "react"
import { ServiceApisBrowserClient } from "@/lib/service-apis/browser"
import { type NormalizedError } from "@/lib/service-apis/error-utils"
import { mapCategoriesResponseToFilters } from "./mappers/catalog-mappers"
import type { CategoryFilter } from "./types/catalog-view-models"
import type { CategoriesResponse } from "./types/catalog-contracts"

interface UseCatalogCategoriesResult {
  categories: CategoryFilter[]
  loading: boolean
  error: NormalizedError | null
  refetch: () => void
}

export function useCatalogCategories(): UseCatalogCategoriesResult {
  const [categories, setCategories] = useState<CategoryFilter[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<NormalizedError | null>(null)

  const client = useMemo(() => new ServiceApisBrowserClient(), [])
  const mountedRef = useRef(true)

  const fetch_ = useCallback(async () => {
    mountedRef.current = true
    setLoading(true)
    setError(null)

    const result = await client.get<CategoriesResponse>(`/catalog/categories`)

    if (!mountedRef.current) return

    if (!result.ok) {
      setError(result)
      setLoading(false)
      return
    }

    const mapped = mapCategoriesResponseToFilters(result.data)
    setCategories(mapped)
    setLoading(false)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    mountedRef.current = true
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetch_()
    return () => { mountedRef.current = false }
  }, [fetch_])

  return { categories, loading, error, refetch: fetch_ }
}
