// Stub client for missing service-apis backend.
// Returns empty/successful responses so the frontend can render in dev
// without the upstream service. Replace with the real implementation
// (or wire to an external host) when ready.

const SERVICE_APIS_BASE = process.env.SERVICE_APIS_BASE_URL || ''

interface ServiceApisFetchOptions extends RequestInit {
  requireAuth?: boolean
}

export async function serviceApisFetch(
  path: string,
  options: ServiceApisFetchOptions = {},
): Promise<Response> {
  if (!SERVICE_APIS_BASE) {
    return new Response(JSON.stringify({ data: [], message: 'service-apis disabled' }), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    })
  }

  const { requireAuth: _requireAuth, ...init } = options
  return fetch(`${SERVICE_APIS_BASE}${path}`, init)
}

export async function getUserInterests(): Promise<{ data: unknown[] }> {
  return { data: [] }
}
