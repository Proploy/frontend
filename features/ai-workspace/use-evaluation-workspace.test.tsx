import { act } from 'react'
import { render } from '@/test/render'
import { useEvaluationWorkspace } from './use-evaluation-workspace'

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
    </div>
  )
}

async function flushEffects() {
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 0))
  })
}

describe('useEvaluationWorkspace initialization', () => {
  it('keeps the welcome state when no session is active', async () => {
    const view = await render(<WorkspaceProbe />)
    await flushEffects()

    expect(
      view.container.querySelector('[data-testid="title"]')
        ?.textContent,
    ).toBe('no evaluation')
    expect(
      view.container.querySelector('[data-testid="active"]')
        ?.textContent,
    ).toBe('')
    await view.unmount()
  })
})