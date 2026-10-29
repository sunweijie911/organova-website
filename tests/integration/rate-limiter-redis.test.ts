import { beforeAll, describe, expect, it } from 'vitest';

// 需要真实 Redis：REDIS_URL 未设置时跳过
const hasRedis = !!process.env.REDIS_URL;

describe.skipIf(!hasRedis)('RateLimiter（Redis 后端）', () => {
  // 客户端关闭了离线队列，连接就绪前的请求会直接放行，先建立连接
  beforeAll(async () => {
    const { RateLimiter } = await import('@/server/services/rate-limiter');
    await new RateLimiter(1, 1_000).check(`warmup:${Date.now()}`);
    await new Promise((r) => setTimeout(r, 200));
  });

  it('窗口内超出配额后拒绝，并返回剩余等待时间', async () => {
    const { RateLimiter } = await import('@/server/services/rate-limiter');
    const limiter = new RateLimiter(3, 2_000);
    const key = `test:${Date.now()}:${Math.random()}`;

    const results = [];
    for (let i = 0; i < 4; i++) results.push(await limiter.check(key));

    expect(results.slice(0, 3).every((r) => r.allowed)).toBe(true);
    expect(results[3]?.allowed).toBe(false);
    expect(results[3]?.retryAfterMs).toBeGreaterThan(0);
    expect(results[3]?.retryAfterMs).toBeLessThanOrEqual(2_000);
  });

  it('窗口过期后重新放行', async () => {
    const { RateLimiter } = await import('@/server/services/rate-limiter');
    const limiter = new RateLimiter(1, 300);
    const key = `test:${Date.now()}:${Math.random()}`;

    expect((await limiter.check(key)).allowed).toBe(true);
    expect((await limiter.check(key)).allowed).toBe(false);
    await new Promise((r) => setTimeout(r, 350));
    expect((await limiter.check(key)).allowed).toBe(true);
  });

  it('不同 key 的计数互不影响', async () => {
    const { RateLimiter } = await import('@/server/services/rate-limiter');
    const limiter = new RateLimiter(1, 2_000);
    const base = `test:${Date.now()}:${Math.random()}`;

    expect((await limiter.check(`${base}:a`)).allowed).toBe(true);
    expect((await limiter.check(`${base}:b`)).allowed).toBe(true);
    expect((await limiter.check(`${base}:a`)).allowed).toBe(false);
  });
});
