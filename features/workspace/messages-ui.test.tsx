import { act } from 'react'
import { render } from '@/test/render'
import type { WorkspaceMessage } from '@/features/workspace/types'
import {
  ConversationHeader,
  ConversationThreadCard,
  MessageBubble,
  MessageComposer,
  MessagesLayout,
} from '@/features/workspace/messages-ui'

const message: WorkspaceMessage = {
  id: 'message-1',
  conversationId: 'conversation-1',
  senderUserId: 'user-1',
  body: 'The scope looks good.',
  content: 'The scope looks good.',
  createdAt: '2026-07-29T05:14:00Z',
}

describe('Messages UI', () => {
  it('renders a tinted active thread and preserves selection behavior', async () => {
    let selected = false
    const view = await render(
      <ConversationThreadCard
        active
        title="Migration project"
        lastMessageAt="2026-07-29T05:14:00Z"
        onSelect={() => {
          selected = true
        }}
      />,
    )

    const thread = view.container.querySelector('button')
    expect(thread?.className).toContain('bg-[#eef4ff]')
    await act(async () => thread?.click())
    expect(selected).toBe(true)
    await view.unmount()
  })

  it('uses distinct professional treatments for sent and received messages', async () => {
    const view = await render(
      <>
        <MessageBubble message={message} own />
        <MessageBubble message={{ ...message, id: 'message-2' }} own={false} />
      </>,
    )

    const sent = view.container.querySelector('[data-message-direction="sent"]')
    const received = view.container.querySelector('[data-message-direction="received"]')
    expect(sent?.className).toContain('from-[#155eef]')
    expect(sent?.className).toContain('to-[#7f56d9]')
    expect(received?.className).toContain('bg-white')
    await view.unmount()
  })

  it('renders contextual identity and keeps a blank composer disabled', async () => {
    const view = await render(
      <>
        <ConversationHeader title="Migration project" engagementLabel="Alex Turing" />
        <MessageComposer
          draft=""
          sending={false}
          onDraftChange={() => undefined}
          onSubmit={() => undefined}
        />
      </>,
    )

    expect(view.container.textContent).toContain('Migration project')
    expect(view.container.textContent).toContain('Alex Turing')
    expect(view.container.querySelector('[data-message-composer]')).not.toBeNull()
    expect(
      view.container.querySelector('textarea')?.getAttribute('aria-label'),
    ).toBe('Message')
    expect(
      (view.container.querySelector('button[type="submit"]') as HTMLButtonElement).disabled,
    ).toBe(true)
    await view.unmount()
  })

  it('fills the available split layout with a painted conversation canvas', async () => {
    const view = await render(
      <MessagesLayout
        threadRail={<div>Threads</div>}
        conversationHeader={<div>Header</div>}
        conversationBody={<div>Messages</div>}
        composer={<div>Composer</div>}
      />,
    )

    const layout = view.container.querySelector('[data-messages-layout]')
    const pane = view.container.querySelector('[data-conversation-pane]')
    const canvas = view.container.querySelector('[data-conversation-canvas]')
    expect(layout?.className).toContain('min-h-0')
    expect(layout?.className).toContain('overflow-hidden')
    expect(layout?.className).toContain('xl:flex-row')
    expect(pane?.className).not.toContain('min-h-[640px]')
    expect(canvas?.className).toContain('bg-[radial-gradient')
    await view.unmount()
  })
})
