export function getClientIp(req: Headers | { headers: Headers }): string {
  const headers = req instanceof Headers ? req : req.headers;
  return (
    headers.get('x-real-ip') ??
    headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    'unknown'
  );
}
