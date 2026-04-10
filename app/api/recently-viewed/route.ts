import { NextRequest } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { getUser } from '@/lib/auth'
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

    const user = await getUser()
    if (!user) {
      return createErrorResponse('UNAUTHORIZED', 'Not authenticated', 401)
    }

    const supabase = createAdminClient()

    const { data: recentlyViewed, error } = await supabase
      .from('RecentlyViewed')
      .select('*, products(product_id, product_name, product_logo, rating, reviews)')
      .eq('userId', user.id)
      .order('viewedAt', { ascending: false })
      .limit(20)

    if (error) {
      console.error('Supabase error:', error)
      return createErrorResponse('DATABASE_ERROR', error.message, 500)
    }

    return Response.json({
      data: recentlyViewed || [],
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

    const { productId } = await request.json()

    if (!productId) {
      return createErrorResponse('VALIDATION_ERROR', 'productId is required', 400)
    }

    const supabase = createAdminClient()

    const { data: existing } = await supabase
      .from('RecentlyViewed')
      .select('id')
      .eq('userId', user.id)
      .eq('productId', productId)
      .single()

    if (existing) {
      const { error: updateError } = await supabase
        .from('RecentlyViewed')
        .update({ viewedAt: new Date().toISOString() })
        .eq('id', existing.id)

      if (updateError) {
        console.error('Supabase error:', updateError)
        return createErrorResponse('DATABASE_ERROR', updateError.message, 500)
      }
    } else {
      const { error: insertError } = await supabase
        .from('RecentlyViewed')
        .insert({
          userId: user.id,
          productId,
        })

      if (insertError) {
        console.error('Supabase error:', insertError)
        return createErrorResponse('DATABASE_ERROR', insertError.message, 500)
      }

      const { data: oldRecords } = await supabase
        .from('RecentlyViewed')
        .select('id')
        .eq('userId', user.id)
        .order('viewedAt', { ascending: false })

      if (oldRecords && oldRecords.length > 20) {
        const idsToDelete = oldRecords.slice(20).map(r => r.id)
        await supabase
          .from('RecentlyViewed')
          .delete()
          .in('id', idsToDelete)
      }
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
