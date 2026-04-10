import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getReviewsByProductParamsSchema, paginationSchema } from '@/lib/validations/api'
import { handleApiError, createErrorResponse } from '@/lib/utils/errors'
import { rateLimit, getClientIP } from '@/lib/utils/ratelimit'

export const revalidate = 3600 // Revalidate every hour (ISR)

/**
 * GET /api/reviews/product/[productId]
 * Get reviews by product ID with optional filtering and pagination
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
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

    // Validate params
    const { productId } = await params
    const validatedParams = getReviewsByProductParamsSchema.parse({ productId })

    // Parse and validate query parameters
    const searchParams = request.nextUrl.searchParams
    const queryParams = Object.fromEntries(searchParams.entries())
    const paginationParams = paginationSchema.parse(queryParams)

    const { page, limit } = paginationParams
    const minRating = queryParams.minRating ? parseFloat(queryParams.minRating) : undefined
    const maxRating = queryParams.maxRating ? parseFloat(queryParams.maxRating) : undefined
    const sortBy = (queryParams.sortBy as 'rating' | 'publish_date' | 'created_at') || 'publish_date'
    const sortOrder = (queryParams.sortOrder as 'asc' | 'desc') || 'desc'

    // Create Supabase client
    const supabase = await createClient()

    // Build query
    let query = supabase
      .from('reviews')
      .select('*', { count: 'exact' })
      .eq('product_id', validatedParams.productId)

    // Apply rating filters
    if (minRating !== undefined) {
      query = query.gte('review_rating', minRating)
    }

    if (maxRating !== undefined) {
      query = query.lte('review_rating', maxRating)
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
        'Invalid parameters',
        400,
        error
      )
    }
    return handleApiError(error)
  }
}

