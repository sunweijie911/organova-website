import { index, serial } from 'drizzle-orm/pg-core';
import { createTable } from './table-creator';

export const posts = createTable(
  'post',
  (d) => ({
    id: serial('id').primaryKey(),
    slug: d.varchar({ length: 256 }).notNull().unique(),
    title: d.varchar({ length: 512 }).notNull(),
    summary: d.text(),
    content: d.text().notNull().default(''),
    coverImage: d.text('cover_image'),
    status: d.varchar({ length: 32 }).notNull().default('draft'),
    authorId: d.text('author_id').notNull(),
    publishedAt: d.timestamp('published_at', { withTimezone: true }),
    createdAt: d
      .timestamp('created_at', { withTimezone: true })
      .$defaultFn(() => new Date())
      .notNull(),
    updatedAt: d
      .timestamp('updated_at', { withTimezone: true })
      .$onUpdate(() => new Date()),
  }),
  (t) => [
    index('post_slug_idx').on(t.slug),
    index('post_status_idx').on(t.status),
    index('post_published_at_idx').on(t.publishedAt),
  ],
);

export const sitePages = createTable(
  'site_page',
  (d) => ({
    id: serial('id').primaryKey(),
    slug: d.varchar({ length: 256 }).notNull().unique(),
    title: d.varchar({ length: 512 }).notNull(),
    content: d.text().notNull().default(''),
    isPublished: d.boolean('is_published').notNull().default(false),
    updatedAt: d
      .timestamp('updated_at', { withTimezone: true })
      .$onUpdate(() => new Date()),
    createdAt: d
      .timestamp('created_at', { withTimezone: true })
      .$defaultFn(() => new Date())
      .notNull(),
  }),
  (t) => [index('site_page_slug_idx').on(t.slug)],
);

export const contactSubmissions = createTable(
  'contact_submission',
  (d) => ({
    id: serial('id').primaryKey(),
    firstName: d.varchar('first_name', { length: 128 }).notNull(),
    lastName: d.varchar('last_name', { length: 128 }).notNull(),
    email: d.varchar({ length: 512 }).notNull(),
    company: d.varchar({ length: 256 }),
    jobTitle: d.varchar('job_title', { length: 256 }),
    message: d.text().notNull(),
    status: d.varchar({ length: 32 }).notNull().default('unread'),
    ip: d.text(),
    createdAt: d
      .timestamp('created_at', { withTimezone: true })
      .$defaultFn(() => new Date())
      .notNull(),
  }),
  (t) => [
    index('contact_status_idx').on(t.status),
    index('contact_created_at_idx').on(t.createdAt),
  ],
);

export const userProfiles = createTable('user_profile', (d) => ({
  userId: d.text('user_id').primaryKey(),
  displayName: d.varchar('display_name', { length: 256 }),
  avatar: d.text(),
  bio: d.text(),
  updatedAt: d
    .timestamp('updated_at', { withTimezone: true })
    .$onUpdate(() => new Date()),
}));
