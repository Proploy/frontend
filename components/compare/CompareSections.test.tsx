import { render } from '@/test/render'
import { EmptyState } from './CompareSections'

describe('CompareSections', () => {
  it('does not describe comparisons as scored against filters', async () => {
    const view = await render(
      <EmptyState onAdd={() => undefined} />,
    )

    expect(view.container.textContent).not.toContain(
      'against your filters',
    )
    await view.unmount()
  })
})
