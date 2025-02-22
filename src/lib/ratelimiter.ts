import { Ratelimit } from "@upstash/ratelimit";
import { redis } from "./redis";

export const ratelimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, "10s"),
});
