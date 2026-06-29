'use client'

// features/compare/client-api.ts — dedicated compare endpoint client.
//
// Calls POST /api/v1/catalog/products/compare once for up to 4 product ids
// and returns a comparison-ready payload. Mirrors the contract defined in
// docs/compare-endpoint.md.
//
// This module is feature-flagged behind NEXT_PUBLIC_COMPARE_ENDPOINT_V2.
// Until the backend ships, useCompareEntities falls back to N parallel
// clientCatalogApi.products.getDetail calls (the legacy path).

import { ServiceApisBrowserClient } from '@/lib/service-apis/browser'

import type {
  CategoryScore,
  PricingPlanItem,
  RatingItem,
} from '@/features/catalog/products/types'
import type { ApiResult, CatalogRequestOptions } from '@/features/catalog/shared/types'

// ---- Request --------------------------------------------------------------

export interface CompareRequest {
  product_ids: string[]                 // 1..4
}

// ---- Response -------------------------------------------------------------

export interface CompareResponse {
  count: number                         // === results.length
  results: CompareProductEntry[]
  missing_ids?: string[]
}

export interface CompareProductEntry {
  // Identity
  product_id: string
  slug: string | null
  product_name: string
  vendor_name: string | null
  official_website: string | null
  logo_url: string | null

  // Copy
  short_description: string | null
  what_is: string | null
  best_for: string | null
  not_for: string | null
  pros: string[]
  cons: string[]

  // Features & compliance
  core_features: string[]
  integration_labels: string[]
  compliance_labels: string[]
  deployment_models: string[]

  // Categories & segments
  primary_category: string | null
  all_categories: CategoryScore[]
  target_segments: string[]

  // Pricing
  pricing_plans: PricingPlanItem[]
  pricing_bucket: string | null
  free_trial: boolean
  free_plan: boolean

  // Implementation
  implementation_complexity: string | null
  typical_timeline: string | null

  // Market
  market_presence_score: number | null

  // Ratings & reviews
  avg_rating: number | null
  total_reviews: number | null
  ratings: RatingItem[]
  sentiment: string[]
  outcomes: string[]
  reviewer_segment: string | null
  reviewer_industry: string | null

  // Fit (v1: derived from market_presence_score)
  fit_score: number

  // Alternatives — product-only
  alternatives: AlternativeItem[]
}

export interface AlternativeItem {
  product_id: string
  product_name: string
  primary_category: string | null
  avg_rating: number | null
  logo_url: string | null
}

// ---- Client ---------------------------------------------------------------

const client = new ServiceApisBrowserClient()

export const compareApi = {
  /**
   * Compare up to 4 products in a single round-trip.
   *
   * Server clamps `product_ids.length` to 4 and reports unknown ids in
   * `missing_ids`. Partial success (some ids found, some missing) returns
   * 200 — never a 4xx.
   */
  compareProducts(
    request: CompareRequest,
    options?: CatalogRequestOptions,
  ): Promise<ApiResult<CompareResponse>> {
    return client.post<CompareResponse>(
      '/api/v1/catalog/products/compare',
      request,
      options,
    )
  },
}

// ---- Feature flag ---------------------------------------------------------

/**
 * True when the new compare endpoint is enabled in the deployment.
 * Frontend ships both paths; default OFF until backend lands.
 */
export function isCompareV2Enabled(): boolean {
  return process.env.NEXT_PUBLIC_COMPARE_ENDPOINT_V2 === 'true'
}
