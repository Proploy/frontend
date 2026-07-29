// features/compare/__tests__/client-api.test.ts
//
// Unit-tests for the dedicated compare endpoint client.
// Mocks ServiceApisBrowserClient so the assertions stay focused on URL, body,
// and response unwrap — not on transport internals.

import { compareApi, isCompareV2Enabled } from '../client-api'
import type { CompareRequest, CompareResponse } from '../client-api'

const { postMock } = vi.hoisted(() => ({ postMock: vi.fn() }))

vi.mock('@/lib/service-apis/browser', () => ({
  ServiceApisBrowserClient: vi.fn(function ServiceApisBrowserClientMock() {
    return {
      post: postMock,
      patch: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
    }
  }),
}))

const successResponse: CompareResponse = {
  count: 1,
  results: [
    {
      product_id: 'prod_a',
      slug: 'prod-a',
      product_name: 'Product A',
      vendor_name: 'Vendor A',
      official_website: 'https://a.example',
      logo_url: 'https://cdn.example/a.png',
      short_description: 'A is great',
      what_is: null,
      best_for: 'Ops teams',
      not_for: 'Engineering teams',
      pros: ['fast'],
      cons: ['pricey'],
      core_features: ['workflows'],
      integration_labels: ['Slack'],
      compliance_labels: ['SOC 2'],
      deployment_models: ['Cloud (SaaS)'],
      primary_category: 'Project Management',
      all_categories: [],
      target_segments: ['Mid-market'],
      pricing_plans: [
        {
          plan_id: 'plan_a',
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
          features: ['Workflows'],
          limits: { seats: '2' },
          pricing_model: 'per seat',
          source_url: null,
        },
      ],
      pricing_bucket: '$$',
      free_trial: true,
      free_plan: false,
      implementation_complexity: 'Medium',
      typical_timeline: '3–6 weeks',
      market_presence_score: 80,
      avg_rating: 4.5,
      total_reviews: 1000,
      ratings: [{ rating_id: 'r1', source_name: 'G2', source_kind: 'g2', rating: 4.5, review_count: 800 }],
      sentiment: ['Easy onboarding'],
      outcomes: ['94% on-budget'],
      reviewer_segment: '60% Mid-market',
      reviewer_industry: 'Marketing',
      alternatives: [
        { product_id: 'prod_b', product_name: 'Product B', primary_category: 'Project Management', avg_rating: 4.2, logo_url: null },
      ],
    },
  ],
  missing_ids: ['prod_missing'],
}

describe('compareApi.compareProducts', () => {
  beforeEach(() => {
    postMock.mockReset()
  })

  it('POSTs to the dedicated compare endpoint with the right URL and body', async () => {
    postMock.mockResolvedValueOnce({ ok: true, data: successResponse })

    const request: CompareRequest = { product_ids: ['prod_a', 'prod_missing'] }
    const res = await compareApi.compareProducts(request)

    expect(postMock).toHaveBeenCalledTimes(1)
    expect(postMock).toHaveBeenCalledWith(
      '/api/v1/catalog/compare',
      request,
      undefined,
    )
    expect(res.ok).toBe(true)
  })

  it('forwards CatalogRequestOptions to the transport', async () => {
    postMock.mockResolvedValueOnce({ ok: true, data: successResponse })

    const options = { requireAuth: true, accessToken: 'token-xyz' }
    await compareApi.compareProducts({ product_ids: ['prod_a'] }, options)

    expect(postMock).toHaveBeenCalledWith(
      '/api/v1/catalog/compare',
      { product_ids: ['prod_a'] },
      options,
    )
  })

  it('unwraps a successful response and exposes results + missing_ids', async () => {
    postMock.mockResolvedValueOnce({ ok: true, data: successResponse })

    const res = await compareApi.compareProducts({ product_ids: ['prod_a', 'prod_missing'] })

    expect(res.ok).toBe(true)
    if (res.ok) {
      expect(res.data.count).toBe(1)
      expect(res.data.results).toHaveLength(1)
      expect(res.data.results[0]?.product_id).toBe('prod_a')
      expect(res.data.missing_ids).toEqual(['prod_missing'])
    }
  })

  it('propagates transport errors unchanged', async () => {
    const transportError = {
      ok: false,
      error: 'NETWORK_ERROR',
      message: 'Network down',
      statusCode: 0,
    }
    postMock.mockResolvedValueOnce(transportError)

    const res = await compareApi.compareProducts({ product_ids: ['prod_a'] })

    expect(res.ok).toBe(false)
    expect(res).toEqual(transportError)
  })
})

describe('isCompareV2Enabled', () => {
  const originalEnv = process.env.NEXT_PUBLIC_COMPARE_ENDPOINT_V2

  afterEach(() => {
    if (originalEnv === undefined) {
      delete process.env.NEXT_PUBLIC_COMPARE_ENDPOINT_V2
    } else {
      process.env.NEXT_PUBLIC_COMPARE_ENDPOINT_V2 = originalEnv
    }
  })

  it('returns false when env var is unset', () => {
    delete process.env.NEXT_PUBLIC_COMPARE_ENDPOINT_V2
    expect(isCompareV2Enabled()).toBe(false)
  })

  it('returns false when env var is "false"', () => {
    process.env.NEXT_PUBLIC_COMPARE_ENDPOINT_V2 = 'false'
    expect(isCompareV2Enabled()).toBe(false)
  })

  it('returns true only when env var is exactly "true"', () => {
    process.env.NEXT_PUBLIC_COMPARE_ENDPOINT_V2 = 'true'
    expect(isCompareV2Enabled()).toBe(true)
  })
})
