// Search Contracts — mirrors backend Pydantic models exactly.
// Backend: KeywordSearchRequest, KeywordSearchResponse, KeywordSearchResult, CatalogSearchRequest, CatalogSearchResponse, CatalogSearchResult, NaturalSearchRequest
// Source: service-apis/modules/catalog/search/models.py + modules/catalog/models.py

export type SearchMode = 'keyword' | 'natural'

export interface KeywordSearchRequest {
  query: string
  limit?: number
}

export interface KeywordSearchResult {
  product_id: string
  product_name: string
  slug: string
  vendor_name: string | null
  primary_category: string | null
  approved_logo_url: string | null
}

export interface KeywordSearchResponse {
  results: KeywordSearchResult[]
  count: number
}

export interface CatalogSearchRequest {
  semantic_query?: string | null
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

export type CatalogSearchSort = NonNullable<CatalogSearchRequest['sort']>

export interface NaturalSearchRequest {
  query: string
  limit?: number
  filters?: Record<string, unknown>
  pricing_bucket?: string[]
  compliance?: string[]
  deployment_model?: string[]
  company_size?: string[]
  free_plan?: boolean
  trial_available?: boolean
  pricing_model?: string[]
  category_term_id?: string | string[]
  integration?: string[]
  industry?: string[]
  implementation_complexity?: string[]
  min_rating?: number
  max_starting_price_usd?: number
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
  approved_logo_url: string | null
  primary_category: string | null
}

export interface CatalogSearchResponse {
  count: number
  results: CatalogSearchResult[]
  facets: Record<string, unknown> | null
  note: string | null
}
