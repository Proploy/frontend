import { act } from 'react'
import { render } from '@/test/render'
import type {
  EvaluationDetail,
  EvaluationSummary,
} from './evaluation-types'
import { useEvaluationWorkspace } from './use-evaluation-workspace'

const mocks = vi.hoisted(() => ({
  listEvaluations: vi.fn(),
  getEvaluation: vi.fn(),
  createEvaluation: vi.fn(),
  streamEvaluationResearch: vi.fn(),
}))

vi.mock('./evaluation-client', async (importOriginal) => {
  const original =
    await importOriginal<typeof import('./evaluation-client')>()
  return {
    ...original,
    listEvaluations: mocks.listEvaluations,
    getEvaluation: mocks.getEvaluation,
    createEvaluation: mocks.createEvaluation,
    streamEvaluationResearch: mocks.streamEvaluationResearch,
  }
})

const milestones = {
  requirements_confirmed: false,
  products_discovered: false,
  shortlist_ready: false,
  recommendation_generated: false,
}

const existingSummary: EvaluationSummary = {
  evaluation_id: 'evaluation-existing',
  title: 'Existing evaluation',
  status: 'active',
  stage: 'defining_requirements',
  attention_group: 'needs_attention',
  next_action: 'define_requirements',
  shortlist_count: 0,
  match_count: 0,
  recommendation_state: 'unavailable',
  regeneration_status: 'idle',
  milestones,
  progress_percent: 0,
}

const existingEvaluation: EvaluationDetail = {
  ...existingSummary,
  agent_session_id: 'session-existing',
  comparison_product_ids: [],
  requirements: null,
  missing_critical_signals: [],
  matches: [],
  shortlist: [],
  recommendation: null,
  messages: [],
}

const emptyEvaluation: EvaluationDetail = {
  ...existingEvaluation,
  evaluation_id: 'evaluation-new',
  agent_session_id: 'session-new',
  title: 'New evaluation',
}

function WorkspaceProbe() {
  const workspace = useEvaluationWorkspace()
  return (
    <div>
      <span data-testid="loading">
        {workspace.state.loading ? 'loading' : 'ready'}
      </span>
      <span data-testid="active">
        {workspace.state.activeEvaluationId ?? ''}
      </span>
      <span data-testid="title">
        {workspace.activeEvaluation?.title ?? 'no evaluation'}
      </span>
      <button
        type="button"
        onClick={() => void workspace.refresh()}
      >
        Refresh
      </button>
      <button
        type="button"
        onClick={() =>
          void workspace.startEvaluation(
            'I need project management software',
          )
        }
      >
        Start
      </button>
    </div>
  )
}

async function flushEffects() {
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 0))
  })
}

describe('useEvaluationWorkspace initialization', () => {
  beforeEach(() => {
    mocks.listEvaluations.mockReset()
    mocks.getEvaluation.mockReset()
    mocks.createEvaluation.mockReset()
    mocks.streamEvaluationResearch.mockReset()
  })

  it('keeps the welcome state when the loaded list is empty', async () => {
    mocks.listEvaluations.mockResolvedValue({
      ok: true,
      data: { evaluations: [] },
    })

    const view = await render(<WorkspaceProbe />)
    await flushEffects()

    expect(mocks.createEvaluation).not.toHaveBeenCalled()
    expect(
      view.container.querySelector('[data-testid="active"]')
        ?.textContent,
    ).toBe('')
    expect(
      view.container.querySelector('[data-testid="title"]')
        ?.textContent,
    ).toBe('no evaluation')
    await view.unmount()
  })

  it('loads an existing evaluation without creating another one', async () => {
    mocks.listEvaluations.mockResolvedValue({
      ok: true,
      data: { evaluations: [existingSummary] },
    })
    mocks.getEvaluation.mockResolvedValue({
      ok: true,
      data: existingEvaluation,
    })

    const view = await render(<WorkspaceProbe />)
    await flushEffects()

    expect(mocks.createEvaluation).not.toHaveBeenCalled()
    expect(mocks.getEvaluation).toHaveBeenCalledWith(
      existingSummary.evaluation_id,
    )
    expect(
      view.container.querySelector('[data-testid="title"]')
        ?.textContent,
    ).toBe(existingEvaluation.title)
    await view.unmount()
  })

  it('creates one evaluation when starter prompts are clicked repeatedly while creation is pending', async () => {
    mocks.listEvaluations.mockResolvedValue({
      ok: true,
      data: { evaluations: [] },
    })
    let resolveCreation:
      | ((value: {
          ok: true
          data: EvaluationDetail
        }) => void)
      | undefined
    mocks.createEvaluation.mockReturnValue(
      new Promise((resolve) => {
        resolveCreation = resolve
      }),
    )
    mocks.streamEvaluationResearch.mockResolvedValue({
      ok: true,
      completed: true,
    })

    const view = await render(<WorkspaceProbe />)
    await flushEffects()

    const start = Array.from(
      view.container.querySelectorAll<HTMLButtonElement>('button'),
    ).find((button) => button.textContent === 'Start')
    await act(async () => {
      start?.click()
      start?.click()
    })
    expect(mocks.createEvaluation).toHaveBeenCalledOnce()

    await act(async () => {
      resolveCreation?.({
        ok: true,
        data: emptyEvaluation,
      })
    })
    await flushEffects()

    expect(mocks.createEvaluation).toHaveBeenCalledOnce()
    expect(mocks.streamEvaluationResearch).toHaveBeenCalledWith(
      emptyEvaluation.evaluation_id,
      'I need project management software',
      expect.any(Function),
      expect.any(AbortSignal),
    )
    await view.unmount()
  })
})
