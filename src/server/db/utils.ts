import { TRPCError } from '@trpc/server';

// PostgreSQL unique_violation：
// https://www.postgresql.org/docs/current/errcodes-appendix.html
const UNIQUE_VIOLATION = '23505';

export function isUniqueViolation(err: unknown): boolean {
  return (
    typeof err === 'object' &&
    err !== null &&
    'code' in err &&
    (err as { code?: string }).code === UNIQUE_VIOLATION
  );
}

// update/delete 后用 .returning({ id: t.id }) 的结果做存在性校验，
// 避免对不存在的 id 静默返回成功
export function assertUpdated(
  result: { id: unknown }[],
  message = '记录不存在',
): void {
  if (result.length === 0) {
    throw new TRPCError({ code: 'NOT_FOUND', message });
  }
}
