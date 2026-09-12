import { describe, expect, it } from 'vitest'

import { asBattleCard, asProjectBrief, fitScore } from './brief-types'

describe('brief-types guards', () => {
  it('rejects payloads without products or a recommended product', () => {
    expect(asBattleCard(null)).toBeNull()
    expect(asBattleCard({ products: [] })).toBeNull()
    expect(asProjectBrief({ title: 'x' })).toBeNull()
  })

  it('normalises fit statuses and scores partial as half', () => {
    const card = asBattleCard({
      products: [{ product_id: 'a', product_name: 'A' }, { product_id: 'b' }],
      requirements: [
        { requirement: 'R1', fit: { a: { status: 'yes' }, b: { status: 'weird' } } },
        { requirement: 'R2', fit: { a: { status: 'partial' }, b: { status: 'no' } } },
      ],
      recommendation: {},
    })!
    expect(card.products[1].product_name).toBe('b')
    expect(card.requirements[0].fit.b.status).toBe('unknown')
    expect(card.recommendation.product_id).toBe('a')
    expect(fitScore(card, 'a')).toEqual({ met: 1, partial: 1, missing: 0, unknown: 0, percent: 75 })
    expect(fitScore(card, 'b')).toEqual({ met: 0, partial: 0, missing: 1, unknown: 1, percent: 0 })
  })

  it('keeps implementation phases and drops malformed ones', () => {
    const brief = asProjectBrief({
      recommended_product: { product_id: 'a', product_name: 'A' },
      implementation_plan: [{ phase: 'Setup', activities: ['x', 3] }, { nope: 1 }],
      risks: [{ risk: 'R' }],
    })!
    expect(brief.implementation_plan).toEqual([{ phase: 'Setup', duration: undefined, owner: undefined, activities: ['x'] }])
    expect(brief.risks).toEqual([{ risk: 'R', mitigation: undefined }])
  })
})
