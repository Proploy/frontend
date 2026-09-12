import { describe, expect, it } from 'vitest'

import type { EvaluationDetail } from './evaluation-types'
import {
  agentSelectedProducts,
  applyEvaluationStreamEvent,
  mergeMatches,
} from './evaluation-reducer'

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

describe('agent-only product selection', () => {
  const selectedHigh = {
    product_id: 'linear',
    product_name: 'Linear',
    profile_href: '/products/linear',
    available: true,
    match_score: 92,
    is_agent_selected: true,
  }
  const selectedLow = {
    product_id: 'asana',
    product_name: 'Asana',
    profile_href: '/products/asana',
    available: true,
    match_score: 75,
    is_agent_selected: true,
  }
  const searchedOnly = {
    product_id: 'noise',
    product_name: 'Noise',
    profile_href: '/products/noise',
    available: true,
    match_score: 88,
  }

  it('only exposes products the agent selected, never plain catalog hits', () => {
    expect(agentSelectedProducts([searchedOnly, selectedLow, selectedHigh]).map((p) => p.product_id))
      .toEqual(['asana', 'linear'])
  })

  it('appends server products to the running list and refreshes repeats in place', () => {
    const provisional = { ...selectedHigh, product_name: 'linear', reasons: ['from markdown'] }
    expect(mergeMatches([selectedLow, provisional], [selectedHigh, searchedOnly]).map((p) => p.product_id))
      .toEqual(['asana', 'linear', 'noise'])
    expect(mergeMatches([provisional], [selectedHigh])[0].product_name).toBe('Linear')
    expect(mergeMatches([selectedLow], [])).toEqual([selectedLow])
    expect(mergeMatches([selectedLow], undefined)).toEqual([selectedLow])
  })

  it('accumulates matches across evaluation_state events', () => {
    const next = applyEvaluationStreamEvent(
      { ...baseEvaluation, matches: [selectedLow] },
      { type: 'evaluation_state', data: { matches: [selectedHigh] } },
    )
    expect(next.matches.map((p) => p.product_id)).toEqual(['asana', 'linear'])
    expect(next.match_count).toBe(2)
  })
})
