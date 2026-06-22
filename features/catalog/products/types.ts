// Product Contracts — mirrors backend Pydantic models exactly.
// Backend: ProductCard, ProductCardResponse, ProductDetail, ProductMediaAssetItem, PricingPlanItem, RatingItem, CategoryScore
// Source: service-apis/modules/catalog/products/models.py

import type { Pagination } from '../shared/types'

export type ProductSort = 'name' | 'rating' | 'market_presence' | 'created_at'

export interface ProductListRequest {
  category?: string
  pricing_bucket?: string
  free_plan?: boolean
  free_trial?: boolean
  search?: string
  sort?: ProductSort
  limit?: number
  offset?: number
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
}

export interface ProductCardResponse {
  count: number
  results: ProductCard[]
  total: number
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
