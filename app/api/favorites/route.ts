import { NextRequest } from 'next/server'
import { serviceApisFetch } from '@/lib/service-apis/client'
import { handleApiError, createErrorResponse, normalizeServiceApisError } from '@/lib/utils/errors'
import { rateLimit, getClientIP } from '@/lib/utils/ratelimit'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const ip = getClientIP(request)
    const rateLimitResult = await rateLimit(ip)
    if (!rateLimitResult.success) {
      return createErrorResponse('RATE_LIMIT_EXCEEDED', 'Too many requests.', 429)
    }

    const targetType = request.nextUrl.searchParams.get('targetType')
    const qs = targetType ? `?targetType=${encodeURIComponent(targetType)}` : ''
    const res = await serviceApisFetch(`/api/v1/favorites${qs}`, { requireAuth: true })
    const data = await res.json().catch(() => null)
    if (!res.ok) return normalizeServiceApisError(res, data)

    return Response.json({
      data,
      rateLimit: { remaining: rateLimitResult.remaining, limit: rateLimitResult.limit },
    })
  } catch (error) {
    return handleApiError(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIP(request)
    const rateLimitResult = await rateLimit(ip)
    if (!rateLimitResult.success) {
      return createErrorResponse('RATE_LIMIT_EXCEEDED', 'Too many requests.', 429)
    }

    const body = await request.json()
    const targetId = body.targetId ?? body.productId
    const targetType = body.targetType ?? 'product'
    if (!targetId) {
      return createErrorResponse('VALIDATION_ERROR', 'targetId (or productId) is required', 400)
    }

    const res = await serviceApisFetch('/api/v1/favorites', {
      method: 'POST',
      requireAuth: true,
      body: JSON.stringify({ targetType, targetId }),
    })
    const data = await res.json().catch(() => null)
    if (!res.ok) return normalizeServiceApisError(res, data)

    return Response.json({
      data,
      rateLimit: { remaining: rateLimitResult.remaining, limit: rateLimitResult.limit },
    })
  } catch (error) {
    return handleApiError(error)
  }
}
