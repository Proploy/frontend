'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import ProductDetailExperience from '@/components/product/ProductDetailExperience'
import { useProductDetail } from '@/features/catalog'

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
      <div className="min-h-screen pt-32 flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full size-12 border-b-2 border-[#0466e7]" />
      </div>
    )
  }

  if (notFound) {
    return (
      <div className="min-h-screen pt-32 flex flex-col items-center justify-center bg-white gap-8">
        <h1 className="font-semibold text-[36px] text-[#181d27]">Product not found</h1>
        <Link href="/products" className="text-[#004eeb] font-semibold hover:underline">Back to products</Link>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen pt-32 flex flex-col items-center justify-center bg-white gap-8">
        <p className="text-red-500 font-medium">
          {error.error.code === 'CIRCUIT_OPEN'
            ? `Service temporarily unavailable. Retry in ${error.error.retryAfter}s.`
            : 'Unable to load product. Please try again.'}
        </p>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={refetch}
            className="px-[16px] py-[8px] bg-[#155eef] text-white rounded-[8px] font-semibold text-[14px]"
          >
            Retry
          </button>
          <Link href="/products" className="px-[16px] py-[8px] border border-[#d5d7da] rounded-[8px] font-semibold text-[14px] text-[#414651]">
            Back to products
          </Link>
        </div>
      </div>
    )
  }

  if (!product) {
    return null
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <ProductDetailExperience
        product={product}
        mediaError={Boolean(mediaError)}
        onRetryMedia={refetch}
      />
    </div>
  )
}
