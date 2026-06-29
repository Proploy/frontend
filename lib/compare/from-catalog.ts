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
//     the backend ships POST /api/v1/catalog/products/compare. Threads every
//     field through.

import type { ProductDetail, PricingPlanItem } from '@/features/catalog/products/types'
import type { CompareProductEntry } from '@/features/compare/client-api'
import type { Complexity, Entity, LogoTone, RecommendedPath } from './data'

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
  return segments.length ? segments.join(' · ') : '—'
}

// Flatten PricingPlanItem.limits (Record | string[] | null) into a one-line summary.
function flattenLimits(limits: PricingPlanItem['limits']): string | null {
  if (!limits) return null
  if (Array.isArray(limits)) return limits.length ? limits.join('; ') : null
  if (typeof limits === 'object') {
    const entries = Object.entries(limits)
      .filter(([, v]) => v != null)
      .map(([k, v]) => {
        const value = typeof v === 'object' ? JSON.stringify(v) : String(v)
        return `${k}: ${value}`
      })
    return entries.length ? entries.join('; ') : null
  }
  return null
}

// ---- Legacy mapper (kept until chunk E removes it) -----------------------

export function productDetailToEntity(detail: ProductDetail): Entity {
  const complexity = toComplexity(detail.implementation_complexity)
  const entry = detail.pricing_plans.find((p) => !p.is_free && !p.is_contact_sales) ?? detail.pricing_plans[0]
  const fitScore =
    detail.market_presence_score != null ? Math.round(Math.max(0, Math.min(100, detail.market_presence_score))) : 0

  return {
    id: detail.product_id,
    type: 'product',
    name: detail.product_name,
    initial: detail.product_name.charAt(0).toUpperCase() || 'P',
    logoTone: toneFor(detail.product_id),
    category: detail.primary_category ?? 'Software',
    tagline: detail.short_description ?? detail.what_is ?? '',
    rating: detail.avg_rating ?? 0,
    reviewCount: detail.total_reviews ?? 0,
    reviewSource: detail.ratings[0]?.source_name ?? 'Verified buyers',
    bestFor: detail.best_for ?? '—',
    notFor: detail.not_for ?? '—',
    segment: firstSegment(detail.target_segments),
    pricingBucket: detail.pricing_bucket ?? '—',
    entryPrice: entry?.price_text ?? (entry?.price_value != null ? `$${entry.price_value}` : '—'),
    priceUnit: entry?.billing_period ? `/${entry.billing_period}` : '',
    pricingModel: entry?.pricing_model ?? (detail.free_plan ? 'Free plan available' : '—'),
    freeTrial: detail.free_trial,
    freePlan: detail.free_plan,
    contactSales: detail.pricing_plans.some((p) => p.is_contact_sales),
    keyLimits: '—',
    implComplexity: complexity,
    rolloutTimeline: detail.typical_timeline ?? '—',
    onboardingEffort: complexity === 'Low' ? 'Light' : complexity === 'High' ? 'Heavy' : 'Moderate',
    adminSkill: complexity === 'Low' ? 'Low' : complexity === 'High' ? 'High' : 'Medium',
    migrationRisk: complexity,
    fitScore,
    recommendedPath: PATH_BY_COMPLEXITY[complexity],
    fit: {
      teamSize: firstSegment(detail.target_segments),
      industryFit: detail.best_for ?? '—',
      workflows: detail.core_features ?? [],
      integrations: detail.integration_labels ?? [],
      compliance: detail.compliance_labels ?? [],
      deployment: detail.deployment_models.length ? detail.deployment_models.join(', ') : 'Cloud (SaaS)',
      verdict: detail.short_description ?? detail.best_for ?? '—',
    },
    reviews: {
      pros: detail.pros ?? [],
      cons: detail.cons ?? [],
      sentiment: [],
      reviewerSegment: firstSegment(detail.target_segments),
      reviewerIndustry: detail.primary_category ?? '—',
    },
    alternatives: [],
  }
}

// ---- New mapper (driven by POST /api/v1/catalog/products/compare) ---------

export function compareEntryToEntity(entry: CompareProductEntry): Entity {
  const complexity = toComplexity(entry.implementation_complexity)
  const plan = entry.pricing_plans.find((p) => !p.is_free && !p.is_contact_sales) ?? entry.pricing_plans[0]

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
      ? entry.ratings.map((r) => r.source_name).filter(Boolean).join(' · ')
      : 'Verified buyers'

  return {
    id: entry.product_id,
    type: 'product',
    name: entry.product_name,
    initial: entry.product_name.charAt(0).toUpperCase() || 'P',
    logoTone: toneFor(entry.product_id),
    category: entry.primary_category ?? 'Software',
    tagline: entry.short_description ?? entry.what_is ?? '',
    rating: entry.avg_rating ?? 0,
    reviewCount: entry.total_reviews ?? 0,
    reviewSource,
    bestFor: entry.best_for ?? '—',
    notFor: entry.not_for ?? '—',
    segment: firstSegment(entry.target_segments),
    pricingBucket: entry.pricing_bucket ?? '—',
    entryPrice: plan?.price_text ?? (plan?.price_value != null ? `$${plan.price_value}` : '—'),
    priceUnit: plan?.billing_period ? `/${plan.billing_period}` : '',
    pricingModel: plan?.pricing_model ?? (entry.free_plan ? 'Free plan available' : '—'),
    freeTrial: entry.free_trial,
    freePlan: entry.free_plan,
    contactSales: entry.pricing_plans.some((p) => p.is_contact_sales),
    keyLimits: flattenLimits(plan?.limits) ?? '—',
    implComplexity: complexity,
    rolloutTimeline: entry.typical_timeline ?? '—',
    onboardingEffort: complexity === 'Low' ? 'Light' : complexity === 'High' ? 'Heavy' : 'Moderate',
    adminSkill: complexity === 'Low' ? 'Low' : complexity === 'High' ? 'High' : 'Medium',
    migrationRisk: complexity,
    fitScore,
    recommendedPath: PATH_BY_COMPLEXITY[complexity],
    fit: {
      teamSize: firstSegment(entry.target_segments),
      industryFit: entry.best_for ?? '—',
      workflows: entry.core_features ?? [],
      integrations: entry.integration_labels ?? [],
      compliance: entry.compliance_labels ?? [],
      deployment: entry.deployment_models.length ? entry.deployment_models.join(', ') : 'Cloud (SaaS)',
      verdict: entry.short_description ?? entry.best_for ?? '—',
    },
    reviews: {
      pros: entry.pros ?? [],
      cons: entry.cons ?? [],
      sentiment: entry.sentiment ?? [],
      reviewerSegment: entry.reviewer_segment ?? firstSegment(entry.target_segments),
      reviewerIndustry: entry.reviewer_industry ?? entry.primary_category ?? '—',
      outcomes: entry.outcomes ?? [],
    },
    alternatives: (entry.alternatives ?? []).map((alt) => ({
      id: alt.product_id,
      name: alt.product_name,
      initial: alt.product_name.charAt(0).toUpperCase() || '?',
      category: alt.primary_category ?? '—',
      rating: alt.avg_rating ?? 0,
      logoUrl: alt.logo_url ?? null,
    })),
    vendorName: entry.vendor_name ?? null,
    logoUrl: entry.logo_url ?? null,
    officialWebsite: entry.official_website ?? null,
  }
}
