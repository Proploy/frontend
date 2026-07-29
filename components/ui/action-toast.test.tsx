import { ActionToast } from '@/components/ui/action-toast'
import { render } from '@/test/render'

describe('ActionToast', () => {
  it('renders an optional workspace action in the bottom-center toast', async () => {
    const view = await render(
      <ActionToast
        show
        onClose={() => undefined}
        toast={{
          tone: 'success',
          title: 'Proposal accepted',
          body: 'The shared workspace is available.',
          actionLabel: 'Open messages',
          actionHref: '/workspace/messages',
        }}
      />,
    )

    expect(view.container.querySelector('.app-action-toast')).not.toBeNull()
    expect(
      view.container.querySelector('a')?.getAttribute('href'),
    ).toBe('/workspace/messages')
    await view.unmount()
  })
})
