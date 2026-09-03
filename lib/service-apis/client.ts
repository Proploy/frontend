/**
 * Thin client for the Proploy `service-apis` gateway.
 *
 * Reads `SERVICE_APIS_BASE_URL` (server-only). When set, requests are proxied
 * to the gateway; otherwise the helper returns an empty stub response so the
 * frontend keeps rendering in dev environments without the backend running.
 *
 * `requireAuth: true` forwards the current Supabase session access token as
 * `Authorization: Bearer <token>` so the gateway can authenticate the user.
 */
import { createClient } from '@/lib/supabase/server'
import { catalogRevalidateSeconds } from './cache-policy'

const SERVICE_APIS_BASE = (process.env.NEXT_PUBLIC_SERVICE_APIS_URL || process.env.SERVICE_APIS_BASE_URL || '').replace(/\/$/, '')

interface ServiceApisFetchOptions extends RequestInit {
  requireAuth?: boolean
  /**
   * Forward a Supabase access token explicitly (e.g. when calling from a
   * context where cookies aren't available). Bypasses the cookie lookup.
   */
  accessToken?: string | null
}

function emptyResponse(): Response {
  return new Response(JSON.stringify({ data: [], message: 'service-apis disabled' }), {
    status: 200,
    headers: { 'content-type': 'application/json' },
  })
}

async function resolveAccessToken(): Promise<string | null> {
  try {
    const supabase = await createClient()
    const { data } = await supabase.auth.getSession()
    return data.session?.access_token ?? null
  } catch {
    return null
  }
}

export async function serviceApisFetch(
  path: string,
  options: ServiceApisFetchOptions = {},
): Promise<Response> {
  if (!SERVICE_APIS_BASE) {
    return emptyResponse()
  }

  const { requireAuth, accessToken, headers, ...init } = options
  const finalHeaders: Record<string, string> = { accept: 'application/json' }
  const requestHeaders = new Headers(headers)

  // Allowlist: only forward headers with a safe, defined purpose for the backend.
  // Using an allowlist (not a denylist) prevents client-injected trust headers
  // (x-forwarded-for, x-real-ip, x-admin, etc.) from reaching the backend.
  const allowedHeaders = new Set([
    'content-type',
    'accept',
    'accept-language',
    'accept-encoding',
    'cache-control',
    'range',
  ])

  requestHeaders.forEach((value, name) => {
    if (allowedHeaders.has(name.toLowerCase())) finalHeaders[name.toLowerCase()] = value
  })

  if (init.body && !finalHeaders['content-type']) {
    finalHeaders['content-type'] = 'application/json'
  }

  let token = accessToken ?? null
  if (requireAuth && token === null) {
    token = await resolveAccessToken()
  }
  if (token) {
    finalHeaders.authorization = `Bearer ${token}`
  }

  const url = `${SERVICE_APIS_BASE}${path.startsWith('/') ? path : `/${path}`}`
  
  const fetchOptions: RequestInit = {
    ...init,
    headers: finalHeaders,
  }
  
  const revalidate = catalogRevalidateSeconds(path)
  if (init.cache !== undefined || init.next !== undefined) {
    // Respect explicitly provided cache options
  } else if (revalidate !== null) {
    fetchOptions.next = { revalidate }
  } else {
    // Everything non-catalog, plus catalog requests carrying a search term.
    fetchOptions.cache = 'no-store'
  }

  return fetch(url, fetchOptions)
}

export async function getUserInterests(): Promise<{
  ok: boolean
  status: number
  data: unknown
}> {
  const response = await serviceApisFetch('/api/v1/users/me/interests', {
    requireAuth: true,
  })
  let data: unknown = null
  try {
    data = await response.json()
  } catch {
    data = null
  }
  return { ok: response.ok, status: response.status, data }
}
