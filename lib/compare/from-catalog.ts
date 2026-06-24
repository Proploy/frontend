// lib/compare/from-catalog.ts — adapts a live catalog ProductDetail into the Entity
// shape the comparison components consume. The /compare page was built against mock
// Entities; this lets real, selected products flow through the same table unchanged.
// Fields the catalog API doesn't supply degrade gracefully (—, [], null).

import type { ProductDetail } from '@/features/catalog/products/types'
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
    expertCount: null,
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
