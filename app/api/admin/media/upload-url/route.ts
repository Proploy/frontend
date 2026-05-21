import { NextRequest } from 'next/server'
import { serviceApisFetch } from '@/lib/service-apis/client'
import { handleApiError, createErrorResponse, normalizeServiceApisError } from '@/lib/utils/errors'
import { rateLimit, getClientIP } from '@/lib/utils/ratelimit'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIP(request)
    const rl = await rateLimit(ip)
    if (!rl.success) return createErrorResponse('RATE_LIMIT_EXCEEDED', 'Too many requests.', 429)
    const sp = request.nextUrl.searchParams
    const filename = sp.get('filename')
    const asset_kind = sp.get('asset_kind')
    const product_id = sp.get('product_id')
    if (!filename || !asset_kind || !product_id) {
      return createErrorResponse('VALIDATION_ERROR', 'filename, asset_kind, product_id required', 400)
    }
    const qs = new URLSearchParams({ filename, asset_kind, product_id }).toString()
    const res = await serviceApisFetch(`/api/v1/admin/media/upload-url?${qs}`, {
      method: 'POST',
      requireAuth: true,
    })
    const data = await res.json().catch(() => null)
    if (!res.ok) return normalizeServiceApisError(res, data)
    return Response.json({ data, rateLimit: { remaining: rl.remaining, limit: rl.limit } })
  } catch (error) {
    return handleApiError(error)
  }
}
