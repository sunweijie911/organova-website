import { and, eq } from 'drizzle-orm';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { cache } from 'react';
import { db } from '@/server/db';
import { news } from '@/server/db/schema';
import NewsDetailView from '.';

const INT4_MAX = 2_147_483_647;

// React.cache 让 generateMetadata 与页面渲染共用同一次 DB 查询，
// 同一请求内只会真正打一次库。

const getNewsRow = cache(async (rawId: string) => {
  if (!/^[1-9]\d{0,9}$/.test(rawId)) return null;
  const id = Number(rawId);
  if (id > INT4_MAX) return null;
  const [row] = await db
    .select()
    .from(news)
    .where(and(eq(news.id, id), eq(news.isPublished, true)))
    .limit(1);
  return row ?? null;
});

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const row = await getNewsRow(id);
  if (!row) return { title: 'News' };

  const description = row.content
    ? stripHtml(row.content).slice(0, 160)
    : undefined;
  return {
    title: row.title,
    description,
    openGraph: {
      title: row.title,
      description,
      type: 'article',
      publishedTime: row.publishedAt.toISOString(),
      images: row.coverImage ? [{ url: row.coverImage }] : undefined,
    },
  };
}

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const row = await getNewsRow(id);
  if (!row) notFound();
  return <NewsDetailView news={row} />;
}
