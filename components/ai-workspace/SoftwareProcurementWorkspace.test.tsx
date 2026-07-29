import { act } from 'react'
import { render } from '@/test/render'
import type { EvaluationDetail } from '@/features/ai-workspace'
import { SoftwareProcurementWorkspace } from './SoftwareProcurementWorkspace'

const mocks = vi.hoisted(() => ({
  push: vi.fn(),
  selectComparison: vi.fn().mockResolvedValue(true),
  addToShortlist: vi.fn().mockResolvedValue(true),
  saveEvaluation: vi.fn().mockResolvedValue(true),
  startEvaluation: vi.fn(),
  emptyWorkspace: false,
}))

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mocks.push }),
}))

vi.mock('@/components/providers/auth-provider', () => ({
  useAuth: () => ({
    user: { id: 'owner-1' },
    isLoading: false,
  }),
}))

const evaluation: EvaluationDetail = {
  evaluation_id: 'evaluation-1',
  agent_session_id: 'session-1',
  title: 'Project management tools',
  status: 'active',
  stage: 'ready_for_recommendation',
  attention_group: 'ready_to_decide',
  next_action: 'compare',
  shortlist_count: 2,
  match_count: 3,
  recommendation_state: 'eligible',
  regeneration_status: 'idle',
  milestones: {
    requirements_confirmed: true,
    products_discovered: true,
    shortlist_ready: true,
    recommendation_generated: false,
  },
  progress_percent: 75,
  comparison_product_ids: [],
  requirements: null,
  missing_critical_signals: [],
  matches: [
    {
      product_id: 'canonical-hubspot',
      product_name: 'HubSpot CRM',
      profile_href: null,
      available: true,
      rank: 1,
      match_score: 89,
    },
  ],
  shortlist: [
    {
      product_id: 'canonical-notion',
      product_name: 'Notion',
      profile_href: null,
      available: true,
      rank: 1,
    },
    {
      product_id: 'canonical-asana',
      product_name: 'Asana',
      profile_href: null,
      available: true,
      rank: 2,
    },
  ],
  recommendation: null,
  messages: [
    {
      id: 'assistant-1',
      role: 'assistant',
      markdown: 'I found three catalog matches.',
      artifact_refs: [],
      status: 'complete',
    },
  ],
}

vi.mock('@/features/ai-workspace', async (importOriginal) => {
  const original =
    await importOriginal<typeof import('@/features/ai-workspace')>()
  return {
    ...original,
    useEvaluationWorkspace: () => {
      const activeEvaluation = mocks.emptyWorkspace ? null : evaluation
      return {
      state: {
        summaries: [],
        detailsById: activeEvaluation
          ? { [evaluation.evaluation_id]: evaluation }
          : {},
        activeEvaluationId: activeEvaluation
          ? evaluation.evaluation_id
          : null,
        loading: false,
        sendingById: {},
        error: null,
      },
      activeEvaluation,
      isSending: false,
      isStartingEvaluation: false,
      selectComparison: mocks.selectComparison,
      refresh: vi.fn(),
      selectEvaluation: vi.fn(),
      newEvaluation: vi.fn(),
      updateTitle: vi.fn(),
      duplicate: vi.fn(),
      archive: vi.fn(),
      deleteEvaluation: vi.fn(),
      sendMessage: vi.fn(),
      startEvaluation: mocks.startEvaluation,
      confirmRequirements: vi.fn(),
      addToShortlist: mocks.addToShortlist,
      removeFromShortlist: vi.fn(),
      reorderShortlist: vi.fn(),
      generateRecommendation: vi.fn(),
      retryRegeneration: vi.fn(),
      saveEvaluation: mocks.saveEvaluation,
      getEvidence: vi.fn(),
      }
    },
  }
})

describe('SoftwareProcurementWorkspace', () => {
  beforeEach(() => {
    mocks.emptyWorkspace = false
    mocks.startEvaluation.mockReset()
    mocks.push.mockClear()
    mocks.selectComparison.mockClear()
    mocks.selectComparison.mockResolvedValue(true)
    mocks.addToShortlist.mockClear()
    mocks.addToShortlist.mockResolvedValue(true)
    mocks.saveEvaluation.mockClear()
    mocks.saveEvaluation.mockResolvedValue(true)
  })

  it('shows the full welcome screen before the first evaluation and starts from a prompt', async () => {
    mocks.emptyWorkspace = true
    const view = await render(<SoftwareProcurementWorkspace />)

    expect(view.container.textContent).toContain(
      'Describe your requirements and compare suitable products',
    )
    expect(view.container.textContent).not.toContain(
      'Start your first evaluation',
    )
    const starterPrompt = Array.from(
      view.container.querySelectorAll<HTMLButtonElement>('button'),
    ).find((button) => button.textContent?.includes('Project management'))

    expect(starterPrompt).toBeDefined()
    await act(async () => starterPrompt?.click())
    expect(mocks.startEvaluation).toHaveBeenCalledOnce()
    await view.unmount()
  })

  it('saves canonical shortlist IDs before opening the existing compare route', async () => {
    const view = await render(<SoftwareProcurementWorkspace />)
    const tabs = Array.from(
      view.container.querySelectorAll<HTMLButtonElement>(
        'button[role="tab"]',
      ),
    )
    const shortlistTab = tabs.find((button) =>
      button.textContent?.startsWith('Shortlist'),
    )
    const comparisonTab = tabs.find(
      (button) => button.textContent === 'Comparison',
    )

    expect(shortlistTab).toBeDefined()
    expect(comparisonTab).toBeUndefined()
    await act(async () => shortlistTab?.click())

    const openComparison = Array.from(
      view.container.querySelectorAll<HTMLButtonElement>('button'),
    ).find((button) => button.textContent === 'Compare shortlist')
    expect(openComparison).toBeDefined()

    await act(async () => openComparison?.click())

    expect(mocks.selectComparison).toHaveBeenCalledWith([
      'canonical-notion',
      'canonical-asana',
    ])
    expect(mocks.push).toHaveBeenCalledWith(
      '/compare?products=canonical-notion%2Ccanonical-asana',
    )
    await view.unmount()
  })

  it('wires a desktop control that can collapse and reopen decisions', async () => {
    const view = await render(<SoftwareProcurementWorkspace />)
    const findButton = (label: string) =>
      view.container.querySelector<HTMLButtonElement>(
        `button[aria-label="${label}"]`,
      )

    expect(findButton('Collapse decision workspace')).not.toBeNull()
    await act(async () =>
      findButton('Collapse decision workspace')?.click(),
    )

    expect(findButton('Expand decision workspace')).not.toBeNull()
    await act(async () =>
      findButton('Expand decision workspace')?.click(),
    )

    expect(findButton('Collapse decision workspace')).not.toBeNull()
    await view.unmount()
  })

  it('sends the canonical result ID when adding to the shortlist', async () => {
    const view = await render(<SoftwareProcurementWorkspace />)
    const addButton = Array.from(
      view.container.querySelectorAll<HTMLButtonElement>('button'),
    ).find((button) => button.textContent === 'Add to shortlist')

    expect(addButton).toBeDefined()
    await act(async () => addButton?.click())

    expect(mocks.addToShortlist).toHaveBeenCalledWith(
      'canonical-hubspot',
    )
    await view.unmount()
  })

  it('uses the native evaluation save action from the header', async () => {
    const view = await render(<SoftwareProcurementWorkspace />)
    const saveButton =
      view.container.querySelector<HTMLButtonElement>(
        'button[aria-label="Save evaluation"]',
      )

    expect(saveButton?.disabled).toBe(false)
    await act(async () => saveButton?.click())

    expect(mocks.saveEvaluation).toHaveBeenCalledOnce()
    expect(view.container.textContent).toContain('Saved')
    await view.unmount()
  })
})
