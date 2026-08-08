'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Footer } from '@/components/site/Footer'
import { Nav } from '@/components/site/Nav'
import { useProductDetail } from '@/features/catalog/products/hooks'
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

export default function ProductDetailPage() {
  const params = useParams()
  const id = params.id as string

  const {
    product,
    loading,
    error,
    mediaError,
    notFound,
    refetch,
  } = useProductDetail({ productId: id })

  if (loading) {
    return (
      <div className="pp-scope overflow-x-clip">
        <Nav />
        <main
          className="pp-page"
          style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <div
            className="animate-spin rounded-full size-12 border-b-2"
            style={{ borderBottomColor: 'var(--cobalt)' }}
            aria-label="Loading product"
          />
        </main>
      </div>
    )
  }

  if (notFound) {
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

  if (error) {
    return (
      <PageChrome>
        <CenteredState>
          <p className="pp-label">Something went wrong</p>
          <p className="pp-lede">
            {error.error.code === 'CIRCUIT_OPEN'
              ? `Service temporarily unavailable. Retry in ${error.error.retryAfter}s.`
              : 'Unable to load product. Please try again.'}
          </p>
          <div className="pp-flex pp-gap-3">
            <button type="button" onClick={refetch} className="pp-btn pp-btn--cobalt">
              Retry
            </button>
            <Link href="/products" className="pp-btn pp-btn--secondary" style={{ color: 'var(--ink)' }}>
              Back to products
            </Link>
          </div>
        </CenteredState>
      </PageChrome>
    )
  }

  if (!product) {
    return null
  }

  return (
    <PageChrome>
      <ProductDetailV2
        product={product}
        mediaError={Boolean(mediaError)}
        onRetryMedia={refetch}
      />
    </PageChrome>
  )
}
