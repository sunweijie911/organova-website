// 仅信任受信代理（nginx）写入的 x-real-ip / x-forwarded-for 最后一跳。
// nginx 配置：proxy_set_header X-Real-IP $remote_addr;
//             proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
// 因此 X-Real-IP 总是真实对端 IP；X-Forwarded-For 末位是 nginx 观测的对端 IP，
// 首位则是客户端可伪造的值，绝不能用首位做限流/审计 key。
export function getClientIp(req: Headers | { headers: Headers }): string {
  const headers = req instanceof Headers ? req : req.headers;
  const realIp = headers.get('x-real-ip');
  if (realIp) return realIp.trim();

  const forwardedFor = headers.get('x-forwarded-for');
  if (forwardedFor) {
    const parts = forwardedFor.split(',');
    const last = parts[parts.length - 1]?.trim();
    if (last) return last;
  }

  return 'unknown';
}
