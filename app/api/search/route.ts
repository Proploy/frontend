import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { searchQuerySchema } from '@/lib/validations/api'
import { handleApiError, createErrorResponse } from '@/lib/utils/errors'
import { rateLimit, getClientIP } from '@/lib/utils/ratelimit'

export const dynamic = 'force-dynamic'
export const revalidate = 3600 


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

    const searchParams = request.nextUrl.searchParams
    const queryParams = Object.fromEntries(searchParams.entries())
    const validatedParams = searchQuerySchema.parse(queryParams)

    const { q, type, limit } = validatedParams

   
    const supabase = await createClient()

    const results: {
      products?: unknown[]
      companies?: unknown[]
    } = {}

   
    if (type === 'products' || type === 'all') {
      const { data: products, error: productsError } = await supabase
        .from('products')
        .select('product_id, product_name, product_description, rating, reviews, product_logo')
        .or(`product_name.ilike.%${q}%,product_description.ilike.%${q}%,what_is.ilike.%${q}%`)
        .limit(limit)
        .order('rating', { ascending: false })

      if (productsError) {
        console.error('Products search error:', productsError)
      } else {
        results.products = products || []
      }
    }

    if (type === 'companies' || type === 'all') {
      const { data: companies, error: companiesError } = await supabase
        .from('companies')
        .select('company_id, name, website, location, employee_count')
        .or(`name.ilike.%${q}%,website.ilike.%${q}%,location.ilike.%${q}%`)
        .limit(limit)
        .order('name', { ascending: true })

      if (companiesError) {
        console.error('Companies search error:', companiesError)
      } else {
        results.companies = companies || []
      }
    }

    const totalResults = (results.products?.length || 0) + (results.companies?.length || 0)

    return Response.json({
      query: q,
      type,
      totalResults,
      results,
      rateLimit: {
        remaining: rateLimitResult.remaining,
        limit: rateLimitResult.limit,
      },
    })
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      return createErrorResponse(
        'VALIDATION_ERROR',
        'Invalid search query',
        400,
        error
      )
    }
    return handleApiError(error)
  }
}

