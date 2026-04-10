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

    const { data: interests, error } = await supabase
      .from('UserInterests')
      .select('*')
      .eq('userId', user.id)
      .single()

    if (error && error.code !== 'PGRST116') {
      console.error('Supabase error:', error)
      return createErrorResponse('DATABASE_ERROR', error.message, 500)
    }

    return Response.json({
      data: interests || null,
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

    const supabase = createAdminClient()

    const { data: existing } = await supabase
      .from('UserInterests')
      .select('id')
      .eq('userId', user.id)
      .single()

    if (existing) {
      const { error } = await supabase
        .from('UserInterests')
        .update({
          industries: industries || [],
          platforms: platforms || [],
          projectTypes: projectTypes || [],
          companySizes: companySizes || [],
          updatedAt: new Date().toISOString(),
        })
        .eq('userId', user.id)

      if (error) {
        console.error('Supabase error:', error)
        return createErrorResponse('DATABASE_ERROR', error.message, 500)
      }
    } else {
      const { error } = await supabase
        .from('UserInterests')
        .insert({
          userId: user.id,
          industries: industries || [],
          platforms: platforms || [],
          projectTypes: projectTypes || [],
          companySizes: companySizes || [],
        })

      if (error) {
        console.error('Supabase error:', error)
        return createErrorResponse('DATABASE_ERROR', error.message, 500)
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
