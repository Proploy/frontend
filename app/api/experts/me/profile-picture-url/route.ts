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
    const body = await request.json()
    if (!body.filename) return createErrorResponse('VALIDATION_ERROR', 'filename required', 400)
    const res = await serviceApisFetch('/api/v1/experts/me/profile-picture-url', {
      method: 'POST',
      requireAuth: true,
      body: JSON.stringify({
        filename: body.filename,
        content_type: body.content_type ?? 'image/jpeg',
      }),
    })
    const data = await res.json().catch(() => null)
    if (!res.ok) return normalizeServiceApisError(res, data)
    return Response.json({ data, rateLimit: { remaining: rl.remaining, limit: rl.limit } })
  } catch (error) {
    return handleApiError(error)
  }
}
