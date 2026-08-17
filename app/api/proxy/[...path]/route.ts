import { NextRequest } from 'next/server'
import { serviceApisFetch } from '@/lib/service-apis/server'

export const dynamic = 'force-dynamic'

async function handleProxy(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const resolvedParams = await params
  const path = '/' + (resolvedParams.path || []).join('/')
  const searchParams = request.nextUrl.searchParams.toString()
  const fullPath = searchParams ? `${path}?${searchParams}` : path

  const headers = new Headers(request.headers)
  const requireAuth = headers.get('x-require-auth') === 'true'
  headers.delete('x-require-auth')
  headers.delete('host') // Do not forward host header

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
