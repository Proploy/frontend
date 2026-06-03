import { NextRequest } from 'next/server'

export const dynamic = 'force-dynamic'

function getBackendUrl() {
  return process.env.AGENT_BACKEND_URL || 'http://127.0.0.1:8001'
}

export async function POST(request: NextRequest) {
  const body = await request.json()

  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 45000)

    const response = await fetch(`${getBackendUrl()}/agent/research`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      signal: controller.signal,
      cache: 'no-store',
    })

    clearTimeout(timeout)

    const payload = await response.text()
    return new Response(payload, {
      status: response.status,
      headers: {
        'Content-Type': response.headers.get('content-type') || 'application/json',
      },
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to contact the agent runtime'
    return Response.json(
      {
        error: 'AGENT_BACKEND_UNAVAILABLE',
        message,
        backendUrl: getBackendUrl(),
      },
      { status: 503 }
    )
  }
}
