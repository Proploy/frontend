import { describe, expect, it, vi } from 'vitest'

import { mapProductAlternative } from '../mappers'

describe('product alternatives', () => {
  it('preserves the API product ID for detail navigation and comparison', () => {
    expect(mapProductAlternative({
      product_id: 'product/id',
      product_name: 'Alternative',
      short_description: null,
      pricing_bucket: null,
      logo_url: null,
    }).product_id).toBe('product/id')
  })

  it('maps alternative logo references through the service-apis logo route', () => {
    vi.stubEnv('NEXT_PUBLIC_SERVICE_APIS_URL', 'http://localhost:8020')

    expect(
      mapProductAlternative({
        product_id: 'prod-2',
        product_name: 'Two',
        logo_url: '/api/v1/catalog/products/prod-2/logo',
      }).logo_url,
    ).toBe('http://localhost:8020/api/v1/catalog/products/prod-2/logo')

    expect(
      mapProductAlternative({
        product_id: 'prod-3',
        product_name: 'Three',
        logo_url: null,
      }).logo_url,
    ).toBeNull()
  })
})
