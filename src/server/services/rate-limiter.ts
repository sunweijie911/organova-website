import { env } from '@/env';

export class RateLimiter {
  private windows = new Map<string, number[]>();
  private readonly maxRequests: number;
  private readonly windowMs: number;

  constructor(maxRequests: number, windowMs: number) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
    setInterval(() => this.cleanup(), 60_000).unref();
  }

  check(key: string): { allowed: boolean; retryAfterMs: number } {
    const now = Date.now();
    const timestamps = this.windows.get(key) ?? [];
    const valid = timestamps.filter((t) => now - t < this.windowMs);
    if (valid.length >= this.maxRequests) {
      const oldest = valid[0] ?? now;
      this.windows.set(key, valid);
      return { allowed: false, retryAfterMs: oldest + this.windowMs - now };
    }
    valid.push(now);
    this.windows.set(key, valid);
    return { allowed: true, retryAfterMs: 0 };
  }

  private cleanup() {
    const now = Date.now();
    for (const [key, timestamps] of this.windows) {
      const valid = timestamps.filter((t) => now - t < this.windowMs);
      if (valid.length === 0) this.windows.delete(key);
      else this.windows.set(key, valid);
    }
  }
}

function parseRateLimit(
  value: string | undefined,
  defaultMax: number,
  defaultWindowMs: number,
): [number, number] {
  if (!value) return [defaultMax, defaultWindowMs];
  const [rawMax, rawWindowMs] = value.split('/');
  if (rawMax === undefined || rawWindowMs === undefined)
    return [defaultMax, defaultWindowMs];
  const max = parseInt(rawMax, 10);
  const windowMs = parseInt(rawWindowMs, 10);
  if (
    Number.isNaN(max) ||
    Number.isNaN(windowMs) ||
    max <= 0 ||
    windowMs <= 0
  ) {
    return [defaultMax, defaultWindowMs];
  }
  return [max, windowMs];
}

function rl(
  envValue: string | undefined,
  defaultMax: number,
  defaultWindowMs: number,
) {
  return new RateLimiter(
    ...parseRateLimit(envValue, defaultMax, defaultWindowMs),
  );
}

export const uploadLimiter = rl(env.RATE_LIMIT_UPLOAD, 5, 60_000);
export const contactLimiter = rl(env.RATE_LIMIT_CONTACT, 3, 60_000);
export const globalIpLimiter = rl(env.RATE_LIMIT_GLOBAL_IP, 60, 60_000);
export const authIpLimiter = rl(env.RATE_LIMIT_AUTH_IP, 5, 60_000);
