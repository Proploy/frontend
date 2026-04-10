import { NextRequest } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { verifyAdmin, getUser } from '@/lib/auth'
import { expertStatusSchema } from '@/lib/validations/expert'
import { handleApiError, createErrorResponse } from '@/lib/utils/errors'
import { rateLimit, getClientIP } from '@/lib/utils/ratelimit'

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

    const supabase = createAdminClient()

    const { data: expert, error } = await supabase
      .from('Expert')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return createErrorResponse('NOT_FOUND', 'Expert not found', 404)
      }
      console.error('Supabase error:', error)
      return createErrorResponse('DATABASE_ERROR', error.message, 500)
    }

    const [tagsResult, linksResult, projectsResult, reviewsResult] = await Promise.all([
      supabase.from('ExpertTag').select('*').eq('expertId', id),
      supabase.from('ExpertLink').select('*').eq('expertId', id),
      supabase.from('ExpertProject').select('*').eq('expertId', id),
      supabase.from('ExpertReview').select('*').eq('expertId', id),
    ])

    const expertWithRelations = {
      ...expert,
      tags: tagsResult.data || [],
      links: linksResult.data || [],
      projects: projectsResult.data || [],
      reviews: reviewsResult.data || [],
    }

    return Response.json({
      data: expertWithRelations,
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

export async function PATCH(
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
    const user = await getUser()
    const { id } = await params

    const json = await request.json()
    const { status, notes, tags } = json

    const validatedStatus = expertStatusSchema.parse(status)

    const supabase = createAdminClient()

    const { data: expert, error } = await supabase
      .from('Expert')
      .update({
        status: validatedStatus,
        updatedAt: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Supabase update error:', error)
      return createErrorResponse('DATABASE_ERROR', error.message, 500)
    }

    if (user) {
      await supabase.from('ExpertReview').insert({
        expertId: id,
        reviewerUserId: user.id,
        status: validatedStatus,
        notes: notes || null,
      })
    }

    // Replace ExpertTag rows when approving and tags are provided
    if (validatedStatus === 'approved' && tags && Array.isArray(tags) && tags.length > 0) {
      await supabase.from('ExpertTag').delete().eq('expertId', id)
      await supabase.from('ExpertTag').insert(
        tags.map((tag: { tagType: string; tagValue: string }) => ({
          expertId: id,
          tagType: tag.tagType,
          tagValue: tag.tagValue,
        }))
      )
    }

    const [tagsResult, linksResult, projectsResult, reviewsResult] = await Promise.all([
      supabase.from('ExpertTag').select('*').eq('expertId', id),
      supabase.from('ExpertLink').select('*').eq('expertId', id),
      supabase.from('ExpertProject').select('*').eq('expertId', id),
      supabase.from('ExpertReview').select('*').eq('expertId', id),
    ])

    const expertWithRelations = {
      ...expert,
      tags: tagsResult.data || [],
      links: linksResult.data || [],
      projects: projectsResult.data || [],
      reviews: reviewsResult.data || [],
    }

    return Response.json({
      data: expertWithRelations,
      rateLimit: {
        remaining: rateLimitResult.remaining,
        limit: rateLimitResult.limit,
      },
    })
  } catch (error) {
    if (error instanceof Error && error.message.includes('UNAUTHORIZED')) {
      return createErrorResponse('UNAUTHORIZED', 'Admin access required', 401)
    }
    if (error instanceof Error && error.name === 'ZodError') {
      return createErrorResponse('VALIDATION_ERROR', 'Invalid status', 400)
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

    const supabase = createAdminClient()

    const { error } = await supabase
      .from('Expert')
      .update({
        deletedAt: new Date().toISOString(),
      })
      .eq('id', id)

    if (error) {
      console.error('Supabase delete error:', error)
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
    if (error instanceof Error && error.message.includes('UNAUTHORIZED')) {
      return createErrorResponse('UNAUTHORIZED', 'Admin access required', 401)
    }
    return handleApiError(error)
  }
}
