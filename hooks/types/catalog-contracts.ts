// Catalog contract types — mirrors service-apis schemas exactly.
//
// These types are the raw backend shapes. UI pages do not consume these directly.
// All raw responses pass through mappers (hooks/mappers/catalog-mappers.ts)
// before reaching pages/components.
//
// Naming: backend field names preserved exactly:
//   short_description  (NOT product_description)
//   avg_rating        (NOT rating)
//   total_reviews     (NOT reviews)
//   semantic_query    (NOT query)
//   count/results     (NOT data/pagination)

export interface ProductSummary {
  product_id: string
  slug: string | null
  product_name: string
  vendor_name: string | null
  official_website: string | null
  short_description: string | null
  primary_category: string | null
  pricing_bucket: string | null
  free_trial: boolean
  free_plan: boolean
  market_presence_score: number | null
  avg_rating: number | null
  total_reviews: number | null
  data_status: string | null
}

export interface ProductListResponse {
  count: number
  results: ProductSummary[]
}

export interface CatalogProductDetail {
  product_id: string
  slug: string | null
  product_name: string
  vendor_name: string | null
  official_website: string | null
  short_description: string | null
  what_is: string | null
  best_for: string | null
  not_for: string | null
  agent_summary: string | null
  deployment_model: string | null
  pricing_summary: string | null
  free_trial: boolean
  free_plan: boolean
  pricing_bucket: string | null
  target_company_sizes: string[]
  core_features: string[]
  integration_labels: string[]
  compliance_labels: string[]
  implementation_complexity: string | null
  typical_timeline: string | null
  market_presence_score: number | null
  avg_rating: number | null
  total_reviews: number | null
  primary_category: string | null
  pricing_plans: Record<string, unknown>[]
  ratings: Record<string, unknown>[]
  review_insights: Record<string, unknown>[]
  community_insights: Record<string, unknown>[]
  comparative_signals: Record<string, unknown>[]
}

export interface CatalogSearchRequest {
  semantic_query: string | null
  filters?: Record<string, unknown>
  limit?: number
  offset?: number
  sort?: 'relevance' | 'price_asc' | 'price_desc' | 'rating' | 'name'
  pricing_bucket?: string[]
  compliance?: string[]
  deployment_model?: string[]
  company_size?: string[]
  free_plan?: boolean
  trial_available?: boolean
  pricing_model?: string[]
}

export interface CatalogSearchResult {
  product_id: string
  product_name: string
  vendor_name: string | null
  short_description: string | null
  avg_rating: number | null
  total_reviews: number | null
  deployment_model: string | null
  implementation_complexity: string | null
  typical_timeline: string | null
  free_trial: boolean
  free_plan: boolean
  fit_score: number
  pricing_bucket: string | null
  market_presence_score: number | null
}

export interface CatalogSearchResponse {
  count: number
  results: CatalogSearchResult[]
  facets: Record<string, unknown> | null
}

export interface PricingPlanResponse {
  plan_id: string
  product_id: string
  plan_name: string
  price_text: string | null
  price_value: number | null
  currency: string | null
  billing_period: string | null
  plan_type: string | null
  is_free: boolean
  is_trial: boolean
  is_contact_sales: boolean
  features: Record<string, unknown> | string[] | null
  limits: Record<string, unknown> | string[] | null
  pricing_model: string | null
}

export interface PricingPlansResponse {
  product_id: string
  plans: PricingPlanResponse[]
}

export interface RatingResponse {
  rating_id: string
  product_id: string
  source_name: string
  source_kind: string
  rating: number | null
  review_count: number | null
}

export interface RatingsResponse {
  product_id: string
  ratings: RatingResponse[]
  avg_rating: number | null
  total_reviews: number | null
}

export interface CatalogAlternativesResponse {
  source_product_id: string
  source_product_name: string
  count: number
  alternatives: CatalogSearchResult[]
}

export interface CategoryResponse {
  term_id: string
  taxonomy_type: string
  slug: string
  label: string
  description: string | null
  parent_term_id: string | null
}

export interface CategoriesResponse {
  count: number
  categories: CategoryResponse[]
}