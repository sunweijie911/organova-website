import { and, eq } from 'drizzle-orm';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { db } from '@/server/db';
import { news } from '@/server/db/schema';
import NewsDetailView from '.';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const numericId = Number(id);
  if (!Number.isFinite(numericId)) return { title: 'News' };

  const [row] = await db
    .select({ title: news.title })
    .from(news)
    .where(and(eq(news.id, numericId), eq(news.isPublished, true)))
    .limit(1);

  if (!row) return { title: 'News' };

  return { title: row.title };
}

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const numericId = Number(id);
  if (!Number.isFinite(numericId)) notFound();

  const [row] = await db
    .select({ id: news.id })
    .from(news)
    .where(and(eq(news.id, numericId), eq(news.isPublished, true)))
    .limit(1);
  if (!row) notFound();
  return <NewsDetailView />;
}
