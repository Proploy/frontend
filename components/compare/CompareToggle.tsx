'use client'

// components/compare/CompareToggle.tsx — per-product "add to comparison" toggle.
// Designed to sit in a product card footer next to "Learn More". Reads the persistent
// selection store; never navigates (so it can live inside a linked card).

import { Check, Scale } from 'lucide-react'
import { MAX_COMPARE, useCompareSelection, type SelectedProduct } from '@/features/compare/selection-store'

export default function CompareToggle({
  product,
  className = '',
}: {
  product: SelectedProduct
  className?: string
}) {
  const { isSelected, isFull, toggle } = useCompareSelection()
  const selected = isSelected(product.product_id)
  const blocked = isFull && !selected

  const base =
    'inline-flex items-center gap-[6px] rounded-[8px] px-[12px] py-[6px] font-[family-name:var(--font-dm-sans)] font-semibold text-[14px] leading-[20px] transition-colors disabled:cursor-not-allowed'
  const tone = selected
    ? 'border border-[#b2ddff] bg-[#eff8ff] text-[#004eeb] hover:bg-[#dbeeff]'
    : blocked
      ? 'border border-[#e9eaeb] bg-white text-[#a4a7ae]'
      : 'border border-[#d5d7da] bg-white text-[#414651] hover:bg-[#f5f5f5] hover:text-[#004eeb]'

  return (
    <button
      type="button"
      aria-pressed={selected}
      disabled={blocked}
      title={blocked ? `Compare up to ${MAX_COMPARE} products — remove one first` : undefined}
      onClick={(e) => {
        // The card itself is wrapped in links; keep the toggle local.
        e.preventDefault()
        e.stopPropagation()
        toggle(product)
      }}
      className={`${base} ${tone} ${className}`}
    >
      {selected ? <Check size={16} aria-hidden="true" /> : <Scale size={16} aria-hidden="true" />}
      {selected ? 'Added' : 'Compare'}
    </button>
  )
}
