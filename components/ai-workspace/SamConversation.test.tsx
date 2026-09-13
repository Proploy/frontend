import { act } from 'react'
import { render } from '@/test/render'
import type { EvaluationDetail } from '@/features/ai-workspace'
import { expect, vi } from 'vitest'
import {
  COMPOSER_MAX_HEIGHT,
  COMPOSER_MIN_HEIGHT,
} from '@/features/ai-workspace/composer-autogrow'
import { SamConversation } from './SamConversation'

const evaluation: EvaluationDetail = {
  evaluation_id: 'evaluation-1',
  agent_session_id: 'session-1',
  title: 'Project management tools',
  status: 'active',
  stage: 'reviewing_evidence',
  attention_group: 'in_progress',
  next_action: 'review_matches',
  shortlist_count: 0,
  match_count: 0,
  recommendation_state: 'unavailable',
  regeneration_status: 'idle',
  milestones: {
    requirements_confirmed: false,
    products_discovered: false,
    shortlist_ready: false,
    recommendation_generated: false,
  },
  progress_percent: 25,
  comparison_product_ids: [],
  requirements: null,
  missing_critical_signals: [],
  matches: [],
  shortlist: [],
  recommendation: null,
  messages: [
    {
      id: 'message-1',
      role: 'assistant',
      markdown:
        '## Strong options\n\n- **Asana** for structured delivery\n- ClickUp for flexibility',
      artifact_refs: [],
    },
  ],
}

describe('SamConversation', () => {
  it('does not force a persisted conversation to the bottom on load', async () => {
    const scrollTo = vi.fn()
    const original = HTMLElement.prototype.scrollTo
    HTMLElement.prototype.scrollTo = scrollTo

    const view = await render(
      <SamConversation
        evaluation={evaluation}
        isSending={false}
        onSend={() => undefined}
        onConfirmRequirements={() => undefined}
      />,
    )

    expect(scrollTo).not.toHaveBeenCalled()
    await view.unmount()
    HTMLElement.prototype.scrollTo = original
  })

  it('renders SAM Markdown without logos or reasoning disclosure', async () => {
    const view = await render(
      <SamConversation
        evaluation={evaluation}
        isSending={false}
        onSend={() => undefined}
        onConfirmRequirements={() => undefined}
      />,
    )

    expect(view.container.textContent).toContain('Sam')
    expect(view.container.querySelector('h2')?.textContent).toBe(
      'Strong options',
    )
    expect(view.container.textContent).not.toContain('Run details')
    expect(view.container.textContent).not.toContain('Thinking')
    expect(view.container.textContent).not.toContain('tool_call')
    expect(view.container.textContent).not.toContain(
      'How SAM evaluated this',
    )
    expect(view.container.querySelector('img')).toBeNull()
    await view.unmount()
  })

  it('uses an adverb while SAM is responding', async () => {
    const view = await render(
      <SamConversation
        evaluation={{
          ...evaluation,
          messages: [
            {
              id: 'user-message',
              role: 'user',
              markdown: 'Find project management tools',
              artifact_refs: [],
            },
          ],
        }}
        isSending
        onSend={() => undefined}
        onConfirmRequirements={() => undefined}
      />,
    )
    expect(view.container.textContent).toMatch(
      /Comparing feature sets/,
    )
    await view.unmount()
  })

  it('keeps the adverb loader visible while response tokens are arriving', async () => {
    const view = await render(
      <SamConversation
        evaluation={{
          ...evaluation,
          messages: [
            {
              id: 'assistant-stream',
              role: 'assistant',
              markdown: 'SAM has started returning recommendation tokens.',
              artifact_refs: [],
              status: 'streaming',
            },
          ],
        }}
        isSending
        onSend={() => undefined}
        onConfirmRequirements={() => undefined}
      />,
    )

    const status = view.container.querySelector('[role="status"]')
    expect(status?.textContent).toMatch(
      /Comparing feature sets/,
    )
    expect(status?.querySelector('.pulse-dot')).not.toBeNull()
    await view.unmount()
  })

  it('offers explicit confirmation when critical requirements are complete', async () => {
    const view = await render(
      <SamConversation
        evaluation={{
          ...evaluation,
          messages: [],
          requirements: {
            category: {
              state: 'answered',
              value: 'Project management',
            },
            primary_use_case: {
              state: 'answered',
              value: 'Cross-functional delivery',
            },
          },
        }}
        isSending={false}
        onSend={() => undefined}
        onConfirmRequirements={() => undefined}
      />,
    )

    expect(view.container.textContent).toContain(
      'Confirm requirements',
    )
    await view.unmount()
  })

  it('keeps product results and evidence controls out of the main chat', async () => {
    const view = await render(
      <SamConversation
        evaluation={{
          ...evaluation,
          matches: [
            {
              product_id: 'canonical-notion',
              product_name: 'Notion',
              profile_href: null,
              available: true,
              rank: 1,
              match_score: 91,
            },
          ],
        }}
        isSending={false}
        onSend={() => undefined}
        onConfirmRequirements={() => undefined}
      />,
    )

    expect(view.container.textContent).not.toContain('Notion')
    expect(view.container.textContent).not.toContain('View evidence')
    expect(view.container.textContent).not.toContain('Add to shortlist')
    await view.unmount()
  })
})

describe('SamConversation nudges', () => {
  const agentProducts = [
    { product_id: 'asana', product_name: 'Asana', profile_href: null, available: true, match_score: 75, is_agent_selected: true },
    { product_id: 'linear', product_name: 'Linear', profile_href: null, available: true, match_score: 92, is_agent_selected: true },
  ]

  it('keeps next-step nudges out of the transcript', async () => {
    // The nudge lives in the results panel beside the products it refers to,
    // so it suggests rather than interrupting the conversation.
    const view = await render(
      <SamConversation
        evaluation={{ ...evaluation, matches: agentProducts }}
        isSending={false}
        onSend={() => undefined}
        onConfirmRequirements={() => undefined}
      />,
    )
    expect(view.container.querySelector('[data-testid="journey-nudge-compare"]')).toBeNull()
    expect(view.container.querySelector('[data-testid="journey-nudge-implement"]')).toBeNull()
    await view.unmount()
  })

  it('still renders generated briefs inline', async () => {
    const view = await render(
      <SamConversation
        evaluation={{
          ...evaluation,
          matches: agentProducts,
          documents: [{ doc_id: 'doc_bc_1', doc_type: 'battle_card', title: 'Asana vs Linear', html: '<h2>Overview</h2>' }],
        }}
        isSending={false}
        onSend={() => undefined}
        onConfirmRequirements={() => undefined}
      />,
    )
    expect(view.container.querySelector('[data-testid="document-card"]')).not.toBeNull()
    await view.unmount()
  })
  /** jsdom has no layout engine, so the composer's content height has to be
   *  dictated rather than measured. Returns a restore function. */
  function stubComposerContentHeight(height: { value: number }) {
    const original = Object.getOwnPropertyDescriptor(
      HTMLTextAreaElement.prototype,
      'scrollHeight',
    )
    Object.defineProperty(HTMLTextAreaElement.prototype, 'scrollHeight', {
      configurable: true,
      get: () => height.value,
    })
    return () => {
      if (original) {
        Object.defineProperty(
          HTMLTextAreaElement.prototype,
          'scrollHeight',
          original,
        )
      } else {
        delete (HTMLTextAreaElement.prototype as Partial<HTMLTextAreaElement>)
          .scrollHeight
      }
    }
  }

  async function typeInComposer(textarea: HTMLTextAreaElement, value: string) {
    const descriptor = Object.getOwnPropertyDescriptor(
      HTMLTextAreaElement.prototype,
      'value',
    )
    if (!descriptor?.set) throw new Error('textarea value setter is missing')
    await act(async () => {
      descriptor.set?.call(textarea, value)
      textarea.dispatchEvent(new Event('input', { bubbles: true }))
    })
  }

  it('grows the composer with the draft and hands the conversation the difference', async () => {
    const contentHeight = { value: COMPOSER_MIN_HEIGHT }
    const restore = stubComposerContentHeight(contentHeight)

    const view = await render(
      <SamConversation
        evaluation={evaluation}
        isSending={false}
        onSend={() => undefined}
        onConfirmRequirements={() => undefined}
      />,
    )

    const textarea = view.container.querySelector('textarea')
    const scroller = view.container.querySelector(
      '[data-testid="sam-conversation-scroll"]',
    )
    if (!textarea || !scroller) throw new Error('composer did not render')

    // A one-line draft leaves the conversation where it was.
    expect(textarea.style.height).toBe(`${COMPOSER_MIN_HEIGHT}px`)
    expect(textarea.style.overflowY).toBe('hidden')

    Object.defineProperty(scroller, 'scrollTop', {
      configurable: true,
      writable: true,
      value: 100,
    })

    // Three lines of draft: the composer takes 48px, so the conversation
    // scrolls down by 48px to keep the same content against its bottom edge.
    contentHeight.value = COMPOSER_MIN_HEIGHT + 48
    await typeInComposer(textarea, 'line one\nline two\nline three')

    expect(textarea.style.height).toBe(`${COMPOSER_MIN_HEIGHT + 48}px`)
    expect(scroller.scrollTop).toBe(148)

    restore()
    await view.unmount()
  })

  it('stops growing at the cap and lets the composer scroll itself', async () => {
    const contentHeight = { value: COMPOSER_MIN_HEIGHT }
    const restore = stubComposerContentHeight(contentHeight)

    const view = await render(
      <SamConversation
        evaluation={evaluation}
        isSending={false}
        onSend={() => undefined}
        onConfirmRequirements={() => undefined}
      />,
    )

    const textarea = view.container.querySelector('textarea')
    if (!textarea) throw new Error('composer did not render')

    contentHeight.value = COMPOSER_MAX_HEIGHT * 3
    await typeInComposer(textarea, 'a very long draft')

    expect(textarea.style.height).toBe(`${COMPOSER_MAX_HEIGHT}px`)
    expect(textarea.style.overflowY).toBe('auto')

    restore()
    await view.unmount()
  })
  it('follows streamed tokens instantly and only animates when idle', async () => {
    const calls: Array<{ top: number; behavior?: string }> = []
    const original = HTMLElement.prototype.scrollTo
    // @ts-expect-error jsdom has no layout; record the intent instead.
    HTMLElement.prototype.scrollTo = function (opts: ScrollToOptions) {
      calls.push({ top: opts.top ?? 0, behavior: opts.behavior })
    }

    const streaming = {
      ...evaluation,
      messages: [
        { id: 'a', role: 'assistant' as const, markdown: 'Pipe', artifact_refs: [] },
      ],
    }
    const view = await render(
      <SamConversation
        evaluation={streaming}
        isSending
        onSend={() => undefined}
        onConfirmRequirements={() => undefined}
      />,
    )

    const scroller = view.container.querySelector(
      '[data-testid="sam-conversation-scroll"]',
    )
    if (!scroller) throw new Error('scroller did not render')
    // Pin to the bottom so the follow-output effect is armed.
    await act(async () => {
      scroller.dispatchEvent(new Event('scroll', { bubbles: true }))
    })

    calls.length = 0
    // One more token arrives.
    await view.rerender(
      <SamConversation
        evaluation={{
          ...streaming,
          messages: [
            { id: 'a', role: 'assistant' as const, markdown: 'Pipedrive', artifact_refs: [] },
          ],
        }}
        isSending
        onSend={() => undefined}
        onConfirmRequirements={() => undefined}
      />,
    )
    expect(calls.length).toBeGreaterThan(0)
    expect(calls.map((c) => c.behavior)).not.toContain('smooth')

    // Turn ends: a settled conversation may animate.
    calls.length = 0
    await view.rerender(
      <SamConversation
        evaluation={{
          ...streaming,
          messages: [
            { id: 'a', role: 'assistant' as const, markdown: 'Pipedrive Lite', artifact_refs: [] },
          ],
        }}
        isSending={false}
        onSend={() => undefined}
        onConfirmRequirements={() => undefined}
      />,
    )
    expect(calls.length).toBeGreaterThan(0)
    expect(calls.every((c) => c.behavior === 'smooth')).toBe(true)

    HTMLElement.prototype.scrollTo = original
    await view.unmount()
  })
})
