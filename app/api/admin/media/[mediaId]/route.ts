import { NextRequest } from 'next/server'
import { serviceApisFetch } from '@/lib/service-apis/client'
import { handleApiError, createErrorResponse, normalizeServiceApisError } from '@/lib/utils/errors'
import { rateLimit, getClientIP } from '@/lib/utils/ratelimit'

export const dynamic = 'force-dynamic'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ mediaId: string }> },
) {
  try {
    const ip = getClientIP(request)
    const rl = await rateLimit(ip)
    if (!rl.success) return createErrorResponse('RATE_LIMIT_EXCEEDED', 'Too many requests.', 429)
    const { mediaId } = await params
    const body = await request.json()
    const res = await serviceApisFetch(
      `/api/v1/admin/media/${encodeURIComponent(mediaId)}`,
      { method: 'PATCH', requireAuth: true, body: JSON.stringify(body) },
    )
    const data = await res.json().catch(() => null)
    if (!res.ok) return normalizeServiceApisError(res, data)
    return Response.json({ data, rateLimit: { remaining: rl.remaining, limit: rl.limit } })
  } catch (error) {
    return handleApiError(error)
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ mediaId: string }> },
) {
  try {
    const ip = getClientIP(request)
    const rl = await rateLimit(ip)
    if (!rl.success) return createErrorResponse('RATE_LIMIT_EXCEEDED', 'Too many requests.', 429)
    const { mediaId } = await params
    const res = await serviceApisFetch(
      `/api/v1/admin/media/${encodeURIComponent(mediaId)}`,
      { method: 'DELETE', requireAuth: true },
    )
    const data = await res.json().catch(() => null)
    if (!res.ok) return normalizeServiceApisError(res, data)
    return Response.json({ data: { success: true }, rateLimit: { remaining: rl.remaining, limit: rl.limit } })
  } catch (error) {
    return handleApiError(error)
  }
}
