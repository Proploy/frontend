// use-product-detail.ts
// Product detail page hook — fetches product detail + sub-resources.
// Calls GET /catalog/products/{productId}.
// Sub-resources loaded via loadPricingPlans(), loadRatings(), loadAlternatives().

import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { ServiceApisBrowserClient } from '@/lib/service-apis/browser'
import { type NormalizedError } from '@/lib/service-apis/error-utils'
import {
  mapCatalogProductDetailToPageModel,
  mapPricingPlanResponseToTier,
  mapRatingResponseToReviewSource,
  mapAlternativesResponseToProducts,
} from './mappers/catalog-mappers'
import type {
  ProductPageModel,
  PricingTier,
  ReviewSource,
  AlternativeProduct,
} from './types/catalog-view-models'
import type {
  CatalogProductDetail,
  PricingPlansResponse,
  RatingsResponse,
  CatalogAlternativesResponse,
} from './types/catalog-contracts'

interface UseProductDetailOptions {
  productId: string | null
}

interface UseProductDetailResult {
  product: ProductPageModel | null
  loading: boolean
  error: NormalizedError | null
  notFound: boolean
  refetch: () => void
  pricingPlans: PricingTier[]
  ratings: ReviewSource[]
  alternatives: AlternativeProduct[]
  loadPricingPlans: () => Promise<void>
  loadRatings: () => Promise<void>
  loadAlternatives: () => Promise<void>
}

/**
 * Fetches product detail from service-apis.
 * GET /catalog/products/{productId} — returns CatalogProductDetail directly (not wrapped).
 * Provides loadPricingPlans(), loadRatings(), loadAlternatives() for sub-resources.
 * Handles 404 as notFound. No auto-retry — retryAfter exposed for UI to handle.
 */
export function useProductDetail({ productId }: UseProductDetailOptions): UseProductDetailResult {
  const [product, setProduct] = useState<ProductPageModel | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<NormalizedError | null>(null)
  const [notFound, setNotFound] = useState(false)

  const [pricingPlans, setPricingPlans] = useState<PricingTier[]>([])
  const [ratings, setRatings] = useState<ReviewSource[]>([])
  const [alternatives, setAlternatives] = useState<AlternativeProduct[]>([])

  // Memoized client — one instance per component lifecycle
  const client = useMemo(() => new ServiceApisBrowserClient(), [])

  // Guard against stale state updates after unmount or param change
  const mountedRef = useRef(true)

  const fetchDetail = useCallback(async () => {
    if (!productId) {
      setProduct(null)
      setNotFound(false)
      return
    }

    mountedRef.current = true
    setLoading(true)
    setError(null)
    setNotFound(false)

    const result = await client.get<CatalogProductDetail>(`/catalog/products/${productId}`)

    if (!mountedRef.current) return

    if (!result.ok) {
      setError(result)
      setLoading(false)
      if (result.status === 404) setNotFound(true)
      return
    }

    // Map raw detail to page model (sub-resources loaded separately)
    const detail = result.data
    setProduct({
      product_id: detail.product_id,
      product_name: detail.product_name,
      vendor_name: detail.vendor_name,
      official_website: detail.official_website,
      short_description: detail.short_description,
      long_description: detail.what_is ?? null,
      what_is: detail.what_is,
      best_for: detail.best_for,
      not_for: detail.not_for,
      agent_summary: detail.agent_summary,
      deployment_model: detail.deployment_model,
      pricing_summary: detail.pricing_summary,
      free_trial: detail.free_trial,
      free_plan: detail.free_plan,
      pricing_bucket: detail.pricing_bucket,
      target_company_sizes: detail.target_company_sizes,
      core_features: detail.core_features,
      integration_labels: detail.integration_labels,
      compliance_labels: detail.compliance_labels,
      implementation_complexity: detail.implementation_complexity,
      typical_timeline: detail.typical_timeline,
      market_presence_score: detail.market_presence_score,
      avg_rating: detail.avg_rating,
      total_reviews: detail.total_reviews,
      primary_category: detail.primary_category,
      pricing_plans: [],
      ratings: [],
      alternatives: [],
    })
    setLoading(false)
  }, [productId]) // eslint-disable-line react-hooks/exhaustive-deps

  const loadPricingPlans = useCallback(async () => {
    if (!productId) return
    const result = await client.get<PricingPlansResponse>(
      `/catalog/products/${productId}/pricing-plans`,
    )
    if (result.ok) {
      setPricingPlans(result.data.plans.map(mapPricingPlanResponseToTier))
    }
  }, [productId])

  const loadRatings = useCallback(async () => {
    if (!productId) return
    const result = await client.get<RatingsResponse>(`/catalog/products/${productId}/ratings`)
    if (result.ok) {
      setRatings(result.data.ratings.map(mapRatingResponseToReviewSource))
    }
  }, [productId])

  const loadAlternatives = useCallback(async () => {
    if (!productId) return
    const result = await client.get<CatalogAlternativesResponse>(
      `/catalog/products/${productId}/alternatives`,
    )
    if (result.ok) {
      setAlternatives(mapAlternativesResponseToProducts(result.data))
    }
  }, [productId])

  useEffect(() => {
    mountedRef.current = true
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchDetail()
    return () => {
      mountedRef.current = false
    }
  }, [fetchDetail])

  return {
    product,
    loading,
    error,
    notFound,
    refetch: fetchDetail,
    pricingPlans,
    ratings,
    alternatives,
    loadPricingPlans,
    loadRatings,
    loadAlternatives,
  }
}