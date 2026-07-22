import type { SelectedProduct } from '@/features/compare/selection-store'

export function buildComparisonAdditions(
  current: SelectedProduct,
  alternative: SelectedProduct,
): SelectedProduct[] {
  return [current, alternative]
}
