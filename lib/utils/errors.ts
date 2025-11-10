/**
 * Standard error response format
 */
export interface ApiError {
  error: string
  message: string
  statusCode: number
  details?: unknown
}

/**
 * Create a standardized error response
 */
export function createErrorResponse(
  error: string,
  message: string,
  statusCode: number = 500,
  details?: unknown
): Response {
  const errorResponse: ApiError = {
    error,
    message,
    statusCode,
    details,
  }

  return Response.json(errorResponse, { status: statusCode })
}

/**
 * Handle API errors consistently
 */
export function handleApiError(error: unknown): Response {
  console.error('API Error:', error)

  if (error instanceof Error) {
    // Handle known error types
    if (error.message.includes('rate limit')) {
      return createErrorResponse('RATE_LIMIT_EXCEEDED', 'Too many requests', 429)
    }

    if (error.message.includes('not found')) {
      return createErrorResponse('NOT_FOUND', error.message, 404)
    }

    if (error.message.includes('validation')) {
      return createErrorResponse('VALIDATION_ERROR', error.message, 400)
    }

    // Generic error
    return createErrorResponse('INTERNAL_ERROR', error.message, 500)
  }

  // Unknown error
  return createErrorResponse(
    'INTERNAL_ERROR',
    'An unexpected error occurred',
    500
  )
}

