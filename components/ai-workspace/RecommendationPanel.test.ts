import { canGenerateRecommendation } from './RecommendationPanel'

describe('RecommendationPanel eligibility', () => {
  it('requires confirmed requirements and at least two shortlisted products', () => {
    expect(canGenerateRecommendation(false, 2)).toBe(false)
    expect(canGenerateRecommendation(true, 1)).toBe(false)
    expect(canGenerateRecommendation(true, 2)).toBe(true)
  })
})
