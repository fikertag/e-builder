import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Set up Redis (from Upstash)
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// Allow 10 requests per 60 seconds per user/IP
export const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.fixedWindow(10, "60s"),
});
