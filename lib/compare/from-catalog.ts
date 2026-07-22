'use client'

// lib/compare/from-catalog.ts — adapts the live compare payload into the Entity
// shape the comparison components consume. The /compare page was built against
// mock Entities; this lets real, selected products flow through the same table.
//
// Two mappers live here:
//   - productDetailToEntity(input: ProductDetail)        — legacy path, kept
//     behind NEXT_PUBLIC_COMPARE_ENDPOINT_V2 === 'false'. Drops several rich
//     fields (logo_url, vendor_name, alternatives, sentiment, outcomes, ...).
//   - compareEntryToEntity(input: CompareProductEntry)   — new path, used when
//     the backend ships POST /api/v1/catalog/compare. Threads every
//     field through.

import type { ProductDetail, PricingPlanItem, ProductAlternative } from '@/features/catalog/products/types'
import type { CompareProductEntry } from '@/features/compare/client-api'
import { getProductLogoUrl } from '@/features/catalog/products/logo-url'
import { isUnpublishedValue, normalizePublishedList, normalizePublishedValue } from '@/features/catalog/products/published-values'
import type { AlternativeEntity, Complexity, Entity, LogoTone, RecommendedPath } from './data'

const LOGO_TONES: LogoTone[] = ['brand', 'pink', 'success', 'blue', 'indigo']

// Stable tone per product so a given product always renders the same colour.
function toneFor(seed: string): LogoTone {
  let h = 0
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0
  return LOGO_TONES[h % LOGO_TONES.length]
}

// Normalise the backend's free-text complexity into the table's Low/Medium/High scale.
function toComplexity(raw: string | null): Complexity {
  const v = (raw ?? '').toLowerCase()
  if (v.includes('low') || v.includes('easy') || v.includes('simple')) return 'Low'
  if (v.includes('high') || v.includes('complex') || v.includes('advanced')) return 'High'
  return 'Medium'
}

// Suggested rollout path follows implementation complexity.
const PATH_BY_COMPLEXITY: Record<Complexity, RecommendedPath> = {
  Low: 'Guided setup',
  Medium: 'Expert-led implementation',
  High: 'White-glove project',
}

function firstSegment(segments: string[]): string {
  const published = normalizePublishedList(segments)
  return published.length ? published.join(' · ') : '—'
}

// Flatten PricingPlanItem.limits (Record | string[] | null) into a one-line summary.
function flattenLimits(limits: PricingPlanItem['limits']): string | null {
  if (!limits) return null
  if (Array.isArray(limits)) {
    const published = normalizePublishedList(limits.filter((value): value is string => typeof value === 'string'))
    return published.length ? published.join('; ') : null
  }
  if (typeof limits === 'object') {
    const entries = Object.entries(limits)
      .filter(([key, value]) => value != null && !isUnpublishedValue(key) && !isUnpublishedValue(String(value)))
      .map(([k, v]) => {
        const value = typeof v === 'object' ? JSON.stringify(v) : String(v)
        return `${k}: ${value}`
      })
    return entries.length ? entries.join('; ') : null
  }
  return null
}

export function productAlternativeToCompareAlternative(alternative: ProductAlternative): AlternativeEntity {
  const name = normalizePublishedValue(alternative.product_name) ?? 'Product'
  return {
    id: alternative.product_id,
    name,
    initial: name.charAt(0).toUpperCase() || '?',
    category:
      normalizePublishedValue(alternative.short_description)
      ?? normalizePublishedValue(alternative.pricing_bucket)
      ?? 'Alternative product',
    rating: null,
    logoUrl: getProductLogoUrl(alternative.product_id, alternative.logo_url),
  }
}

// ---- Legacy mapper (kept until chunk E removes it) -----------------------

export function productDetailToEntity(detail: ProductDetail): Entity {
  const complexity = toComplexity(detail.implementation_complexity)
  const publishedPlans = detail.pricing_plans.filter((plan) => !isUnpublishedValue(plan.plan_name))
  const entry = publishedPlans.find((p) => !p.is_free && !p.is_contact_sales) ?? publishedPlans[0]
  const fitScore =
    detail.market_presence_score != null ? Math.round(Math.max(0, Math.min(100, detail.market_presence_score))) : 0

  return {
    id: detail.product_id,
    type: 'product',
    name: detail.product_name,
    initial: detail.product_name.charAt(0).toUpperCase() || 'P',
    logoTone: toneFor(detail.product_id),
    logoUrl: getProductLogoUrl(detail.product_id, detail.logo_url),
    category: normalizePublishedValue(detail.primary_category) ?? 'Software',
    tagline: normalizePublishedValue(detail.short_description) ?? normalizePublishedValue(detail.what_is) ?? '',
    rating: detail.avg_rating ?? 0,
    reviewCount: detail.total_reviews ?? 0,
    reviewSource: normalizePublishedValue(detail.ratings[0]?.source_name) ?? 'Verified buyers',
    bestFor: normalizePublishedValue(detail.best_for) ?? '—',
    notFor: normalizePublishedValue(detail.not_for) ?? '—',
    segment: firstSegment(detail.target_segments),
    pricingBucket: normalizePublishedValue(detail.pricing_bucket) ?? '—',
    entryPrice: normalizePublishedValue(entry?.price_text) ?? (entry?.price_value != null ? `$${entry.price_value}` : '—'),
    priceUnit: normalizePublishedValue(entry?.billing_period) ? `/${normalizePublishedValue(entry?.billing_period)}` : '',
    pricingModel: normalizePublishedValue(entry?.pricing_model) ?? (detail.free_plan ? 'Free plan available' : '—'),
    freeTrial: detail.free_trial,
    freePlan: detail.free_plan,
    contactSales: detail.pricing_plans.some((p) => p.is_contact_sales),
    keyLimits: '—',
    implComplexity: complexity,
    rolloutTimeline: normalizePublishedValue(detail.typical_timeline) ?? '—',
    onboardingEffort: complexity === 'Low' ? 'Light' : complexity === 'High' ? 'Heavy' : 'Moderate',
    adminSkill: complexity === 'Low' ? 'Low' : complexity === 'High' ? 'High' : 'Medium',
    migrationRisk: complexity,
    fitScore,
    recommendedPath: PATH_BY_COMPLEXITY[complexity],
    fit: {
      teamSize: firstSegment(detail.target_segments),
      industryFit: normalizePublishedValue(detail.best_for) ?? '—',
      workflows: normalizePublishedList(detail.core_features),
      integrations: normalizePublishedList(detail.integration_labels),
      compliance: normalizePublishedList(detail.compliance_labels),
      deployment: normalizePublishedList(detail.deployment_models).join(', ') || 'Cloud (SaaS)',
      verdict: normalizePublishedValue(detail.short_description) ?? normalizePublishedValue(detail.best_for) ?? '—',
    },
    reviews: {
      pros: normalizePublishedList(detail.pros),
      cons: normalizePublishedList(detail.cons),
      sentiment: [],
      reviewerSegment: firstSegment(detail.target_segments),
      reviewerIndustry: normalizePublishedValue(detail.primary_category) ?? '—',
    },
    alternatives: [],
  }
}

// ---- New mapper (driven by POST /api/v1/catalog/compare) ------------------

export function compareEntryToEntity(entry: CompareProductEntry): Entity {
  const complexity = toComplexity(entry.implementation_complexity)
  const publishedPlans = entry.pricing_plans.filter((plan) => !isUnpublishedValue(plan.plan_name))
  const plan = publishedPlans.find((p) => !p.is_free && !p.is_contact_sales) ?? publishedPlans[0]

  // fit_score is server-computed. v1 derives it from market_presence_score;
  // v2 (buyer-context-aware) returns a true fit. The mapper trusts the field.
  const fitScore =
    typeof entry.fit_score === 'number'
      ? Math.round(Math.max(0, Math.min(100, entry.fit_score)))
      : entry.market_presence_score != null
        ? Math.round(Math.max(0, Math.min(100, entry.market_presence_score)))
        : 0

  // Join all rating source names so the "Review source" row surfaces every channel.
  const reviewSource =
    entry.ratings.length > 0
      ? entry.ratings.map((r) => normalizePublishedValue(r.source_name)).filter((name): name is string => Boolean(name)).join(' · ')
      : 'Verified buyers'

  return {
    id: entry.product_id,
    type: 'product',
    name: entry.product_name,
    initial: entry.product_name.charAt(0).toUpperCase() || 'P',
    logoTone: toneFor(entry.product_id),
    category: normalizePublishedValue(entry.primary_category) ?? 'Software',
    tagline: normalizePublishedValue(entry.short_description) ?? normalizePublishedValue(entry.what_is) ?? '',
    rating: entry.avg_rating ?? 0,
    reviewCount: entry.total_reviews ?? 0,
    reviewSource,
    bestFor: normalizePublishedValue(entry.best_for) ?? '—',
    notFor: normalizePublishedValue(entry.not_for) ?? '—',
    segment: firstSegment(entry.target_segments),
    pricingBucket: normalizePublishedValue(entry.pricing_bucket) ?? '—',
    entryPrice: normalizePublishedValue(plan?.price_text) ?? (plan?.price_value != null ? `$${plan.price_value}` : '—'),
    priceUnit: normalizePublishedValue(plan?.billing_period) ? `/${normalizePublishedValue(plan?.billing_period)}` : '',
    pricingModel: normalizePublishedValue(plan?.pricing_model) ?? (entry.free_plan ? 'Free plan available' : '—'),
    freeTrial: entry.free_trial,
    freePlan: entry.free_plan,
    contactSales: entry.pricing_plans.some((p) => p.is_contact_sales),
    keyLimits: flattenLimits(plan?.limits) ?? '—',
    implComplexity: complexity,
    rolloutTimeline: normalizePublishedValue(entry.typical_timeline) ?? '—',
    onboardingEffort: complexity === 'Low' ? 'Light' : complexity === 'High' ? 'Heavy' : 'Moderate',
    adminSkill: complexity === 'Low' ? 'Low' : complexity === 'High' ? 'High' : 'Medium',
    migrationRisk: complexity,
    fitScore,
    recommendedPath: PATH_BY_COMPLEXITY[complexity],
    fit: {
      teamSize: firstSegment(entry.target_segments),
      industryFit: normalizePublishedValue(entry.best_for) ?? '—',
      workflows: normalizePublishedList(entry.core_features),
      integrations: normalizePublishedList(entry.integration_labels),
      compliance: normalizePublishedList(entry.compliance_labels),
      deployment: normalizePublishedList(entry.deployment_models).join(', ') || 'Cloud (SaaS)',
      verdict: normalizePublishedValue(entry.short_description) ?? normalizePublishedValue(entry.best_for) ?? '—',
    },
    reviews: {
      pros: normalizePublishedList(entry.pros),
      cons: normalizePublishedList(entry.cons),
      sentiment: normalizePublishedList(entry.sentiment),
      reviewerSegment: normalizePublishedValue(entry.reviewer_segment) ?? firstSegment(entry.target_segments),
      reviewerIndustry: normalizePublishedValue(entry.reviewer_industry) ?? normalizePublishedValue(entry.primary_category) ?? '—',
      outcomes: normalizePublishedList(entry.outcomes),
    },
    alternatives: (entry.alternatives ?? []).filter((alt) => !isUnpublishedValue(alt.product_name)).map((alt) => ({
      id: alt.product_id,
      name: alt.product_name,
      initial: alt.product_name.charAt(0).toUpperCase() || '?',
      category: normalizePublishedValue(alt.primary_category) ?? '—',
      rating: alt.avg_rating ?? 0,
      logoUrl: getProductLogoUrl(alt.product_id, alt.logo_url),
    })),
    vendorName: normalizePublishedValue(entry.vendor_name),
    logoUrl: getProductLogoUrl(entry.product_id, entry.logo_url),
    officialWebsite: normalizePublishedValue(entry.official_website),
  }
}
