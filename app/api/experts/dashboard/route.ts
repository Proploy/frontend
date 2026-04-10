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

    // Fetch expert record with relations
    const { data: expert, error: expertError } = await supabase
      .from('Expert')
      .select('*')
      .eq('supabaseUserId', user.id)
      .eq('status', 'approved')
      .maybeSingle()

    if (expertError) {
      console.error('Supabase expert error:', expertError)
      return createErrorResponse('DATABASE_ERROR', expertError.message, 500)
    }

    if (!expert) {
      return createErrorResponse('NOT_FOUND', 'No approved expert profile found', 404)
    }

    const [tagsResult, linksResult, projectsResult, interestsResult, recentlyViewedResult] = await Promise.all([
      supabase.from('ExpertTag').select('*').eq('expertId', expert.id),
      supabase.from('ExpertLink').select('*').eq('expertId', expert.id),
      supabase.from('ExpertProject').select('*').eq('expertId', expert.id),
      supabase.from('UserInterest').select('*').eq('userId', user.id).order('createdAt', { ascending: false }).limit(20),
      supabase.from('RecentlyViewed').select('*').eq('userId', user.id).order('viewedAt', { ascending: false }).limit(20),
    ])

    return Response.json({
      data: {
        expert: {
          ...expert,
          tags: tagsResult.data || [],
          links: linksResult.data || [],
          projects: projectsResult.data || [],
        },
        interests: interestsResult.data || [],
        recentlyViewed: recentlyViewedResult.data || [],
      },
      rateLimit: {
        remaining: rateLimitResult.remaining,
        limit: rateLimitResult.limit,
      },
    })
  } catch (error) {
    return handleApiError(error)
  }
}
