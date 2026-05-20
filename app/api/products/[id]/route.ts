/** @deprecated — proxy shim, use hooks directly, remove after migration */
import { NextRequest } from 'next/server'
import { handleApiError, createErrorResponse, normalizeServiceApisError } from '@/lib/utils/errors'
import { rateLimit, getClientIP } from '@/lib/utils/ratelimit'
import { serviceApisFetch } from '@/lib/service-apis/client'

export const dynamic = 'force-dynamic'
export const revalidate = 0

const SERVICE_APIS_BASE = process.env.SERVICE_APIS_BASE_URL || ''

const mockProducts: Record<string, object> = {
  '1': { product_id: '1', product_name: 'Salesforce CRM', product_description: "The world's #1 CRM platform.", rating: 4.5, reviews: 1243, category: { name: 'CRM' }, pricing_plans: [{ plan_name: 'Starter', plan_price: '$25/mo', plan_description: 'Basic CRM features' }] },
  '2': { product_id: '2', product_name: 'HubSpot', product_description: 'All-in-one inbound marketing & CRM.', rating: 4.6, reviews: 987, category: { name: 'Marketing' } },
  '3': { product_id: '3', product_name: 'Slack', product_description: 'Business communication platform.', rating: 4.7, reviews: 2156, category: { name: 'Collaboration' } },
  '4': { product_id: '4', product_name: 'Asana', product_description: 'Work management platform.', rating: 4.4, reviews: 876, category: { name: 'Project Management' } },
  '5': { product_id: '5', product_name: 'Notion', product_description: 'All-in-one workspace.', rating: 4.8, reviews: 1567, category: { name: 'Productivity' } },
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const ip = getClientIP(request)
    const rateLimitResult = await rateLimit(ip)
    if (!rateLimitResult.success) {
      return createErrorResponse('RATE_LIMIT_EXCEEDED', 'Too many requests.', 429)
    }

    const { id } = await params
    const rateLimitInfo = { remaining: rateLimitResult.remaining, limit: rateLimitResult.limit }

    if (!SERVICE_APIS_BASE) {
      const product = mockProducts[id]
      if (!product) {
        return createErrorResponse('NOT_FOUND', 'Product not found', 404)
      }
      return Response.json({ data: product, rateLimit: rateLimitInfo })
    }

    const response = await serviceApisFetch(`/catalog/products/${encodeURIComponent(id)}`)
    const data = await response.json().catch(() => null)

    if (response.status === 404) {
      return createErrorResponse('NOT_FOUND', 'Product not found', 404)
    }
    if (!response.ok) {
      return normalizeServiceApisError(response, data)
    }

    const raw = (data?.data ?? data) as Record<string, unknown> | null
    if (!raw) {
      return createErrorResponse('NOT_FOUND', 'Product not found', 404)
    }
    const normalized = {
      ...raw,
      product_id: raw.product_id ?? raw.id,
      product_name: raw.product_name ?? raw.name,
      product_description:
        raw.product_description ?? raw.short_description ?? raw.what_is ?? null,
      product_logo: raw.product_logo ?? raw.logo_url ?? null,
      rating: raw.rating ?? raw.avg_rating ?? null,
      reviews: raw.reviews ?? raw.total_reviews ?? null,
      product_link: raw.product_link ?? raw.official_website ?? null,
      category:
        raw.category ?? (raw.primary_category ? { name: raw.primary_category } : null),
    }

    return Response.json({ data: normalized, rateLimit: rateLimitInfo })
  } catch (error) {
    return handleApiError(error)
  }
}
