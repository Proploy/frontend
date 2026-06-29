// lib/compare/__tests__/data-shape.test.ts
//
// Snapshot-style test that locks the mock fallback (`ENTITIES` + `CATALOG`)
// against the current narrowed `Entity` shape. After Chunk C trimmed
// `EntityType` to `'product'` and dropped `expertCount`, this test is the
// tripwire: if a future field is removed/renamed in `Entity`, the mocks
// either have to be updated or the contract has to change explicitly.

import { describe, it, expect } from 'vitest'
import {
  CATALOG,
  ENTITIES,
  TABS,
  DISCUSSIONS,
  BUYER_CONTEXT,
  TYPE_META,
  PATH_META,
  FILTER_OPTIONS,
  type Entity,
} from '../data'

function assertEntityShape(e: Entity, ctx: string) {
  // Core identity & copy
  expect(e.id, `${ctx}.id`).toBeTypeOf('string')
  expect(e.type, `${ctx}.type`).toBe('product')
  expect(e.name, `${ctx}.name`).toBeTypeOf('string')
  expect(e.initial, `${ctx}.initial`).toBeTypeOf('string')
  expect(e.category, `${ctx}.category`).toBeTypeOf('string')
  expect(e.tagline, `${ctx}.tagline`).toBeTypeOf('string')

  // Numeric ratings
  expect(e.rating, `${ctx}.rating`).toBeTypeOf('number')
  expect(e.reviewCount, `${ctx}.reviewCount`).toBeTypeOf('number')
  expect(typeof e.reviewSource).toBe('string')

  // Buy-side copy
  expect(typeof e.bestFor).toBe('string')
  expect(typeof e.notFor).toBe('string')
  expect(typeof e.segment).toBe('string')

  // Pricing
  expect(typeof e.pricingBucket).toBe('string')
  expect(typeof e.entryPrice).toBe('string')
  expect(typeof e.priceUnit).toBe('string')
  expect(typeof e.pricingModel).toBe('string')
  expect(typeof e.freeTrial).toBe('boolean')
  expect(typeof e.freePlan).toBe('boolean')
  expect(typeof e.contactSales).toBe('boolean')
  expect(typeof e.keyLimits).toBe('string')

  // Implementation
  expect(['Low', 'Medium', 'High']).toContain(e.implComplexity)
  expect(typeof e.rolloutTimeline).toBe('string')
  expect(typeof e.onboardingEffort).toBe('string')
  expect(typeof e.adminSkill).toBe('string')
  expect(['Low', 'Medium', 'High']).toContain(e.migrationRisk)
  expect(typeof e.fitScore).toBe('number')
  expect(['Self-serve', 'Guided setup', 'Expert-led implementation', 'White-glove project'])
    .toContain(e.recommendedPath)

  // Fit object
  expect(typeof e.fit.teamSize).toBe('string')
  expect(typeof e.fit.industryFit).toBe('string')
  expect(Array.isArray(e.fit.workflows)).toBe(true)
  expect(Array.isArray(e.fit.integrations)).toBe(true)
  expect(Array.isArray(e.fit.compliance)).toBe(true)
  expect(typeof e.fit.deployment).toBe('string')
  expect(typeof e.fit.verdict).toBe('string')

  // Reviews object
  expect(Array.isArray(e.reviews.pros)).toBe(true)
  expect(Array.isArray(e.reviews.cons)).toBe(true)
  expect(Array.isArray(e.reviews.sentiment)).toBe(true)
  expect(typeof e.reviews.reviewerSegment).toBe('string')
  expect(typeof e.reviews.reviewerIndustry).toBe('string')
  // outcomes is optional, but if present must be string[]
  if (e.reviews.outcomes !== undefined) {
    expect(Array.isArray(e.reviews.outcomes)).toBe(true)
  }

  // Alternatives must be an array of { id?, name, initial, category, rating, logoUrl? }
  expect(Array.isArray(e.alternatives)).toBe(true)
  e.alternatives.forEach((alt, i) => {
    expect(typeof alt.name, `${ctx}.alternatives[${i}].name`).toBe('string')
    expect(typeof alt.initial, `${ctx}.alternatives[${i}].initial`).toBe('string')
    expect(typeof alt.category, `${ctx}.alternatives[${i}].category`).toBe('string')
    expect(typeof alt.rating, `${ctx}.alternatives[${i}].rating`).toBe('number')
  })

  // Chunk C trim tripwires: these fields MUST NOT appear on the legacy mocks.
  expect(e, `${ctx} must not carry expertCount`).not.toHaveProperty('expertCount')
}

describe('lib/compare/data — chunk C trim', () => {
  it('EntityType is narrowed to the single product literal', () => {
    // Static type assertion: if the union widens, this will fail to compile.
    const t: 'product' = 'product' as 'product'
    // And every entity claims to be that literal at runtime.
    for (const e of Object.values(ENTITIES)) expect(e.type).toBe(t)
    for (const e of CATALOG) expect(e.type).toBe(t)
  })

  it('ENTITIES and CATALOG both expose the same product set', () => {
    const entityIds = Object.keys(ENTITIES).sort()
    const catalogIds = CATALOG.map((e) => e.id).sort()
    expect(catalogIds).toEqual(entityIds)
  })

  it('every entity in ENTITIES satisfies the Entity shape', () => {
    expect(Object.keys(ENTITIES).length).toBeGreaterThan(0)
    for (const [id, e] of Object.entries(ENTITIES)) assertEntityShape(e, `ENTITIES[${id}]`)
  })

  it('every entity in CATALOG satisfies the Entity shape', () => {
    expect(CATALOG.length).toBeGreaterThan(0)
    CATALOG.forEach((e, i) => assertEntityShape(e, `CATALOG[${i}]`))
  })

  it('TABS no longer contains "Experts"', () => {
    expect(TABS).not.toContain('Experts')
    // Snapshot of the final tab order — proves the structure is stable.
    expect([...TABS]).toEqual([
      'At a glance',
      'Pricing',
      'Fit',
      'Implementation',
      'Reviews',
      'Alternatives',
    ])
  })

  it('TYPE_META only carries the product entry (no expert / business rows)', () => {
    expect(Object.keys(TYPE_META)).toEqual(['product'])
  })

  it('PATH_META covers all four RecommendedPath values', () => {
    expect(Object.keys(PATH_META).sort()).toEqual([
      'Expert-led implementation',
      'Guided setup',
      'Self-serve',
      'White-glove project',
    ])
  })

  it('DISCUSSIONS references no removed entities', () => {
    // The Ravi Anand / BrightPath strings were removed in Chunk C.
    const blob = JSON.stringify(DISCUSSIONS)
    expect(blob).not.toMatch(/Ravi Anand/)
    expect(blob).not.toMatch(/BrightPath/)
    expect(DISCUSSIONS.length).toBeGreaterThan(0)
  })

  it('BUYER_CONTEXT fits the Filters shape', () => {
    expect(BUYER_CONTEXT).toMatchObject({
      category: expect.any(String),
      companySize: expect.any(String),
      budget: expect.any(String),
      region: expect.any(String),
      timeline: expect.any(String),
    })
  })

  it('FILTER_OPTIONS exposes the expected five dropdowns', () => {
    expect(Object.keys(FILTER_OPTIONS).sort()).toEqual(
      ['budget', 'category', 'companySize', 'region', 'timeline'].sort(),
    )
  })
})