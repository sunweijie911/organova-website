import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

/** Strip surrounding quotes that Docker --env-file preserves verbatim */
const stripQuotes = (/** @type {string | undefined} */ v) =>
  v?.replace(/^["']|["']$/g, '');

export const env = createEnv({
  server: {
    DATABASE_URL: z.url(),
    NODE_ENV: z
      .enum(['development', 'test', 'production'])
      .default('development'),

    BETTER_AUTH_SECRET:
      process.env.NODE_ENV === 'production'
        ? z.string()
        : z.string().optional(),
    BETTER_AUTH_URL:
      process.env.NODE_ENV === 'production' ? z.url() : z.url().optional(),

    ADMIN_EMAILS: z.string().optional(),

    // 邮箱 SMTP
    SMTP_HOST: z.string().default('smtp.qq.com'),
    SMTP_PORT: z.coerce.number().int().default(465),
    SMTP_USER: z.string().optional(),
    SMTP_PASS: z.string().optional(),

    // 限流
    RATE_LIMIT_UPLOAD: z.string().default('5/60000'),
    RATE_LIMIT_GLOBAL_IP: z.string().default('60/60000'),
    RATE_LIMIT_AUTH_IP: z.string().default('5/60000'),
    RATE_LIMIT_CONTACT: z.string().default('3/60000'),
  },

  client: {
    NEXT_PUBLIC_SITE_NAME: z.string().default('Organova'),
    // 登录方式: email-password | email-otp
    NEXT_PUBLIC_AUTH_METHOD: z.string().default('email-otp'),
  },

  runtimeEnv: {
    DATABASE_URL: stripQuotes(process.env.DATABASE_URL),
    NODE_ENV: stripQuotes(process.env.NODE_ENV),
    BETTER_AUTH_SECRET: stripQuotes(process.env.BETTER_AUTH_SECRET),
    BETTER_AUTH_URL: stripQuotes(process.env.BETTER_AUTH_URL),
    ADMIN_EMAILS: stripQuotes(process.env.ADMIN_EMAILS),
    SMTP_HOST: stripQuotes(process.env.SMTP_HOST),
    SMTP_PORT: stripQuotes(process.env.SMTP_PORT),
    SMTP_USER: stripQuotes(process.env.SMTP_USER),
    SMTP_PASS: stripQuotes(process.env.SMTP_PASS),
    RATE_LIMIT_UPLOAD: stripQuotes(process.env.RATE_LIMIT_UPLOAD),
    RATE_LIMIT_GLOBAL_IP: stripQuotes(process.env.RATE_LIMIT_GLOBAL_IP),
    RATE_LIMIT_AUTH_IP: stripQuotes(process.env.RATE_LIMIT_AUTH_IP),
    RATE_LIMIT_CONTACT: stripQuotes(process.env.RATE_LIMIT_CONTACT),
    NEXT_PUBLIC_SITE_NAME: stripQuotes(process.env.NEXT_PUBLIC_SITE_NAME),
    NEXT_PUBLIC_AUTH_METHOD: stripQuotes(process.env.NEXT_PUBLIC_AUTH_METHOD),
  },

  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  emptyStringAsUndefined: true,
});
