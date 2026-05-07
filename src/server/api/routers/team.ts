import { TRPCError } from '@trpc/server';
import { asc, eq } from 'drizzle-orm';
import { z } from 'zod';
import { teamMembers } from '@/server/db/schema';
import { TEAM_GROUPS } from '@/types/enums';
import { adminProcedure, createTRPCRouter, publicProcedure } from '../trpc';

const teamMemberWriteSchema = z.object({
  photo: z.string().optional(),
  name: z.string().min(1).max(256),
  title: z.string().min(1).max(256),
  shortBio: z.string().optional(),
  fullBio: z.string().optional(),
  group: z.enum(TEAM_GROUPS),
  sortOrder: z.number().int().default(0),
  isVisible: z.boolean().default(true),
});

export const teamRouter = createTRPCRouter({
  // 门户：按分组获取可见成员
  list: publicProcedure.query(async ({ ctx }) => {
    const rows = await ctx.db
      .select()
      .from(teamMembers)
      .where(eq(teamMembers.isVisible, true))
      .orderBy(asc(teamMembers.sortOrder));

    return {
      tricbio: rows.filter((r) => r.group === 'tricbio'),
      organova: rows.filter((r) => r.group === 'organova'),
    };
  }),

  adminList: adminProcedure.query(async ({ ctx }) => {
    return ctx.db
      .select()
      .from(teamMembers)
      .orderBy(asc(teamMembers.group), asc(teamMembers.sortOrder));
  }),

  adminGet: adminProcedure
    .input(z.object({ id: z.number().int() }))
    .query(async ({ input, ctx }) => {
      const [row] = await ctx.db
        .select()
        .from(teamMembers)
        .where(eq(teamMembers.id, input.id))
        .limit(1);
      if (!row) throw new TRPCError({ code: 'NOT_FOUND' });
      return row;
    }),

  adminCreate: adminProcedure
    .input(teamMemberWriteSchema)
    .mutation(async ({ input, ctx }) => {
      const [row] = await ctx.db
        .insert(teamMembers)
        .values(input)
        .returning({ id: teamMembers.id });
      return row;
    }),

  adminUpdate: adminProcedure
    .input(z.object({ id: z.number().int() }).merge(teamMemberWriteSchema))
    .mutation(async ({ input, ctx }) => {
      const { id, ...data } = input;
      await ctx.db.update(teamMembers).set(data).where(eq(teamMembers.id, id));
      return { success: true };
    }),

  adminDelete: adminProcedure
    .input(z.object({ id: z.number().int() }))
    .mutation(async ({ input, ctx }) => {
      await ctx.db.delete(teamMembers).where(eq(teamMembers.id, input.id));
      return { success: true };
    }),

  adminUpdateSort: adminProcedure
    .input(
      z.array(z.object({ id: z.number().int(), sortOrder: z.number().int() })),
    )
    .mutation(async ({ input, ctx }) => {
      await ctx.db.transaction(async (tx) => {
        for (const { id, sortOrder } of input) {
          await tx
            .update(teamMembers)
            .set({ sortOrder })
            .where(eq(teamMembers.id, id));
        }
      });
      return { success: true };
    }),
});
