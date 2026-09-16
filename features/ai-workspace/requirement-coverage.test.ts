import { describe, expect, it } from 'vitest'
import { buildFitCoverage } from './requirement-fit'
import type { EvaluationProduct } from './evaluation-types'

function product(id: string, cells: Record<string, unknown> | null): EvaluationProduct {
  return {
    product_id: id,
    product_name: id,
    requirement_fit: cells ? { assessed_at: 'T', basis: {}, cells } : null,
  } as unknown as EvaluationProduct
}

const profile = {
  goals: [{ text: 'improve visibility' }],
  pain_points: ['spreadsheets'],
  constraints: [
    { type: 'team_size', value: '50' },
    { type: 'budget', value: 'under $15 a seat' },
  ],
}

describe('buildFitCoverage', () => {
  it('accounts for a captured requirement the grid cannot show', () => {
    // The state the deployed harness produces: catalog rows only, because it
    // emits no judgement verdicts. The grid drops goals and pain_points; the
    // buyer must still be told they were captured and who owes an answer.
    const cells = { team_size: { status: 'yes', source: 'catalog' } }
    const coverage = buildFitCoverage([product('a', cells), product('b', cells)], profile)

    expect(coverage).not.toBeNull()
    const byKey = Object.fromEntries(coverage!.rows.map((row) => [row.key, row]))

    expect(byKey.team_size.state).toBe('assessed')
    expect(byKey.goals.state).toBe('awaiting-agent')
    expect(byKey.goals.decidedBy).toBe('judgement')
    expect(byKey.goals.values).toEqual(['improve visibility'])
    expect(byKey.goals.explanation).toMatch(/has not weighed in/)
  })

  it('counts a lookup and a judgement apart', () => {
    const coverage = buildFitCoverage(
      [
        product('a', {
          team_size: { status: 'yes', source: 'catalog' },
          goals: { status: 'yes', source: 'judgement' },
        }),
      ],
      profile,
    )
    expect(coverage!.checked).toBe(1)
    expect(coverage!.judged).toBe(1)
  })

  it('separates a catalog row with nothing on file from one awaiting Sam', () => {
    const coverage = buildFitCoverage([product('a', { goals: { status: 'yes', source: 'judgement' } })], {
      ...profile,
      constraints: [{ type: 'compliance', value: 'SOC 2' }],
    })
    const byKey = Object.fromEntries(coverage!.rows.map((row) => [row.key, row]))
    expect(byKey.compliance.state).toBe('no-catalog-data')
    expect(byKey.compliance.explanation).toMatch(/unproven rather than missing/)
  })

  it('returns null only when nothing has been captured', () => {
    expect(buildFitCoverage([], null)).toBeNull()
  })
})
