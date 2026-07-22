import type {
  AiWorkspacePageContextInput,
  AiWorkspacePageContextPayload,
  AiWorkspaceRecord,
} from '@/features/ai-workspace/types'

export const AI_WORKSPACE_SESSION_STORAGE_KEY = 'proploy-ai-workspace-session-id'
export const AI_WORKSPACE_CONTEXT_HISTORY_STORAGE_KEY = 'proploy-ai-workspace-page-context-history'

const MAX_CONTEXT_HISTORY = 5

export function inferAiWorkspacePageType(route: string): string {
  if (route === '/') return 'homepage'
  if (route.startsWith('/products/') || route.startsWith('/product/')) return 'product_detail'
  if (route.startsWith('/products')) return 'catalog'
  if (route.startsWith('/compare')) return 'compare'
  if (route.startsWith('/experts')) return 'experts'
  if (route.startsWith('/for-businesses')) return 'businesses'
  if (route.startsWith('/for-experts')) return 'experts_landing'
  if (route.startsWith('/workspace')) return 'workspace'
  if (route.startsWith('/AI_workspace')) return 'AI_workspace'
  return 'unknown'
}

function stringOrUndefined(value: unknown): string | undefined {
  return typeof value === 'string' && value.length > 0 ? value : undefined
}

function stringArrayOrUndefined(value: unknown): string[] | undefined {
  return Array.isArray(value) && value.every((item) => typeof item === 'string')
    ? value
    : undefined
}

function recordOrUndefined(value: unknown): AiWorkspaceRecord | undefined {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? value as AiWorkspaceRecord
    : undefined
}

function compactPayload(payload: AiWorkspacePageContextPayload): AiWorkspacePageContextPayload {
  return Object.fromEntries(
    Object.entries(payload).filter(([, value]) => value !== undefined && value !== null),
  ) as AiWorkspacePageContextPayload
}

export function normalizeAiWorkspacePageContext(
  input: AiWorkspacePageContextInput | null | undefined,
  fallbackRoute = '/',
): AiWorkspacePageContextPayload {
  const source = input ?? {}
  const route = stringOrUndefined(source.route) ?? fallbackRoute
  const pageType = stringOrUndefined(source.page_type)
    ?? stringOrUndefined(source.pageType)
    ?? inferAiWorkspacePageType(route)

  const payload: AiWorkspacePageContextPayload = {
    ...source,
    route,
    page_type: pageType,
    title: stringOrUndefined(source.title),
    product_id: stringOrUndefined(source.product_id) ?? stringOrUndefined(source.productId),
    product_name: stringOrUndefined(source.product_name) ?? stringOrUndefined(source.productName),
    product_category: stringOrUndefined(source.product_category) ?? stringOrUndefined(source.productCategory),
    search_query: stringOrUndefined(source.search_query) ?? stringOrUndefined(source.searchQuery),
    comparison_product_ids: stringArrayOrUndefined(source.comparison_product_ids)
      ?? stringArrayOrUndefined(source.comparisonProductIds),
    filters: recordOrUndefined(source.filters),
    notes: stringArrayOrUndefined(source.notes),
    summary: stringOrUndefined(source.summary),
    timestamp: stringOrUndefined(source.timestamp),
  }

  delete (payload as AiWorkspacePageContextInput).pageType
  delete (payload as AiWorkspacePageContextInput).productId
  delete (payload as AiWorkspacePageContextInput).productName
  delete (payload as AiWorkspacePageContextInput).productCategory
  delete (payload as AiWorkspacePageContextInput).searchQuery
  delete (payload as AiWorkspacePageContextInput).comparisonProductIds

  return compactPayload(payload)
}

function isSameContext(left: AiWorkspacePageContextPayload, right: AiWorkspacePageContextPayload): boolean {
  return left.route === right.route
    && left.page_type === right.page_type
    && left.product_id === right.product_id
    && left.search_query === right.search_query
}

export function readAiWorkspaceContextHistory(): AiWorkspacePageContextPayload[] {
  if (typeof window === 'undefined') return []

  try {
    const raw = window.localStorage.getItem(AI_WORKSPACE_CONTEXT_HISTORY_STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return []
    return parsed
      .map((item) => normalizeAiWorkspacePageContext(recordOrUndefined(item)))
      .slice(0, MAX_CONTEXT_HISTORY)
  } catch {
    return []
  }
}

export function rememberAiWorkspacePageContext(input: AiWorkspacePageContextInput): AiWorkspacePageContextPayload {
  const context = normalizeAiWorkspacePageContext(input)
  if (typeof window === 'undefined') return context

  try {
    const withTimestamp = {
      ...context,
      timestamp: context.timestamp ?? new Date().toISOString(),
    }
    const history = readAiWorkspaceContextHistory()
    const withoutDuplicate = history.filter((item, index) => index !== 0 || !isSameContext(item, withTimestamp))
    const next = [withTimestamp, ...withoutDuplicate].slice(0, MAX_CONTEXT_HISTORY)
    window.localStorage.setItem(AI_WORKSPACE_CONTEXT_HISTORY_STORAGE_KEY, JSON.stringify(next))
  } catch {
    // Ignore storage failures; page context is a relevance hint, not required state.
  }

  return context
}
