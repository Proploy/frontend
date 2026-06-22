import type { ProductMediaAssetItem, ProductPageModel } from './types'

export type ProductTabKey =
  | 'product-information'
  | 'integrations'
  | 'pricing'
  | 'features'
  | 'media'
  | 'experts'

export interface ProductDetailTab {
  key: ProductTabKey
  label: string
  badge?: string
}

export interface ProductMediaPreview {
  id: string
  url: string
  type: 'image' | 'video' | 'gif'
  alt: string
  assetKind: string
}

const PRODUCT_DETAIL_TABS: ProductDetailTab[] = [
  { key: 'product-information', label: 'Product Information' },
  { key: 'integrations', label: 'Integrations' },
  { key: 'pricing', label: 'Pricing' },
  { key: 'features', label: 'Features' },
  { key: 'media', label: 'Media' },
  { key: 'experts', label: 'Vetted Experts' },
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
  return [...assets]
    .sort((a, b) => a.display_order - b.display_order)
    .flatMap((asset) => {
    if (!asset.public_url) return []

    const mimeType = asset.mime_type?.toLowerCase() ?? ''
    const assetKind = asset.asset_kind.toLowerCase()
    const type = assetKind === 'video' || mimeType.startsWith('video/')
      ? 'video' as const
      : assetKind === 'gif' || mimeType === 'image/gif'
        ? 'gif' as const
        : 'image' as const

    return [{
      id: asset.media_id,
      url: asset.public_url,
      type,
      alt: asset.alt_text ?? '',
      assetKind,
    }]
  })
}

export function getProductGalleryMedia(
  assets: ProductMediaAssetItem[],
): ProductMediaPreview[] {
  return mapMediaAssetsToPreview(assets).filter((asset) => asset.assetKind !== 'logo')
}

export function getProductHeroMedia(
  assets: ProductMediaAssetItem[],
): ProductMediaPreview | null {
  const gallery = getProductGalleryMedia(assets)
  return gallery.find((asset) => asset.type === 'image') ?? gallery[0] ?? null
}
