'use client'

import { useEffect, useState } from 'react'
import type { EvaluationProduct } from '@/features/ai-workspace'
import { clientCatalogApi } from '@/features/catalog/shared/client-api'

export function ProductName({ product }: { product: EvaluationProduct }) {
  const [resolvedName, setResolvedName] = useState<string | null>(null)

  useEffect(() => {
    if (!product.product_name || product.product_name === product.product_id) {
      clientCatalogApi.products.getDetail(product.product_id).then((res) => {
        if (res.ok && res.data?.product_name) {
          setResolvedName(res.data.product_name)
        }
      })
    }
  }, [product.product_id, product.product_name])

  const displayName = resolvedName || product.product_name
  if (!displayName || displayName === product.product_id) {
    return <span className="animate-pulse bg-gray-200 text-transparent rounded w-24 inline-block">Loading</span>
  }

  return <>{displayName}</>
}
