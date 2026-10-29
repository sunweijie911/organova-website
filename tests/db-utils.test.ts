import { DrizzleQueryError } from 'drizzle-orm/errors';
import { describe, expect, it } from 'vitest';
import { isUniqueViolation } from '@/server/db/utils';

describe('isUniqueViolation', () => {
  it('识别驱动直接抛出的 23505', () => {
    expect(isUniqueViolation({ code: '23505' })).toBe(true);
  });

  it('识别 drizzle 包装后 cause 上的 23505', () => {
    const err = new DrizzleQueryError(
      'insert ...',
      [],
      Object.assign(new Error('dup'), { code: '23505' }),
    );
    expect(isUniqueViolation(err)).toBe(true);
  });

  it.each([
    null,
    undefined,
    'x',
    {},
    { code: '23503' },
    new Error('other'),
  ])('其他错误返回 false：%j', (err) => {
    expect(isUniqueViolation(err)).toBe(false);
  });
});
