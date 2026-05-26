/**
 * Normalized error shape returned by ServiceApisBrowserClient
 * for all non-2xx responses.
 */
export interface NormalizedError {
  ok: false
  status: number
  error: {
    code: string
    message: string
    retryAfter?: number
    fields?: Record<string, string>
  }
}

/**
 * Returns true when the error is a circuit-open (503) error.
 */
export function isCircuitOpen(error: NormalizedError): boolean {
  return error.status === 503 && error.error.code === 'CIRCUIT_OPEN'
}

/**
 * Normalize a service-apis CIRCUIT_OPEN response to NormalizedError.
 * Used internally by normalizeServiceApiError — exported for use in hooks.
 */
export function normalizeCircuitOpen(
  detail: Record<string, unknown>,
  status: number,
): NormalizedError {
  return {
    ok: false,
    status,
    error: {
      code: 'CIRCUIT_OPEN',
      message: (detail.message as string) || 'Service temporarily unavailable. Please retry in 30 seconds.',
      retryAfter: (detail.retryAfter as number) || 30,
    },
  }
}

/**
 * Normalize any service-apis error response to a consistent NormalizedError shape.
 *
 * Supported response shapes:
 * - Nested { detail: { error, code, message, retryAfter } } — circuit open HTTPException
 * - Top-level { code, detail } — AppException style
 * - String detail { detail: "..." }
 * - Non-JSON / empty body fallback
 *
 * CIRCUIT_OPEN (503)    → include retryAfter for UI auto-retry
 * 401/403              → user-safe messages (no raw token errors)
 * 429                  → rate limit message + retryAfter if present
 * 500+ (not circuit)   → generic "Something went wrong" (never leak internal details)
 */
export async function normalizeServiceApiError(response: Response): Promise<NormalizedError> {
  const status = response.status

  let body: Record<string, unknown> = {}
  try {
    body = (await response.json()) as Record<string, unknown>
  } catch {
    // non-JSON or empty body — fall through to fallback
  }

  // ── nested { detail: { error, code, message, retryAfter, group } } ──
  // e.g. circuit-open HTTPException: { detail: { error: "CIRCUIT_OPEN", ... } }
  if (typeof body.detail === 'object' && body.detail !== null) {
    const detail = body.detail as Record<string, unknown>

    if (detail.error === 'CIRCUIT_OPEN') {
      return normalizeCircuitOpen(detail, status)
    }

    const code = (detail.code as string) || (detail.error as string) || mapStatusToCode(status)
    const message = extractMessage(detail, status)
    return {
      ok: false,
      status,
      error: {
        code,
        message,
        retryAfter: detail.retryAfter as number | undefined,
        fields: extractFieldErrors(detail),
      },
    }
  }

  // ── top-level { code, detail } — AppException style ──
  if (typeof body.code === 'string') {
    // 5xx AppException — never leak internal details
    if (status >= 500 && body.code !== 'CIRCUIT_OPEN') {
      return {
        ok: false,
        status,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Something went wrong',
        },
      }
    }
    return {
      ok: false,
      status,
      error: {
        code: body.code,
        message: extractMessage({ detail: body.detail }, status),
        fields: extractFieldErrors(body),
      },
    }
  }

  // ── string detail { detail: "..." } ──
  if (typeof body.detail === 'string') {
    return {
      ok: false,
      status,
      error: {
        code: mapStatusToCode(status),
        message: body.detail,
      },
    }
  }

  // ── non-JSON or unrecognized body ──
  return {
    ok: false,
    status,
    error: {
      code: mapStatusToCode(status),
      message: status >= 500 ? 'Something went wrong' : `Request failed with status ${status}`,
    },
  }
}

/**
 * Extract user-safe message from a detail object.
 * Prioritizes: message field > detail string > fallback.
 */
function extractMessage(detail: Record<string, unknown>, status: number): string {
  if (typeof detail.message === 'string' && detail.message.length > 0) {
    return detail.message
  }
  if (typeof detail.detail === 'string' && detail.detail.length > 0) {
    return detail.detail
  }
  if (status >= 500) {
    return 'Something went wrong'
  }
  return `Request failed with status ${status}`
}

function extractFieldErrors(body: Record<string, unknown>): Record<string, string> | undefined {
  const fields = body.fields
  if (!fields || typeof fields !== 'object' || Array.isArray(fields)) return undefined

  return Object.fromEntries(
    Object.entries(fields as Record<string, unknown>)
      .filter((entry): entry is [string, string] => typeof entry[1] === 'string'),
  )
}

/**
 * Map HTTP status code to a default error code.
 */
function mapStatusToCode(status: number): string {
  switch (status) {
    case 400: return 'BAD_REQUEST'
    case 401: return 'AUTHENTICATION_ERROR'
    case 403: return 'AUTHORIZATION_ERROR'
    case 404: return 'NOT_FOUND'
    case 409: return 'CONFLICT'
    case 422: return 'VALIDATION_ERROR'
    case 429: return 'RATE_LIMITED'
    case 503: return 'SERVICE_UNAVAILABLE'
    default: return status >= 500 ? 'INTERNAL_ERROR' : 'UNKNOWN_ERROR'
  }
}
