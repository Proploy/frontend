import { normalizeServiceApiError, type NormalizedError } from './error-utils'

interface RequestOptions {
  requireAuth?: boolean
  /** Optional current Supabase token, used by auth sync and token-aware callers. */
  accessToken?: string | null
}

export interface ServiceApisBrowserFetchOptions extends RequestInit {
  requireAuth?: boolean
  accessToken?: string | null
}

function getBaseUrl(): string {
  return '/api/proxy'
}



/** Browser transport for the FastAPI gateway; feature traffic bypasses Next.js. */
export async function serviceApisBrowserFetch(
  path: string,
  options: ServiceApisBrowserFetchOptions = {},
): Promise<Response> {
  const { requireAuth = false, accessToken, headers, ...init } = options
  const baseUrl = getBaseUrl()

  if (!baseUrl) {
    return new Response(
      JSON.stringify({
        code: 'SERVICE_APIS_NOT_CONFIGURED',
        detail: 'Service APIs are not configured',
      }),
      {
        status: 503,
        headers: { 'content-type': 'application/json' },
      },
    )
  }

  const requestHeaders = new Headers(headers)
  if (!requestHeaders.has('accept')) requestHeaders.set('accept', 'application/json')

  // Do not send x-require-auth; auth decisions are made server-side in the proxy route.

  return fetch(`${baseUrl}${path.startsWith('/') ? path : `/${path}`}`, {
    ...init,
    headers: requestHeaders,
    cache: init.cache ?? 'no-store',
  })
}

/**
 * Browser-only client for calling service-apis.
 *
 * IMPORTANT: This module is for Client Components and browser code only.
 * Server Components must use lib/service-apis/server (serviceApisFetch).
 *
 * Authenticated requests ask a first-party Next.js route for the current
 * access token before calling service-apis.
 */
export class ServiceApisBrowserClient {
  private async fetch<T>(
    method: string,
    path: string,
    body: unknown | undefined,
    options: RequestOptions,
  ): Promise<NormalizedError | { ok: true; data: T }> {
    const { requireAuth = false, accessToken } = options

    const headers: Record<string, string> = {
      accept: 'application/json',
    }

    const isBinaryBody = typeof Blob !== 'undefined' && body instanceof Blob
    if (isBinaryBody) {
      if (body.type) headers['content-type'] = body.type
    } else if (body !== undefined) {
      headers['content-type'] = 'application/json'
    }

    let response: Response
    try {
      response = await serviceApisBrowserFetch(path, {
        method,
        headers,
        body: body === undefined
          ? undefined
          : isBinaryBody
            ? body
            : JSON.stringify(body),
        requireAuth,
        accessToken,
      })
    } catch {
      // Network/CORS failure — service-apis unreachable
      return {
        ok: false,
        status: 0,
        error: {
          code: 'NETWORK_ERROR',
          message: 'Unable to reach service APIs',
        },
      }
    }

    if (!response.ok) {
      return await normalizeServiceApiError(response)
    }

    let data: T
    try {
      data = await response.json() as T
    } catch {
      data = {} as T
    }
    return { ok: true, data }
  }

  /** Public GET — no auth attached */
  async get<T = unknown>(path: string, options: RequestOptions = {}): Promise<NormalizedError | { ok: true; data: T }> {
    return this.fetch<T>('GET', path, undefined, options)
  }

  /** Auth-required POST */
  async post<T = unknown>(path: string, body: unknown, options: RequestOptions = {}): Promise<NormalizedError | { ok: true; data: T }> {
    return this.fetch<T>('POST', path, body, options)
  }

  /** Auth-required POST for raw file bytes; no storage URL is returned to the browser. */
  async postBinary<T = unknown>(path: string, body: Blob, options: RequestOptions = {}): Promise<NormalizedError | { ok: true; data: T }> {
    return this.fetch<T>('POST', path, body, options)
  }

  /** Auth-required binary GET; the response remains a service-API blob. */
  async getBinary(path: string, options: RequestOptions = {}): Promise<NormalizedError | { ok: true; data: Blob }> {
    const { requireAuth = false, accessToken } = options
    let response: Response
    try {
      response = await serviceApisBrowserFetch(path, {
        method: 'GET',
        requireAuth,
        accessToken,
      })
    } catch {
      return {
        ok: false,
        status: 0,
        error: {
          code: 'NETWORK_ERROR',
          message: 'Unable to reach service APIs',
        },
      }
    }

    if (!response.ok) return await normalizeServiceApiError(response)
    return { ok: true, data: await response.blob() }
  }

  /** Auth-required PATCH */
  async patch<T = unknown>(path: string, body: unknown, options: RequestOptions = {}): Promise<NormalizedError | { ok: true; data: T }> {
    return this.fetch<T>('PATCH', path, body, options)
  }

  /** Auth-required PUT */
  async put<T = unknown>(path: string, body: unknown, options: RequestOptions = {}): Promise<NormalizedError | { ok: true; data: T }> {
    return this.fetch<T>('PUT', path, body, options)
  }

  /** Auth-required DELETE */
  async delete<T = unknown>(path: string, options: RequestOptions = {}): Promise<NormalizedError | { ok: true; data: T }> {
    return this.fetch<T>('DELETE', path, undefined, options)
  }
}

export function getServiceApisBrowserBaseUrl(): string {
  return getBaseUrl()
}
