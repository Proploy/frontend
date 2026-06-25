import {
  mapProductCardToCardProduct,
  mapProductListResponseToPage,
  mapPricingPlanItemToTier,
  mapRatingItemToReviewSource,
  mapProductDetailToPageModel,
} from '../mappers'
import type { ProductCard, ProductCardResponse, ProductDetail, PricingPlanItem, RatingItem, ProductMediaAssetItem } from '../types'

// ── Test Fixtures ────────────────────────────────────────────────────────────

const mockProductCard: ProductCard = {
  product_id: 'prod-123',
  slug: 'salesforce-crm',
  product_name: 'Salesforce CRM',
  vendor_name: 'Salesforce',
  short_description: 'The world\'s #1 CRM platform.',
  primary_category: 'CRM',
  approved_logo_url: 'https://example.com/logo.png',
  avg_rating: 4.5,
  total_reviews: 1243,
  pricing_bucket: 'enterprise',
  free_trial: true,
  free_plan: false,
  implementation_complexity: 'high',
  typical_timeline: '3-6 months',
}

const mockProductCardResponse: ProductCardResponse = {
  count: 1,
  results: [mockProductCard],
  total: 150,
}

const mockPricingPlan: PricingPlanItem = {
  plan_id: 'plan-1',
  plan_name: 'Enterprise',
  price_text: '$300/user/month',
  price_value: 300,
  currency: 'USD',
  price_usd: 300,
  billing_period: 'monthly',
  plan_type: 'enterprise',
  is_free: false,
  is_trial: false,
  is_contact_sales: true,
  features: {
    'Advanced Analytics': 'included',
    'Custom Integrations': 'included',
    'Dedicated Support': 'included',
  },
  limits: {
    'Users': 'unlimited',
    'Storage': '100 GB',
  },
  pricing_model: 'per_user',
  source_url: 'https://salesforce.com/pricing',
}

const mockRating: RatingItem = {
  rating_id: 'rating-1',
  source_name: 'G2',
  source_kind: 'review_platform',
  rating: 4.6,
  review_count: 500,
}

const mockProductDetail: ProductDetail = {
  product_id: 'prod-123',
  slug: 'salesforce-crm',
  product_name: 'Salesforce CRM',
  vendor_name: 'Salesforce',
  official_website: 'https://salesforce.com',
  short_description: 'The world\'s #1 CRM platform.',
  what_is: 'Salesforce is a cloud-based CRM platform.',
  best_for: 'Enterprise sales teams',
  not_for: 'Small businesses with simple needs',
  core_features: ['Lead Management', 'Opportunity Tracking', 'Forecasting'],
  integration_labels: ['Slack', 'Outlook', 'Gmail'],
  compliance_labels: ['SOC 2', 'ISO 27001', 'GDPR'],
  implementation_complexity: 'high',
  typical_timeline: '3-6 months',
  primary_category: 'crm',
  all_categories: [],
  deployment_models: ['cloud'],
  target_segments: ['enterprise', 'mid-market'],
  free_trial: true,
  free_plan: false,
  pricing_bucket: 'enterprise',
  market_presence_score: 95.5,
  avg_rating: 4.5,
  total_reviews: 1243,
  pricing_plans: [mockPricingPlan],
  ratings: [mockRating],
  logo_url: 'https://example.com/logo.png',
  pros: [],
  cons: [],
}

const mockMedia: ProductMediaAssetItem[] = [
  {
    media_id: 'media-1',
    asset_kind: 'logo',
    public_url: 'https://example.com/logo.png',
    mime_type: 'image/png',
    width: 400,
    height: 400,
    alt_text: 'Salesforce Logo',
    display_order: 0,
  },
  {
    media_id: 'media-2',
    asset_kind: 'screenshot',
    public_url: 'https://example.com/screenshot.png',
    mime_type: 'image/png',
    width: 1920,
    height: 1080,
    alt_text: 'Dashboard Screenshot',
    display_order: 1,
  },
]

// ── Tests ────────────────────────────────────────────────────────────────────

describe('mapProductCardToCardProduct', () => {
  it('maps all fields correctly', () => {
    const result = mapProductCardToCardProduct(mockProductCard)

    expect(result).toEqual({
      product_id: 'prod-123',
      product_name: 'Salesforce CRM',
      product_description: 'The world\'s #1 CRM platform.',
      product_logo: 'https://example.com/logo.png',
      rating: 4.5,
      reviews: 1243,
      primary_category: 'CRM',
      vendor_name: 'Salesforce',
      free_plan_available: false,
      free_trial_available: true,
    })
  })

  it('handles null values gracefully', () => {
    const cardWithNulls: ProductCard = {
      ...mockProductCard,
      vendor_name: null,
      short_description: null,
      approved_logo_url: null,
      avg_rating: null,
      total_reviews: null,
      primary_category: null,
      pricing_bucket: null,
      implementation_complexity: null,
      typical_timeline: null,
    }

    const result = mapProductCardToCardProduct(cardWithNulls)

    expect(result.vendor_name).toBeNull()
    expect(result.product_description).toBeNull()
    expect(result.product_logo).toBeNull()
    expect(result.rating).toBeNull()
    expect(result.reviews).toBeNull()
    expect(result.primary_category).toBeNull()
  })
})

describe('mapProductListResponseToPage', () => {
  it('calculates pagination correctly', () => {
    const result = mapProductListResponseToPage(mockProductCardResponse, 30, 0)

    expect(result.pagination).toEqual({
      page: 1,
      limit: 30,
      total: 150,
      totalPages: 5,
      hasNextPage: true,
      hasPreviousPage: false,
    })
  })

  it('maps products through mapProductCardToCardProduct', () => {
    const result = mapProductListResponseToPage(mockProductCardResponse, 30, 0)

    expect(result.products).toHaveLength(1)
    expect(result.products[0].product_id).toBe('prod-123')
  })

  it('handles page 2 correctly', () => {
    const result = mapProductListResponseToPage(mockProductCardResponse, 30, 30)

    expect(result.pagination.page).toBe(2)
    expect(result.pagination.hasPreviousPage).toBe(true)
  })

  it('handles last page correctly', () => {
    const result = mapProductListResponseToPage(mockProductCardResponse, 30, 120)

    expect(result.pagination.page).toBe(5)
    expect(result.pagination.hasNextPage).toBe(false)
  })
})

describe('mapPricingPlanItemToTier', () => {
  it('converts features object to array of label/value pairs', () => {
    const result = mapPricingPlanItemToTier(mockPricingPlan)

    expect(result.features).toEqual([
      { label: 'Advanced Analytics', value: 'included' },
      { label: 'Custom Integrations', value: 'included' },
      { label: 'Dedicated Support', value: 'included' },
    ])
  })

  it('converts limits object to array of label/value pairs', () => {
    const result = mapPricingPlanItemToTier(mockPricingPlan)

    expect(result.limits).toEqual([
      { label: 'Users', value: 'unlimited' },
      { label: 'Storage', value: '100 GB' },
    ])
  })

  it('preserves pricing source URL', () => {
    const result = mapPricingPlanItemToTier(mockPricingPlan)

    expect(result.source_url).toBe('https://salesforce.com/pricing')
  })

  it('handles array features', () => {
    const planWithArrayFeatures: PricingPlanItem = {
      ...mockPricingPlan,
      features: ['Feature A', 'Feature B'],
      limits: ['Limit A'],
    }

    const result = mapPricingPlanItemToTier(planWithArrayFeatures)

    expect(result.features).toEqual([
      { label: 'Feature A', value: 'included' },
      { label: 'Feature B', value: 'included' },
    ])
    expect(result.limits).toEqual([
      { label: 'Limit A', value: 'limited' },
    ])
  })

  it('handles null features and limits', () => {
    const planWithNulls: PricingPlanItem = {
      ...mockPricingPlan,
      features: null,
      limits: null,
    }

    const result = mapPricingPlanItemToTier(planWithNulls)

    expect(result.features).toEqual([])
    expect(result.limits).toEqual([])
  })
})

describe('mapRatingItemToReviewSource', () => {
  it('maps rating fields correctly', () => {
    const result = mapRatingItemToReviewSource(mockRating)

    expect(result).toEqual({
      source_name: 'G2',
      source_kind: 'review_platform',
      avg_rating: 4.6,
      total_reviews: 500,
    })
  })
})

describe('mapProductDetailToPageModel', () => {
  it('maps all fields including inline sub-resources', () => {
    const result = mapProductDetailToPageModel(mockProductDetail, mockMedia)

    expect(result.product_id).toBe('prod-123')
    expect(result.product_name).toBe('Salesforce CRM')
    expect(result.pricing_plans).toHaveLength(1)
    expect(result.ratings).toHaveLength(1)
    expect(result.media).toHaveLength(2)
    expect(result.all_categories).toEqual(mockProductDetail.all_categories)
    expect(result.deployment_models).toEqual(['cloud'])
    expect(result.target_segments).toEqual(['enterprise', 'mid-market'])
  })

  it('does not invent fields that are absent from the backend contract', () => {
    const result = mapProductDetailToPageModel(mockProductDetail, mockMedia)

    expect(result).not.toHaveProperty('agent_summary')
    expect(result).not.toHaveProperty('deployment_model')
    expect(result).not.toHaveProperty('pricing_summary')
    expect(result).not.toHaveProperty('target_company_sizes')
    expect(result).not.toHaveProperty('alternatives')
  })

  it('handles empty media array', () => {
    const result = mapProductDetailToPageModel(mockProductDetail, [])

    expect(result.media).toEqual([])
  })

  it('handles empty pricing_plans and ratings', () => {
    const detailWithoutSubResources: ProductDetail = {
      ...mockProductDetail,
      pricing_plans: [],
      ratings: [],
    }

    const result = mapProductDetailToPageModel(detailWithoutSubResources, mockMedia)

    expect(result.pricing_plans).toEqual([])
    expect(result.ratings).toEqual([])
  })
})
