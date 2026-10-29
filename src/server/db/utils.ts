import { TRPCError } from '@trpc/server';

// PostgreSQL unique_violation：
// https://www.postgresql.org/docs/current/errcodes-appendix.html
const UNIQUE_VIOLATION = '23505';

// drizzle 把驱动错误包装为 DrizzleQueryError，错误码在 cause 上
export function isUniqueViolation(err: unknown): boolean {
  let cur: unknown = err;
  for (let depth = 0; depth < 3 && cur; depth++) {
    if (
      typeof cur === 'object' &&
      (cur as { code?: unknown }).code === UNIQUE_VIOLATION
    ) {
      return true;
    }
    cur = (cur as { cause?: unknown }).cause;
  }
  return false;
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
