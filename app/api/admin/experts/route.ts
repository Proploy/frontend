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

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const status = searchParams.get('status')
    const from = (page - 1) * limit
    const to = from + limit - 1

    const supabase = createAdminClient()

    let query = supabase
      .from('Expert')
      .select('*', { count: 'exact' })
      .is('deletedAt', null)
      .order('updatedAt', { ascending: false })
      .range(from, to)

    if (status && status !== 'all') {
      query = query.eq('status', status)
    } else {
      query = query.in('status', ['submitted', 'approved', 'rejected', 'changes_requested', 'draft'])
    }

    const { data: experts, error, count } = await query

    if (error) {
      console.error('Supabase error:', error)
      return createErrorResponse('DATABASE_ERROR', error.message, 500)
    }

    if (!experts || experts.length === 0) {
      return Response.json({
        data: [],
        pagination: {
          page,
          limit,
          total: 0,
          totalPages: 0,
          hasNextPage: false,
          hasPreviousPage: false,
        },
        rateLimit: {
          remaining: rateLimitResult.remaining,
          limit: rateLimitResult.limit,
        },
      })
    }

    const expertIds = experts.map(e => e.id)

    const [tagsResult, linksResult, projectsResult, reviewsResult] = await Promise.all([
      supabase.from('ExpertTag').select('*').in('expertId', expertIds),
      supabase.from('ExpertLink').select('*').in('expertId', expertIds),
      supabase.from('ExpertProject').select('*').in('expertId', expertIds),
      supabase.from('ExpertReview').select('*').in('expertId', expertIds),
    ])

    const tagsMap = new Map()
    const linksMap = new Map()
    const projectsMap = new Map()
    const reviewsMap = new Map()

    ;(tagsResult.data || []).forEach(tag => {
      if (!tagsMap.has(tag.expertId)) tagsMap.set(tag.expertId, [])
      tagsMap.get(tag.expertId).push(tag)
    })
    ;(linksResult.data || []).forEach(link => {
      if (!linksMap.has(link.expertId)) linksMap.set(link.expertId, [])
      linksMap.get(link.expertId).push(link)
    })
    ;(projectsResult.data || []).forEach(project => {
      if (!projectsMap.has(project.expertId)) projectsMap.set(project.expertId, [])
      projectsMap.get(project.expertId).push(project)
    })
    ;(reviewsResult.data || []).forEach(review => {
      if (!reviewsMap.has(review.expertId)) reviewsMap.set(review.expertId, [])
      reviewsMap.get(review.expertId).push(review)
    })

    const expertsWithRelations = experts.map(expert => ({
      ...expert,
      tags: tagsMap.get(expert.id) || [],
      links: linksMap.get(expert.id) || [],
      projects: projectsMap.get(expert.id) || [],
      reviews: reviewsMap.get(expert.id) || [],
    }))

    const totalPages = count ? Math.ceil(count / limit) : 0

    return Response.json({
      data: expertsWithRelations,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
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
