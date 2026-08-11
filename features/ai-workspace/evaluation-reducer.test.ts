import { describe, expect, it } from 'vitest'

import type { EvaluationDetail } from './evaluation-types'
import { applyEvaluationStreamEvent } from './evaluation-reducer'

const baseEvaluation: EvaluationDetail = {
  evaluation_id: 'evaluation-1',
  agent_session_id: 'agent-1',
  title: 'Software Procurement',
  status: 'active',
  stage: 'building_shortlist',
  attention_group: 'in_progress',
  next_action: 'shortlist_products',
  shortlist_count: 0,
  match_count: 0,
  recommendation_state: 'unavailable',
  regeneration_status: 'idle',
  milestones: {
    requirements_confirmed: true,
    products_discovered: false,
    shortlist_ready: false,
    recommendation_generated: false,
  },
  progress_percent: 40,
  comparison_product_ids: [],
  requirements: null,
  missing_critical_signals: [],
  matches: [],
  shortlist: [],
  recommendation: null,
  messages: [],
}

describe('applyEvaluationStreamEvent', () => {
  it('publishes recommendation only from an explicit recommendation event', () => {
    const next = applyEvaluationStreamEvent(baseEvaluation, {
      type: 'recommendation_published',
      data: {
        recommendation: {
          recommended_product: {
            product_id: 'zendesk',
            product_name: 'Zendesk',
            profile_href: '/products/zendesk',
            available: true,
          },
          publication_state: 'current',
          why_it_won: ['Best Slack-first support fit'],
          main_trade_offs: ['More setup than Freshdesk'],
          supporting_evidence_bundle_ids: [],
          alternative_product: null,
        },
      },
    })

    expect(next.recommendation?.recommended_product.product_id).toBe('zendesk')
    expect(next.recommendation_state).toBe('current')
    expect(next.milestones.recommendation_generated).toBe(true)
  })

  it('updates shortlist without treating products as generic results', () => {
    const next = applyEvaluationStreamEvent(baseEvaluation, {
      type: 'shortlist_updated',
      data: {
        items: [
          {
            product_id: 'freshdesk',
            product_name: 'Freshdesk',
            profile_href: '/products/freshdesk',
            available: true,
          },
        ],
      },
    })

    expect(next.shortlist).toEqual([
      {
        product_id: 'freshdesk',
        product_name: 'Freshdesk',
        profile_href: '/products/freshdesk',
        available: true,
      },
    ])
    expect(next.matches).toEqual([])
    expect(next.shortlist_count).toBe(1)
  })
})
