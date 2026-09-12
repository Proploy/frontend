import { act } from 'react'
import { render } from '@/test/render'
import type { EvaluationDetail } from '@/features/ai-workspace'
import { SoftwareProcurementWorkspace } from './SoftwareProcurementWorkspace'

const mocks = vi.hoisted(() => ({
  push: vi.fn(),
  requestComparisonBrief: vi.fn().mockResolvedValue(undefined),
  requestImplementationBrief: vi.fn().mockResolvedValue(undefined),
  exportDocumentPdf: vi.fn().mockResolvedValue(true),
  toggleShortlist: vi.fn().mockResolvedValue(undefined),
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
      // The gateway only forwards products the agent selected; the panel
      // ignores anything without this flag.
      is_agent_selected: true,
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
  documents: [
    {
      doc_id: 'doc-1',
      doc_type: 'battle_card',
      title: 'Notion vs Asana',
      html: '<p>Comparison body</p>',
    },
  ],
  profile: {
    goals: [{ text: 'Find project management tools' }],
    constraints: [{ type: 'team_size', value: '12' }],
  },
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
      toggleShortlist: mocks.toggleShortlist,
      requestComparisonBrief: mocks.requestComparisonBrief,
      requestImplementationBrief: mocks.requestImplementationBrief,
      exportDocumentPdf: mocks.exportDocumentPdf,
      saveEvaluation: mocks.saveEvaluation,
      }
    },
  }
})

describe('SoftwareProcurementWorkspace', () => {
  beforeEach(() => {
    mocks.emptyWorkspace = false
    mocks.startEvaluation.mockReset()
    mocks.push.mockClear()
    mocks.requestComparisonBrief.mockClear()
    mocks.requestImplementationBrief.mockClear()
    mocks.toggleShortlist.mockClear()
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

  it('lists the products Sam returned in the results sidebar with a catalog link', async () => {
    const view = await render(<SoftwareProcurementWorkspace />)
    const sidebar = view.container.querySelector('aside[aria-label="Agent results"]')
    expect(sidebar).not.toBeNull()
    // Sam named HubSpot this turn; Notion and Asana it named in an earlier one
    // and the buyer kept them. All three are products the buyer is deciding
    // between, so all three are counted.
    expect(sidebar!.textContent).toContain('3 products')
    expect(sidebar!.textContent).toContain('HubSpot CRM')
    expect(sidebar!.textContent).toContain('89%')
    expect(sidebar!.querySelector('a[href="/products/canonical-hubspot"]')).not.toBeNull()
    // The buyer's captured requirements sit above the results.
    expect(sidebar!.querySelector('[data-testid="requirements-panel"]')?.textContent).toContain('Find project management tools')
    // The card itself carries no navigation away from the evaluation.
    expect(sidebar!.textContent).not.toContain('View product')
    await view.unmount()
  })

  it('keeps a suggestion through the workspace and compares what was kept', async () => {
    const view = await render(<SoftwareProcurementWorkspace />)
    const sidebar = view.container.querySelector('aside[aria-label="Agent results"]')!
    const keep = Array.from(sidebar.querySelectorAll('button')).find(
      (b) => b.textContent?.trim() === 'Shortlist',
    )
    expect(keep).toBeDefined()
    await act(async () => keep?.click())
    expect(mocks.toggleShortlist).toHaveBeenCalledWith(
      expect.objectContaining({ product_id: 'canonical-hubspot' }),
    )

    const lane = Array.from(sidebar.querySelectorAll('button')).find(
      (b) => b.getAttribute('role') === 'tab' && b.textContent?.startsWith('Shortlist'),
    )
    await act(async () => lane?.click())
    // The shortlist lane hands the existing /compare page its product ids.
    expect(
      sidebar.querySelector('a[href="/compare?products=canonical-notion,canonical-asana"]'),
    ).not.toBeNull()
    await view.unmount()
  })

  it('gives a kept product a place in Matches to be put back to', async () => {
    // Removing a product from the shortlist returns it to Matches. Sam's
    // latest turn named only HubSpot, so without this the buyer's kept
    // products live in the shortlist alone, and the shortlist's remove
    // control is indistinguishable from deleting them.
    const view = await render(<SoftwareProcurementWorkspace />)
    const sidebar = view.container.querySelector('aside[aria-label="Agent results"]')!

    expect(sidebar.textContent).toContain('Notion')
    expect(sidebar.textContent).toContain('Asana')

    const remove = sidebar.querySelector<HTMLButtonElement>(
      'button[aria-label="Remove Notion from the shortlist"]',
    )
    expect(remove).toBeNull()

    const lane = Array.from(sidebar.querySelectorAll('button')).find(
      (b) => b.getAttribute('role') === 'tab' && b.textContent?.startsWith('Shortlist'),
    )
    await act(async () => lane?.click())

    const removeInLane = sidebar.querySelector<HTMLButtonElement>(
      'button[aria-label="Remove Notion from the shortlist"]',
    )
    expect(removeInLane).not.toBeNull()
    await act(async () => removeInLane?.click())

    // The workspace hands the same toggle the Matches lane uses, so the
    // product moves lane rather than leaving the evaluation.
    expect(mocks.toggleShortlist).toHaveBeenCalledWith(
      expect.objectContaining({ product_id: 'canonical-notion' }),
    )
    await view.unmount()
  })

  it('wires a desktop control that can collapse and reopen the results sidebar', async () => {
    const view = await render(<SoftwareProcurementWorkspace />)
    const findButton = (label: string) =>
      view.container.querySelector<HTMLButtonElement>(
        `button[aria-label="${label}"]`,
      )

    expect(findButton('Collapse agent results')).not.toBeNull()
    await act(async () => findButton('Collapse agent results')?.click())

    expect(findButton('Expand agent results')).not.toBeNull()
    await act(async () => findButton('Expand agent results')?.click())

    expect(findButton('Collapse agent results')).not.toBeNull()
    await view.unmount()
  })

  it('routes the shortlisted implementation brief through the workspace', async () => {
    const view = await render(<SoftwareProcurementWorkspace />)
    const sidebar = view.container.querySelector('aside[aria-label="Agent results"]')!
    // The brief only exists on a kept product, so open the shortlist first.
    const lane = Array.from(sidebar.querySelectorAll('button')).find(
      (b) => b.getAttribute('role') === 'tab' && b.textContent?.startsWith('Shortlist'),
    )
    await act(async () => lane?.click())
    const action = Array.from(sidebar.querySelectorAll('button')).find(
      (b) => b.textContent?.trim() === 'Implementation brief',
    )
    expect(action).toBeDefined()
    await act(async () => action?.click())
    expect(mocks.requestImplementationBrief).toHaveBeenCalledWith(
      expect.objectContaining({ product_id: 'canonical-notion' }),
    )
    await view.unmount()
  })

  it('opens a finished brief over the workspace from the board', async () => {
    const view = await render(<SoftwareProcurementWorkspace />)
    const sidebar = view.container.querySelector('aside[aria-label="Agent results"]')!
    // The brief Sam finished is visible in the board, not just in the transcript.
    expect(sidebar.textContent).toContain('Notion vs Asana')
    expect(view.container.querySelector('[role="dialog"]')).toBeNull()

    const open = sidebar.querySelector<HTMLButtonElement>('button[aria-label="Open Notion vs Asana"]')
    expect(open).not.toBeNull()
    await act(async () => open?.click())

    const dialog = view.container.querySelector('[role="dialog"]')
    expect(dialog).not.toBeNull()
    expect(dialog!.textContent).toContain('Notion vs Asana')

    const close = view.container.querySelector<HTMLButtonElement>('button[aria-label="Close brief"]')
    await act(async () => close?.click())
    expect(view.container.querySelector('[role="dialog"]')).toBeNull()
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
