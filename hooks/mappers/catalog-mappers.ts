// Catalog mappers — convert raw backend contract shapes to UI view models.
//
// All raw service-apis responses must pass through these mappers
// before reaching UI pages or components.
//
// Each function takes a contract type and returns a view model type.
// No side effects, no network calls, no React state.

import type {
  ProductSummary,
  ProductListResponse,
  CatalogProductDetail,
  CatalogSearchResponse,
  CatalogSearchResult,
  CategoriesResponse,
  PricingPlansResponse,
  RatingResponse,
  CatalogAlternativesResponse,
} from '../types/catalog-contracts'

import type {
  CardProduct,
  ProductPageModel,
  PricingTier,
  ReviewSource,
  AlternativeProduct,
  CategoryFilter,
  Pagination,
} from '../types/catalog-view-models'

// ── Product List ──────────────────────────────────────────────────────────────

export function mapProductSummaryToCardProduct(summary: ProductSummary): CardProduct {
  return {
    product_id: summary.product_id,
    product_name: summary.product_name,
    product_description: summary.short_description,
    product_logo: null,
    rating: summary.avg_rating,
    reviews: summary.total_reviews,
    primary_category: summary.primary_category,
    vendor_name: summary.vendor_name,
    free_plan_available: summary.free_plan,
    free_trial_available: summary.free_trial,
  }
}

export function mapProductListResponseToPage(
  response: ProductListResponse,
  limit: number,
  offset: number,
): { products: CardProduct[]; pagination: Pagination } {
  const page = Math.floor(offset / limit) + 1
  const totalPages = Math.ceil(response.count / limit)
  return {
    products: response.results.map(mapProductSummaryToCardProduct),
    pagination: {
      page,
      limit,
      total: response.count,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  }
}

// ── Search ───────────────────────────────────────────────────────────────────

export function mapSearchResultToCardProduct(result: CatalogSearchResult): CardProduct {
  return {
    product_id: result.product_id,
    product_name: result.product_name,
    product_description: result.short_description,
    product_logo: null,
    rating: result.avg_rating,
    reviews: result.total_reviews,
    primary_category: null,
    vendor_name: result.vendor_name,
    free_plan_available: result.free_plan,
    free_trial_available: result.free_trial,
  }
}

export function mapCatalogSearchResponseToResults(
  response: CatalogSearchResponse,
  limit: number,
  offset: number,
): { products: CardProduct[]; total: number; pagination: Pagination } {
  const page = Math.floor(offset / limit) + 1
  const totalPages = Math.ceil(response.count / limit)
  return {
    products: response.results.map(mapSearchResultToCardProduct),
    total: response.count,
    pagination: {
      page,
      limit,
      total: response.count,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  }
}

// ── Product Detail ────────────────────────────────────────────────────────────

export function mapPricingPlanResponseToTier(
  plan: PricingPlansResponse['plans'][number],
): PricingTier {
  let features: Record<string, string>[] = []
  let limits: Record<string, string>[] = []

  if (Array.isArray(plan.features)) {
    features = (plan.features as string[]).map((f) => ({ label: f, value: 'included' }))
  } else if (plan.features && typeof plan.features === 'object') {
    features = Object.entries(plan.features as Record<string, string>).map(
      ([label, value]) => ({ label, value }),
    )
  }

  if (Array.isArray(plan.limits)) {
    limits = (plan.limits as string[]).map((l) => ({ label: l, value: 'limited' }))
  } else if (plan.limits && typeof plan.limits === 'object') {
    limits = Object.entries(plan.limits as Record<string, string>).map(
      ([label, value]) => ({ label, value }),
    )
  }

  return {
    plan_id: plan.plan_id,
    plan_name: plan.plan_name,
    price_text: plan.price_text,
    price_value: plan.price_value,
    currency: plan.currency,
    billing_period: plan.billing_period,
    plan_type: plan.plan_type,
    is_free: plan.is_free,
    is_trial: plan.is_trial,
    is_contact_sales: plan.is_contact_sales,
    features,
    limits,
    pricing_model: plan.pricing_model,
  }
}

export function mapRatingResponseToReviewSource(rating: RatingResponse): ReviewSource {
  return {
    source_name: rating.source_name,
    source_kind: rating.source_kind,
    avg_rating: rating.rating,
    total_reviews: rating.review_count,
  }
}

export function mapAlternativesResponseToProducts(
  alt: CatalogAlternativesResponse,
): AlternativeProduct[] {
  return alt.alternatives.map((a) => ({
    product_id: a.product_id,
    product_name: a.product_name,
    vendor_name: a.vendor_name ?? null,
    short_description: a.short_description,
    avg_rating: a.avg_rating,
    free_plan: a.free_plan,
  }))
}

export function mapCatalogProductDetailToPageModel(
  detail: CatalogProductDetail,
  pricingPlans: PricingTier[],
  reviewSources: ReviewSource[],
  alternatives: AlternativeProduct[],
): ProductPageModel {
  return {
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
    pricing_plans: pricingPlans,
    ratings: reviewSources,
    alternatives,
  }
}

// ── Categories ────────────────────────────────────────────────────────────────

export function mapCategoriesResponseToFilters(
  response: CategoriesResponse,
): CategoryFilter[] {
  return response.categories.map((cat) => ({
    term_id: cat.term_id,
    label: cat.label,
    slug: cat.slug,
    count: 0,
    taxonomy_type: cat.taxonomy_type,
  }))
}