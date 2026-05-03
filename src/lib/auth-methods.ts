/**
 * 登录方式配置 — 通过 NEXT_PUBLIC_AUTH_METHOD 环境变量控制。
 * 可选值: email-password | email-otp（默认 email-otp）
 */
import { env } from '@/env';

export type AuthMethod = 'email-password' | 'email-otp';

const VALID_METHODS = new Set<AuthMethod>(['email-password', 'email-otp']);

export function parseAuthMethod(raw: string | undefined): AuthMethod {
  const trimmed = raw?.trim() as AuthMethod | undefined;
  if (trimmed && VALID_METHODS.has(trimmed)) return trimmed;
  return 'email-otp';
}

export const authMethod: AuthMethod = parseAuthMethod(
  env.NEXT_PUBLIC_AUTH_METHOD,
);

export const isEmailOtpEnabled = authMethod === 'email-otp';
