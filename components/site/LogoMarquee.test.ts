import { interleaveByVendor } from './LogoMarquee'

const makeTiles = (vendorCounts: Record<string, number>) => {
  const tiles: { vendor: string }[] = []
  for (const [vendor, count] of Object.entries(vendorCounts)) {
    for (let i = 0; i < count; i++) {
      tiles.push({ vendor })
    }
  }
  return tiles
}

describe('LogoMarquee interleaveByVendor', () => {
  it('keeps tiles from the same vendor apart', () => {
    const tiles = interleaveByVendor(makeTiles({ HubSpot: 3, Microsoft: 3, Slack: 1, Stripe: 1, Figma: 1 }))
    for (let i = 1; i < tiles.length; i++) {
      expect(tiles[i].vendor).not.toBe(tiles[i - 1].vendor)
    }
  })

  it('round-robins so every vendor is spread out', () => {
    const tiles = interleaveByVendor(makeTiles({ HubSpot: 3, Microsoft: 2 }))
    expect(tiles.map((t) => t.vendor)).toEqual([
      'HubSpot',
      'Microsoft',
      'HubSpot',
      'Microsoft',
      'HubSpot',
    ])
  })

  it('preserves every tile and is deterministic', () => {
    const input = makeTiles({ HubSpot: 3, Microsoft: 2, Zoho: 1 })
    const a = interleaveByVendor(input)
    const b = interleaveByVendor(makeTiles({ HubSpot: 3, Microsoft: 2, Zoho: 1 }))
    expect(a).toEqual(b)
    expect(a).toHaveLength(input.length)
    expect([...a].sort((x) => x.vendor.length)).toHaveLength(input.length)
  })

  it('handles short and vendor-less inputs without breaking', () => {
    expect(interleaveByVendor(makeTiles({ HubSpot: 2 }))).toHaveLength(2)
    expect(interleaveByVendor(makeTiles({ '': 3, Slack: 1 })).map((t) => t.vendor)).toEqual([
      '',
      'Slack',
      '',
      '',
    ])
  })
})