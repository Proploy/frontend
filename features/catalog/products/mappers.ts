// Product Mappers — convert backend contracts to UI view models.

import type {
  ProductCardResponse,
  ProductCard,
  ProductDetail,
  PricingPlanItem,
  RatingItem,
  ProductMediaAssetItem,
} from './types'

import type {
  ProductListResult,
  ProductPageModel,
  CardProduct,
  PricingTier,
  ReviewSource,
} from './types'

// ── Product List ────────────────────────────────────────────────────────────

export function mapProductCardToCardProduct(card: ProductCard): CardProduct {
  return {
    product_id: card.product_id,
    product_name: card.product_name,
    product_description: card.short_description,
    product_logo: card.approved_logo_url,
    rating: card.avg_rating,
    reviews: card.total_reviews,
    primary_category: card.primary_category,
    vendor_name: card.vendor_name,
    free_plan_available: card.free_plan,
    free_trial_available: card.free_trial,
  }
}

export function mapProductListResponseToPage(
  response: ProductCardResponse,
  limit: number,
  offset: number,
): ProductListResult {
  const page = Math.floor(offset / limit) + 1
  const totalPages = Math.ceil(response.total / limit)
  return {
    products: response.results.map(mapProductCardToCardProduct),
    pagination: {
      page,
      limit,
      total: response.total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  }
}

// ── Pricing Plans ────────────────────────────────────────────────────────────

export function mapPricingPlanItemToTier(plan: PricingPlanItem): PricingTier {
  let features: Record<string, string>[] = []
  let limits: Record<string, string>[] = []

  if (plan.features) {
    if (Array.isArray(plan.features)) {
      features = (plan.features as string[]).map(f => ({ label: f, value: 'included' }))
    } else if (typeof plan.features === 'object') {
      features = Object.entries(plan.features as Record<string, string>).map(
        ([label, value]) => ({ label, value }),
      )
    }
  }

  if (plan.limits) {
    if (Array.isArray(plan.limits)) {
      limits = (plan.limits as string[]).map(l => ({ label: l, value: 'limited' }))
    } else if (typeof plan.limits === 'object') {
      limits = Object.entries(plan.limits as Record<string, string>).map(
        ([label, value]) => ({ label, value }),
      )
    }
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
    source_url: plan.source_url,
    statement: plan.statement ?? null,
    confidence: plan.confidence ?? null,
  }
}

// ── Ratings ──────────────────────────────────────────────────────────────────

export function mapRatingItemToReviewSource(rating: RatingItem): ReviewSource {
  return {
    source_name: rating.source_name,
    source_kind: rating.source_kind,
    avg_rating: rating.rating,
    total_reviews: rating.review_count,
  }
}

// ── Product Detail ───────────────────────────────────────────────────────────

/**
 * Maps backend ProductDetail to UI ProductPageModel.
 * Backend provides inline pricing_plans, ratings, all_categories.
 * Backend does NOT provide: alternatives, written reviews, pricing comparison tables.
 * Those sections should show empty states in UI.
 */
export function mapProductDetailToPageModel(
  detail: ProductDetail,
  media: ProductMediaAssetItem[],
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
    pros: detail.pros ?? [],
    cons: detail.cons ?? [],
    free_trial: detail.free_trial,
    free_plan: detail.free_plan,
    pricing_bucket: detail.pricing_bucket,
    core_features: detail.core_features,
    integration_labels: detail.integration_labels,
    compliance_labels: detail.compliance_labels,
    implementation_complexity: detail.implementation_complexity,
    typical_timeline: detail.typical_timeline,
    market_presence_score: detail.market_presence_score,
    avg_rating: detail.avg_rating,
    total_reviews: detail.total_reviews,
    primary_category: detail.primary_category,
    all_categories: detail.all_categories,
    deployment_models: detail.deployment_models,
    target_segments: detail.target_segments,
    pricing_plans: detail.pricing_plans.map(mapPricingPlanItemToTier),
    ratings: detail.ratings.map(mapRatingItemToReviewSource),
    media: [...media].sort((a, b) => a.display_order - b.display_order),
    product_logo: detail.logo_url
      ?? media.find((asset) => asset.asset_kind.toLowerCase() === 'logo')?.public_url
      ?? null,
  }
}
