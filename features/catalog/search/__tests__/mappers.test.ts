import {
  mapKeywordSearchResultToCardProduct,
  mapKeywordSearchResponseToResults,
  mapCatalogSearchResultToCardProduct,
  mapCatalogSearchResponseToResults,
} from '../mappers'
import type { KeywordSearchResult, KeywordSearchResponse, CatalogSearchResult, CatalogSearchResponse } from '../types'

beforeEach(() => {
  vi.stubEnv('NEXT_PUBLIC_SERVICE_APIS_URL', 'http://localhost:8020')
})

afterAll(() => {
  vi.unstubAllEnvs()
})

// ── Test Fixtures ────────────────────────────────────────────────────────────

const mockKeywordResult: KeywordSearchResult = {
  product_id: 'prod-1',
  product_name: 'Salesforce CRM',
  slug: 'salesforce-crm',
  vendor_name: 'Salesforce',
  primary_category: 'CRM',
  approved_logo_url: 'https://example.com/logo.png',
}

const mockKeywordResponse: KeywordSearchResponse = {
  results: [mockKeywordResult],
  count: 5,
}

const mockCatalogSearchResult: CatalogSearchResult = {
  product_id: 'prod-1',
  product_name: 'Salesforce CRM',
  vendor_name: 'Salesforce',
  short_description: 'The world\'s #1 CRM platform.',
  avg_rating: 4.5,
  total_reviews: 1243,
  deployment_model: 'cloud',
  implementation_complexity: 'high',
  typical_timeline: '3-6 months',
  free_trial: true,
  free_plan: false,
  fit_score: 0.95,
  pricing_bucket: 'enterprise',
  market_presence_score: 95.5,
  approved_logo_url: 'https://example.com/logo.png',
  primary_category: 'CRM',
}

const mockCatalogSearchResponse: CatalogSearchResponse = {
  count: 10,
  results: [mockCatalogSearchResult],
  facets: null,
  note: null,
}

// ── Tests ────────────────────────────────────────────────────────────────────

describe('mapKeywordSearchResultToCardProduct', () => {
  it('maps keyword search result to card product', () => {
    const result = mapKeywordSearchResultToCardProduct(mockKeywordResult)

    expect(result).toEqual({
      product_id: 'prod-1',
      product_name: 'Salesforce CRM',
      product_description: null, // Not in keyword search
      product_logo: '/api/proxy/api/v1/catalog/products/prod-1/logo',
      rating: null, // Not in keyword search
      reviews: null,
      primary_category: 'CRM',
      vendor_name: 'Salesforce',
      free_plan_available: false, // Not in keyword search
      free_trial_available: false,
    })
  })
})

describe('mapKeywordSearchResponseToResults', () => {
  it('calculates pagination correctly', () => {
    const result = mapKeywordSearchResponseToResults(mockKeywordResponse, 20, 0)

    expect(result.pagination).toEqual({
      page: 1,
      limit: 20,
      total: 5,
      totalPages: 1,
      hasNextPage: false,
      hasPreviousPage: false,
    })
  })

  it('maps results through mapKeywordSearchResultToCardProduct', () => {
    const result = mapKeywordSearchResponseToResults(mockKeywordResponse, 20, 0)

    expect(result.products).toHaveLength(1)
    expect(result.products[0].product_id).toBe('prod-1')
  })

  it('does not expose unpublished products', () => {
    const result = mapKeywordSearchResponseToResults({
      ...mockKeywordResponse,
      results: [mockKeywordResult, { ...mockKeywordResult, product_id: 'hidden', product_name: 'Not published' }],
    }, 20, 0)

    expect(result.products.map((product) => product.product_id)).toEqual(['prod-1'])
  })
})

describe('mapCatalogSearchResultToCardProduct', () => {
  it('maps hybrid search result to card product', () => {
    const result = mapCatalogSearchResultToCardProduct(mockCatalogSearchResult)

    expect(result).toEqual({
      product_id: 'prod-1',
      product_name: 'Salesforce CRM',
      product_description: 'The world\'s #1 CRM platform.',
      product_logo: '/api/proxy/api/v1/catalog/products/prod-1/logo',
      rating: 4.5,
      reviews: 1243,
      primary_category: 'CRM',
      vendor_name: 'Salesforce',
      free_plan_available: false,
      free_trial_available: true,
    })
  })
})

describe('mapCatalogSearchResponseToResults', () => {
  it('calculates pagination correctly', () => {
    const result = mapCatalogSearchResponseToResults(mockCatalogSearchResponse, 20, 0)

    expect(result.pagination).toEqual({
      page: 1,
      limit: 20,
      total: 10,
      totalPages: 1,
      hasNextPage: false,
      hasPreviousPage: false,
    })
  })

  it('maps results through mapCatalogSearchResultToCardProduct', () => {
    const result = mapCatalogSearchResponseToResults(mockCatalogSearchResponse, 20, 0)

    expect(result.products).toHaveLength(1)
    expect(result.products[0].product_id).toBe('prod-1')
  })

  it('does not expose unpublished products', () => {
    const result = mapCatalogSearchResponseToResults({
      ...mockCatalogSearchResponse,
      results: [mockCatalogSearchResult, { ...mockCatalogSearchResult, product_id: 'hidden', product_name: 'unpublished' }],
    }, 20, 0)

    expect(result.products.map((product) => product.product_id)).toEqual(['prod-1'])
  })
})
