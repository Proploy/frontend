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
  mimeType: string | null
}

const VIDEO_EXTENSIONS = new Set(['mp4', 'webm', 'mov', 'm4v', 'ogv', 'ogg', 'm3u8', 'gifv'])
const GIF_EXTENSIONS = new Set(['gif'])

function mediaUrlExtension(url: string): string {
  try {
    const pathname = new URL(url, 'https://media.local').pathname
    return pathname.split('.').pop()?.toLowerCase() ?? ''
  } catch {
    return url.split(/[?#]/, 1)[0].split('.').pop()?.toLowerCase() ?? ''
  }
}

export function classifyProductMediaAsset(
  asset: Pick<ProductMediaAssetItem, 'asset_kind' | 'mime_type' | 'public_url'>,
): ProductMediaPreview['type'] {
  const assetKind = asset.asset_kind.trim().toLowerCase()
  const mimeType = asset.mime_type?.split(';', 1)[0].trim().toLowerCase() ?? ''
  const extension = mediaUrlExtension(asset.public_url ?? '')

  if (
    assetKind.includes('video')
    || mimeType.startsWith('video/')
    || VIDEO_EXTENSIONS.has(extension)
    || /(?:youtube\.com|youtu\.be|vimeo\.com|loom\.com)/i.test(asset.public_url ?? '')
  ) return 'video'

  if (assetKind.includes('gif') || mimeType === 'image/gif' || GIF_EXTENSIONS.has(extension)) {
    return 'gif'
  }

  return 'image'
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

    const assetKind = asset.asset_kind.trim().toLowerCase()
    const type = classifyProductMediaAsset(asset)

    return [{
      id: asset.media_id,
      url: asset.public_url,
      type,
      alt: asset.alt_text ?? '',
      assetKind,
      mimeType: asset.mime_type,
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
