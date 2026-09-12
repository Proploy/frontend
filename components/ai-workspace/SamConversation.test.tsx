import { act } from 'react'
import { render } from '@/test/render'
import type { EvaluationDetail } from '@/features/ai-workspace'
import { expect, vi } from 'vitest'
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
})
