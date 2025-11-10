import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getCompaniesQuerySchema } from '@/lib/validations/api'
import { handleApiError, createErrorResponse } from '@/lib/utils/errors'
import { rateLimit, getClientIP } from '@/lib/utils/ratelimit'

export const revalidate = 3600 // Revalidate every hour (ISR)

/**
 * GET /api/companies
 * Get paginated list of companies with optional filtering and search
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
    const validatedParams = getCompaniesQuerySchema.parse(queryParams)

    const { page, limit, search, sortBy, sortOrder } = validatedParams

    // Create Supabase client
    const supabase = await createClient()

    // Build query
    let query = supabase
      .from('companies')
      .select('*', { count: 'exact' })

    // Apply search filter
    if (search) {
      // Full-text search on company name, website, and location
      query = query.or(`name.ilike.%${search}%,website.ilike.%${search}%,location.ilike.%${search}%`)
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

