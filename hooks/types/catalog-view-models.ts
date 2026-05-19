// Catalog view model types — what UI pages and components actually consume.
//
// These are created by mappers (hooks/mappers/catalog-mappers.ts).
// Raw backend contract types live in catalog-contracts.ts.
//
// Naming: UI-friendly, context-appropriate names.
// These types can use `product_description` (not `short_description`),
// `rating` (not `avg_rating`), `reviews` (not `total_reviews`).

// ── Product Card (used by product listing grid, search results) ──────────────

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

// ── Product Detail Page ───────────────────────────────────────────────────────

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
  pricing_plans: PricingTier[]
  ratings: ReviewSource[]
  alternatives: AlternativeProduct[]
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
}

export interface ReviewSource {
  source_name: string
  source_kind: string
  avg_rating: number | null
  total_reviews: number | null
}

export interface AlternativeProduct {
  product_id: string
  product_name: string
  vendor_name: string | null
  short_description: string | null
  avg_rating: number | null
  free_plan: boolean
}

// ── Category Filter ───────────────────────────────────────────────────────────

export interface CategoryFilter {
  term_id: string
  label: string
  slug: string
  count: number
  taxonomy_type: string
}

// ── Pagination ────────────────────────────────────────────────────────────────

export interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}