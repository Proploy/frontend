import { NextRequest } from 'next/server'
import { getUser } from '@/lib/auth'
import { handleApiError, createErrorResponse } from '@/lib/utils/errors'
import { rateLimit, getClientIP } from '@/lib/utils/ratelimit'
import { serviceApisFetch } from '@/lib/service-apis/client'
import { expertDraftSchema } from '@/lib/validations/expert'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
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

    const user = await getUser()
    if (!user) {
      return createErrorResponse('UNAUTHORIZED', 'Not authenticated', 401)
    }

    const body = await request.json()

    const parsed = expertDraftSchema.safeParse(body)
    if (!parsed.success) {
      const fieldErrors = parsed.error.errors.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      }))
      return Response.json(
        {
          error: 'VALIDATION_ERROR',
          message: 'Validation failed',
          errors: fieldErrors,
        },
        { status: 400 }
      )
    }

    const res = await serviceApisFetch('/api/v1/experts/me/application', {
      requireAuth: true,
      method: 'PATCH',
      body: JSON.stringify(parsed.data),
    })

    if (res.status === 409) {
      return createErrorResponse(
        'CONFLICT',
        'Cannot update application in its current status',
        409
      )
    }

    if (!res.ok) {
      return createErrorResponse('SERVICE_APIS_ERROR', `Failed to save draft: ${res.status}`, res.status)
    }

    const data = await res.json()

    return Response.json({
      data,
      rateLimit: {
        remaining: rateLimitResult.remaining,
        limit: rateLimitResult.limit,
      },
    })
  } catch (error) {
    return handleApiError(error)
  }
}
