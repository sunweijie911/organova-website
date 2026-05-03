import { describe, expect, it } from 'vitest';
import { parseAuthMethod } from '@/lib/auth-methods';
import { getClientIp } from '@/server/services/get-client-ip';

describe('getClientIp', () => {
  it('优先读取 x-real-ip', () => {
    const headers = new Headers({ 'x-real-ip': '1.2.3.4' });
    expect(getClientIp(headers)).toBe('1.2.3.4');
  });

  it('x-real-ip 缺失时回退到 x-forwarded-for 第一个地址', () => {
    const headers = new Headers({ 'x-forwarded-for': '5.6.7.8, 9.10.11.12' });
    expect(getClientIp(headers)).toBe('5.6.7.8');
  });

  it('两个 header 都缺失时返回 unknown', () => {
    expect(getClientIp(new Headers())).toBe('unknown');
  });

  it('接受包含 headers 属性的请求对象', () => {
    const req = { headers: new Headers({ 'x-real-ip': '127.0.0.1' }) };
    expect(getClientIp(req)).toBe('127.0.0.1');
  });
});

describe('parseAuthMethod', () => {
  it('返回合法的 email-otp', () => {
    expect(parseAuthMethod('email-otp')).toBe('email-otp');
  });

  it('返回合法的 email-password', () => {
    expect(parseAuthMethod('email-password')).toBe('email-password');
  });

  it('未知值回退到默认 email-otp', () => {
    expect(parseAuthMethod('unknown')).toBe('email-otp');
  });

  it('undefined 回退到默认 email-otp', () => {
    expect(parseAuthMethod(undefined)).toBe('email-otp');
  });

  it('去除首尾空格后仍能正确识别', () => {
    expect(parseAuthMethod('  email-password  ')).toBe('email-password');
  });
});
