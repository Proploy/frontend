import { NextRequest } from 'next/server'
import { serviceApisFetch } from '@/lib/service-apis/client'
import { handleApiError, createErrorResponse, normalizeServiceApisError } from '@/lib/utils/errors'
import { rateLimit, getClientIP } from '@/lib/utils/ratelimit'

export const dynamic = 'force-dynamic'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ linkId: string }> },
) {
  try {
    const ip = getClientIP(request)
    const rl = await rateLimit(ip)
    if (!rl.success) return createErrorResponse('RATE_LIMIT_EXCEEDED', 'Too many requests.', 429)
    const { linkId } = await params
    const res = await serviceApisFetch(
      `/api/v1/experts/me/links/${encodeURIComponent(linkId)}`,
      { method: 'DELETE', requireAuth: true },
    )
    const data = await res.json().catch(() => null)
    if (!res.ok) return normalizeServiceApisError(res, data)
    return Response.json({ data: { success: true }, rateLimit: { remaining: rl.remaining, limit: rl.limit } })
  } catch (error) {
    return handleApiError(error)
  }
}
