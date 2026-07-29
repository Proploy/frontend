// lib/compare/data.ts — shared types and display metadata for live comparisons.

export type EntityType = 'product'
export type LogoTone = 'brand' | 'pink' | 'success' | 'blue' | 'indigo'
export type Complexity = 'Low' | 'Medium' | 'High'
export type RecommendedPath =
  | 'Self-serve'
  | 'Guided setup'
  | 'Expert-led implementation'
  | 'White-glove project'

export interface EntityFit {
  teamSize: string
  industryFit: string
  workflows: string[]
  integrations: string[]
  compliance: string[]
  deployment: string
  verdict: string
}

export interface EntityReviews {
  pros: string[]
  cons: string[]
  sentiment: string[]
  reviewerSegment: string
  reviewerIndustry: string
  outcomes?: string[]
}

export interface AlternativeEntity {
  id?: string
  name: string
  initial: string
  category: string
  rating?: number | null
  logoUrl?: string | null
}

export interface Entity {
  id: string
  type: EntityType
  name: string
  initial: string
  logoTone: LogoTone
  category: string
  tagline: string
  rating: number
  reviewCount: number
  reviewSource: string
  bestFor: string
  notFor: string
  segment: string
  pricingBucket: string
  entryPrice: string
  priceUnit: string
  pricingModel: string
  freeTrial: boolean
  freePlan: boolean
  contactSales: boolean
  keyLimits: string
  implComplexity: Complexity
  rolloutTimeline: string
  onboardingEffort: string
  adminSkill: string
  migrationRisk: Complexity
  recommendedPath: RecommendedPath
  fit: EntityFit
  reviews: EntityReviews
  alternatives: AlternativeEntity[]
  // Optional fields populated by the service-apis catalog detail mapper.
  vendorName?: string | null
  logoUrl?: string | null
  officialWebsite?: string | null
}

export const TABS = ['At a glance', 'Pricing', 'Fit', 'Implementation', 'Reviews', 'Alternatives'] as const
export type Tab = (typeof TABS)[number]

export const TYPE_META: Record<EntityType, { label: string; color: string; bg: string; border: string }> = {
  product: { label: 'Product', color: '#155eef', bg: '#eff4ff', border: '#b2ccff' },
}

export const PATH_META: Record<RecommendedPath, { blurb: string; tier: number }> = {
  'Self-serve': { blurb: 'You set it up yourself with docs & templates.', tier: 1 },
  'Guided setup': { blurb: 'Light expert help on config & onboarding.', tier: 2 },
  'Expert-led implementation': { blurb: 'A vetted expert owns the rollout end to end.', tier: 3 },
  'White-glove project': { blurb: 'Full project team handles migration & change.', tier: 4 },
}
