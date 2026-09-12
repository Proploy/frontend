import type { EvaluationProduct } from './evaluation-types'

/**
 * Sam's picks sometimes arrive with only an ID (older evaluations, or a
 * product the harness could not resolve from its search batch). The UI must
 * never show a raw ID, so missing names are looked up from the catalog and
 * patched into the evaluation state.
 */

export function needsProductName(product: EvaluationProduct): boolean {
  const name = product.product_name?.trim()
  return !name || name === product.product_id
}

export function productIdsMissingNames(products: EvaluationProduct[]): string[] {
  return products.filter(needsProductName).map((product) => product.product_id)
}

export type ResolvedProductNames = Record<string, { product_name: string; best_for?: string | null }>

export function applyResolvedProductNames(
  products: EvaluationProduct[],
  resolved: ResolvedProductNames,
): EvaluationProduct[] {
  let changed = false
  const next = products.map((product) => {
    const hit = resolved[product.product_id]
    if (!hit || !needsProductName(product)) return product
    changed = true
    return {
      ...product,
      product_name: hit.product_name,
      best_for: product.best_for ?? hit.best_for ?? undefined,
    }
  })
  return changed ? next : products
}
