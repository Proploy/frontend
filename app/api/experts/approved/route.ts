import { NextRequest } from 'next/server'
import { createErrorResponse, normalizeServiceApisError } from '@/lib/utils/errors'
import { rateLimit, getClientIP } from '@/lib/utils/ratelimit'
import { serviceApisFetch } from '@/lib/service-apis/client'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const ip = getClientIP(request)
    const rateLimitResult = await rateLimit(ip)

    if (!rateLimitResult.success) {
      return createErrorResponse(
        'RATE_LIMIT_EXCEEDED',
        'Too many requests. Please try again later.',
        429
      )
    }

    const response = await serviceApisFetch('/api/v1/experts', {
      requireAuth: false,
    })

    const data = await response.json().catch(() => null)

    if (!response.ok) {
      return normalizeServiceApisError(response, data)
    }

    const list = Array.isArray(data)
      ? data
      : Array.isArray(data?.experts)
      ? data.experts
      : Array.isArray(data?.data)
      ? data.data
      : Array.isArray(data?.items)
      ? data.items
      : []

    return Response.json({
      data: list,
      rateLimit: {
        remaining: rateLimitResult.remaining,
        limit: rateLimitResult.limit,
      },
    })
  } catch (error) {
    console.error('Error in experts/approved:', error)
    return createErrorResponse('INTERNAL_ERROR', 'Failed to fetch experts', 500)
  }
}
