import { describe, expect, it } from 'vitest'

import type { EvaluationSummary } from './evaluation-types'
import { placeSummary } from './evaluation-list'

function summary(id: string, title = id): EvaluationSummary {
  return {
    evaluation_id: id,
    title,
    status: 'active',
    stage: 'defining_requirements',
    attention_group: 'needs_attention',
    next_action: 'describe_requirements',
    shortlist_count: 0,
    match_count: 0,
    recommendation_state: 'unavailable',
    regeneration_status: 'idle',
    milestones: { requirements_confirmed: false, products_discovered: false, shortlist_ready: false, recommendation_generated: false },
    progress_percent: 0,
  }
}

describe('placeSummary', () => {
  const list = [summary('c'), summary('b'), summary('a')]

  it('keeps an existing evaluation in its slot when it is selected or updated', () => {
    const next = placeSummary(list, summary('a', 'A renamed'))
    expect(next.map((s) => s.evaluation_id)).toEqual(['c', 'b', 'a'])
    expect(next[2].title).toBe('A renamed')
  })

  it('adds a new evaluation at the top', () => {
    expect(placeSummary(list, summary('d')).map((s) => s.evaluation_id)).toEqual(['d', 'c', 'b', 'a'])
  })
})
