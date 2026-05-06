import { NextRequest } from 'next/server'
import { serviceApisFetch } from '@/lib/service-apis/client'
import { handleApiError, createErrorResponse } from '@/lib/utils/errors'
import { rateLimit, getClientIP } from '@/lib/utils/ratelimit'

export const dynamic = 'force-dynamic'
export const revalidate = 3600

/**
 * GET /api/categories
 * Proxy to service-apis GET /api/v1/catalog/categories
 */
export async function GET(request: NextRequest) {
  try {
    const ip = getClientIP(request)
    const rateLimitResult = await rateLimit(ip)

    if (!rateLimitResult.success) {
      return createErrorResponse('RATE_LIMIT_EXCEEDED', 'Too many requests.', 429)
    }

    try {
      const res = await serviceApisFetch('/api/v1/catalog/categories')

      if (res.ok) {
        const json = await res.json()
        // Map taxonomy terms to {name, link} format expected by frontend
        const categories = (json.terms || json.categories || []).map((term: { name: string; slug?: string; link?: string }) => ({
          name: term.name,
          link: term.link || term.slug ? `/products?category=${term.slug || term.name}` : undefined,
        }))

        return Response.json({
          data: categories,
          total: categories.length,
        })
      }

      if (res.status === 404 || res.status === 400) {
        // Endpoint not yet available
      } else {
        console.error('service-apis error:', res.status, await res.text())
        return createErrorResponse('SERVICE_APIS_ERROR', 'Failed to fetch categories from catalog service', 502)
      }
    } catch (err) {
      console.error('service-apis fetch failed:', err)
    }

    // Fallback: no mock categories (empty)
    return Response.json({
      data: [],
      total: 0,
    })
  } catch (error) {
    return handleApiError(error)
  }
}
