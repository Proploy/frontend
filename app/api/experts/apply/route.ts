import { NextRequest } from 'next/server'
import { requireUser } from '@/lib/auth'
import { handleApiError, createErrorResponse, normalizeServiceApisError } from '@/lib/utils/errors'
import { rateLimit, getClientIP } from '@/lib/utils/ratelimit'
import { serviceApisFetch } from '@/lib/service-apis/client'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIP(request)
    const rateLimitResult = await rateLimit(ip)
    if (!rateLimitResult.success) {
      return createErrorResponse('RATE_LIMIT_EXCEEDED', 'Too many requests.', 429)
    }
    await requireUser()
    const body = await request.json().catch(() => ({}))
    const res = await serviceApisFetch('/api/v1/experts/apply', {
      method: 'POST',
      body: JSON.stringify(body),
      requireAuth: true,
    })
    const data = await res.json().catch(() => null)
    if (!res.ok) return normalizeServiceApisError(res, data)
    return Response.json({ data: data?.data ?? data, rateLimit: { remaining: rateLimitResult.remaining, limit: rateLimitResult.limit } }, { status: 201 })
  } catch (error) {
    if (error instanceof Error && error.message.includes('UNAUTHORIZED')) {
      return createErrorResponse('UNAUTHORIZED', 'Sign-in required', 401)
    }
    return handleApiError(error)
  }
}
