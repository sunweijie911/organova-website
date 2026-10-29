// 仅允许站内相对路径；URL 解析会把 \ 视为 /，并剔除制表符与换行
export function isSafeCallbackUrl(url: string): boolean {
  return /^\/(?![/\\])/.test(url) && !/[\\\t\n\r]/.test(url);
}
