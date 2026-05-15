import { createClient } from '@/lib/supabase/client'
import { normalizeServiceApiError, type NormalizedError } from './error-utils'

const BASE_URL = (process.env.NEXT_PUBLIC_SERVICE_APIS_URL || '').replace(/\/$/, '')

interface RequestOptions {
  /**
   * Attach browser Supabase session token.
   * - false (default): no token attached
   * - true: resolve from browser Supabase session
   */
  requireAuth?: boolean
  /**
   * Override token resolved from browser Supabase.
   * Use for SSR hydration prop — pass server-resolved token here.
   * When set, token is attached regardless of requireAuth value.
   */
  accessToken?: string | null
}

/**
 * Browser-only client for calling service-apis.
 *
 * IMPORTANT: This module is for Client Components and browser code only.
 * Server Components must use lib/service-apis/server (serviceApisFetch).
 *
 * Token resolution:
 * - accessToken: string → always attach that token (SSR hydration override)
 * - requireAuth: true + no accessToken → resolve from browser Supabase session
 * - requireAuth: false + no accessToken → no token attached
 *
 * SECURITY: Token is never stored in React state. Resolved per-request only.
 */
export class ServiceApisBrowserClient {
  private baseUrl: string

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl ?? BASE_URL
    if (!this.baseUrl) {
      console.warn(
        '[ServiceApisBrowserClient] NEXT_PUBLIC_SERVICE_APIS_URL is not set. '
        + 'Browser client will not make requests. Set it in .env.local for local dev.',
      )
    }
  }

  private async resolveToken(): Promise<string | null> {
    try {
      const supabase = createClient()
      const { data } = await supabase.auth.getSession()
      return data.session?.access_token ?? null
    } catch {
      return null
    }
  }

  private async fetch<T>(
    method: string,
    path: string,
    body: unknown | undefined,
    options: RequestOptions,
  ): Promise<NormalizedError | { ok: true; data: T }> {
    if (!this.baseUrl) {
      return {
        ok: false,
        status: 503,
        error: {
          code: 'NOT_CONFIGURED',
          message: 'NEXT_PUBLIC_SERVICE_APIS_URL is not configured',
        },
      }
    }

    const { requireAuth = false, accessToken } = options

    // Resolve token once — either explicit override or from browser Supabase
    let token: string | null = accessToken ?? null
    if (requireAuth && token === null) {
      token = await this.resolveToken()
    }

    // Auth required but no token available → return normalized 401
    if (requireAuth && !token) {
      return {
        ok: false,
        status: 401,
        error: {
          code: 'AUTHENTICATION_ERROR',
          message: 'Sign-in required',
        },
      }
    }

    const headers: Record<string, string> = {
      accept: 'application/json',
    }

    if (body !== undefined) {
      headers['content-type'] = 'application/json'
    }

    if (token) {
      headers['authorization'] = `Bearer ${token}`
    }

    const url = `${this.baseUrl}${path.startsWith('/') ? path : `/${path}`}`

    let response: Response
    try {
      response = await fetch(url, {
        method,
        headers,
        body: body !== undefined ? JSON.stringify(body) : undefined,
        cache: 'no-store',
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