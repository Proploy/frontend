/**
 * Browser-safe entrypoint for service-apis client.
 *
 * Usage in Client Components / browser code:
 *   import { ServiceApisBrowserClient } from '@/lib/service-apis/browser'
 *
 * This module is SAFE to import in browser code.
 * Calls the configured `NEXT_PUBLIC_SERVICE_APIS_URL` directly. Authenticated
 * requests attach the current Supabase browser access token.
 *
 * For Server Components, use:
 *   import { serviceApisFetch } from '@/lib/service-apis/server'
 */

export {
  ServiceApisBrowserClient,
  getServiceApisBrowserBaseUrl,
  serviceApisBrowserFetch,
} from './browser-client'
export { normalizeServiceApiError, normalizeCircuitOpen, isCircuitOpen, type NormalizedError } from './error-utils'
