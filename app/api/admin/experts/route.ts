import { NextRequest } from 'next/server'
import { verifyAdmin } from '@/lib/auth'
import { handleApiError, createErrorResponse } from '@/lib/utils/errors'
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

    await verifyAdmin()

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const status = searchParams.get('status')

    const query = new URLSearchParams({ page: String(page), limit: String(limit) })
    if (status && status !== 'all') {
      query.set('status', status)
    }

    const res = await serviceApisFetch(`/api/v1/admin/experts?${query.toString()}`, { requireAuth: true })

    if (!res.ok) {
      return createErrorResponse('SERVICE_APIS_ERROR', `Failed to fetch experts: ${res.status}`, res.status)
    }

    const data = await res.json()

    return Response.json({
      data: data.data,
      pagination: {
        page: data.page,
        limit: data.limit,
        total: data.total,
        totalPages: Math.ceil(data.total / limit),
        hasNextPage: data.page * data.limit < data.total,
        hasPreviousPage: data.page > 1,
      },
      rateLimit: {
        remaining: rateLimitResult.remaining,
        limit: rateLimitResult.limit,
      },
    })
  } catch (error) {
    if (error instanceof Error && error.message.includes('UNAUTHORIZED')) {
      return createErrorResponse('UNAUTHORIZED', 'Admin access required', 401)
    }
    return handleApiError(error)
  }
}
