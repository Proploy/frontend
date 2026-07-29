import { useState } from 'react'
import { render } from '@/test/render'
import { useWorkspaceQueryParam } from '@/features/workspace/use-workspace-query-param'

let currentSearch = 'proposal=p1'

vi.mock('next/navigation', () => ({
  useSearchParams: () => new URLSearchParams(currentSearch),
}))

function Probe() {
  const requested = useWorkspaceQueryParam('proposal')
  const [, rerender] = useState(0)
  return (
    <>
      <output>{requested}</output>
      <button type="button" onClick={() => rerender((value) => value + 1)}>
        Refresh
      </button>
    </>
  )
}

describe('workspace query deep links', () => {
  it('observes client-side query changes while the page stays mounted', async () => {
    currentSearch = 'proposal=p1'
    const view = await render(<Probe />)
    expect(view.container.querySelector('output')?.textContent).toBe('p1')

    currentSearch = 'proposal=p2'
    view.container.querySelector('button')?.click()
    await new Promise((resolve) => setTimeout(resolve, 0))

    expect(view.container.querySelector('output')?.textContent).toBe('p2')
    await view.unmount()
  })
})
