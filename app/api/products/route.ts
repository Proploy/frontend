import { NextRequest } from 'next/server'
import { handleApiError, createErrorResponse } from '@/lib/utils/errors'
import { rateLimit, getClientIP } from '@/lib/utils/ratelimit'

export const dynamic = 'force-dynamic'
export const revalidate = 3600

const isSupabaseConfigured =
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const mockProducts = [
  { product_id: '1', product_name: 'Salesforce CRM', product_description: 'The world\'s #1 CRM platform for sales, service, marketing, and more.', rating: 4.5, reviews: 1243, product_logo: null, category: { name: 'CRM' }, created_at: '2024-01-01' },
  { product_id: '2', product_name: 'HubSpot', product_description: 'All-in-one inbound marketing, sales, and CRM platform to grow your business.', rating: 4.6, reviews: 987, product_logo: null, category: { name: 'Marketing' }, created_at: '2024-01-02' },
  { product_id: '3', product_name: 'Slack', product_description: 'Business communication platform offering real-time messaging, archiving, and search.', rating: 4.7, reviews: 2156, product_logo: null, category: { name: 'Collaboration' }, created_at: '2024-01-03' },
  { product_id: '4', product_name: 'Asana', product_description: 'Work management platform that helps teams orchestrate their work from daily tasks to strategic initiatives.', rating: 4.4, reviews: 876, product_logo: null, category: { name: 'Project Management' }, created_at: '2024-01-04' },
  { product_id: '5', product_name: 'Notion', product_description: 'All-in-one workspace for notes, docs, knowledge bases, project management, and collaboration.', rating: 4.8, reviews: 1567, product_logo: null, category: { name: 'Productivity' }, created_at: '2024-01-05' },
  { product_id: '6', product_name: 'Zendesk', product_description: 'Customer service and engagement platform designed to improve customer relationships.', rating: 4.3, reviews: 654, product_logo: null, category: { name: 'Customer Support' }, created_at: '2024-01-06' },
  { product_id: '7', product_name: 'Monday.com', product_description: 'Work operating system that powers teams to run processes, projects, and workflows.', rating: 4.5, reviews: 1098, product_logo: null, category: { name: 'Project Management' }, created_at: '2024-01-07' },
  { product_id: '8', product_name: 'Jira', product_description: 'Issue and project tracking software for agile teams to plan, track, and release software.', rating: 4.2, reviews: 1876, product_logo: null, category: { name: 'Development' }, created_at: '2024-01-08' },
  { product_id: '9', product_name: 'Intercom', product_description: 'Customer messaging platform that drives growth at every stage of the customer lifecycle.', rating: 4.4, reviews: 543, product_logo: null, category: { name: 'Customer Support' }, created_at: '2024-01-09' },
]

/**
 * GET /api/products
 * Get paginated list of products with optional filtering and search
 */
export async function GET(request: NextRequest) {
  try {
    const ip = getClientIP(request)
    const rateLimitResult = await rateLimit(ip)

    if (!rateLimitResult.success) {
      return createErrorResponse('RATE_LIMIT_EXCEEDED', 'Too many requests.', 429)
    }

    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const search = searchParams.get('search') || ''

    // Use mock data when Supabase is not configured
    if (!isSupabaseConfigured) {
      let filtered = mockProducts
      if (search) {
        const q = search.toLowerCase()
        filtered = filtered.filter(p =>
          p.product_name.toLowerCase().includes(q) ||
          p.product_description?.toLowerCase().includes(q)
        )
      }

      const from = (page - 1) * limit
      const paged = filtered.slice(from, from + limit)
      const totalPages = Math.ceil(filtered.length / limit)

      return Response.json({
        data: paged,
        pagination: { page, limit, total: filtered.length, totalPages, hasNextPage: page < totalPages, hasPreviousPage: page > 1 },
        rateLimit: { remaining: rateLimitResult.remaining, limit: rateLimitResult.limit },
      })
    }

    // Real Supabase path
    const { createClient } = await import('@/lib/supabase/server')
    const { getProductsQuerySchema } = await import('@/lib/validations/api')

    const queryParams = Object.fromEntries(searchParams.entries())
    const validatedParams = getProductsQuerySchema.parse(queryParams)
    const { page: vPage, limit: vLimit, search: vSearch, category, minRating, maxRating, sortBy, sortOrder, companyId } = validatedParams

    const supabase = await createClient()
    let query = supabase.from('products').select('*', { count: 'exact' })

    if (vSearch) query = query.or(`product_name.ilike.%${vSearch}%,product_description.ilike.%${vSearch}%`)
    if (category) {
      const searchCategory = category.replace(/-/g, ' ')
      query = query.ilike('category->>name', `%${searchCategory}%`)
    }
    if (minRating !== undefined) query = query.gte('rating', minRating)
    if (maxRating !== undefined) query = query.lte('rating', maxRating)
    if (companyId) query = query.eq('company_id', companyId)

    query = query.order(sortBy, { ascending: sortOrder === 'asc' })
    const from = (vPage - 1) * vLimit
    query = query.range(from, from + vLimit - 1)

    const { data, error, count } = await query

    if (error) {
      console.error('Supabase error:', error)
      return createErrorResponse('DATABASE_ERROR', error.message, 500)
    }

    const totalPages = count ? Math.ceil(count / vLimit) : 0

    return Response.json({
      data: data || [],
      pagination: { page: vPage, limit: vLimit, total: count || 0, totalPages, hasNextPage: vPage < totalPages, hasPreviousPage: vPage > 1 },
      rateLimit: { remaining: rateLimitResult.remaining, limit: rateLimitResult.limit },
    })
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      return createErrorResponse('VALIDATION_ERROR', 'Invalid query parameters', 400, error)
    }
    return handleApiError(error)
  }
}
