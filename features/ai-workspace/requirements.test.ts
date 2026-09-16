import { describe, expect, it } from 'vitest'

import { deriveRequirements, hasRequirements } from './requirements'

describe('deriveRequirements', () => {
  it('turns the needs profile into a labelled matrix with gaps marked', () => {
    const matrix = deriveRequirements({
      goals: [{ text: 'Replace our PM tool', priority: 'high' }],
      constraints: [
        { type: 'team_size', value: '45' },
        { type: 'budget', value: '$10/seat' },
        { type: 'integrations', value: 'Slack' },
      ],
      pain_points: ['Double entry'],
      success_criteria: [],
      interested_products: ['GitHub'],
    })
    const byKey = Object.fromEntries(matrix.rows.map((row) => [row.key, row]))
    expect(byKey.goals.values).toEqual(['Replace our PM tool'])
    expect(byKey.team_size.values).toEqual(['45'])
    expect(byKey.integrations.values).toEqual(['Slack', 'GitHub'])
    expect(byKey.compliance.missing).toBe(true)
    expect(byKey.success_criteria.missing).toBe(true)
    expect(matrix.known).toBe(5)
    // Timeline is empty and unscoreable, so it is not carried as a gap.
    expect(matrix.total).toBe(9)
  })

  it('reports nothing captured for an empty or missing profile', () => {
    expect(hasRequirements(null)).toBe(false)
    expect(hasRequirements({ goals: [], constraints: [] })).toBe(false)
  })
})

describe('deriveRequirements — harness field mapping', () => {
  it('reads industry from interested_domains, where the harness files it', () => {
    // agent-harness tools/profile/extract.py appends industry to
    // `interested_domains` rather than emitting Constraint(type="industry"),
    // so reading the constraints list alone left this row always empty.
    const matrix = deriveRequirements({ interested_domains: ['Pharmaceutical manufacturing'] })
    const industry = matrix.rows.find((row) => row.key === 'industry')
    expect(industry?.missing).toBe(false)
    expect(industry?.values).toEqual(['Pharmaceutical manufacturing'])
  })

  it('still honours an explicit industry constraint if one is sent', () => {
    const matrix = deriveRequirements({ constraints: [{ type: 'industry', value: 'Fintech' }] })
    expect(matrix.rows.find((row) => row.key === 'industry')?.values).toEqual(['Fintech'])
  })

  it('captures numeric constraints and top-level profile fields correctly', () => {
    const matrix = deriveRequirements({
      team_size: 50,
      budget_tier: '$10,000/mo',
      industry: 'healthcare',
      compliance: 'SOC2',
      deployment: 'cloud-based',
      timeline: '3 months',
    })
    const byKey = Object.fromEntries(matrix.rows.map((row) => [row.key, row]))
    expect(byKey.team_size.values).toEqual(['50'])
    expect(byKey.budget.values).toEqual(['$10,000/mo'])
    expect(byKey.industry.values).toEqual(['healthcare'])
    expect(byKey.compliance.values).toEqual(['SOC2'])
    expect(byKey.deployment.values).toEqual(['cloud-based'])
    expect(byKey.timeline.values).toEqual(['3 months'])
    expect(matrix.known).toBe(6)
  })

  it('merges answered fields from requirementsDraft', () => {
    const matrix = deriveRequirements(
      { goals: [{ text: 'CRM evaluation' }] },
      {
        team_size: { state: 'answered', value: '50' },
        compliance: { state: 'answered', value: 'HIPAA, SOC2' },
      },
    )
    const byKey = Object.fromEntries(matrix.rows.map((row) => [row.key, row]))
    expect(byKey.goals.values).toEqual(['CRM evaluation'])
    expect(byKey.team_size.values).toEqual(['50'])
    expect(byKey.compliance.values).toEqual(['HIPAA, SOC2'])
    expect(matrix.known).toBe(3)
  })
})
