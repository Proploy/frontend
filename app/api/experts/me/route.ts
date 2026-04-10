import { NextRequest } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { getUser, createOrGetUser } from '@/lib/auth'
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

    await createOrGetUser(user)

    const supabase = createAdminClient()

    const { data: expert, error } = await supabase
      .from('Expert')
      .select('*')
      .eq('supabaseUserId', user.id)
      .maybeSingle()

    if (error) {
      console.error('Supabase error:', error)
      return createErrorResponse('DATABASE_ERROR', error.message, 500)
    }

    if (!expert) {
      return Response.json({
        data: null,
        rateLimit: {
          remaining: rateLimitResult.remaining,
          limit: rateLimitResult.limit,
        },
      })
    }

    const [tagsResult, linksResult, projectsResult] = await Promise.all([
      supabase.from('ExpertTag').select('*').eq('expertId', expert.id),
      supabase.from('ExpertLink').select('*').eq('expertId', expert.id),
      supabase.from('ExpertProject').select('*').eq('expertId', expert.id),
    ])

    const expertWithRelations = {
      ...expert,
      tags: tagsResult.data || [],
      links: linksResult.data || [],
      projects: projectsResult.data || [],
    }

    return Response.json({
      data: expertWithRelations,
      rateLimit: {
        remaining: rateLimitResult.remaining,
        limit: rateLimitResult.limit,
      },
    })
  } catch (error) {
    return handleApiError(error)
  }
}
