import { render } from '@/test/render'
import type { Entity } from '@/lib/compare/data'
import { buildRows } from './CompareRows'
import { ColumnHeader, DesktopTable } from './CompareTable'

const entity: Entity = {
  id: 'asana',
  type: 'product',
  name: 'Asana',
  initial: 'A',
  logoTone: 'pink',
  category: 'Project management',
  tagline: 'Coordinate work',
  rating: 4.5,
  reviewCount: 1200,
  reviewSource: 'Verified buyers',
  bestFor: 'Cross-functional teams',
  notFor: 'Simple personal lists',
  segment: 'SMB · Mid-market',
  pricingBucket: '$$',
  entryPrice: '$10.99',
  priceUnit: '/month',
  pricingModel: 'Per user',
  freeTrial: true,
  freePlan: true,
  contactSales: false,
  keyLimits: 'Seat limits',
  implComplexity: 'Medium',
  rolloutTimeline: '2–4 weeks',
  onboardingEffort: 'Moderate',
  adminSkill: 'Medium',
  migrationRisk: 'Medium',
  recommendedPath: 'Expert-led implementation',
  fit: {
    teamSize: '10–500',
    industryFit: 'Broad',
    workflows: ['Projects'],
    integrations: ['Slack'],
    compliance: ['SOC 2'],
    deployment: 'Cloud',
    verdict: 'Strong collaboration option',
  },
  reviews: {
    pros: ['Flexible'],
    cons: ['Can be complex'],
    sentiment: ['Positive'],
    reviewerSegment: 'Mid-market',
    reviewerIndustry: 'Technology',
  },
  alternatives: [],
}

describe('comparison fit-score presentation', () => {
  it('removes fit score from at-a-glance rows', () => {
    expect(
      buildRows('At a glance').map((row) => row.label),
    ).not.toContain('Proploy fit score')
  })

  it('does not show a fit score in product column headers', async () => {
    const view = await render(
      <ColumnHeader
        entity={entity}
        onRemove={() => undefined}
        canRemove={false}
        density="regular"
      />,
    )

    expect(view.container.textContent).not.toContain('FIT SCORE')
    expect(view.container.textContent).not.toContain('vs your filters')
    await view.unmount()
  })
})

describe('comparison tab layout consistency', () => {
  it('uses the same table shell and column sizing for Fit and Pricing', async () => {
    const renderTable = (tab: 'Fit' | 'Pricing') =>
      render(
        <DesktopTable
          entities={[
            entity,
            { ...entity, id: 'monday', name: 'Monday' },
          ]}
          tab={tab}
          tabs={['Pricing', 'Fit']}
          onTab={() => undefined}
          onRemove={() => undefined}
          density="regular"
        />,
      )

    const pricing = await renderTable('Pricing')
    const fit = await renderTable('Fit')
    const getLayout = (
      container: HTMLElement,
      testId: string,
    ) =>
      container.querySelector<HTMLElement>(
        `[data-testid="${testId}"]`,
      )
    const pricingFrame = getLayout(
      pricing.container,
      'comparison-table-frame',
    )
    const fitFrame = getLayout(
      fit.container,
      'comparison-table-frame',
    )
    const pricingScroller = getLayout(
      pricing.container,
      'comparison-table-scroller',
    )
    const fitScroller = getLayout(
      fit.container,
      'comparison-table-scroller',
    )
    const pricingHeader = getLayout(
      pricing.container,
      'comparison-table-header-grid',
    )
    const fitHeader = getLayout(
      fit.container,
      'comparison-table-header-grid',
    )

    expect(fitFrame?.style.maxWidth).toBe(
      pricingFrame?.style.maxWidth,
    )
    expect(fitScroller?.className).toBe(
      pricingScroller?.className,
    )
    expect(fitHeader?.style.gridTemplateColumns).toBe(
      pricingHeader?.style.gridTemplateColumns,
    )
    expect(fitFrame?.style.maxWidth).toBe('1440px')
    expect(fitHeader?.style.gridTemplateColumns).toBe(
      '220px repeat(2, minmax(260px, 1fr))',
    )

    await pricing.unmount()
    await fit.unmount()
  })

  it('wraps long workflow chips within the Fit product column', async () => {
    const longWorkflow =
      'Create, assign, and organize tasks with custom fields and priorities'
    const view = await render(
      <DesktopTable
        entities={[
          {
            ...entity,
            fit: {
              ...entity.fit,
              workflows: [longWorkflow],
            },
          },
        ]}
        tab="Fit"
        tabs={['Pricing', 'Fit']}
        onTab={() => undefined}
        onRemove={() => undefined}
        density="regular"
      />,
    )
    const workflowChip = Array.from(
      view.container.querySelectorAll<HTMLElement>('span'),
    ).find((element) => element.textContent === longWorkflow)
    const productCell = workflowChip?.closest<HTMLElement>(
      '[data-testid="comparison-product-cell"]',
    )

    expect(workflowChip?.className).toContain('max-w-full')
    expect(workflowChip?.className).toContain('whitespace-normal')
    expect(workflowChip?.className).toContain('break-words')
    expect(workflowChip?.className).not.toContain('whitespace-nowrap')
    expect(productCell?.className).toContain('min-w-0')

    await view.unmount()
  })
})
