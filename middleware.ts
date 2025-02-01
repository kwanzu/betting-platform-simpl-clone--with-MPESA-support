import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

const ratelimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(10, "10 s"),
})

export async function middleware(request: NextRequest) {
  const ip = request.ip ?? "127.0.0.1"
  const { success, pending, limit, reset, remaining } = await ratelimit.limit(`ratelimit_middleware_${ip}`)
  return success ? NextResponse.next() : NextResponse.json({ error: "Too many requests" }, { status: 429 })
}

export const config = {
  matcher: "/api/:path*",
}

