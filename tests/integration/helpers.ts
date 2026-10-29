import { createCaller } from '@/server/api/root';
import type { Session } from '@/server/better-auth/config';
import { db } from '@/server/db';
import { user } from '@/server/db/schema';

// 集成测试依赖真实 Postgres（已执行迁移），未配置 DATABASE_URL 时整组跳过
export const hasDb = !!process.env.DATABASE_URL;

export const ADMIN = { id: 'test-admin', email: 'admin@test.local' };
export const VISITOR = { id: 'test-visitor', email: 'visitor@test.local' };

export function makeSession(u: { id: string; email: string }): Session {
  const now = new Date();
  return {
    user: {
      id: u.id,
      email: u.email,
      name: u.id,
      emailVerified: true,
      image: null,
      createdAt: now,
      updatedAt: now,
    },
    session: {
      id: `session-${u.id}`,
      userId: u.id,
      token: `token-${u.id}`,
      expiresAt: new Date(now.getTime() + 3_600_000),
      createdAt: now,
      updatedAt: now,
      ipAddress: null,
      userAgent: null,
    },
  } as Session;
}

export function callerFor(u: { id: string; email: string } | null) {
  return createCaller({
    db,
    session: u ? makeSession(u) : null,
    headers: new Headers(),
  });
}

// 审计日志 user_id 外键指向 user 表，管理员需真实存在；多个测试文件并行共用，不做删除
export async function ensureAdminUser() {
  const now = new Date();
  await db
    .insert(user)
    .values({
      id: ADMIN.id,
      email: ADMIN.email,
      name: 'Test Admin',
      emailVerified: true,
      createdAt: now,
      updatedAt: now,
    })
    .onConflictDoNothing();
}
