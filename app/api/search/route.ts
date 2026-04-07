import { NextRequest } from 'next/server'
import { handleApiError, createErrorResponse } from '@/lib/utils/errors'
import { rateLimit, getClientIP } from '@/lib/utils/ratelimit'

export const dynamic = 'force-dynamic'
export const revalidate = 3600

const isSupabaseConfigured =
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const mockProducts = [
  { product_id: '1', product_name: 'Salesforce CRM', product_description: 'The world\'s #1 CRM platform.', rating: 4.5, reviews: 1243, product_logo: null },
  { product_id: '2', product_name: 'HubSpot', product_description: 'All-in-one inbound marketing and CRM.', rating: 4.6, reviews: 987, product_logo: null },
  { product_id: '3', product_name: 'Slack', product_description: 'Business communication platform.', rating: 4.7, reviews: 2156, product_logo: null },
  { product_id: '4', product_name: 'Asana', product_description: 'Work management platform for teams.', rating: 4.4, reviews: 876, product_logo: null },
  { product_id: '5', product_name: 'Notion', product_description: 'All-in-one workspace for docs and projects.', rating: 4.8, reviews: 1567, product_logo: null },
  { product_id: '6', product_name: 'Zendesk', product_description: 'Customer service platform.', rating: 4.3, reviews: 654, product_logo: null },
  { product_id: '7', product_name: 'Monday.com', product_description: 'Work operating system for teams.', rating: 4.5, reviews: 1098, product_logo: null },
  { product_id: '8', product_name: 'Jira', product_description: 'Issue tracking for agile teams.', rating: 4.2, reviews: 1876, product_logo: null },
  { product_id: '9', product_name: 'Intercom', product_description: 'Customer messaging platform.', rating: 4.4, reviews: 543, product_logo: null },
]

export async function GET(request: NextRequest) {
  try {
    const ip = getClientIP(request)
    const rateLimitResult = await rateLimit(ip)

    if (!rateLimitResult.success) {
      return createErrorResponse('RATE_LIMIT_EXCEEDED', 'Too many requests.', 429)
    }

    const searchParams = request.nextUrl.searchParams
    const q = searchParams.get('q') || searchParams.get('search') || ''
    const limitParam = parseInt(searchParams.get('limit') || '10')

    // Mock data fallback
    if (!isSupabaseConfigured) {
      const query = q.toLowerCase()
      const filtered = query
        ? mockProducts.filter(p => p.product_name.toLowerCase().includes(query) || p.product_description.toLowerCase().includes(query))
        : mockProducts
      const products = filtered.slice(0, limitParam)

      return Response.json({
        query: q,
        type: 'all',
        totalResults: products.length,
        results: { products, companies: [] },
        rateLimit: { remaining: rateLimitResult.remaining, limit: rateLimitResult.limit },
      })
    }

    // Real Supabase path
    const { createClient } = await import('@/lib/supabase/server')
    const { searchQuerySchema } = await import('@/lib/validations/api')

    const queryParams = Object.fromEntries(searchParams.entries())
    const validatedParams = searchQuerySchema.parse(queryParams)
    const { q: vq, type, limit } = validatedParams

    const supabase = await createClient()
    const results: { products?: unknown[]; companies?: unknown[] } = {}

    if (type === 'products' || type === 'all') {
      const { data: products, error } = await supabase
        .from('products')
        .select('product_id, product_name, product_description, rating, reviews, product_logo')
        .or(`product_name.ilike.%${vq}%,product_description.ilike.%${vq}%,what_is.ilike.%${vq}%`)
        .limit(limit)
        .order('rating', { ascending: false })
      if (!error) results.products = products || []
    }

    if (type === 'companies' || type === 'all') {
      const { data: companies, error } = await supabase
        .from('companies')
        .select('company_id, name, website, location, employee_count')
        .or(`name.ilike.%${vq}%,website.ilike.%${vq}%,location.ilike.%${vq}%`)
        .limit(limit)
        .order('name', { ascending: true })
      if (!error) results.companies = companies || []
    }

    return Response.json({
      query: vq,
      type,
      totalResults: (results.products?.length || 0) + (results.companies?.length || 0),
      results,
      rateLimit: { remaining: rateLimitResult.remaining, limit: rateLimitResult.limit },
    })
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      return createErrorResponse('VALIDATION_ERROR', 'Invalid search query', 400, error)
    }
    return handleApiError(error)
  }
}

