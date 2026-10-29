import { describe, expect, it } from 'vitest';
import { isSafeCallbackUrl } from '@/lib/safe-callback-url';

describe('isSafeCallbackUrl', () => {
  it.each([
    '/',
    '/admin',
    '/admin/news?page=2',
    '/publications?tab=news#top',
  ])('接受站内路径 %j', (url) => {
    expect(isSafeCallbackUrl(url)).toBe(true);
  });

  it.each([
    '',
    'admin',
    'https://evil.com',
    '//evil.com',
    '/\\evil.com',
    '/\t/evil.com',
    '/\n/evil.com',
    '/\r/evil.com',
    '/admin\\..\\evil',
  ])('拒绝 %j', (url) => {
    expect(isSafeCallbackUrl(url)).toBe(false);
  });

  it('接受的路径解析后仍为同源', () => {
    const base = 'https://site.example';
    for (const url of ['/', '/admin', '/a/b?c=d']) {
      expect(new URL(url, base).origin).toBe(base);
    }
  });
});
