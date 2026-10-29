import { TRPCError } from '@trpc/server';
import { eq } from 'drizzle-orm';
import { beforeAll, describe, expect, it } from 'vitest';
import { db } from '@/server/db';
import { news } from '@/server/db/schema';
import { ADMIN, callerFor, ensureAdminUser, hasDb, VISITOR } from './helpers';

describe.skipIf(!hasDb)('admin 过程的访问控制', () => {
  beforeAll(ensureAdminUser);

  const adminQueries = [
    ['news.adminList', (c: ReturnType<typeof callerFor>) => c.news.adminList()],
    [
      'caseStudies.adminList',
      (c: ReturnType<typeof callerFor>) => c.caseStudies.adminList(),
    ],
    [
      'leads.adminList',
      (c: ReturnType<typeof callerFor>) => c.leads.adminList({}),
    ],
    [
      'page.getFrontendConfig',
      (c: ReturnType<typeof callerFor>) => c.page.getFrontendConfig(),
    ],
  ] as const;

  it.each(adminQueries)('%s：未登录返回 UNAUTHORIZED', async (_, call) => {
    await expect(call(callerFor(null))).rejects.toMatchObject({
      code: 'UNAUTHORIZED',
    });
  });

  it.each(adminQueries)('%s：非白名单用户返回 FORBIDDEN', async (_, call) => {
    await expect(call(callerFor(VISITOR))).rejects.toMatchObject({
      code: 'FORBIDDEN',
    });
  });

  it.each(adminQueries)('%s：管理员可访问', async (_, call) => {
    await expect(call(callerFor(ADMIN))).resolves.toBeDefined();
  });

  it('非白名单用户调用 admin mutation 被拒绝且不落库', async () => {
    const title = `forbidden-${Date.now()}`;
    const err = await callerFor(VISITOR)
      .news.adminCreate({ title, publishedAt: new Date() })
      .catch((e: unknown) => e);
    expect(err).toBeInstanceOf(TRPCError);
    expect((err as TRPCError).code).toBe('FORBIDDEN');
    expect(await db.$count(news, eq(news.title, title))).toBe(0);
  });
});
