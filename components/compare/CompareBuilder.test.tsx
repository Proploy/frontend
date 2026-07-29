import { render } from '@/test/render'
import { Builder } from './CompareBuilder'

describe('CompareBuilder', () => {
  it('does not render buyer-fit controls', async () => {
    const view = await render(
      <Builder
        columns={[{ type: 'product', id: null }]}
        onSwap={() => undefined}
        onRemove={() => undefined}
        onAdd={() => undefined}
        onCompare={() => undefined}
        onMatched={() => undefined}
      />,
    )

    expect(view.container.textContent).not.toContain(
      'Fit to my business',
    )
    expect(view.container.textContent).not.toContain('Company size')
    expect(view.container.textContent).not.toContain('Any budget')
    await view.unmount()
  })
})
