import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

/**
 * Rate limiter using Upstash Redis
 * Falls back to a simple in-memory rate limiter if Redis is not configured
 */

// Check if Upstash Redis is configured
const isRedisConfigured =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN && process.env.UPSTASH_REDIS_REST_URL !== 'your_upstash_redis_rest_url'

let ratelimit: Ratelimit | null = null

if (isRedisConfigured) {
  const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
  })

  // Create rate limiter: 10 requests per 10 seconds per IP
  ratelimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, '10 s'),
    analytics: true,
    prefix: '@upstash/ratelimit',
  })
}

/**
 * Simple in-memory rate limiter fallback
 * This is used when Redis is not configured (development)
 */
class InMemoryRateLimiter {
  private requests: Map<string, number[]> = new Map()
  private readonly maxRequests = 10
  private readonly windowMs = 10000 // 10 seconds

  async limit(identifier: string): Promise<{ success: boolean; limit: number; remaining: number; reset: number }> {
    const now = Date.now()
    const windowStart = now - this.windowMs

    // Get or create request timestamps for this identifier
    const timestamps = this.requests.get(identifier) || []

    // Filter out requests outside the window
    const recentRequests = timestamps.filter((timestamp) => timestamp > windowStart)

    // Check if limit exceeded
    if (recentRequests.length >= this.maxRequests) {
      const oldestRequest = Math.min(...recentRequests)
      const reset = oldestRequest + this.windowMs
      return {
        success: false,
        limit: this.maxRequests,
        remaining: 0,
        reset,
      }
    }

    // Add current request
    recentRequests.push(now)
    this.requests.set(identifier, recentRequests)

    // Clean up old entries (prevent memory leak)
    if (this.requests.size > 1000) {
      const entries = Array.from(this.requests.entries())
      entries.slice(0, 100).forEach(([key]) => this.requests.delete(key))
    }

    return {
      success: true,
      limit: this.maxRequests,
      remaining: this.maxRequests - recentRequests.length,
      reset: now + this.windowMs,
    }
  }
}

const inMemoryRateLimiter = new InMemoryRateLimiter()

/**
 * Rate limit a request by IP address
 * @param identifier - IP address or user identifier
 * @returns Rate limit result
 */
export async function rateLimit(
  identifier: string
): Promise<{ success: boolean; limit: number; remaining: number; reset: number }> {
  if (ratelimit) {
    return await ratelimit.limit(identifier)
  }

  // Fallback to in-memory rate limiter
  return await inMemoryRateLimiter.limit(identifier)
}

/**
 * Get client IP address from request headers
 */
export function getClientIP(request: Request): string {
  // Try various headers that might contain the client IP
  const forwarded = request.headers.get('x-forwarded-for')
  const realIP = request.headers.get('x-real-ip')
  const cfConnectingIP = request.headers.get('cf-connecting-ip')

  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }

  if (realIP) {
    return realIP
  }

  if (cfConnectingIP) {
    return cfConnectingIP
  }

  // Fallback to a default identifier
  return 'unknown'
}

