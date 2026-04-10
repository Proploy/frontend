import { NextRequest } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
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

    const supabase = createAdminClient()

    const { data: experts, error } = await supabase
      .from('Expert')
      .select('*')
      .eq('status', 'approved')
      .is('deletedAt', null)
      .order('createdAt', { ascending: false })

    if (error) {
      console.error('Supabase error:', error)
      return createErrorResponse('DATABASE_ERROR', error.message, 500)
    }

    if (!experts || experts.length === 0) {
      return Response.json({
        data: [],
        rateLimit: {
          remaining: rateLimitResult.remaining,
          limit: rateLimitResult.limit,
        },
      })
    }

    const expertIds = experts.map(e => e.id)

    const [tagsResult, linksResult, projectsResult] = await Promise.all([
      supabase.from('ExpertTag').select('*').in('expertId', expertIds),
      supabase.from('ExpertLink').select('*').in('expertId', expertIds),
      supabase.from('ExpertProject').select('*').in('expertId', expertIds),
    ])

    const tagsMap = new Map()
    const linksMap = new Map()
    const projectsMap = new Map()

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

    const expertsWithRelations = experts.map(expert => ({
      ...expert,
      tags: tagsMap.get(expert.id) || [],
      links: linksMap.get(expert.id) || [],
      projects: projectsMap.get(expert.id) || [],
    }))

    return Response.json({
      data: expertsWithRelations,
      rateLimit: {
        remaining: rateLimitResult.remaining,
        limit: rateLimitResult.limit,
      },
    })
  } catch (error) {
    return handleApiError(error)
  }
}
