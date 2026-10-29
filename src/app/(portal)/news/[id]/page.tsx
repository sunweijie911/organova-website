import { TRPCError } from '@trpc/server';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { cache } from 'react';
import { api } from '@/lib/trpc/server';
import NewsDetailView from '.';

// React.cache 让 generateMetadata 与页面渲染共享同一次查询结果。
// 仅接受纯数字 id；越界或不存在均返回 404
const getNewsRow = cache(async (rawId: string) => {
  if (!/^[1-9]\d*$/.test(rawId)) return null;
  try {
    return await api.news.getById({ id: Number(rawId) });
  } catch (err) {
    if (
      err instanceof TRPCError &&
      (err.code === 'NOT_FOUND' || err.code === 'BAD_REQUEST')
    ) {
      return null;
    }
    throw err;
  }
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
