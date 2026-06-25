/**
 * Shared helpers for the workspace dashboard.
 *
 * Absorbs the error-message mapping from
 * components/experts/dashboard/ExpertDashboardFrame.tsx:getDashboardErrorMessage
 * so the workspace home can reuse it without importing from the expert
 * module.
 */

import type { NormalizedError } from '@/lib/service-apis/error-utils'

export function getDashboardErrorMessage(error: NormalizedError): string {
  switch (error.status) {
    case 401:
      return 'Please sign in to view your workspace.'
    case 403:
      return error.error.message || 'You do not have access to this workspace.'
    case 404:
      return error.error.message || 'The workspace dashboard endpoint was not found on service-apis.'
    case 429:
      return 'Too many requests. Please try again in a moment.'
    case 0:
      return 'Unable to reach service-apis.'
    case 503:
      return error.error.message || 'Unable to reach local service-apis. Start it on port 8020 and restart the frontend dev server.'
    default:
      return error.error.message || 'Failed to load workspace.'
  }
}
