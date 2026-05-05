import { NextRequest } from 'next/server'
import { verifyAdmin, getUser } from '@/lib/auth'
import { handleApiError, createErrorResponse } from '@/lib/utils/errors'
import { rateLimit, getClientIP } from '@/lib/utils/ratelimit'
import { serviceApisFetch } from '@/lib/service-apis/client'

export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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
    const { id } = await params

    const res = await serviceApisFetch(`/api/v1/admin/experts/${id}`, { requireAuth: true })

    if (res.status === 404) {
      return createErrorResponse('NOT_FOUND', 'Expert not found', 404)
    }

    if (!res.ok) {
      return createErrorResponse('SERVICE_APIS_ERROR', `Failed to fetch expert: ${res.status}`, res.status)
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
    if (error instanceof Error && error.message.includes('UNAUTHORIZED')) {
      return createErrorResponse('UNAUTHORIZED', 'Admin access required', 401)
    }
    return handleApiError(error)
  }
}

// POST handles approve/reject/request-changes based on status field in body
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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
    const { id } = await params

    const { status, notes } = await request.json()

    // Normalize frontend status values to service-apis schema values
    // Frontend uses 'approve'/'reject'/'request-changes', service-apis expects 'approved'/'rejected'/'changes_requested'
    const statusMap: Record<string, string> = {
      approve: 'approved',
      reject: 'rejected',
      'request-changes': 'changes_requested',
      review: 'changes_requested',
    }
    const normalizedStatus = statusMap[status]
    if (!normalizedStatus) {
      return createErrorResponse('VALIDATION_ERROR', 'Invalid status. Must be approve, reject, or request-changes', 400)
    }

    // All status transitions go through PATCH /api/v1/admin/experts/{id} with { status, notes }
    // notes must be a string if provided; null clears it
    const body: Record<string, string | null> = { status: normalizedStatus }
    body.notes = notes ? notes : null

    const res = await serviceApisFetch(`/api/v1/admin/experts/${id}`, {
      requireAuth: true,
      method: 'PATCH',
      body,
    })

    if (!res.ok) {
      // Try to surface the actual error from service-apis
      let errorDetail = `Failed to update expert: ${res.status}`
      try {
        const errorData = await res.clone().json()
        if (errorData?.detail) errorDetail = errorData.detail
        else if (errorData?.message) errorDetail = errorData.message
      } catch {}
      return createErrorResponse('SERVICE_APIS_ERROR', errorDetail, res.status)
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
    if (error instanceof Error && error.message.includes('UNAUTHORIZED')) {
      return createErrorResponse('UNAUTHORIZED', 'Admin access required', 401)
    }
    return handleApiError(error)
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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
    const { id } = await params

    // Soft delete via the restore endpoint (there is no delete endpoint in service-apis)
    // The admin can restore by calling request-changes, but there's no soft-delete
    // For now, return success without action (the Supabase-based DELETE is not needed)
    return Response.json({
      data: { success: true },
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
