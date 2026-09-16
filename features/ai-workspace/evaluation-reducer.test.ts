import { describe, expect, it } from 'vitest'

import type { EvaluationDetail } from './evaluation-types'
import {
  agentSelectedProducts,
  applyEvaluationStreamEvent,
  mergeMatches,
  parseAssistantMarkdown,
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

  it('updates evaluation title from session_meta event', () => {
    const next = applyEvaluationStreamEvent(baseEvaluation, {
      type: 'session_meta',
      data: { title: 'CRM for 50-person Sales Team' },
    })
    expect(next.title).toBe('CRM for 50-person Sales Team')
  })

  it('derives requirements and sets requirements_confirmed on profile update', () => {
    const next = applyEvaluationStreamEvent(baseEvaluation, {
      type: 'evaluation_state',
      data: {
        profile: {
          goals: [{ text: 'Automate sales quotes' }],
          pain_points: ['Slow quoting process'],
          constraints: [{ type: 'team_size', value: '25' }, { type: 'budget', value: '$10k/yr' }],
        },
      },
    })
    expect(next.requirements).toBeDefined()
    expect(next.requirements?.primary_use_case?.value).toBe('Automate sales quotes')
    expect(next.requirements?.problem_frame?.value).toBe('Slow quoting process')
    expect(next.requirements?.team_size?.value).toBe('25')
    expect(next.requirements?.budget?.value).toBe('$10k/yr')
    expect(next.milestones.requirements_confirmed).toBe(true)
  })

  it('prefers server requirements over the existing draft and the derived one', () => {
    const next = applyEvaluationStreamEvent(
      {
        ...baseEvaluation,
        requirements: { primary_use_case: { state: 'answered', value: 'Old draft' } },
      },
      {
        type: 'evaluation_state',
        data: {
          requirements: { primary_use_case: { state: 'answered', value: 'Server draft' } },
          profile: { goals: [{ text: 'Derived goal' }] },
        },
      },
    )
    expect(next.requirements?.primary_use_case?.value).toBe('Server draft')
  })

  it('keeps existing answered fields while incorporating newly derived ones', () => {
    const next = applyEvaluationStreamEvent(
      {
        ...baseEvaluation,
        requirements: { team_size: { state: 'answered', value: '42' } },
      },
      {
        type: 'evaluation_state',
        data: {
          profile: { goals: [{ text: 'Derived goal' }] },
        },
      },
    )
    expect(next.requirements?.team_size?.value).toBe('42')
    expect(next.requirements?.primary_use_case?.value).toBe('Derived goal')
  })

  it('falls back to derivation when the existing draft is meaningless', () => {
    const next = applyEvaluationStreamEvent(
      {
        ...baseEvaluation,
        requirements: { team_size: { state: 'unanswered' } },
      },
      {
        type: 'evaluation_state',
        data: {
          profile: { goals: [{ text: 'Derived goal' }] },
        },
      },
    )
    expect(next.requirements?.primary_use_case?.value).toBe('Derived goal')
  })

  it('adopts agent_session_id and evaluation_id from a session event', () => {
    const next = applyEvaluationStreamEvent(baseEvaluation, {
      type: 'session',
      data: { session_id: 'harness-session-9', evaluation_id: 'evaluation-9' },
    })
    expect(next.agent_session_id).toBe('harness-session-9')
    expect(next.evaluation_id).toBe('evaluation-9')
  })
})

describe('parseAssistantMarkdown', () => {
  it('cleanly strips SELECTED_PRODUCT_IDS and extracts matches without leaving dangling markers', () => {
    const raw = `Here are the top candidates for your team:
- **HubSpot**: Great all-around CRM
- **Salesforce**: Highly scalable

SELECTED_PRODUCT_IDS: [
  {"product_id": "hubspot", "agent_score": 9.2, "reason": "Best fit"},
  {"product_id": "salesforce", "agent_score": 8.5, "reason": "Scalable"}
]`
    const { displayMarkdown, extractedMatches } = parseAssistantMarkdown(raw)
    expect(displayMarkdown).not.toContain('SELECTED_PRODUCT_IDS')
    expect(displayMarkdown).not.toContain('{"product_id"')
    expect(displayMarkdown).toContain('HubSpot')
    expect(extractedMatches).toHaveLength(2)
    expect(extractedMatches[0].product_id).toBe('hubspot')
    expect(extractedMatches[0].match_score).toBe(92)
  })
})

