// Category Contracts — mirrors backend Pydantic models exactly.
// Backend: CategoryNode, CategoryTreeResponse (service-apis/modules/catalog/categories/models.py)

export interface CategoryNode {
  term_id: string
  taxonomy_type: string
  slug: string
  label: string
  description: string | null
  parent_term_id: string | null
  product_count: number
  children: CategoryNode[]
}

export interface CategoryTreeResponse {
  tree: CategoryNode[]
}

// View model for filter UI (flat list of product_category nodes)
export interface CategoryFilter {
  term_id: string
  label: string
  slug: string
  count: number
  taxonomy_type: string
}
