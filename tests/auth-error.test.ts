import { describe, expect, it } from 'vitest';
import { resolveAuthError } from '@/lib/auth-error';

const FALLBACK = '登录失败，请检查邮箱和密码';

describe('resolveAuthError', () => {
  it('邮箱或密码错误时提示凭据错误', () => {
    expect(
      resolveAuthError(
        {
          code: 'INVALID_EMAIL_OR_PASSWORD',
          message: 'Invalid email or password',
          status: 401,
        },
        FALLBACK,
      ),
    ).toBe('邮箱或密码错误');
  });

  it('仅有英文 message 时同样识别凭据错误', () => {
    expect(
      resolveAuthError({ message: 'Invalid email or password' }, FALLBACK),
    ).toBe('邮箱或密码错误');
  });

  it('邮箱格式错误时提示格式问题', () => {
    expect(
      resolveAuthError(
        { code: 'INVALID_EMAIL', message: 'Invalid email' },
        FALLBACK,
      ),
    ).toBe('邮箱格式不正确');
  });

  it('未知英文错误使用兜底文案', () => {
    expect(resolveAuthError({ message: 'Something broke' }, FALLBACK)).toBe(
      FALLBACK,
    );
  });
});
