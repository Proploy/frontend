import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getCompaniesByProductParamsSchema } from '@/lib/validations/api'
import { handleApiError, createErrorResponse } from '@/lib/utils/errors'
import { rateLimit, getClientIP } from '@/lib/utils/ratelimit'

export const revalidate = 3600 // Revalidate every hour (ISR)

/**
 * GET /api/companies/product/[productId]
 * Get company by product ID
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
    const validatedParams = getCompaniesByProductParamsSchema.parse({ productId })

    // Create Supabase client
    const supabase = await createClient()

    // First, get the product to find the company_id
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('company_id')
      .eq('product_id', validatedParams.productId)
      .single()

    if (productError || !product) {
      return createErrorResponse('NOT_FOUND', 'Product not found', 404)
    }

    if (!product.company_id) {
      return createErrorResponse('NOT_FOUND', 'Company not associated with this product', 404)
    }

    // Fetch company
    const { data: company, error: companyError } = await supabase
      .from('companies')
      .select('*')
      .eq('company_id', product.company_id)
      .single()

    if (companyError) {
      if (companyError.code === 'PGRST116') {
        return createErrorResponse('NOT_FOUND', 'Company not found', 404)
      }
      console.error('Supabase error:', companyError)
      return createErrorResponse('DATABASE_ERROR', companyError.message, 500)
    }

    if (!company) {
      return createErrorResponse('NOT_FOUND', 'Company not found', 404)
    }

    return Response.json({
      data: company,
      rateLimit: {
        remaining: rateLimitResult.remaining,
        limit: rateLimitResult.limit,
      },
    })
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      return createErrorResponse(
        'VALIDATION_ERROR',
        'Invalid product ID',
        400,
        error
      )
    }
    return handleApiError(error)
  }
}

