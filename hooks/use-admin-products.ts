// use-admin-products.ts
// Admin product+media management hooks via Next proxies under /api/admin/*.

import { useCallback, useEffect, useState } from 'react'

export interface ProductMedia {
  media_id: string
  product_id: string
  url: string
  asset_kind?: string
  review_status?: 'pending' | 'approved' | 'rejected'
  display_order?: number
  [k: string]: unknown
}

async function call<T>(path: string, init?: RequestInit): Promise<T | null> {
  const res = await fetch(path, { credentials: 'include', ...init })
  if (!res.ok) return null
  const json = await res.json().catch(() => null)
  return (json?.data ?? json) as T
}

export function useAdminProductMedia(productId: string | null | undefined) {
  const [media, setMedia] = useState<ProductMedia[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refetch = useCallback(async () => {
    if (!productId) {
      setMedia([])
      setLoading(false)
      return
    }
    setLoading(true)
    setError(null)
    const data = await call<{ items?: ProductMedia[] } | ProductMedia[]>(
      `/api/admin/products/${encodeURIComponent(productId)}/media`,
    )
    const list = Array.isArray(data) ? data : data?.items ?? []
    setMedia(list)
    if (!list && data === null) setError('Failed to load media')
    setLoading(false)
  }, [productId])

  useEffect(() => {
    refetch()
  }, [refetch])

  return { media, loading, error, refetch }
}

export function useAdminProductActions() {
  const updateMedia = useCallback(
    (mediaId: string, body: { review_status?: string; display_order?: number }) =>
      call(`/api/admin/media/${encodeURIComponent(mediaId)}`, {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(body),
      }),
    [],
  )

  const deleteMedia = useCallback(
    (mediaId: string) =>
      call(`/api/admin/media/${encodeURIComponent(mediaId)}`, { method: 'DELETE' }),
    [],
  )

  const bulkAction = useCallback(
    (productId: string, mediaIds: string[], reviewStatus: 'pending' | 'approved' | 'rejected') =>
      call(`/api/admin/products/${encodeURIComponent(productId)}/media/bulk-action`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ media_ids: mediaIds, review_status: reviewStatus }),
      }),
    [],
  )

  const publishCheck = useCallback(
    (productId: string) =>
      call(`/api/admin/products/${encodeURIComponent(productId)}/publish-check`),
    [],
  )

  const approve = useCallback(
    (productId: string) =>
      call(`/api/admin/products/${encodeURIComponent(productId)}/approve`, { method: 'POST' }),
    [],
  )

  const publish = useCallback(
    (productId: string) =>
      call(`/api/admin/products/${encodeURIComponent(productId)}/publish`, { method: 'POST' }),
    [],
  )

  const unpublish = useCallback(
    (productId: string) =>
      call(`/api/admin/products/${encodeURIComponent(productId)}/unpublish`, { method: 'POST' }),
    [],
  )

  const getMediaUploadUrl = useCallback(
    (productId: string, filename: string, assetKind: string) => {
      const qs = new URLSearchParams({ filename, asset_kind: assetKind, product_id: productId })
      return call<{ url: string; key: string }>(`/api/admin/media/upload-url?${qs}`, {
        method: 'POST',
      })
    },
    [],
  )

  return {
    updateMedia,
    deleteMedia,
    bulkAction,
    publishCheck,
    approve,
    publish,
    unpublish,
    getMediaUploadUrl,
  }
}
