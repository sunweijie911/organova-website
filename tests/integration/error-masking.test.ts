import type { AnyTRPCRouter } from '@trpc/server';
import { TRPCError } from '@trpc/server';
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { describe, expect, it } from 'vitest';
import { appRouter } from '@/server/api/root';
import { createTRPCRouter, publicProcedure } from '@/server/api/trpc';
import { db } from '@/server/db';
import { hasDb } from './helpers';

const probeRouter = createTRPCRouter({
  dbFailure: publicProcedure.query(() => {
    throw new Error('Failed query: select "secret" from "t"\nparams: 42');
  }),
  explicitInternal: publicProcedure.query(() => {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: '创建用户失败',
    });
  }),
});

async function callQuery(router: AnyTRPCRouter, path: string, input?: unknown) {
  const query =
    input === undefined
      ? ''
      : `?input=${encodeURIComponent(JSON.stringify({ json: input }))}`;
  const res = await fetchRequestHandler({
    endpoint: '/api/trpc',
    req: new Request(`http://test.local/api/trpc/${path}${query}`),
    router,
    createContext: () => ({ db, session: null, headers: new Headers() }),
    onError: () => {},
  });
  const body = (await res.json()) as {
    error?: { json: { message: string; data: { code: string } } };
  };
  return {
    status: res.status,
    message: body.error?.json.message,
    code: body.error?.json.data.code,
  };
}

// stack 仅在非生产环境随响应返回，这里只校验对外的 message
describe('HTTP 错误响应', () => {
  it('未捕获异常只返回通用信息，不含 SQL 与参数', async () => {
    const { status, message } = await callQuery(probeRouter, 'dbFailure');
    expect(status).toBe(500);
    expect(message).toBe('Internal server error');
  });

  it('主动抛出的 INTERNAL_SERVER_ERROR 保留自定义信息', async () => {
    const { status, message } = await callQuery(
      probeRouter,
      'explicitInternal',
    );
    expect(status).toBe(500);
    expect(message).toBe('创建用户失败');
  });

  it.each([
    ['非数字', 'abc'],
    ['超出 int4', 3_000_000_000],
    ['非正数', 0],
  ])('news.getById 入参%s返回 BAD_REQUEST', async (_, id) => {
    const { status, code } = await callQuery(appRouter, 'news.getById', { id });
    expect(status).toBe(400);
    expect(code).toBe('BAD_REQUEST');
  });

  it.skipIf(!hasDb)('不存在的新闻返回 NOT_FOUND', async () => {
    const { status, code } = await callQuery(appRouter, 'news.getById', {
      id: 2_147_483_000,
    });
    expect(status).toBe(404);
    expect(code).toBe('NOT_FOUND');
  });
});
