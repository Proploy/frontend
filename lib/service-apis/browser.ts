/**
 * Browser-safe entrypoint for service-apis client.
 *
 * Usage in Client Components / browser code:
 *   import { ServiceApisBrowserClient } from '@/lib/service-apis/browser'
 *
 * This module is SAFE to import in browser code.
 * Uses NEXT_PUBLIC_SERVICE_APIS_URL (browser-exposed env var).
 *
 * For Server Components, use:
 *   import { serviceApisFetch } from '@/lib/service-apis/server'
 */

export { ServiceApisBrowserClient } from './browser-client'
export { normalizeServiceApiError, normalizeCircuitOpen, isCircuitOpen, type NormalizedError } from './error-utils'