import { act } from 'react'
import { render } from '@/test/render'
import type { EvaluationSummary } from '@/features/ai-workspace'
import { EvaluationSidebar } from './EvaluationSidebar'

function summary(
  evaluationId: string,
  attentionGroup: EvaluationSummary['attention_group'],
): EvaluationSummary {
  return {
    evaluation_id: evaluationId,
    title: `${evaluationId} tools`,
    status: 'active',
    stage: 'building_shortlist',
    attention_group: attentionGroup,
    next_action: 'review',
    shortlist_count: 4,
    match_count: 7,
    recommendation_state: 'eligible',
    regeneration_status: 'idle',
    milestones: {
      requirements_confirmed: true,
      products_discovered: true,
      shortlist_ready: true,
      recommendation_generated: false,
    },
    progress_percent: 75,
  }
}

describe('EvaluationSidebar', () => {
  it('renders workflow groups, meaningful state, and sidebar creation', async () => {
    const view = await render(
      <EvaluationSidebar
        evaluations={[
          summary('ready', 'ready_to_decide'),
          summary('attention', 'needs_attention'),
          summary('progress', 'in_progress'),
        ]}
        activeEvaluationId="progress"
        onSelect={() => undefined}
        onNew={() => undefined}
        onRename={() => undefined}
        onDuplicate={() => undefined}
        onArchive={() => undefined}
        onDelete={() => undefined}
      />,
    )

    const text = view.container.textContent || ''
    expect(text).toContain('EVALUATIONS')
    expect(text.indexOf('Needs attention')).toBeLessThan(
      text.indexOf('In progress'),
    )
    expect(text.indexOf('In progress')).toBeLessThan(
      text.indexOf('Ready to decide'),
    )
    expect(text).toContain('Building shortlist')
    expect(text).toContain('4 shortlisted')
    expect(text).toContain('New evaluation')
    expect(text).not.toMatch(/\d{1,2}:\d{2}/)

    const actions = view.container.querySelector(
      'button[aria-label="Actions for progress tools"]',
    ) as HTMLButtonElement
    await act(async () => actions.click())
    expect(view.container.textContent).toContain('Rename')
    expect(view.container.textContent).toContain('Duplicate')
    expect(view.container.textContent).toContain('Archive')
    expect(view.container.textContent).toContain('Delete')
    await view.unmount()
  })
})
