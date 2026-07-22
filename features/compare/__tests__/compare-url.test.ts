import { buildCompareUrl } from '../compare-url'

describe('buildCompareUrl', () => {
  it('encodes the selected product IDs for the shared compare route', () => {
    expect(buildCompareUrl(['1350b8e1d7fe', 'a5d7a591337']))
      .toBe('/compare?products=1350b8e1d7fe%2Ca5d7a591337')
  })
})
