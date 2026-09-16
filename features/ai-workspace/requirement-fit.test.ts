import { describe, expect, it } from 'vitest'
import { asRequirementFit, buildFitMatrix, normalizeBasisValue } from './requirement-fit'
import type { EvaluationProduct, FitCell, RequirementFit } from './evaluation-types'
import type { AiWorkspaceProfile } from './types'

/**
 * The gateway decides the verdicts; everything here decides whether a grid of
 * them is worth putting in front of a buyer, and whether it still describes
 * the requirements they currently have.
 */

function cell(status: FitCell['status'], source: FitCell['source'] = 'catalog'): FitCell {
  return { status, source }
}

function product(
  id: string,
  fit: RequirementFit | null,
  name = id.toUpperCase(),
): EvaluationProduct {
  return {
    product_id: id,
    product_name: name,
    profile_href: null,
    available: true,
    requirement_fit: fit,
  }
}

const profile: AiWorkspaceProfile = {
  constraints: [
    { type: 'compliance', value: 'SOC 2' },
    { type: 'deployment', value: 'Cloud' },
    { type: 'team_size', value: '40' },
  ],
}

function fit(cells: Record<string, FitCell>, basis: Record<string, string[]> = {}): RequirementFit {
  return { assessed_at: '2026-09-15T00:00:00+00:00', basis, cells }
}

const bothAssessed = [
  product('a', fit({ compliance: cell('yes'), deployment: cell('yes'), team_size: cell('partial') })),
  product('b', fit({ compliance: cell('no'), deployment: cell('yes'), team_size: cell('yes') })),
]

describe('normalizeBasisValue', () => {
  it('matches the gateway: lowercase, alphanumerics only', () => {
    expect(normalizeBasisValue('  SOC 2 ')).toBe('soc2')
    expect(normalizeBasisValue('Self-Hosted')).toBe('selfhosted')
  })
})

describe('asRequirementFit', () => {
  it('rejects anything without usable cells, so absence stays one signal', () => {
    expect(asRequirementFit(null)).toBeNull()
    expect(asRequirementFit('yes')).toBeNull()
    expect(asRequirementFit({ cells: {} })).toBeNull()
    expect(asRequirementFit({ basis: { compliance: ['soc2'] } })).toBeNull()
  })

  it('clamps a status or source outside the vocabulary rather than trusting it', () => {
    const parsed = asRequirementFit({
      cells: { compliance: { status: 'probably', source: 'vibes', note: '  ' } },
    })
    expect(parsed?.cells.compliance).toEqual({ status: 'unknown', source: 'catalog', note: undefined })
  })

  it('keeps the basis so staleness can be judged per row', () => {
    const parsed = asRequirementFit({
      basis: { compliance: ['soc2'], bad: 'not-a-list' },
      cells: { compliance: { status: 'yes', source: 'catalog' } },
    })
    expect(parsed?.basis).toEqual({ compliance: ['soc2'] })
  })
})

describe('buildFitMatrix', () => {
  it('declines a single product: one column is a list wearing a grid costume', () => {
    expect(buildFitMatrix([bothAssessed[0], product('b', null)], profile)).toBeNull()
  })

  it('declines a single row: one requirement is a sentence', () => {
    const rows = [
      product('a', fit({ compliance: cell('yes') })),
      product('b', fit({ compliance: cell('no') })),
    ]
    expect(buildFitMatrix(rows, profile)).toBeNull()
  })

  it('declines a mostly unassessed grid rather than reading as blanket failure', () => {
    // Two verdicts across a 2x3 grid: a third of the cells, so it reads as
    // "these products fail everything" rather than as a comparison.
    const sparse = [
      product('a', fit({ compliance: cell('yes'), deployment: cell('unknown') })),
      product('b', fit({ compliance: cell('unknown'), deployment: cell('unknown') })),
      product('c', fit({ compliance: cell('unknown'), deployment: cell('yes') })),
    ]
    expect(buildFitMatrix(sparse, profile)).toBeNull()
  })

  it('leans on row suppression, not the share gate, at two products', () => {
    // Worth pinning because it is not obvious: every surviving row has at
    // least one verdict, so with two products coverage is always >= 50% and
    // the share gate cannot fire. Dropping all-unknown rows is what does the
    // work here; the share gate only starts binding at three products.
    const half = [
      product('a', fit({ compliance: cell('yes'), deployment: cell('unknown') })),
      product('b', fit({ compliance: cell('unknown'), deployment: cell('yes') })),
    ]
    const view = buildFitMatrix(half, profile)
    expect(view?.assessed).toBe(2)
    expect(view?.total).toBe(4)
  })

  it('orders rows the way the requirements panel does', () => {
    const view = buildFitMatrix(bothAssessed, profile)
    expect(view?.rows.map((row) => row.key)).toEqual(['team_size', 'deployment', 'compliance'])
    expect(view?.rows.map((row) => row.label)).toEqual(['Team size', 'Deployment', 'Compliance'])
  })

  it('drops a row nobody could assess but keeps one everybody agrees on', () => {
    const view = buildFitMatrix(
      [
        product('a', fit({ compliance: cell('yes'), deployment: cell('yes'), team_size: cell('unknown') })),
        product('b', fit({ compliance: cell('yes'), deployment: cell('yes'), team_size: cell('unknown') })),
      ],
      profile,
    )
    // "both meet SOC 2" is an answer; "neither could be checked" is not.
    expect(view?.rows.map((row) => row.key)).toEqual(['deployment', 'compliance'])
  })

  it('flags only the row whose requirement moved', () => {
    const basis = { compliance: ['soc2'], deployment: ['cloud'], team_size: ['40'] }
    const changed: AiWorkspaceProfile = {
      constraints: [
        { type: 'compliance', value: 'HIPAA' },
        { type: 'deployment', value: 'Cloud' },
        { type: 'team_size', value: '40' },
      ],
    }
    const view = buildFitMatrix(
      [
        product('a', fit({ compliance: cell('yes'), deployment: cell('yes'), team_size: cell('yes') }, basis)),
        product('b', fit({ compliance: cell('no'), deployment: cell('yes'), team_size: cell('yes') }, basis)),
      ],
      changed,
    )
    expect(view?.staleRows).toBe(1)
    expect(view?.rows.find((row) => row.key === 'compliance')?.stale).toBe(true)
    expect(view?.rows.find((row) => row.key === 'deployment')?.stale).toBe(false)
  })

  it('does not call a row stale over spelling or ordering', () => {
    const view = buildFitMatrix(
      [
        product('a', fit({ compliance: cell('yes'), deployment: cell('yes') }, { compliance: ['SOC-2'] })),
        product('b', fit({ compliance: cell('no'), deployment: cell('yes') }, { compliance: ['soc 2'] })),
      ],
      profile,
    )
    expect(view?.staleRows).toBe(0)
  })

  it('counts verdicts per product and reports the denominator', () => {
    const view = buildFitMatrix(bothAssessed, profile)
    const a = view?.columns.find((column) => column.product.product_id === 'a')
    expect(a).toMatchObject({ met: 2, partial: 1, missing: 0, unknown: 0, assessed: 3 })
    expect(view?.assessed).toBe(6)
    expect(view?.total).toBe(6)
  })

  it('reports when any cell is the agent opinion rather than a catalog lookup', () => {
    expect(buildFitMatrix(bothAssessed, profile)?.hasJudgement).toBe(false)
    const judged = [
      product('a', fit({ compliance: cell('yes'), deployment: cell('yes', 'judgement') })),
      product('b', fit({ compliance: cell('no'), deployment: cell('yes') })),
    ]
    expect(buildFitMatrix(judged, profile)?.hasJudgement).toBe(true)
  })

  it('labels a row the requirements panel does not know about', () => {
    const view = buildFitMatrix(
      [
        product('a', fit({ compliance: cell('yes'), data_residency: cell('no') })),
        product('b', fit({ compliance: cell('yes'), data_residency: cell('yes') })),
      ],
      profile,
    )
    expect(view?.rows.find((row) => row.key === 'data_residency')?.label).toBe('Data residency')
  })

  it('falls back to the id when a product has no name', () => {
    const view = buildFitMatrix(
      [
        { ...bothAssessed[0], product_name: '   ' },
        bothAssessed[1],
      ],
      profile,
    )
    expect(view?.columns[0].productName).toBe('a')
  })
})
