import { inArray } from 'drizzle-orm';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { db } from '@/server/db';
import { caseStudies, news } from '@/server/db/schema';
import { ADMIN, callerFor, ensureAdminUser, hasDb } from './helpers';

const RUN = `t${Date.now()}`;

describe.skipIf(!hasDb)('内容管理 CRUD', () => {
  const admin = callerFor(ADMIN);
  const anon = callerFor(null);
  const newsIds: number[] = [];
  const caseIds: number[] = [];

  beforeAll(ensureAdminUser);
  afterAll(async () => {
    if (newsIds.length) await db.delete(news).where(inArray(news.id, newsIds));
    if (caseIds.length)
      await db.delete(caseStudies).where(inArray(caseStudies.id, caseIds));
  });

  async function createNews(isPublished: boolean) {
    const row = await admin.news.adminCreate({
      title: `${RUN} news ${newsIds.length}`,
      publishedAt: new Date('2026-04-15T02:00:00Z'),
      isPublished,
    });
    if (!row) throw new Error('adminCreate returned nothing');
    newsIds.push(row.id);
    return row.id;
  }

  async function createCase(sortOrder: number) {
    const row = await admin.caseStudies.adminCreate({
      slug: `${RUN}-case-${caseIds.length}`,
      title: `${RUN} case ${caseIds.length}`,
      sortOrder,
      isPublished: true,
    });
    if (!row) throw new Error('adminCreate returned nothing');
    caseIds.push(row.id);
    return row.id;
  }

  it('可选字段为空的新闻，按读取结果原样回传即可保存', async () => {
    const id = await createNews(false);
    const row = await admin.news.adminGet({ id });
    expect(row.location).toBeNull();
    expect(row.content).toBeNull();

    await expect(
      admin.news.adminUpdate({
        id,
        title: `${row.title} edited`,
        publishedAt: row.publishedAt,
        location: row.location,
        content: row.content,
        coverImage: row.coverImage,
        isPublished: row.isPublished,
      }),
    ).resolves.toEqual({ success: true });
    expect((await admin.news.adminGet({ id })).title).toBe(
      `${row.title} edited`,
    );
  });

  it('可选字段为空的案例，按读取结果原样回传即可保存', async () => {
    const id = await createCase(0);
    const {
      id: _id,
      createdAt: _c,
      updatedAt: _u,
      ...row
    } = await admin.caseStudies.adminGet({ id });
    expect(row.summary).toBeNull();

    await expect(
      admin.caseStudies.adminUpdate({
        id,
        ...row,
        title: `${row.title} edited`,
      }),
    ).resolves.toEqual({ success: true });
  });

  it('公开接口只返回已发布的新闻', async () => {
    const draft = await createNews(false);
    const live = await createNews(true);
    const ids = (await anon.news.list({})).map((n) => n.id);
    expect(ids).toContain(live);
    expect(ids).not.toContain(draft);
    await expect(anon.news.getById({ id: draft })).rejects.toMatchObject({
      code: 'NOT_FOUND',
    });
  });

  it('切换发布状态后公开接口可见性随之变化', async () => {
    const id = await createNews(false);
    await admin.news.adminTogglePublish({ id, isPublished: true });
    await expect(anon.news.getById({ id })).resolves.toMatchObject({ id });
    await admin.news.adminTogglePublish({ id, isPublished: false });
    await expect(anon.news.getById({ id })).rejects.toMatchObject({
      code: 'NOT_FOUND',
    });
  });

  it('拖拽排序结果持久化并反映在公开列表顺序中', async () => {
    const a = await createCase(1000);
    const b = await createCase(1001);
    await admin.caseStudies.adminUpdateSort([
      { id: a, sortOrder: 1001 },
      { id: b, sortOrder: 1000 },
    ]);
    const order = (await anon.caseStudies.list())
      .map((c) => c.id)
      .filter((id) => id === a || id === b);
    expect(order).toEqual([b, a]);
  });

  it('slug 重复时返回 CONFLICT', async () => {
    const id = await createCase(0);
    const { slug } = await admin.caseStudies.adminGet({ id });
    await expect(
      admin.caseStudies.adminCreate({ slug, title: 'dup' }),
    ).rejects.toMatchObject({ code: 'CONFLICT' });
  });
});
