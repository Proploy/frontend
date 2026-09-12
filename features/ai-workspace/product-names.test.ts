import { describe, expect, it } from 'vitest'

import type { EvaluationProduct } from './evaluation-types'
import { applyResolvedProductNames, productIdsMissingNames } from './product-names'

const bare: EvaluationProduct = {
  product_id: '6fc32aa84bb4',
  product_name: null,
  profile_href: null,
  available: true,
  is_agent_selected: true,
}
const idAsName: EvaluationProduct = { ...bare, product_id: '793085ba805e', product_name: '793085ba805e' }
const named: EvaluationProduct = { ...bare, product_id: 'asana', product_name: 'Asana', best_for: 'Teams' }

describe('product name resolution', () => {
  it('flags products whose name is missing or just the ID', () => {
    expect(productIdsMissingNames([bare, idAsName, named])).toEqual(['6fc32aa84bb4', '793085ba805e'])
  })

  it('patches resolved names without touching products that already have one', () => {
    const next = applyResolvedProductNames([bare, idAsName, named], {
      '6fc32aa84bb4': { product_name: 'monday.com', best_for: 'Planning' },
      asana: { product_name: 'Should not apply' },
    })
    expect(next[0].product_name).toBe('monday.com')
    expect(next[0].best_for).toBe('Planning')
    expect(next[1].product_name).toBe('793085ba805e')
    expect(next[2].product_name).toBe('Asana')
  })

  it('returns the same array when nothing changes', () => {
    const input = [named]
    expect(applyResolvedProductNames(input, {})).toBe(input)
  })
})
