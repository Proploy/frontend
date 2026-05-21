import { NextRequest } from 'next/server'
import { serviceApisFetch } from '@/lib/service-apis/client'
import { handleApiError, createErrorResponse, normalizeServiceApisError } from '@/lib/utils/errors'
import { rateLimit, getClientIP } from '@/lib/utils/ratelimit'

export const dynamic = 'force-dynamic'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const ip = getClientIP(request)
    const rl = await rateLimit(ip)
    if (!rl.success) return createErrorResponse('RATE_LIMIT_EXCEEDED', 'Too many requests.', 429)
    const { id } = await params
    const body = await request.json()
    if (!Array.isArray(body.media_ids) || !body.review_status) {
      return createErrorResponse('VALIDATION_ERROR', 'media_ids[] and review_status required', 400)
    }
    const res = await serviceApisFetch(
      `/api/v1/admin/products/${encodeURIComponent(id)}/media/bulk-action`,
      { method: 'POST', requireAuth: true, body: JSON.stringify(body) },
    )
    const data = await res.json().catch(() => null)
    if (!res.ok) return normalizeServiceApisError(res, data)
    return Response.json({ data, rateLimit: { remaining: rl.remaining, limit: rl.limit } })
  } catch (error) {
    return handleApiError(error)
  }
}
