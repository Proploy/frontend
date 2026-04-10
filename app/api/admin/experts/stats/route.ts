import { NextRequest } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { verifyAdmin } from '@/lib/auth'
import { handleApiError, createErrorResponse } from '@/lib/utils/errors'
import { rateLimit, getClientIP } from '@/lib/utils/ratelimit'

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

    const supabase = createAdminClient()

    const { count: totalCount } = await supabase
      .from('Expert')
      .select('*', { count: 'exact', head: true })
      .is('deletedAt', null)

    const { count: submittedCount } = await supabase
      .from('Expert')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'submitted')
      .is('deletedAt', null)

    const { count: approvedCount } = await supabase
      .from('Expert')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'approved')
      .is('deletedAt', null)

    const { count: rejectedCount } = await supabase
      .from('Expert')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'rejected')
      .is('deletedAt', null)

    const { count: draftCount } = await supabase
      .from('Expert')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'draft')
      .is('deletedAt', null)

    return Response.json({
      data: {
        total: totalCount || 0,
        submitted: submittedCount || 0,
        approved: approvedCount || 0,
        rejected: rejectedCount || 0,
        draft: draftCount || 0,
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
