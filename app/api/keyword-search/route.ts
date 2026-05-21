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
    const query: string = body.query ?? body.q ?? ''
    const limit: number = Number(body.limit) || 20
    if (!query.trim()) return createErrorResponse('VALIDATION_ERROR', 'query required', 400)
    const res = await serviceApisFetch('/catalog/keyword-search', {
      method: 'POST',
      body: JSON.stringify({ query, limit }),
    })
    const data = await res.json().catch(() => null)
    if (!res.ok) return normalizeServiceApisError(res, data)
    return Response.json({ data, rateLimit: { remaining: rl.remaining, limit: rl.limit } })
  } catch (error) {
    return handleApiError(error)
  }
}
