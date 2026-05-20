/** @deprecated — proxy shim, use hooks directly, remove after migration */
import { NextRequest } from 'next/server'
import { handleApiError, createErrorResponse, normalizeServiceApisError } from '@/lib/utils/errors'
import { rateLimit, getClientIP } from '@/lib/utils/ratelimit'
import { serviceApisFetch } from '@/lib/service-apis/client'

export const dynamic = 'force-dynamic'
export const revalidate = 0

const SERVICE_APIS_BASE = process.env.SERVICE_APIS_BASE_URL || ''

const mockProducts = [
  { product_id: '1', product_name: 'Salesforce CRM', product_description: "The world's #1 CRM platform for sales, service, marketing, and more.", rating: 4.5, reviews: 1243, product_logo: null, category: { name: 'CRM' } },
  { product_id: '2', product_name: 'HubSpot', product_description: 'All-in-one inbound marketing, sales, and CRM platform.', rating: 4.6, reviews: 987, product_logo: null, category: { name: 'Marketing' } },
  { product_id: '3', product_name: 'Slack', product_description: 'Business communication platform with real-time messaging.', rating: 4.7, reviews: 2156, product_logo: null, category: { name: 'Collaboration' } },
  { product_id: '4', product_name: 'Asana', product_description: 'Work management platform that helps teams orchestrate work.', rating: 4.4, reviews: 876, product_logo: null, category: { name: 'Project Management' } },
  { product_id: '5', product_name: 'Notion', product_description: 'All-in-one workspace for notes, docs, and collaboration.', rating: 4.8, reviews: 1567, product_logo: null, category: { name: 'Productivity' } },
  { product_id: '6', product_name: 'Zendesk', product_description: 'Customer service and engagement platform.', rating: 4.3, reviews: 654, product_logo: null, category: { name: 'Customer Support' } },
  { product_id: '7', product_name: 'Monday.com', product_description: 'Work operating system for teams and workflows.', rating: 4.5, reviews: 1098, product_logo: null, category: { name: 'Project Management' } },
  { product_id: '8', product_name: 'Jira', product_description: 'Issue and project tracking software for agile teams.', rating: 4.2, reviews: 1876, product_logo: null, category: { name: 'Development' } },
  { product_id: '9', product_name: 'Intercom', product_description: 'Customer messaging platform for the customer lifecycle.', rating: 4.4, reviews: 543, product_logo: null, category: { name: 'Customer Support' } },
]

function mockPaginated(searchParams: URLSearchParams, rateLimitInfo: { remaining: number; limit: number }) {
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '20')
  const search = searchParams.get('search')?.toLowerCase() || ''
  const category = searchParams.get('category')?.toLowerCase() || ''

  let filtered = mockProducts
  if (search) {
    filtered = filtered.filter((p) =>
      p.product_name.toLowerCase().includes(search) ||
      p.product_description.toLowerCase().includes(search),
    )
  }
  if (category) {
    filtered = filtered.filter((p) => p.category.name.toLowerCase().includes(category))
  }

  const from = (page - 1) * limit
  const paged = filtered.slice(from, from + limit)
  const totalPages = Math.max(1, Math.ceil(filtered.length / limit))

  return Response.json({
    data: paged,
    pagination: {
      page,
      limit,
      total: filtered.length,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
    rateLimit: rateLimitInfo,
  })
}

export async function GET(request: NextRequest) {
  try {
    const ip = getClientIP(request)
    const rateLimitResult = await rateLimit(ip)
    if (!rateLimitResult.success) {
      return createErrorResponse('RATE_LIMIT_EXCEEDED', 'Too many requests.', 429)
    }

    const searchParams = request.nextUrl.searchParams
    const rateLimitInfo = { remaining: rateLimitResult.remaining, limit: rateLimitResult.limit }

    if (!SERVICE_APIS_BASE) {
      return mockPaginated(searchParams, rateLimitInfo)
    }

    // Forward to service-apis catalog
    const params = new URLSearchParams()
    const limit = searchParams.get('limit') || '20'
    const page = searchParams.get('page') || '1'
    params.set('limit', limit)
    params.set('offset', String((parseInt(page) - 1) * parseInt(limit)))
    if (searchParams.get('search')) params.set('q', searchParams.get('search') as string)
    if (searchParams.get('category')) params.set('category', searchParams.get('category') as string)

    const response = await serviceApisFetch(`/catalog/products?${params.toString()}`)
    const data = await response.json().catch(() => null)
    if (!response.ok) {
      return normalizeServiceApisError(response, data)
    }

    const rawList: Array<Record<string, unknown>> = Array.isArray(data?.results)
      ? data.results
      : Array.isArray(data?.items)
      ? data.items
      : Array.isArray(data?.data)
      ? data.data
      : Array.isArray(data)
      ? data
      : []

    const normalized = rawList.map((p) => ({
      product_id: p.product_id ?? p.id,
      product_name: p.product_name ?? p.name,
      product_description: p.product_description ?? p.short_description ?? p.what_is ?? null,
      product_logo: p.product_logo ?? p.logo_url ?? null,
      rating: p.rating ?? p.avg_rating ?? null,
      reviews: p.reviews ?? p.total_reviews ?? null,
      category: p.category ?? (p.primary_category ? { name: p.primary_category } : null),
      slug: p.slug,
      official_website: p.official_website,
    }))

    return Response.json({
      data: normalized,
      pagination: data?.pagination ?? {
        page: parseInt(page),
        limit: parseInt(limit),
        total: data?.count ?? data?.total ?? normalized.length,
      },
      rateLimit: rateLimitInfo,
    })
  } catch (error) {
    return handleApiError(error)
  }
}
