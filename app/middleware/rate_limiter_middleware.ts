import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

/**
 * Rate limiter middleware
 *
 * Simple in-memory rate limiter for MVP
 * For production, consider using Redis or a dedicated rate limiting service
 */
export default class RateLimiterMiddleware {
  private static requests: Map<string, { count: number; resetAt: number }> = new Map()

  async handle(
    { request, response }: HttpContext,
    next: NextFn,
    options: { max?: number; windowMs?: number } = {}
  ) {
    const { max = 100, windowMs = 60000 } = options // Default: 100 requests per minute
    const ip = request.ip()
    const key = `${ip}:${request.url()}`
    const now = Date.now()

    const record = RateLimiterMiddleware.requests.get(key)

    if (record) {
      if (now < record.resetAt) {
        if (record.count >= max) {
          return response.tooManyRequests({
            error: 'Too many requests. Please try again later.',
            retryAfter: Math.ceil((record.resetAt - now) / 1000),
          })
        }
        record.count++
      } else {
        // Reset window
        record.count = 1
        record.resetAt = now + windowMs
      }
    } else {
      RateLimiterMiddleware.requests.set(key, {
        count: 1,
        resetAt: now + windowMs,
      })
    }

    // Cleanup old entries every 100 requests
    if (RateLimiterMiddleware.requests.size > 1000) {
      for (const [k, v] of RateLimiterMiddleware.requests.entries()) {
        if (now > v.resetAt) {
          RateLimiterMiddleware.requests.delete(k)
        }
      }
    }

    await next()
  }
}
