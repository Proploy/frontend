/**
 * @deprecated
 *
 * The underlying endpoint (`/api/v1/users/me/interests`) is exposed by the
 * deployed service-apis and the proxy currently works correctly. It is
 * marked deprecated only because the proxy is unnecessary — the page that
 * uses interests should call the service-apis endpoint directly via
 * `ServiceApisBrowserClient` (mirroring the pattern in
 * `features/catalog/shared/client-api.ts` and `features/experts/*`).
 *
 * Per project policy, the only Supabase use allowed is the auth session.
 * service-apis is the source of truth for interests data.
 *
 * Replacement: a hook under `features/users/` that calls
 * `GET/PATCH /api/v1/users/me/interests` directly. Functionality is
 * preserved until the migration lands.
 */
import { NextRequest } from 'next/server'
import { getUser } from '@/lib/auth'
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

    const user = await getUser()
    if (!user) {
      return createErrorResponse('UNAUTHORIZED', 'Not authenticated', 401)
    }

    const res = await serviceApisFetch('/api/v1/users/me/interests', { requireAuth: true })
    if (!res.ok) {
      return createErrorResponse('SERVICE_APIS_ERROR', `Failed to fetch interests: ${res.status}`, res.status)
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

    const { industries, platforms, projectTypes, companySizes } = await request.json()

    const res = await serviceApisFetch('/api/v1/users/me/interests', {
      requireAuth: true,
      method: 'PATCH',
      body: JSON.stringify({ industries, platforms, projectTypes, companySizes }),
    })

    if (!res.ok) {
      return createErrorResponse('SERVICE_APIS_ERROR', `Failed to update interests: ${res.status}`, res.status)
    }

    return Response.json({
      data: { success: true },
      rateLimit: {
        remaining: rateLimitResult.remaining,
        limit: rateLimitResult.limit,
      },
    })
  } catch (error) {
    return handleApiError(error)
  }
}
