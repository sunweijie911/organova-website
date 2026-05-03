import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { auth } from '@/server/better-auth';
import { isAdminEmail } from '@/server/services/admin-check';
import { getClientIp } from '@/server/services/get-client-ip';
import { authIpLimiter, globalIpLimiter } from '@/server/services/rate-limiter';

const protectedPatterns = [/^\/admin(\/|$)/];

const adminPatterns = [/^\/admin(\/|$)/];

function rateLimitResponse(retryAfterMs: number, message: string) {
  return NextResponse.json(
    { error: message },
    {
      status: 429,
      headers: { 'Retry-After': String(Math.ceil(retryAfterMs / 1000)) },
    },
  );
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const ip = getClientIp(request);

  // API 全局 IP 限流
  if (pathname.startsWith('/api/')) {
    const globalCheck = globalIpLimiter.check(ip);
    if (!globalCheck.allowed) {
      return rateLimitResponse(
        globalCheck.retryAfterMs,
        '请求过于频繁，请稍后再试',
      );
    }
  }

  // 登录接口额外严格限流
  if (
    pathname.startsWith('/api/auth/sign-in') ||
    pathname.startsWith('/api/auth/email-otp/')
  ) {
    const authCheck = authIpLimiter.check(ip);
    if (!authCheck.allowed) {
      return rateLimitResponse(
        authCheck.retryAfterMs,
        '登录尝试过于频繁，请稍后再试',
      );
    }
  }

  // API 路由直接放行
  if (pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // 页面认证保护
  const isProtected = protectedPatterns.some((p) => p.test(pathname));
  if (isProtected) {
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session) {
      const signinUrl = new URL('/signin', request.url);
      signinUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(signinUrl);
    }

    if (adminPatterns.some((p) => p.test(pathname))) {
      if (!isAdminEmail(session.user.email)) {
        return NextResponse.redirect(new URL('/', request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next|_vercel|.*\\..*).*)',
    '/api/auth/:path*',
    '/api/trpc/:path*',
    '/api/upload',
  ],
};
