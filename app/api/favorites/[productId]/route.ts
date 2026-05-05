import { NextRequest } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { getUser } from '@/lib/auth'
import { handleApiError, createErrorResponse } from '@/lib/utils/errors'
import { rateLimit, getClientIP } from '@/lib/utils/ratelimit'

export const dynamic = 'force-dynamic'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
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

    const user = await getUser()
    if (!user) {
      return createErrorResponse('UNAUTHORIZED', 'Not authenticated', 401)
    }

    const { productId } = await params

    const supabase = createAdminClient()

    const { error } = await supabase
      .from('favorite')
      .delete()
      .eq('userId', user.id)
      .eq('productId', productId)

    if (error) {
      console.error('Supabase error:', error)
      return createErrorResponse('DATABASE_ERROR', error.message, 500)
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