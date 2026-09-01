import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Footer } from '@/components/site/Footer'
import { Nav } from '@/components/site/Nav'
import { serviceApisFetch } from '@/lib/service-apis/server'
import { mapProductDetailToPageModel } from '@/features/catalog/products/mappers'
import type { ProductDetail, ProductMediaAssetItem } from '@/features/catalog/products/types'
import ProductDetailV2 from './product-detail-v2'

function PageChrome({ children }: { children: React.ReactNode }) {
  return (
    <div className="pp-scope overflow-x-clip">
      <Nav />
      <main className="pp-page">{children}</main>
      <Footer />
    </div>
  )
}

function CenteredState({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="pp-container-app pp-stack pp-gap-6"
      style={{ minHeight: '55vh', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}
    >
      {children}
    </div>
  )
}

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  // Use serviceApisFetch directly to hit the backend from the server component
  const [detailRes, mediaRes] = await Promise.all([
    serviceApisFetch(`/api/v1/catalog/products/${encodeURIComponent(id)}/ui`, { next: { revalidate: 3600 } }),
    serviceApisFetch(`/api/v1/catalog/products/${encodeURIComponent(id)}/media`, { next: { revalidate: 3600 } }),
  ])

  if (detailRes.status === 404) {
    return (
      <PageChrome>
        <CenteredState>
          <p className="pp-label">Product</p>
          <h1 className="pp-display pp-d3">Product not found.</h1>
          <Link href="/products" className="pp-btn pp-btn--secondary" style={{ color: 'var(--ink)' }}>
            Back to products
          </Link>
        </CenteredState>
      </PageChrome>
    )
  }

  if (!detailRes.ok) {
    const errorJson = await detailRes.json().catch(() => ({}))
    const isCircuitOpen = errorJson?.error?.code === 'CIRCUIT_OPEN'
    return (
      <PageChrome>
        <CenteredState>
          <p className="pp-label">Something went wrong</p>
          <p className="pp-lede">
            {isCircuitOpen
              ? `Service temporarily unavailable. Retry in ${errorJson.error.retryAfter}s.`
              : 'Unable to load product. Please try again.'}
          </p>
          <div className="pp-flex pp-gap-3">
            <Link href="/products" className="pp-btn pp-btn--secondary" style={{ color: 'var(--ink)' }}>
              Back to products
            </Link>
          </div>
        </CenteredState>
      </PageChrome>
    )
  }

  const detail: ProductDetail = await detailRes.json()
  const rawMedia = mediaRes.ok ? await mediaRes.json() : []
  const media: ProductMediaAssetItem[] = Array.isArray(rawMedia) ? rawMedia : (rawMedia.data || [])

  const product = mapProductDetailToPageModel(detail, media)

  return (
    <PageChrome>
      <ProductDetailV2
        product={product}
        mediaError={!mediaRes.ok}
      />
    </PageChrome>
  )
}
