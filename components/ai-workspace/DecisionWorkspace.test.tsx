import { act, useState } from 'react'
import { render } from '@/test/render'
import type {
  EvaluationDetail,
  EvaluationProduct,
} from '@/features/ai-workspace'
import { DecisionWorkspace } from './DecisionWorkspace'

const product: EvaluationProduct = {
  product_id: 'canonical-notion',
  product_name: 'Notion',
  profile_href: null,
  available: true,
  rank: 1,
  match_score: 91,
}

const evaluation: EvaluationDetail = {
  evaluation_id: 'evaluation-1',
  agent_session_id: 'session-1',
  title: 'Project management tools',
  status: 'active',
  stage: 'building_shortlist',
  attention_group: 'in_progress',
  next_action: 'add_to_shortlist',
  shortlist_count: 0,
  match_count: 1,
  recommendation_state: 'unavailable',
  regeneration_status: 'idle',
  milestones: {
    requirements_confirmed: false,
    products_discovered: true,
    shortlist_ready: false,
    recommendation_generated: false,
  },
  progress_percent: 50,
  comparison_product_ids: [],
  requirements: null,
  missing_critical_signals: [],
  matches: [product],
  shortlist: [],
  recommendation: null,
  messages: [],
}

function Harness({
  onToggleShortlist = () => undefined,
}: {
  onToggleShortlist?: (
    productId: string,
    shortlisted: boolean,
  ) => void
}) {
  const [detail, setDetail] = useState(evaluation)
  return (
    <>
      <button
        type="button"
        onClick={() =>
          setDetail((current) => ({
            ...current,
            shortlist_count: 1,
            shortlist: [product],
          }))
        }
      >
        Simulate shortlist response
      </button>
      <DecisionWorkspace
        evaluation={detail}
        onReorder={() => undefined}
        onRemove={() => undefined}
        onToggleShortlist={onToggleShortlist}
        onCompare={() => undefined}
        onGenerateRecommendation={() => undefined}
        onRetry={() => undefined}
      />
    </>
  )
}

function CollapsibleHarness() {
  const [collapsed, setCollapsed] = useState(false)
  return (
    <DecisionWorkspace
      evaluation={evaluation}
      onReorder={() => undefined}
      onRemove={() => undefined}
      onToggleShortlist={() => undefined}
      onCompare={() => undefined}
      onGenerateRecommendation={() => undefined}
      onRetry={() => undefined}
      collapsed={collapsed}
      onToggleCollapsed={() =>
        setCollapsed((current) => !current)
      }
    />
  )
}

describe('DecisionWorkspace', () => {
  it('can collapse to a rail and expand itself again', async () => {
    const view = await render(<CollapsibleHarness />)
    const findButton = (label: string) =>
      view.container.querySelector<HTMLButtonElement>(
        `button[aria-label="${label}"]`,
      )

    expect(findButton('Collapse decision workspace')).not.toBeNull()
    await act(async () =>
      findButton('Collapse decision workspace')?.click(),
    )

    expect(findButton('Expand decision workspace')).not.toBeNull()
    expect(view.container.textContent).not.toContain('Build your decision')

    await act(async () =>
      findButton('Expand decision workspace')?.click(),
    )

    expect(findButton('Collapse decision workspace')).not.toBeNull()
    expect(view.container.textContent).toContain('Build your decision')
    await view.unmount()
  })

  it('renders canonical matches in Results without an evidence disclosure', async () => {
    const onToggleShortlist = vi.fn()
    const view = await render(
      <Harness onToggleShortlist={onToggleShortlist} />,
    )
    const tabs = Array.from(
      view.container.querySelectorAll<HTMLButtonElement>(
        'button[role="tab"]',
      ),
    )
    const resultsTab = tabs.find((tab) =>
      tab.textContent?.startsWith('Results'),
    )
    const comparisonTab = tabs.find(
      (tab) => tab.textContent === 'Comparison',
    )
    const addButton = Array.from(
      view.container.querySelectorAll<HTMLButtonElement>('button'),
    ).find((button) => button.textContent === 'Add to shortlist')

    expect(resultsTab?.getAttribute('aria-selected')).toBe('true')
    expect(comparisonTab).toBeUndefined()
    expect(view.container.textContent).toContain('Notion')
    expect(view.container.textContent).not.toContain('View evidence')
    expect(addButton).toBeDefined()
    expect(
      view.container.querySelector<HTMLAnchorElement>(
        'a[href="/products/canonical-notion"]',
      )?.textContent,
    ).toBe('Notion')

    await act(async () => addButton?.click())

    expect(onToggleShortlist).toHaveBeenCalledWith(
      'canonical-notion',
      false,
    )
    await view.unmount()
  })

  it('reveals the Shortlist tab when a recommended product is added', async () => {
    const view = await render(<Harness />)
    const tabs = Array.from(
      view.container.querySelectorAll<HTMLButtonElement>(
        'button[role="tab"]',
      ),
    )
    const recommendationTab = tabs.find(
      (tab) => tab.textContent === 'Recommendation',
    )
    const shortlistTab = tabs.find((tab) =>
      tab.textContent?.startsWith('Shortlist'),
    )
    const simulateResponse = Array.from(
      view.container.querySelectorAll<HTMLButtonElement>('button'),
    ).find((button) => button.textContent === 'Simulate shortlist response')

    expect(recommendationTab).toBeDefined()
    expect(shortlistTab).toBeDefined()
    expect(simulateResponse).toBeDefined()

    await act(async () => recommendationTab?.click())
    expect(recommendationTab?.getAttribute('aria-selected')).toBe('true')

    await act(async () => simulateResponse?.click())

    expect(shortlistTab?.getAttribute('aria-selected')).toBe('true')
    expect(view.container.textContent).toContain('Notion')
    await view.unmount()
  })
})
