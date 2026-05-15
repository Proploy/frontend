/**
 * Server-only entrypoint for service-apis client.
 *
 * Usage in Server Components / API routes:
 *   import { serviceApisFetch } from '@/lib/service-apis/server'
 *
 * This module is NOT safe to import in browser code.
 * Uses SERVICE_APIS_BASE_URL (server-only env var) and server Supabase client.
 *
 * For Client Components / browser code, use:
 *   import { ServiceApisBrowserClient } from '@/lib/service-apis/browser'
 */

export { serviceApisFetch } from './client'