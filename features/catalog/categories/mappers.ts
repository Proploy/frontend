// Category Mappers — convert backend contracts to UI view models.

import type { CategoryNode } from './types'
import type { CategoryFilter } from './types'

/**
 * Flatten the category tree to extract only product_category nodes for filter UI.
 * Backend returns ui_category roots with product_category children.
 * Filters should show product_category terms with their product counts.
 */
export function mapCategoryTreeToFilters(tree: CategoryNode[]): CategoryFilter[] {
  const filters: CategoryFilter[] = []

  function traverse(node: CategoryNode) {
    if (node.taxonomy_type === 'product_category') {
      filters.push({
        term_id: node.term_id,
        label: node.label,
        slug: node.slug,
        count: node.product_count,
        taxonomy_type: node.taxonomy_type,
      })
    }
    node.children.forEach(traverse)
  }

  tree.forEach(traverse)
  return filters
}

/**
 * Get ui_category roots for navigation (e.g., top-level tabs).
 */
export function mapCategoryTreeToRoots(tree: CategoryNode[]): CategoryNode[] {
  return tree.filter(node => node.taxonomy_type === 'ui_category' && node.parent_term_id === null)
}

/**
 * Return every product-category term in a selected branch, including the
 * selected term when it is itself a product category. The list endpoint
 * filters by one exact term, so callers use these IDs to build a recursive
 * category result set on the client.
 */
export function getDescendantProductCategoryTermIds(node: CategoryNode | null): string[] {
  if (!node) return []

  const termIds: string[] = []
  const visit = (current: CategoryNode) => {
    if (current.taxonomy_type === 'product_category') {
      termIds.push(current.term_id)
    }
    current.children.forEach(visit)
  }

  visit(node)
  return termIds
}
