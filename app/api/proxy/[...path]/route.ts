import { NextRequest } from 'next/server'
import { serviceApisFetch } from '@/lib/service-apis/server'

export const dynamic = 'force-dynamic'

async function handleProxy(request: NextRequest, context: { params: Promise<unknown> }) {
  const resolvedParams = (await context.params) as { path?: string[] }
  const path = '/' + (resolvedParams.path || []).join('/')
  const searchParams = request.nextUrl.searchParams.toString()
  const fullPath = searchParams ? `${path}?${searchParams}` : path

  // Block internal-only paths from being forwarded through the public proxy
  if (path.startsWith('/internal/')) {
    return new Response(JSON.stringify({ error: 'Not Found' }), { status: 404, headers: { 'content-type': 'application/json' } })
  }

  const headers = new Headers(request.headers)
  // Strip client-supplied auth hint before any auth decision is made.
  // requireAuth must never be derived from a client-controlled header.
  headers.delete('x-require-auth')
  headers.delete('host') // Do not forward host header
  headers.delete('x-agent-key') // Strip internal agent key to prevent exposure

  // Determine requireAuth server-side from a path-prefix allowlist.
  // Never trust a client-supplied header for this decision.
  //
  // This list mirrors every authenticated route in service-apis. If a route
  // there requires auth but is missing here, the proxy forwards it without a
  // token and the gateway answers 401 — so keep the two in step when adding
  // authenticated endpoints.
  const AUTH_REQUIRED_PREFIXES = [
    '/api/v1/workspace/',
    '/api/v1/users/me',
    '/api/v1/users/favorites',
    '/api/v1/users/recently-viewed',
    '/api/v1/experts/me',
    '/api/v1/experts/apply',
    '/api/v1/experts/recommended',
    '/api/v1/native-scheduling/',
    '/api/v1/integrations/',
    '/api/v1/ai_workspace/',
    '/api/v1/auth/sync',
    '/api/v1/catalog/compare',
  ]
  const requireAuth = AUTH_REQUIRED_PREFIXES.some(prefix => path.startsWith(prefix))

  const init: any = {
    method: request.method,
    headers,
    redirect: 'manual',
    duplex: 'half', // Required in Node.js when body is a ReadableStream
  }

  if (request.method !== 'GET' && request.method !== 'HEAD' && request.body) {
    init.body = request.body
  }

  const response = await serviceApisFetch(fullPath, {
    ...init,
    requireAuth,
  })

  const responseHeaders = new Headers(response.headers)
  // Let Next.js handle encoding
  responseHeaders.delete('content-encoding')

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: responseHeaders,
  })
}

export const GET = handleProxy
export const POST = handleProxy
export const PUT = handleProxy
export const PATCH = handleProxy
export const DELETE = handleProxy
export const OPTIONS = handleProxy
