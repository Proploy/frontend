import type { CardProduct } from './types'

export function getNextProductPageOffset(currentProducts: CardProduct[]): number {
  return currentProducts.length
}

export function mergeProductListPage({
  currentProducts,
  incomingProducts,
  offset,
}: {
  currentProducts: CardProduct[]
  incomingProducts: CardProduct[]
  offset: number
}): CardProduct[] {
  if (offset <= 0) return incomingProducts

  const merged = new Map<string, CardProduct>()
  for (const product of currentProducts) {
    merged.set(product.product_id, product)
  }
  for (const product of incomingProducts) {
    merged.set(product.product_id, product)
  }

  return Array.from(merged.values())
}
