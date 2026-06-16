import type { ProductMediaAssetItem, ProductPageModel } from './types'

export type ProductTabKey =
  | 'product-information'
  | 'integrations'
  | 'pricing'
  | 'reviews'
  | 'features'
  | 'media'

export interface ProductDetailTab {
  key: ProductTabKey
  label: string
  badge?: string
}

export interface ProductMediaPreview {
  id: string
  url: string
  type: 'image' | 'video'
  alt: string
}

const PRODUCT_DETAIL_TABS: ProductDetailTab[] = [
  { key: 'product-information', label: 'Product Information' },
  { key: 'integrations', label: 'Integrations' },
  { key: 'pricing', label: 'Pricing' },
  { key: 'reviews', label: 'Reviews' },
  { key: 'features', label: 'Features' },
  { key: 'media', label: 'Media' },
]

export function getProductDetailHref(productId: string): string {
  return `/products/${encodeURIComponent(productId)}`
}

export function getProductDetailTabs(_product: ProductPageModel): ProductDetailTab[] {
  void _product
  return PRODUCT_DETAIL_TABS
}

export function mapMediaAssetsToPreview(
  assets: ProductMediaAssetItem[],
): ProductMediaPreview[] {
  return assets.flatMap((asset) => {
    if (!asset.public_url) return []

    return [{
      id: asset.media_id,
      url: asset.public_url,
      type: asset.asset_kind === 'video' ? 'video' as const : 'image' as const,
      alt: asset.alt_text ?? '',
    }]
  })
}
