/** @deprecated — proxy shim, use hooks directly, remove after migration */
import { NextRequest } from 'next/server'
import { handleApiError, createErrorResponse, normalizeServiceApisError } from '@/lib/utils/errors'
import { serviceApisFetch } from '@/lib/service-apis/client'

export const dynamic = 'force-dynamic'

const SERVICE_APIS_BASE = process.env.SERVICE_APIS_BASE_URL || ''

const MOCK_CATEGORIES = [
  { name: 'CRM & Sales', count: 64 },
  { name: 'Marketing Automation', count: 48 },
  { name: 'Project Management', count: 72 },
  { name: 'Analytics & Business Intelligence', count: 39 },
  { name: 'Accounting & Finance', count: 31 },
  { name: 'HR & Recruitment', count: 22 },
  { name: 'Customer Support', count: 41 },
  { name: 'Collaboration Tools', count: 56 },
  { name: 'Security & Compliance', count: 18 },
]

export async function GET(_request: NextRequest) {
  try {
    if (!SERVICE_APIS_BASE) {
      return Response.json({ data: MOCK_CATEGORIES, total: MOCK_CATEGORIES.length })
    }
    const response = await serviceApisFetch('/catalog/categories')
    const data = await response.json().catch(() => null)
    if (!response.ok) {
      return normalizeServiceApisError(response, data)
    }
    const rawList: Array<Record<string, unknown>> = Array.isArray(data?.categories)
      ? data.categories
      : Array.isArray(data?.data)
      ? data.data
      : Array.isArray(data)
      ? data
      : []
    const items = rawList.map((c) => ({
      name: (c.label as string) ?? (c.name as string) ?? (c.slug as string),
      slug: (c.slug as string) ?? (c.term_id as string),
      term_id: c.term_id,
      taxonomy_type: c.taxonomy_type,
      parent_term_id: c.parent_term_id,
      count: c.count ?? null,
    }))
    return Response.json({ data: items, total: data?.count ?? items.length })
  } catch (error) {
    if (error instanceof Error) {
      return createErrorResponse('INTERNAL_ERROR', error.message, 500)
    }
    return handleApiError(error)
  }
}
