import { NextRequest } from 'next/server'
import { serviceApisFetch } from '@/lib/service-apis/client'
import { handleApiError, createErrorResponse } from '@/lib/utils/errors'
import { rateLimit, getClientIP } from '@/lib/utils/ratelimit'

export const dynamic = 'force-dynamic'
export const revalidate = 3600

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
 * Proxy to service-apis GET /api/v1/catalog/products
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
    const category = searchParams.get('category') || ''
    const sort = searchParams.get('sort') || ''
    const offset = (page - 1) * limit

    // Build query string for service-apis
    const queryParts: string[] = []
    if (search) queryParts.push(`search=${encodeURIComponent(search)}`)
    if (category) queryParts.push(`category=${encodeURIComponent(category)}`)
    if (sort) queryParts.push(`sort=${encodeURIComponent(sort)}`)
    queryParts.push(`limit=${limit}`)
    queryParts.push(`offset=${offset}`)
    const queryString = queryParts.join('&')

    try {
      const res = await serviceApisFetch(`/api/v1/catalog/products${queryString ? `?${queryString}` : ''}`)

      if (res.ok) {
        const json = await res.json()
        // Map service-apis response to frontend expected shape
        const products = json.results || json.products || []
        const count = json.count || products.length
        const totalPages = Math.ceil(count / limit)

        return Response.json({
          data: products,
          pagination: {
            page,
            limit,
            total: count,
            totalPages,
            hasNextPage: page < totalPages,
            hasPreviousPage: page > 1,
          },
          rateLimit: { remaining: rateLimitResult.remaining, limit: rateLimitResult.limit },
        })
      }

      if (res.status === 404 || res.status === 400) {
        // Endpoint not yet available on service-apis, fall through to mock
      } else {
        console.error('service-apis error:', res.status, await res.text())
        return createErrorResponse('SERVICE_APIS_ERROR', 'Failed to fetch products from catalog service', 502)
      }
    } catch (err) {
      // service-apis unreachable, fall through to mock
      console.error('service-apis fetch failed:', err)
    }

    // Mock fallback
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
  } catch (error) {
    return handleApiError(error)
  }
}
