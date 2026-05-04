import { adminRouter } from '@/server/api/routers/admin';
import { cancerTypesRouter } from '@/server/api/routers/cancerTypes';
import { caseStudiesRouter } from '@/server/api/routers/caseStudies';
import { faqRouter } from '@/server/api/routers/faq';
import { leadsRouter } from '@/server/api/routers/leads';
import { newsRouter } from '@/server/api/routers/news';
import { pageRouter } from '@/server/api/routers/page';
import { postRouter } from '@/server/api/routers/post';
import { publicationsRouter } from '@/server/api/routers/publications';
import { resourcesRouter } from '@/server/api/routers/resources';
import { teamRouter } from '@/server/api/routers/team';
import { userRouter } from '@/server/api/routers/user';
import { createCallerFactory, createTRPCRouter } from '@/server/api/trpc';

export const appRouter = createTRPCRouter({
  sys: adminRouter,
  user: userRouter,
  post: postRouter,
  page: pageRouter,
  leads: leadsRouter,
  caseStudies: caseStudiesRouter,
  publications: publicationsRouter,
  news: newsRouter,
  resources: resourcesRouter,
  faq: faqRouter,
  team: teamRouter,
  cancerTypes: cancerTypesRouter,
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
