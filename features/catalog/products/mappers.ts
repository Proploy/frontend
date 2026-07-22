// Product Mappers — convert backend contracts to UI view models.

import type {
  ProductCardResponse,
  ProductCard,
  ProductDetail,
  PricingPlanItem,
  RatingItem,
  ProductMediaAssetItem,
  ProductAlternative,
} from './types'
import { getProductLogoUrl } from './logo-url'

import type {
  ProductListResult,
  ProductPageModel,
  CardProduct,
  PricingTier,
  ReviewSource,
} from './types'
import {
  isUnpublishedValue,
  normalizePublishedList,
  normalizePublishedValue,
} from './published-values'

export function mapProductAlternative(alternative: ProductAlternative): ProductAlternative {
  return {
    ...alternative,
    product_name: normalizePublishedValue(alternative.product_name) ?? 'Product',
    short_description: normalizePublishedValue(alternative.short_description),
    pricing_bucket: normalizePublishedValue(alternative.pricing_bucket),
    logo_url: getProductLogoUrl(alternative.product_id, alternative.logo_url),
  }
}

// ── Product List ────────────────────────────────────────────────────────────

export function mapProductCardToCardProduct(card: ProductCard): CardProduct {
  return {
    product_id: card.product_id,
    product_name: normalizePublishedValue(card.product_name) ?? '',
    product_description: normalizePublishedValue(card.short_description),
    product_logo: getProductLogoUrl(card.product_id, card.approved_logo_url),
    rating: card.avg_rating,
    reviews: card.total_reviews,
    primary_category: normalizePublishedValue(card.primary_category),
    vendor_name: normalizePublishedValue(card.vendor_name),
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
    products: response.results
      .filter((card) => !isUnpublishedValue(card.product_name))
      .map(mapProductCardToCardProduct),
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
      features = normalizePublishedList(plan.features as string[]).map(f => ({ label: f, value: 'included' }))
    } else if (typeof plan.features === 'object') {
      features = Object.entries(plan.features as Record<string, string>).map(
        ([label, value]) => ({ label: normalizePublishedValue(label), value: normalizePublishedValue(value) }),
      ).filter((entry): entry is { label: string; value: string } => Boolean(entry.label && entry.value))
    }
  }

  if (plan.limits) {
    if (Array.isArray(plan.limits)) {
      limits = normalizePublishedList(plan.limits as string[]).map(l => ({ label: l, value: 'limited' }))
    } else if (typeof plan.limits === 'object') {
      limits = Object.entries(plan.limits as Record<string, string>).map(
        ([label, value]) => ({ label: normalizePublishedValue(label), value: normalizePublishedValue(value) }),
      ).filter((entry): entry is { label: string; value: string } => Boolean(entry.label && entry.value))
    }
  }

  return {
    plan_id: plan.plan_id,
    plan_name: normalizePublishedValue(plan.plan_name) ?? 'Plan',
    price_text: normalizePublishedValue(plan.price_text),
    price_value: plan.price_value,
    currency: normalizePublishedValue(plan.currency),
    billing_period: plan.billing_period,
    plan_type: normalizePublishedValue(plan.plan_type),
    is_free: plan.is_free,
    is_trial: plan.is_trial,
    is_contact_sales: plan.is_contact_sales,
    features,
    limits,
    pricing_model: normalizePublishedValue(plan.pricing_model),
    source_url: plan.source_url,
    statement: normalizePublishedValue(plan.statement),
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
    product_name: normalizePublishedValue(detail.product_name) ?? '',
    vendor_name: normalizePublishedValue(detail.vendor_name),
    official_website: normalizePublishedValue(detail.official_website),
    short_description: normalizePublishedValue(detail.short_description),
    long_description: normalizePublishedValue(detail.what_is),
    what_is: normalizePublishedValue(detail.what_is),
    best_for: normalizePublishedValue(detail.best_for),
    not_for: normalizePublishedValue(detail.not_for),
    pros: normalizePublishedList(detail.pros),
    cons: normalizePublishedList(detail.cons),
    free_trial: detail.free_trial,
    free_plan: detail.free_plan,
    pricing_bucket: normalizePublishedValue(detail.pricing_bucket),
    core_features: normalizePublishedList(detail.core_features),
    integration_labels: normalizePublishedList(detail.integration_labels),
    compliance_labels: normalizePublishedList(detail.compliance_labels),
    implementation_complexity: normalizePublishedValue(detail.implementation_complexity),
    typical_timeline: normalizePublishedValue(detail.typical_timeline),
    market_presence_score: detail.market_presence_score,
    avg_rating: detail.avg_rating,
    total_reviews: detail.total_reviews,
    primary_category: normalizePublishedValue(detail.primary_category),
    all_categories: detail.all_categories.filter((category) => !isUnpublishedValue(category.label)),
    deployment_models: normalizePublishedList(detail.deployment_models),
    target_segments: normalizePublishedList(detail.target_segments),
    pricing_plans: detail.pricing_plans
      .filter((plan) => !isUnpublishedValue(plan.plan_name))
      .map(mapPricingPlanItemToTier),
    ratings: detail.ratings.filter((rating) => !isUnpublishedValue(rating.source_name)).map(mapRatingItemToReviewSource),
    media: media
      .map((asset) => asset.asset_kind.toLowerCase() === 'logo'
        ? { ...asset, public_url: getProductLogoUrl(detail.product_id, asset.public_url) }
        : asset)
      .sort((a, b) => a.display_order - b.display_order),
    product_logo: getProductLogoUrl(
      detail.product_id,
      detail.logo_url
        ?? media.find((asset) => asset.asset_kind.toLowerCase() === 'logo')?.public_url,
    ),
  }
}
