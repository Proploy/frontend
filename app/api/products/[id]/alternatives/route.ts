import { NextRequest } from 'next/server'
import { handleApiError, createErrorResponse, normalizeServiceApisError } from '@/lib/utils/errors'
import { rateLimit, getClientIP } from '@/lib/utils/ratelimit'
import { serviceApisFetch } from '@/lib/service-apis/client'

export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const ip = getClientIP(request)
    const rateLimitResult = await rateLimit(ip)
    if (!rateLimitResult.success) {
      return createErrorResponse('RATE_LIMIT_EXCEEDED', 'Too many requests.', 429)
    }
    const { id } = await params
    const res = await serviceApisFetch(`/catalog/products/${encodeURIComponent(id)}/alternatives`)
    const data = await res.json().catch(() => null)
    if (res.status === 404) return createErrorResponse('NOT_FOUND', 'Product not found', 404)
    if (!res.ok) return normalizeServiceApisError(res, data)
    return Response.json({ data: data?.data ?? data, rateLimit: { remaining: rateLimitResult.remaining, limit: rateLimitResult.limit } })
  } catch (error) {
    return handleApiError(error)
  }
}
