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
    const items = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : []
    return Response.json({ data: items, total: items.length })
  } catch (error) {
    if (error instanceof Error) {
      return createErrorResponse('INTERNAL_ERROR', error.message, 500)
    }
    return handleApiError(error)
  }
}
