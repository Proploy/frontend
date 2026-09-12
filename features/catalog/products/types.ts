// Product Contracts — mirrors backend Pydantic models exactly.
// Backend: ProductCard, ProductCardResponse, ProductDetail, ProductMediaAssetItem, PricingPlanItem, RatingItem, CategoryScore
// Source: service-apis/modules/catalog/products/models.py

import type { Pagination } from '../shared/types'

export type ProductSort = 'name' | 'rating' | 'market_presence' | 'created_at'

/** Hard filters shared by the product list and natural search (backend ProductFilterSet). */
export interface ProductFilterRequest {
  /** Category term ids (OR-ed); the API expands ui_category roots to their product categories. */
  category?: string[]
  pricing_bucket?: string[]
  free_plan?: boolean
  free_trial?: boolean
  company_size?: string[]
  deployment_model?: string[]
  compliance?: string[]
  integration?: string[]
  industry?: string[]
  implementation_complexity?: string[]
  min_rating?: number
  max_starting_price_usd?: number
}

export interface ProductListRequest extends ProductFilterRequest {
  search?: string
  sort?: ProductSort
  limit?: number
  offset?: number
  /** Attach facets computed over this request's id universe. First page only. */
  include_facets?: boolean
}

// Backend: ProductFacetsResponse (service-apis/modules/catalog/facet_models.py).
// Returned by GET /products/facets and, with `include_facets`, inline on the
// list and natural-search responses.
export type FacetMode = 'catalog' | 'search' | 'natural' | 'keyword'
export type FacetGroupState = 'expanded' | 'collapsed' | 'hidden'

export interface FacetOption {
  value: string
  label: string
  count: number
  /** Whether this option is part of the applied filters. Selected options are
   * returned even at count 0; unselected zero-count options are omitted. */
  selected: boolean
}

/** Which id universe the counts were computed over. `matched` equals the list total. */
export interface FacetScope {
  mode: FacetMode
  search: string | null
  universe: number
  matched: number
}

/** Response field names the backend reports group state for. */
export type FacetGroupKey =
  | 'pricing_buckets'
  | 'company_sizes'
  | 'deployment_models'
  | 'compliance'
  | 'integrations'
  | 'industries'
  | 'implementation_complexity'
  | 'ratings'
  | 'starting_prices'
  | 'free_plan'
  | 'free_trial'

export type FacetOptionsKey = Exclude<FacetGroupKey, 'free_plan' | 'free_trial'>

export type FacetGroups = Partial<Record<FacetGroupKey, { state: FacetGroupState }>>

/** Wire option: `selected` is absent from older responses. */
export type FacetOptionResponse = Omit<FacetOption, 'selected'> & { selected?: boolean }

/** Wire shape. `selected`, `scope` and `groups` are absent from older responses. */
export interface ProductFacetsResponse extends Record<FacetOptionsKey, FacetOptionResponse[]> {
  total: number
  free_plan_count: number
  free_trial_count: number
  scope?: FacetScope | null
  groups?: FacetGroups | null
}

/** Normalised facets (see mapProductFacets): every option carries `selected`,
 * `scope` is null for older responses, `groups` is always an object. */
export interface ProductFacets extends Record<FacetOptionsKey, FacetOption[]> {
  total: number
  free_plan_count: number
  free_trial_count: number
  scope: FacetScope | null
  groups: FacetGroups
}

export interface ProductCard {
  product_id: string
  slug: string
  product_name: string
  vendor_name: string | null
  short_description: string | null
  primary_category: string | null
  approved_logo_url: string | null
  avg_rating: number | null
  total_reviews: number | null
  pricing_bucket: string | null
  free_trial: boolean
  free_plan: boolean
  implementation_complexity: string | null
  typical_timeline: string | null
  industry_fit?: string[]
}

export interface ProductCardResponse {
  count: number
  results: ProductCard[]
  total: number
  /** Present when the request asked for `include_facets` on the first page. */
  facets?: ProductFacetsResponse | null
}

export interface ProductSummary {
  product_id: string
  product_name: string
  logo_url: string | null
}

export interface ProductSummaryResponse {
  results: ProductSummary[]
}

export interface ProductAlternative {
  product_id: string
  product_name: string
  short_description: string | null
  pricing_bucket: string | null
  logo_url: string | null
}

export interface ProductAlternativesResponse {
  source_product_id: string
  source_product_name: string
  count: number
  alternatives: ProductAlternative[]
}

// Product Detail (inline sub-resources)
export interface PricingPlanItem {
  plan_id: string
  plan_name: string
  price_text: string | null
  price_value: number | null
  currency: string | null
  price_usd: number | null
  billing_period: string
  plan_type: string | null
  is_free: boolean
  is_trial: boolean
  is_contact_sales: boolean
  features: Record<string, unknown> | string[] | null
  limits: Record<string, unknown> | string[] | null
  pricing_model: string | null
  source_url: string | null
  statement?: string | null
  confidence?: number | null
}

export interface RatingItem {
  rating_id: string
  source_name: string
  source_kind: string
  rating: number | null
  review_count: number | null
}

export interface CategoryScore {
  term_id: string
  label: string
  taxonomy_type: string
  relationship_type: string
  confidence_score: number | null
}

export interface ProductDetail {
  product_id: string
  slug: string
  product_name: string
  vendor_name: string | null
  official_website: string | null
  short_description: string | null
  what_is: string | null
  best_for: string | null
  not_for: string | null
  pros?: string[]
  cons?: string[]
  core_features: string[]
  integration_labels: string[]
  compliance_labels: string[]
  implementation_complexity: string | null
  typical_timeline: string | null
  primary_category: string | null
  all_categories: CategoryScore[]
  deployment_models: string[]
  target_segments: string[]
  free_trial: boolean
  free_plan: boolean
  pricing_bucket: string | null
  market_presence_score: number | null
  avg_rating: number | null
  total_reviews: number | null
  pricing_plans: PricingPlanItem[]
  ratings: RatingItem[]
  logo_url: string | null
}

// Product Media
export interface ProductMediaAssetItem {
  media_id: string
  asset_kind: string
  public_url: string | null
  mime_type: string | null
  width: number | null
  height: number | null
  alt_text: string | null
  display_order: number
  media_role?: string | null
}

// View models for UI
export interface CardProduct {
  product_id: string
  product_name: string
  product_description: string | null
  product_logo: string | null
  rating: number | null
  reviews: number | null
  primary_category: string | null
  vendor_name: string | null
  free_plan_available: boolean
  free_trial_available: boolean
  /** The catalog's own view of which industries the product suits. */
  industry_fit: string[]
}

export interface ProductPageModel {
  product_id: string
  product_name: string
  vendor_name: string | null
  official_website: string | null
  short_description: string | null
  long_description: string | null
  what_is: string | null
  best_for: string | null
  not_for: string | null
  pros: string[]
  cons: string[]
  free_trial: boolean
  free_plan: boolean
  pricing_bucket: string | null
  core_features: string[]
  integration_labels: string[]
  compliance_labels: string[]
  implementation_complexity: string | null
  typical_timeline: string | null
  market_presence_score: number | null
  avg_rating: number | null
  total_reviews: number | null
  primary_category: string | null
  all_categories: CategoryScore[]
  deployment_models: string[]
  target_segments: string[]
  pricing_plans: PricingTier[]
  ratings: ReviewSource[]
  media: ProductMediaAssetItem[]
  product_logo: string | null
}

export interface PricingTier {
  plan_id: string
  plan_name: string
  price_text: string | null
  price_value: number | null
  currency: string | null
  billing_period: string | null
  plan_type: string | null
  is_free: boolean
  is_trial: boolean
  is_contact_sales: boolean
  features: Record<string, string>[]
  limits: Record<string, string>[]
  pricing_model: string | null
  source_url: string | null
  statement: string | null
  confidence: number | null
}

export interface ReviewSource {
  source_name: string
  source_kind: string
  avg_rating: number | null
  total_reviews: number | null
}

export interface ProductListResult {
  products: CardProduct[]
  pagination: Pagination
}
