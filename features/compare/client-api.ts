'use client'

// features/compare/client-api.ts — dedicated compare endpoint client.
//
// Calls the canonical service-apis compare endpoints once for up to 4 product
// ids and returns comparison-ready catalog data plus live filter metadata.
//
import { ServiceApisBrowserClient } from '@/lib/service-apis/browser'

import type {
  CategoryScore,
  PricingPlanItem,
  RatingItem,
} from '@/features/catalog/products/types'
import type { ApiResult, CatalogRequestOptions } from '@/features/catalog/shared/types'

// ---- Request --------------------------------------------------------------

export interface CompareRequest {
  product_ids: string[]
  fit_filters?: CompareFitFilters
}

export interface CompareFitFilters {
  category_id?: string | null
  company_size?: string | null
  pricing_bucket?: string | null
  region?: string | null
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

export interface CompareFilterOption {
  value: string
  label: string
}

export interface CompareFiltersResponse {
  categories: CompareFilterOption[]
  company_sizes: CompareFilterOption[]
  pricing_buckets: CompareFilterOption[]
  regions: CompareFilterOption[]
  timelines: CompareFilterOption[]
}

export interface CompareMatchedExpertsRequest {
  product_ids: string[]
  limit?: number
}

export interface CompareMatchedExpert {
  id: string
  displayName: string
  headline?: string | null
  regionCountry?: string | null
  regionCity?: string | null
  yearsExperience?: number | null
  primaryPlatforms: string[]
  secondaryPlatforms: string[]
  industryExpertise: string[]
  matchScore: number
  matchedProducts: string[]
  profilePictureUrl?: string | null
  schedulingLink?: string | null
}

export interface CompareMatchedExpertsResponse {
  count: number
  experts: CompareMatchedExpert[]
}

// ---- Client ---------------------------------------------------------------

const client = new ServiceApisBrowserClient()

export const compareApi = {
  /** Compare the selected products using the buyer's current fit context. */
  compareProducts(
    request: CompareRequest,
    options?: CatalogRequestOptions,
  ): Promise<ApiResult<CompareResponse>> {
    return client.post<CompareResponse>(
      '/api/v1/catalog/compare',
      request,
      options,
    )
  },

  getFilters(options?: CatalogRequestOptions): Promise<ApiResult<CompareFiltersResponse>> {
    return client.get<CompareFiltersResponse>('/api/v1/catalog/compare/filters', options)
  },

  getMatchedExperts(
    request: CompareMatchedExpertsRequest,
    options?: CatalogRequestOptions,
  ): Promise<ApiResult<CompareMatchedExpertsResponse>> {
    return client.post<CompareMatchedExpertsResponse>(
      '/api/v1/catalog/compare/matched-experts',
      request,
      options,
    )
  },
}

// ---- Feature flag ---------------------------------------------------------

/**
 * Retained for callers that still expose the old rollout flag. The canonical
 * endpoint is now always used; this flag no longer changes request routing.
 */
export function isCompareV2Enabled(): boolean {
  return process.env.NEXT_PUBLIC_COMPARE_ENDPOINT_V2 === 'true'
}
