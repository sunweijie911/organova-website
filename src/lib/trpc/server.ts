import 'server-only';

import { createHydrationHelpers } from '@trpc/react-query/rsc';
import { cache } from 'react';

import { type AppRouter, createCaller } from '@/server/api/root';
import { createTRPCContext } from '@/server/api/trpc';
import { createQueryClient } from './query-client';

// RSC 只调用公开查询：不读取请求头，页面可走静态渲染 / ISR，ctx.session 恒为 null
const createContext = cache(() =>
  createTRPCContext({ headers: new Headers({ 'x-trpc-source': 'rsc' }) }),
);

const getQueryClient = cache(createQueryClient);
const caller = createCaller(createContext);

export const { trpc: api, HydrateClient } = createHydrationHelpers<AppRouter>(
  caller,
  getQueryClient,
);
