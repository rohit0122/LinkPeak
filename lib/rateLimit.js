/**
 * Simple in-memory rate limiter
 * For production, use Redis-based solution like @upstash/ratelimit
 */

const rateLimitStore = new Map();

export function rateLimit({ limit = 100, window = 60000 }) {
    return async function rateLimitMiddleware(req) {
        const identifier = req.headers.get("x-forwarded-for") || "anonymous";
        const key = `${identifier}:${req.url}`;

        const now = Date.now();
        const record = rateLimitStore.get(key) || { count: 0, resetTime: now + window };

        // Reset if window expired
        if (now > record.resetTime) {
            record.count = 0;
            record.resetTime = now + window;
        }

        record.count++;
        rateLimitStore.set(key, record);

        // Clean up old entries periodically
        if (Math.random() < 0.01) {
            for (const [k, v] of rateLimitStore.entries()) {
                if (now > v.resetTime) {
                    rateLimitStore.delete(k);
                }
            }
        }

        if (record.count > limit) {
            return {
                success: false,
                limit,
                remaining: 0,
                reset: record.resetTime
            };
        }

        return {
            success: true,
            limit,
            remaining: limit - record.count,
            reset: record.resetTime
        };
    };
}

// Preset rate limiters
export const authRateLimit = rateLimit({ limit: 5, window: 60000 }); // 5 req/min
export const trackingRateLimit = rateLimit({ limit: 100, window: 60000 }); // 100 req/min
export const apiRateLimit = rateLimit({ limit: 50, window: 60000 }); // 50 req/min
