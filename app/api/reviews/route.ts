import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getReviewsQuerySchema } from '@/lib/validations/api'
import { handleApiError, createErrorResponse } from '@/lib/utils/errors'
import { rateLimit, getClientIP } from '@/lib/utils/ratelimit'

export const revalidate = 3600 // Revalidate every hour (ISR)

/**
 * GET /api/reviews
 * Get paginated list of reviews with optional filtering
 */
export async function GET(request: NextRequest) {
  try {
    // Rate limiting
    const ip = getClientIP(request)
    const rateLimitResult = await rateLimit(ip)
    
    if (!rateLimitResult.success) {
      return createErrorResponse(
        'RATE_LIMIT_EXCEEDED',
        'Too many requests. Please try again later.',
        429
      )
    }

    // Parse and validate query parameters
    const searchParams = request.nextUrl.searchParams
    const queryParams = Object.fromEntries(searchParams.entries())
    const validatedParams = getReviewsQuerySchema.parse(queryParams)

    const { page, limit, productId, minRating, maxRating, sortBy, sortOrder, startDate, endDate } = validatedParams

    // Create Supabase client
    const supabase = await createClient()

    // Build query
    let query = supabase
      .from('reviews')
      .select('*', { count: 'exact' })

    // Apply filters
    if (productId) {
      query = query.eq('product_id', productId)
    }

    if (minRating !== undefined) {
      query = query.gte('review_rating', minRating)
    }

    if (maxRating !== undefined) {
      query = query.lte('review_rating', maxRating)
    }

    if (startDate) {
      query = query.gte('publish_date', startDate.toISOString())
    }

    if (endDate) {
      query = query.lte('publish_date', endDate.toISOString())
    }

    // Apply sorting
    query = query.order(sortBy, { ascending: sortOrder === 'asc' })

    // Apply pagination
    const from = (page - 1) * limit
    const to = from + limit - 1
    query = query.range(from, to)

    // Execute query
    const { data, error, count } = await query

    if (error) {
      console.error('Supabase error:', error)
      return createErrorResponse('DATABASE_ERROR', error.message, 500)
    }

    // Calculate pagination metadata
    const totalPages = count ? Math.ceil(count / limit) : 0
    const hasNextPage = page < totalPages
    const hasPreviousPage = page > 1

    return Response.json({
      data: data || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages,
        hasNextPage,
        hasPreviousPage,
      },
      rateLimit: {
        remaining: rateLimitResult.remaining,
        limit: rateLimitResult.limit,
      },
    })
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      return createErrorResponse(
        'VALIDATION_ERROR',
        'Invalid query parameters',
        400,
        error
      )
    }
    return handleApiError(error)
  }
}

