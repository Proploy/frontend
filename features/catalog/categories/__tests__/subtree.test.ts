import { describe, expect, it } from 'vitest'

import { getDescendantProductCategoryTermIds } from '../mappers'
import type { CategoryNode } from '../types'

const tree: CategoryNode = {
  term_id: 'marketing', taxonomy_type: 'ui_category', slug: 'marketing', label: 'Marketing', description: null, parent_term_id: null, product_count: 0,
  children: [{
    term_id: 'email', taxonomy_type: 'product_category', slug: 'email', label: 'Email', description: null, parent_term_id: 'marketing', product_count: 2,
    children: [{ term_id: 'automation', taxonomy_type: 'product_category', slug: 'automation', label: 'Automation', description: null, parent_term_id: 'email', product_count: 1, children: [] }],
  }],
}

describe('getDescendantProductCategoryTermIds', () => {
  it('includes every product category in a selected branch', () => {
    expect(getDescendantProductCategoryTermIds(tree)).toEqual(['email', 'automation'])
  })

  it('includes the selected product category itself', () => {
    expect(getDescendantProductCategoryTermIds(tree.children[0])).toEqual(['email', 'automation'])
  })
})
