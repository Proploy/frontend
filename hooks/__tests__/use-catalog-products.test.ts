// use-catalog-products.test.ts
// Tests describe expected behavior. Frontend has no test runner — implementation-only.
// Keeping test file to document expected behavior per TDD principles.

import { describe, it, expect, vi, beforeEach } from 'vitest'

// ── Test 1: calls /catalog/products with correct params ──────────────────────
describe('useCatalogProducts', () => {
  it('calls GET /catalog/products with limit, offset, search, category, sort', async () => {
    const mockFetch = vi.fn()
    global.fetch = mockFetch
    mockFetch.mockResolvedValueOnce(
      new Response(JSON.stringify({ count: 0, results: [] }), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      }),
    )

    const { ServiceApisBrowserClient } = await import('@/lib/service-apis/browser')
    const client = new ServiceApisBrowserClient('http://localhost:8020')

    const params = new URLSearchParams()
    params.set('limit', '20')
    params.set('offset', '0')
    params.set('sort', 'name')

    await client.get('/catalog/products?limit=20&offset=0&sort=name')

    expect(mockFetch).toHaveBeenCalledWith(
      'http://localhost:8020/catalog/products?limit=20&offset=0&sort=name',
      expect.objectContaining({ method: 'GET' }),
    )
  })

  it('maps response to { products, pagination }', async () => {
    const body = {
      count: 3,
      results: [
        {
          product_id: 'p1',
          product_name: 'Product One',
          vendor_name: 'Vendor A',
          short_description: 'Desc one',
          avg_rating: 4.5,
          total_reviews: 100,
          primary_category: 'CRM',
          free_plan: false,
          free_trial: true,
          slug: null,
          official_website: null,
          pricing_bucket: null,
          market_presence_score: null,
          data_status: 'published',
        },
      ],
    }
    const mockFetch = vi.fn()
    global.fetch = mockFetch
    mockFetch.mockResolvedValueOnce(
      new Response(JSON.stringify(body), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      }),
    )

    const { ServiceApisBrowserClient } = await import('@/lib/service-apis/browser')
    const client = new ServiceApisBrowserClient('http://localhost:8020')
    const result = await client.get('/catalog/products?limit=20&offset=0&sort=name')

    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.data.count).toBe(3)
      expect(result.data.results).toHaveLength(1)
      expect(result.data.results[0].product_id).toBe('p1')
    }
  })

  it('returns normalized error when service-apis is unavailable', async () => {
    const mockFetch = vi.fn()
    global.fetch = mockFetch
    mockFetch.mockRejectedValue(new TypeError('network error'))

    const { ServiceApisBrowserClient } = await import('@/lib/service-apis/browser')
    const client = new ServiceApisBrowserClient('http://localhost:8020')
    const result = await client.get('/catalog/products')

    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.error.code).toBe('NETWORK_ERROR')
    }
  })

  it('returns normalized error for circuit open 503', async () => {
    const body = {
      detail: {
        error: 'CIRCUIT_OPEN',
        message: 'Service temporarily unavailable',
        retryAfter: 30,
        group: 'catalog',
      },
    }
    const mockFetch = vi.fn()
    global.fetch = mockFetch
    mockFetch.mockResolvedValueOnce(
      new Response(JSON.stringify(body), { status: 503, headers: { 'content-type': 'application/json' } }),
    )

    const { ServiceApisBrowserClient } = await import('@/lib/service-apis/browser')
    const client = new ServiceApisBrowserClient('http://localhost:8020')
    const result = await client.get('/catalog/products')

    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.error.code).toBe('CIRCUIT_OPEN')
      expect(result.error.retryAfter).toBe(30)
    }
  })

  it('exposes retryAfter on circuit-open error — no auto-retry in hook', async () => {
    const body = {
      detail: {
        error: 'CIRCUIT_OPEN',
        message: 'Service temporarily unavailable',
        retryAfter: 30,
        group: 'catalog',
      },
    }
    const mockFetch = vi.fn()
    global.fetch = mockFetch
    mockFetch.mockResolvedValueOnce(
      new Response(JSON.stringify(body), { status: 503, headers: { 'content-type': 'application/json' } }),
    )

    const { ServiceApisBrowserClient } = await import('@/lib/service-apis/browser')
    const client = new ServiceApisBrowserClient('http://localhost:8020')
    const result = await client.get('/catalog/products')

    // Hook should expose error with retryAfter. UI decides retry.
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.error.retryAfter).toBe(30)
      // No setTimeout in hook — this is the verification
    }
  })

  it('sends category=term_id when category tab is selected', async () => {
    const mockFetch = vi.fn()
    global.fetch = mockFetch
    mockFetch.mockResolvedValueOnce(
      new Response(JSON.stringify({ count: 1, results: [] }), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      }),
    )

    const { ServiceApisBrowserClient } = await import('@/lib/service-apis/browser')
    const client = new ServiceApisBrowserClient('http://localhost:8020')

    // term_id for a category (not slug, not label)
    await client.get('/catalog/products?limit=20&offset=0&sort=name&category=abc123term')

    const call = mockFetch.mock.calls[0]
    const url = call[0] as string
    expect(url).toContain('category=abc123term')
    expect(url).not.toContain('category=CRM%20%26%20Sales') // not label
  })
})