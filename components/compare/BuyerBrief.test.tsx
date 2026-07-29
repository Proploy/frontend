import { render } from '@/test/render'
import type { Entity } from '@/lib/compare/data'
import { BuyerBrief } from './BuyerBrief'

const entity = {
  id: 'product-1',
  type: 'product',
  name: 'Product One',
  initial: 'P',
  logoTone: 'blue',
  category: 'Software',
  tagline: '',
  rating: 4,
  reviewCount: 12,
  reviewSource: 'Verified buyers',
  bestFor: 'Teams',
  notFor: 'Individuals',
  segment: 'Mid-market',
  pricingBucket: '$$',
  entryPrice: '$20',
  priceUnit: '/month',
  pricingModel: 'Per seat',
  freeTrial: true,
  freePlan: false,
  contactSales: false,
  keyLimits: '—',
  implComplexity: 'Low',
  rolloutTimeline: '1 week',
  onboardingEffort: 'Light',
  adminSkill: 'Low',
  migrationRisk: 'Low',
  recommendedPath: 'Self-serve',
  fit: {
    teamSize: 'Mid-market',
    industryFit: 'General',
    workflows: [],
    integrations: [],
    compliance: [],
    deployment: 'Cloud',
    verdict: 'Good',
  },
  reviews: {
    pros: [],
    cons: [],
    sentiment: [],
    reviewerSegment: 'Mid-market',
    reviewerIndustry: 'General',
  },
  alternatives: [],
} satisfies Entity

describe('BuyerBrief', () => {
  it('does not rank products with the removed fit score', async () => {
    const view = await render(
      <BuyerBrief entities={[entity]} />,
    )

    expect(view.container.textContent).not.toContain('Best fit')
    expect(view.container.textContent).not.toContain('99/100')
    await view.unmount()
  })
})
