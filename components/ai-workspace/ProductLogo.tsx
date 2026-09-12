'use client'

import { CatalogImage } from '@/components/catalog/CatalogImage'
import type { EvaluationProduct } from '@/features/ai-workspace'
import { productDisplayName } from '@/features/ai-workspace/journey'
import { getProductLogoUrl } from '@/features/catalog/products/logo-url'

/**
 * Sam's picks arrive with no logo reference — the catalog serves the approved
 * logo off the product id — so the card asks that route for it directly and
 * falls back to a monogram when the product has none (the route 404s).
 */
export function ProductLogo({
  product,
  className = 'size-9',
}: {
  product: EvaluationProduct
  className?: string
}) {
  const src = getProductLogoUrl(
    product.product_id,
    `/api/v1/catalog/products/${encodeURIComponent(product.product_id)}/logo`,
  )
  const monogram = productDisplayName(product).trim().charAt(0).toUpperCase() || '?'
  const fallback = <span aria-hidden>{monogram}</span>

  return (
    <span
      className={`grid shrink-0 place-items-center overflow-hidden rounded-lg border border-border bg-white text-[0.8rem] font-semibold text-cobalt-deep ${className}`}
    >
      {src ? (
        <CatalogImage src={src} alt="" className="size-full object-contain p-1" fallback={fallback} />
      ) : (
        fallback
      )}
    </span>
  )
}
