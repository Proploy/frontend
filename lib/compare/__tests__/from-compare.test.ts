// lib/compare/__tests__/from-compare.test.ts
//
// Unit-tests for compareEntryToEntity — the mapper that turns the new compare
// endpoint payload into the Entity shape the /compare table consumes.

import { compareEntryToEntity } from '../from-catalog'
import type { CompareProductEntry, AlternativeItem } from '@/features/compare/client-api'
import type { PricingPlanItem, RatingItem } from '@/features/catalog/products/types'

// ---- Test fixture --------------------------------------------------------

function makeEntry(overrides: Partial<CompareProductEntry> = {}): CompareProductEntry {
  const plan: PricingPlanItem = {
    plan_id: 'plan_1',
    plan_name: 'Standard',
    price_text: '$9',
    price_value: 9,
    currency: 'USD',
    price_usd: 9,
    billing_period: 'month',
    plan_type: 'standard',
    is_free: false,
    is_trial: false,
    is_contact_sales: false,
    features: ['Workflows', 'Approvals'],
    limits: { seats: '2', projects: 'unlimited' },
    pricing_model: 'per seat',
    source_url: null,
  }

  const freePlan: PricingPlanItem = {
    ...plan,
    plan_id: 'plan_free',
    plan_name: 'Free',
    is_free: true,
    is_trial: false,
    is_contact_sales: false,
    price_text: null,
    price_value: null,
  }

  const rating: RatingItem = {
    rating_id: 'r1',
    source_name: 'G2',
    source_kind: 'g2',
    rating: 4.5,
    review_count: 800,
  }

  const alt: AlternativeItem = {
    product_id: 'prod_alt',
    product_name: 'Alt Product',
    primary_category: 'Project Management',
    avg_rating: 4.2,
    logo_url: 'https://cdn.example/alt.png',
  }

  return {
    product_id: 'prod_abc',
    slug: 'prod-abc',
    product_name: 'Prod ABC',
    vendor_name: 'Vendor Co',
    official_website: 'https://example.com',
    logo_url: 'https://cdn.example/abc.png',
    short_description: 'Short copy',
    what_is: 'Longer copy',
    best_for: 'Ops teams',
    not_for: 'Engineering teams',
    pros: ['fast', 'cheap'],
    cons: ['limited'],
    core_features: ['Workflows', 'Approvals'],
    integration_labels: ['Slack', 'Gmail'],
    compliance_labels: ['SOC 2'],
    deployment_models: ['Cloud (SaaS)'],
    primary_category: 'Project Management',
    all_categories: [],
    target_segments: ['Mid-market', 'Enterprise'],
    pricing_plans: [freePlan, plan],
    pricing_bucket: '$$',
    free_trial: true,
    free_plan: true,
    implementation_complexity: 'Medium',
    typical_timeline: '3–6 weeks',
    market_presence_score: 80,
    avg_rating: 4.5,
    total_reviews: 1000,
    ratings: [rating],
    sentiment: ['Easy onboarding', 'Responsive support'],
    outcomes: ['94% on-budget'],
    reviewer_segment: '60% Mid-market',
    reviewer_industry: 'Marketing',
    fit_score: 85,
    alternatives: [alt],
    ...overrides,
  }
}

// ---- Tests ----------------------------------------------------------------

describe('compareEntryToEntity — required fields', () => {
  it('maps identity fields verbatim', () => {
    const entity = compareEntryToEntity(makeEntry())
    expect(entity.id).toBe('prod_abc')
    expect(entity.name).toBe('Prod ABC')
    expect(entity.type).toBe('product')
    expect(entity.initial).toBe('P')
  })

  it('picks the cheapest non-free, non-contact-sales plan for entry price', () => {
    const entity = compareEntryToEntity(makeEntry())
    // The fixture has [freePlan, plan]. The mapper picks `plan` ($9 / month).
    expect(entity.entryPrice).toBe('$9')
    expect(entity.priceUnit).toBe('/month')
    expect(entity.pricingModel).toBe('per seat')
    expect(entity.contactSales).toBe(false)
  })

  it('flags contactSales when any plan is contact-sales', () => {
    const entity = compareEntryToEntity(
      makeEntry({
        pricing_plans: [
          {
            plan_id: 'p1',
            plan_name: 'Enterprise',
            price_text: null,
            price_value: null,
            currency: null,
            price_usd: null,
            billing_period: 'month',
            plan_type: null,
            is_free: false,
            is_trial: false,
            is_contact_sales: true,
            features: null,
            limits: null,
            pricing_model: null,
            source_url: null,
          },
        ],
      }),
    )
    expect(entity.contactSales).toBe(true)
  })

  it('flattens pricing_plans[0].limits into keyLimits', () => {
    const entity = compareEntryToEntity(makeEntry())
    expect(entity.keyLimits).toBe('seats: 2; projects: unlimited')
  })

  it('falls back to "—" when limits are null', () => {
    const entity = compareEntryToEntity(
      makeEntry({
        pricing_plans: [
          {
            plan_id: 'p1',
            plan_name: 'Free',
            price_text: null,
            price_value: null,
            currency: null,
            price_usd: null,
            billing_period: 'month',
            plan_type: null,
            is_free: true,
            is_trial: false,
            is_contact_sales: false,
            features: null,
            limits: null,
            pricing_model: null,
            source_url: null,
          },
        ],
      }),
    )
    expect(entity.keyLimits).toBe('—')
  })

  it('flattens string[] limits with semicolons', () => {
    const entity = compareEntryToEntity(
      makeEntry({
        pricing_plans: [
          {
            plan_id: 'p1',
            plan_name: 'Standard',
            price_text: '$9',
            price_value: 9,
            currency: 'USD',
            price_usd: 9,
            billing_period: 'month',
            plan_type: null,
            is_free: false,
            is_trial: false,
            is_contact_sales: false,
            features: null,
            limits: ['10 seats', '5 projects'],
            pricing_model: null,
            source_url: null,
          },
        ],
      }),
    )
    expect(entity.keyLimits).toBe('10 seats; 5 projects')
  })
})

describe('compareEntryToEntity — new optional fields', () => {
  it('threads vendorName, logoUrl, officialWebsite from CompareProductEntry', () => {
    const entity = compareEntryToEntity(makeEntry())
    expect(entity.vendorName).toBe('Vendor Co')
    expect(entity.logoUrl).toBe('https://cdn.example/abc.png')
    expect(entity.officialWebsite).toBe('https://example.com')
  })

  it('leaves the new optional fields null when backend omits them', () => {
    const entity = compareEntryToEntity(
      makeEntry({ vendor_name: null, logo_url: null, official_website: null }),
    )
    expect(entity.vendorName).toBeNull()
    expect(entity.logoUrl).toBeNull()
    expect(entity.officialWebsite).toBeNull()
  })
})

describe('compareEntryToEntity — review & sentiment fields', () => {
  it('surfaces real sentiment and outcomes (previously hardcoded empty)', () => {
    const entity = compareEntryToEntity(makeEntry())
    expect(entity.reviews.sentiment).toEqual(['Easy onboarding', 'Responsive support'])
    expect(entity.reviews.outcomes).toEqual(['94% on-budget'])
  })

  it('joins all rating source names into reviewSource', () => {
    const entity = compareEntryToEntity(
      makeEntry({
        ratings: [
          { rating_id: 'r1', source_name: 'G2', source_kind: 'g2', rating: 4.5, review_count: 800 },
          { rating_id: 'r2', source_name: 'Capterra', source_kind: 'capterra', rating: 4.4, review_count: 200 },
        ],
      }),
    )
    expect(entity.reviewSource).toBe('G2 · Capterra')
  })

  it('uses reviewer_segment / reviewer_industry when supplied', () => {
    const entity = compareEntryToEntity(makeEntry())
    expect(entity.reviews.reviewerSegment).toBe('60% Mid-market')
    expect(entity.reviews.reviewerIndustry).toBe('Marketing')
  })
})

describe('compareEntryToEntity — alternatives', () => {
  it('maps real alternatives with id + logoUrl (previously hardcoded [])', () => {
    const entity = compareEntryToEntity(makeEntry())
    expect(entity.alternatives).toHaveLength(1)
    expect(entity.alternatives[0]).toEqual({
      id: 'prod_alt',
      name: 'Alt Product',
      initial: 'A',
      category: 'Project Management',
      rating: 4.2,
      logoUrl: 'https://cdn.example/alt.png',
    })
  })

  it('returns [] when alternatives is missing', () => {
    const entity = compareEntryToEntity(makeEntry({ alternatives: [] }))
    expect(entity.alternatives).toEqual([])
  })
})

describe('compareEntryToEntity — fit & complexity', () => {
  it('trusts server fit_score when it is a number', () => {
    const entity = compareEntryToEntity(makeEntry({ fit_score: 91, market_presence_score: 50 }))
    expect(entity.fitScore).toBe(91)
  })

  it('falls back to market_presence_score when fit_score is missing', () => {
    const entity = compareEntryToEntity(
      makeEntry({ fit_score: undefined as unknown as number, market_presence_score: 73 }),
    )
    expect(entity.fitScore).toBe(73)
  })

  it('clamps fit_score to 0..100', () => {
    expect(compareEntryToEntity(makeEntry({ fit_score: 250 })).fitScore).toBe(100)
    expect(compareEntryToEntity(makeEntry({ fit_score: -10 })).fitScore).toBe(0)
  })

  it('maps complexity → onboardingEffort / adminSkill heuristically', () => {
    const low = compareEntryToEntity(makeEntry({ implementation_complexity: 'Easy' }))
    expect(low.implComplexity).toBe('Low')
    expect(low.onboardingEffort).toBe('Light')
    expect(low.adminSkill).toBe('Low')

    const high = compareEntryToEntity(makeEntry({ implementation_complexity: 'Complex' }))
    expect(high.implComplexity).toBe('High')
    expect(high.onboardingEffort).toBe('Heavy')
    expect(high.adminSkill).toBe('High')

    const medium = compareEntryToEntity(makeEntry({ implementation_complexity: 'Medium' }))
    expect(medium.implComplexity).toBe('Medium')
    expect(medium.onboardingEffort).toBe('Moderate')
    expect(medium.adminSkill).toBe('Medium')
  })
})

describe('compareEntryToEntity — graceful degradation', () => {
  it('produces a valid Entity when only required fields are set', () => {
    const minimal: CompareProductEntry = {
      product_id: 'prod_min',
      slug: null,
      product_name: 'Minimal',
      vendor_name: null,
      official_website: null,
      logo_url: null,
      short_description: null,
      what_is: null,
      best_for: null,
      not_for: null,
      pros: [],
      cons: [],
      core_features: [],
      integration_labels: [],
      compliance_labels: [],
      deployment_models: [],
      primary_category: null,
      all_categories: [],
      target_segments: [],
      pricing_plans: [],
      pricing_bucket: null,
      free_trial: false,
      free_plan: false,
      implementation_complexity: null,
      typical_timeline: null,
      market_presence_score: null,
      avg_rating: null,
      total_reviews: null,
      ratings: [],
      sentiment: [],
      outcomes: [],
      reviewer_segment: null,
      reviewer_industry: null,
      fit_score: 0,
      alternatives: [],
    }
    const entity = compareEntryToEntity(minimal)
    expect(entity.id).toBe('prod_min')
    expect(entity.name).toBe('Minimal')
    expect(entity.category).toBe('Software') // fallback when primary_category is null
    expect(entity.tagline).toBe('')
    expect(entity.entryPrice).toBe('—')
    expect(entity.fitScore).toBe(0)
    expect(entity.alternatives).toEqual([])
    expect(entity.reviews.sentiment).toEqual([])
    expect(entity.reviews.outcomes).toEqual([])
  })
})
