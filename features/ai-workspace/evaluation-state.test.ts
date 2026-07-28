import {
  createInitialEvaluationState,
  evaluationWorkspaceReducer,
  shouldPollRegeneration,
} from './evaluation-state'
import type { EvaluationDetail } from './evaluation-types'

function evaluation(
  evaluationId: string,
  recommendedProductId?: string,
): EvaluationDetail {
  return {
    evaluation_id: evaluationId,
    agent_session_id: `session-${evaluationId}`,
    title: evaluationId,
    status: 'active',
    stage: recommendedProductId
      ? 'recommendation_ready'
      : 'building_shortlist',
    attention_group: 'in_progress',
    next_action: 'review',
    shortlist_count: 0,
    match_count: 0,
    recommendation_state: recommendedProductId ? 'current' : 'unavailable',
    regeneration_status: 'idle',
    milestones: {
      requirements_confirmed: false,
      products_discovered: false,
      shortlist_ready: false,
      recommendation_generated: Boolean(recommendedProductId),
    },
    progress_percent: 0,
    comparison_product_ids: [],
    requirements: null,
    missing_critical_signals: [],
    matches: [],
    shortlist: [],
    recommendation: recommendedProductId
      ? {
          recommended_product: {
            product_id: recommendedProductId,
            product_name: 'Asana',
            profile_href: `/products/${recommendedProductId}`,
            available: true,
          },
          publication_state: 'current',
          why_it_won: [],
          main_trade_offs: [],
          supporting_evidence_bundle_ids: [],
        }
      : null,
    messages: [],
  }
}

describe('evaluation workspace reducer', () => {
  it('applies a successful shortlist mutation immediately using canonical match data', () => {
    const detail = evaluation('evaluation-a')
    detail.matches = [
      {
        product_id: 'canonical-notion',
        product_name: 'Notion',
        profile_href: '/products/canonical-notion',
        available: true,
        match_score: 91,
      },
    ]
    let state = evaluationWorkspaceReducer(
      createInitialEvaluationState(),
      { type: 'detail_loaded', detail },
    )

    state = evaluationWorkspaceReducer(state, {
      type: 'shortlist_replaced',
      evaluationId: 'evaluation-a',
      items: [
        {
          product_id: 'canonical-notion',
          product_name: null,
          profile_href: null,
          available: true,
          rank: 1,
        },
      ],
    })

    expect(state.detailsById['evaluation-a'].shortlist).toEqual([
      {
        product_id: 'canonical-notion',
        product_name: 'Notion',
        profile_href: '/products/canonical-notion',
        available: true,
        match_score: 91,
        rank: 1,
      },
    ])
    expect(
      state.detailsById['evaluation-a'].shortlist_count,
    ).toBe(1)
    expect(state.summaries[0].shortlist_count).toBe(1)
  })

  it('polls only while a durable replacement is pending or running', () => {
    expect(shouldPollRegeneration('pending')).toBe(true)
    expect(shouldPollRegeneration('running')).toBe(true)
    expect(shouldPollRegeneration('idle')).toBe(false)
    expect(shouldPollRegeneration('failed')).toBe(false)
  })

  it('keeps detail state independent when switching evaluations', () => {
    let state = createInitialEvaluationState()
    state = evaluationWorkspaceReducer(state, {
      type: 'detail_loaded',
      detail: evaluation('evaluation-a', 'asana'),
    })
    state = evaluationWorkspaceReducer(state, {
      type: 'detail_loaded',
      detail: evaluation('evaluation-b'),
    })
    state = evaluationWorkspaceReducer(state, {
      type: 'evaluation_selected',
      evaluationId: 'evaluation-a',
    })

    expect(
      state.detailsById['evaluation-a'].recommendation
        ?.recommended_product.product_id,
    ).toBe('asana')
    expect(state.detailsById['evaluation-b'].recommendation).toBeNull()
  })

  it('keeps the published recommendation visible while updating', () => {
    let state = createInitialEvaluationState()
    state = evaluationWorkspaceReducer(state, {
      type: 'detail_loaded',
      detail: evaluation('evaluation-a', 'asana'),
    })
    state = evaluationWorkspaceReducer(state, {
      type: 'stream_event',
      evaluationId: 'evaluation-a',
      event: {
        type: 'regeneration_status',
        data: { status: 'running', scope: ['recommendation'] },
      },
    })

    const detail = state.detailsById['evaluation-a']
    expect(detail.recommendation?.recommended_product.product_id).toBe(
      'asana',
    )
    expect(detail.recommendation?.publication_state).toBe('updating')
  })

  it('ignores private or unknown stream events', () => {
    const state = evaluationWorkspaceReducer(
      {
        ...createInitialEvaluationState(),
        detailsById: { 'evaluation-a': evaluation('evaluation-a') },
      },
      {
        type: 'stream_event',
        evaluationId: 'evaluation-a',
        event: { type: 'thinking', data: { delta: 'private' } } as never,
      },
    )

    expect(state.detailsById['evaluation-a'].messages).toEqual([])
  })

  it('keeps partial assistant output and marks it failed on stream error', () => {
    const detail = evaluation('evaluation-a')
    detail.messages = [
      {
        id: 'assistant-1',
        role: 'assistant',
        markdown: 'Partial but useful response',
        artifact_refs: [],
        status: 'streaming',
      },
    ]
    const state = evaluationWorkspaceReducer(
      {
        ...createInitialEvaluationState(),
        detailsById: { 'evaluation-a': detail },
      },
      {
        type: 'stream_event',
        evaluationId: 'evaluation-a',
        event: {
          type: 'error',
          data: {
            code: 'STREAM_INTERRUPTED',
            message: 'Interrupted',
            retryable: true,
          },
        },
      },
    )

    expect(
      state.detailsById['evaluation-a'].messages[0],
    ).toMatchObject({
      markdown: 'Partial but useful response',
      status: 'failed',
    })
  })

  it('does not let a polling snapshot erase a local streaming reply', () => {
    const local = evaluation('evaluation-a')
    local.messages = [
      {
        id: 'user-local',
        role: 'user',
        markdown: 'Build an implementation plan',
        artifact_refs: [],
        status: 'complete',
      },
      {
        id: 'assistant-local',
        role: 'assistant',
        markdown: 'First, tell me about your team',
        artifact_refs: [],
        status: 'streaming',
      },
    ]
    const stale = evaluation('evaluation-a')
    const state = evaluationWorkspaceReducer(
      {
        ...createInitialEvaluationState(),
        detailsById: { 'evaluation-a': local },
      },
      { type: 'detail_loaded', detail: stale },
    )

    expect(state.detailsById['evaluation-a'].messages).toEqual(
      local.messages,
    )
  })

  it('does not let polling erase the optimistic user turn before the first delta', () => {
    const local = evaluation('evaluation-a')
    local.messages = [
      {
        id: 'user-local',
        role: 'user',
        markdown: 'Build an implementation plan',
        artifact_refs: [],
        status: 'complete',
      },
    ]
    const state = evaluationWorkspaceReducer(
      {
        ...createInitialEvaluationState(),
        detailsById: { 'evaluation-a': local },
        sendingById: { 'evaluation-a': true },
      },
      {
        type: 'detail_loaded',
        detail: evaluation('evaluation-a'),
      },
    )

    expect(state.detailsById['evaluation-a'].messages).toEqual(
      local.messages,
    )
  })

  it('accepts an authoritative reply after an older interrupted message', () => {
    const local = evaluation('evaluation-a')
    local.messages = [
      {
        id: 'assistant-failed',
        role: 'assistant',
        markdown: 'Old partial reply',
        artifact_refs: [],
        status: 'failed',
      },
      {
        id: 'assistant-complete',
        role: 'assistant',
        markdown: 'New complete reply',
        artifact_refs: [],
        status: 'complete',
      },
    ]
    const authoritative = evaluation('evaluation-a')
    authoritative.messages = [local.messages[1]]

    const state = evaluationWorkspaceReducer(
      {
        ...createInitialEvaluationState(),
        detailsById: { 'evaluation-a': local },
      },
      { type: 'detail_loaded', detail: authoritative },
    )

    expect(state.detailsById['evaluation-a'].messages).toEqual(
      authoritative.messages,
    )
  })
})
