import { mapCategoryTreeToFilters, mapCategoryTreeToRoots } from '../mappers'
import type { CategoryNode } from '../types'

// ── Test Fixtures ────────────────────────────────────────────────────────────

const mockCategoryTree: CategoryNode[] = [
  {
    term_id: 'ui-cat-1',
    taxonomy_type: 'ui_category',
    slug: 'business-software',
    label: 'Business Software',
    description: null,
    parent_term_id: null,
    product_count: 0,
    children: [
      {
        term_id: 'prod-cat-1',
        taxonomy_type: 'product_category',
        slug: 'crm',
        label: 'CRM',
        description: 'Customer Relationship Management',
        parent_term_id: 'ui-cat-1',
        product_count: 42,
        children: [],
      },
      {
        term_id: 'prod-cat-2',
        taxonomy_type: 'product_category',
        slug: 'marketing-automation',
        label: 'Marketing Automation',
        description: null,
        parent_term_id: 'ui-cat-1',
        product_count: 28,
        children: [],
      },
    ],
  },
  {
    term_id: 'ui-cat-2',
    taxonomy_type: 'ui_category',
    slug: 'dev-tools',
    label: 'Developer Tools',
    description: null,
    parent_term_id: null,
    product_count: 0,
    children: [
      {
        term_id: 'prod-cat-3',
        taxonomy_type: 'product_category',
        slug: 'ci-cd',
        label: 'CI/CD',
        description: 'Continuous Integration & Deployment',
        parent_term_id: 'ui-cat-2',
        product_count: 15,
        children: [],
      },
      {
        term_id: 'prod-cat-4',
        taxonomy_type: 'product_category',
        slug: 'version-control',
        label: 'Version Control',
        description: null,
        parent_term_id: 'ui-cat-2',
        product_count: 8,
        children: [],
      },
    ],
  },
  // Orphan product_category (no ui_category parent) - should still be included in filters
  {
    term_id: 'prod-cat-5',
    taxonomy_type: 'product_category',
    slug: 'analytics',
    label: 'Analytics',
    description: null,
    parent_term_id: null,
    product_count: 12,
    children: [],
  },
]

// ── Tests ────────────────────────────────────────────────────────────────────

describe('mapCategoryTreeToFilters', () => {
  it('extracts only product_category nodes from tree', () => {
    const filters = mapCategoryTreeToFilters(mockCategoryTree)
    
    expect(filters).toHaveLength(5)
    expect(filters.every(f => f.taxonomy_type === 'product_category')).toBe(true)
  })

  it('includes product_count from backend', () => {
    const filters = mapCategoryTreeToFilters(mockCategoryTree)
    
    const crm = filters.find(f => f.slug === 'crm')
    expect(crm?.count).toBe(42)
    
    const analytics = filters.find(f => f.slug === 'analytics')
    expect(analytics?.count).toBe(12)
  })

  it('includes term_id, label, slug for each filter', () => {
    const filters = mapCategoryTreeToFilters(mockCategoryTree)
    
    const crm = filters.find(f => f.slug === 'crm')
    expect(crm).toEqual({
      term_id: 'prod-cat-1',
      label: 'CRM',
      slug: 'crm',
      count: 42,
      taxonomy_type: 'product_category',
    })
  })

  it('includes orphan product_category nodes (no parent)', () => {
    const filters = mapCategoryTreeToFilters(mockCategoryTree)
    
    const analytics = filters.find(f => f.slug === 'analytics')
    expect(analytics).toBeDefined()
    expect(analytics?.parent_term_id).toBeUndefined() // Not in output, but it was in input
  })

  it('returns empty array for empty tree', () => {
    const filters = mapCategoryTreeToFilters([])
    expect(filters).toEqual([])
  })
})

describe('mapCategoryTreeToRoots', () => {
  it('returns only ui_category roots with null parent_term_id', () => {
    const roots = mapCategoryTreeToRoots(mockCategoryTree)
    
    expect(roots).toHaveLength(2)
    expect(roots.every(r => r.taxonomy_type === 'ui_category')).toBe(true)
    expect(roots.every(r => r.parent_term_id === null)).toBe(true)
  })

  it('preserves children in returned roots', () => {
    const roots = mapCategoryTreeToRoots(mockCategoryTree)
    
    expect(roots[0].children).toHaveLength(2)
    expect(roots[1].children).toHaveLength(2)
  })

  it('excludes product_category nodes', () => {
    const roots = mapCategoryTreeToRoots(mockCategoryTree)
    
    const analytics = roots.find(r => r.slug === 'analytics')
    expect(analytics).toBeUndefined()
  })
})
