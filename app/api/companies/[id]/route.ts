import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getCompanyByIdParamsSchema } from '@/lib/validations/api'
import { handleApiError, createErrorResponse } from '@/lib/utils/errors'
import { rateLimit, getClientIP } from '@/lib/utils/ratelimit'

export const revalidate = 3600 // Revalidate every hour (ISR)

/**
 * GET /api/companies/[id]
 * Get a single company by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
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
    const { id } = await params
    const validatedParams = getCompanyByIdParamsSchema.parse({ id })

    // Create Supabase client
    const supabase = await createClient()

    // Fetch company
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .eq('company_id', validatedParams.id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return createErrorResponse('NOT_FOUND', 'Company not found', 404)
      }
      console.error('Supabase error:', error)
      return createErrorResponse('DATABASE_ERROR', error.message, 500)
    }

    if (!data) {
      return createErrorResponse('NOT_FOUND', 'Company not found', 404)
    }

    return Response.json({
      data,
      rateLimit: {
        remaining: rateLimitResult.remaining,
        limit: rateLimitResult.limit,
      },
    })
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      return createErrorResponse(
        'VALIDATION_ERROR',
        'Invalid company ID',
        400,
        error
      )
    }
    return handleApiError(error)
  }
}

