import { adminRouter } from '@/server/api/routers/admin';
import { contactRouter } from '@/server/api/routers/contact';
import { pageRouter } from '@/server/api/routers/page';
import { postRouter } from '@/server/api/routers/post';
import { userRouter } from '@/server/api/routers/user';
import { createCallerFactory, createTRPCRouter } from '@/server/api/trpc';

export const appRouter = createTRPCRouter({
  sys: adminRouter,
  user: userRouter,
  post: postRouter,
  page: pageRouter,
  contact: contactRouter,
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
