import { NextRequest } from 'next/server'
import { handleApiError, createErrorResponse, normalizeServiceApisError } from '@/lib/utils/errors'
import { rateLimit, getClientIP } from '@/lib/utils/ratelimit'
import { serviceApisFetch } from '@/lib/service-apis/client'

export const dynamic = 'force-dynamic'

const SERVICE_APIS_BASE = process.env.SERVICE_APIS_BASE_URL || ''

const mockProducts = [
  { product_id: '1', product_name: 'Salesforce CRM', product_description: "The world's #1 CRM platform.", rating: 4.5, reviews: 1243, product_logo: null },
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
    const rateLimitInfo = { remaining: rateLimitResult.remaining, limit: rateLimitResult.limit }

    if (!SERVICE_APIS_BASE) {
      const query = q.toLowerCase()
      const filtered = query
        ? mockProducts.filter((p) => p.product_name.toLowerCase().includes(query) || p.product_description.toLowerCase().includes(query))
        : mockProducts
      const products = filtered.slice(0, limitParam)
      return Response.json({
        query: q,
        type: 'all',
        totalResults: products.length,
        results: { products, companies: [] },
        rateLimit: rateLimitInfo,
      })
    }

    const res = await serviceApisFetch('/catalog/search', {
      method: 'POST',
      body: JSON.stringify({ query: q, limit: limitParam }),
    })
    const data = await res.json().catch(() => null)
    if (!res.ok) return normalizeServiceApisError(res, data)

    return Response.json({
      query: q,
      type: 'all',
      totalResults: data?.totalResults ?? data?.results?.products?.length ?? 0,
      results: data?.results ?? data,
      rateLimit: rateLimitInfo,
    })
  } catch (error) {
    return handleApiError(error)
  }
}
